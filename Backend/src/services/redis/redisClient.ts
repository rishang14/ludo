import { createClient, type RedisClientType } from "redis";
import { redisConfig } from "../../utils/redisConfig";
import type { backBone, gameInitType, pawn, updatePawn } from "../../dto/game.dto";

export class RedisInstance {
  private static client: RedisClientType | null = null;
  private static pawnKey(gameId: string) {
    return `${gameId}:pawn`;
  }
  private static boardKey(gameId: string){
    return `${gameId}:board`;
  }

  private static boardStateKey(gameId: string) {
    return `${gameId}:state`;
  } 
  private static userWithColorKey(gameId:string){
    return `${gameId}:userWithColorKey`  
  }  

  private static joinedUserKey(gameId:string){
    return `${gameId}:totalUser`;
  }  

  private static  gameKey(gameId:string){
    return `${gameId}:game`;
  } 

  private static initializedKey(gameId:string){
    return `${gameId}:gameInit`
  }   

  private static winnerKey(gameId:string){
    return  `gameId:${gameId}:winner`
  }


  public static async initialize() {
    if (this.client) {
      return;
    }

    this.client = createClient({
      socket: {
        host: redisConfig.host,
        port: redisConfig.port,
      },
    });

    this.client.on("connect", () => {
      console.log("redis is connected ");

    });

    this.client.on("error", (err) => {
      console.log(err);
    });

    await this.client.connect();
  } 

  private static async expire(key:string,){
   if(!this.client)return;  
   
  await this.client.expire(key,60*40)
  }
   
 public static async setGameInIt(gameId:string,value:boolean){
 if(!this.client){
  throw  new Error("Redis is not conneced")
 }   

 const key = this.initializedKey(gameId); 

 const val= await this.client.hSet(key,"initalized",JSON.stringify(value));  
            await this.expire(key)
 }  
  
 public static async getInitGameStatus(gameId:string){
  if(!this.client){
    throw new Error("Redis is not connected")
  }  
  const key=this.initializedKey(gameId);
  const val=await  this.client.hGet(key,"initalized"); 
 if(!val){
  return null
 }
  return JSON.parse(val)
 }

 public static async setGame(gameId:string,payload:gameInitType){
     if (!this.client) {
      throw new Error("Redis is not connected");
    }  
    const key=this.gameKey(gameId); 
    const details = await this.client.hSet(key,"gameDetails",JSON.stringify(payload));  
    await this.expire(key)
 }   
 
  public static async alreadyInJoinedUser(gameId:string,userId:string){
    if(!this.client){
      throw new Error("Redis is not connected"); 
    }  
    const key= this.joinedUserKey(gameId)
    const userExists= await this.client.sIsMember(key,userId); 
    return userExists;
  }


 public static async getGame(gameId:string){
  if(!this.client){
    throw new Error("Redis is not connected"); 
  } 
  const key= this.gameKey(gameId); 
  const gameDetails=await this.client.HGET(key,"gameDetails"); 
  if(!gameDetails){
     throw new Error("game not found")
  } 
  return JSON.parse(gameDetails);
 }

  public static async getOnePawn(gameId: string, pId: string) {
    if (!this.client) {
      throw new Error("Redis is not connected");
    } 
    const key = this.pawnKey(gameId);
    const pawn = await this.client.hGet(key, pId);
    if (!pawn) {
      throw new Error("Invalid gameId or pawnId");
    }

    return JSON.parse(pawn);
  } 
  public static async setUserWithColor(gameId:string,userId:string,val:string){
    if(!this.client){
      throw new Error("Redis is not connected"); 
    }  
    try {
    const key=this.userWithColorKey(gameId)
    const setUserWithColor=await this.client.HSET(key,userId,JSON.stringify(val));  
      await this.expire(key)
    } catch (error) {
       console.log("errorwhile seting up the userwith color", error)
    }
    }  

      public static async getUserWithColor(gameId:string,userId:string){ 
        console.log("user with color", userId)
    const key = this.userWithColorKey(gameId); 
    if(!this.client){
      throw new Error("Redis is not connected")
    } 
   try {
      const userWithColor= await this.client.hGet(key,userId); 
    if(!userWithColor){
      throw new Error("Invalid gameId or pawnId"); 
    } 
    return JSON.parse(userWithColor);
   } catch (error) {
    console.log("error while getting up userwith color",error)
   }
  }  
 
  public static async  setJoinedUsers(gameId:string,val:string){
   if(!this.client){
    throw new Error("Redis is not connected");  
   } 
   const key = this.joinedUserKey(gameId); 

   const totalUser= await this.client.SADD(key,val)     
      await this.expire(key)
  }    

  public static async getJoinedUser(gameId:string){
    if(!this.client){
      throw new Error("Redis is not connected")  
    }  
    const key = this.joinedUserKey(gameId); 
    const totalUser= await this.client.SMEMBERS(key);  
    if(!totalUser){
     return []
    }
    return totalUser;
  }    

  public static async setWinner(gameId:string,userId:string){
    if(!this.client){
      throw new Error("Redis is not connected"); 
    } 
    const key=this.winnerKey(gameId); 
         await this.client.SADD(key,userId);  
          await this.expire(key);
  }     

  public static async getWinners(gameId:string){
    if(!this.client){
     throw new Error("Redis is not connected")
     } 
     const key= this.winnerKey(gameId); 
     const winner= this.client.SMEMBERS(gameId); 
     if(!winner){
      return [];
     } 
     return winner;
  }

  public static async getAllPawn(gameId: string) {
    if (!this.client) {
      throw new Error("Redis is not connected");
    }
    const key = this.pawnKey(gameId);

    const pawns = await this.client.hGetAll(key);
    if (!pawns) {
      throw new Error("Pawn Not found for this gameId");
    }
   
    return pawns;
  }

  public static async setPawn(gameId: string, pawnVal: pawn) {
    if (!this.client) {
      throw new Error("Redis is not Connected");
    }

    const pawn = await this.client.HSET(
      `${gameId}:pawn`,
      pawnVal.pId,
      JSON.stringify(pawnVal)
    );
  }

  public static async updatePawnVlalue(
    gameId: string,
    pId: string,
    value: updatePawn
  ) {
    if (!this.client) {
      throw new Error("Redis is not connected");
    }

    const pawn = await this.getOnePawn(gameId, pId);

    const updatedPawn: pawn = {
      ...pawn,
      ...value,
    };

    await this.setPawn(gameId, updatedPawn);
  }

  public static async setBoard(
    gameId: string,
    cellId: string,
    cellval: string[]
  ) {
    if (!this.client) {
      throw new Error("Redis is  not connected");
    }
    const key = this.boardKey(gameId);
    const board = await this.client.HSET(key, cellId, JSON.stringify(cellval));
    
  }

  public static async getFullBoard(gameId: string) {
    if (!this.client) {
      throw new Error("Redis is not connected");
    }
    const key = this.boardKey(gameId);
    const board = await this.client.hGetAll(key);
    if (!board) {
      throw new Error("Board cell not found for this gameId");
    }

    return board;
  }

  public static async getOneBoardCell(gameId: string, cellId: string) {
    if (!this.client) {
      throw new Error("Redis is not connected");
    }
    const key = this.boardKey(gameId);

    const boardCell = await this.client.hGet(key, cellId);
    if (!boardCell) {
      throw new Error("Cell not found with this boardId and cellId");
    }
    return JSON.parse(boardCell);
  }

  public static async updateBoardCell(
    gameId: string,
    oldCellId: string,
    oldCellNewVal: string[],
    newCellId: string,
    newCellVal: string[]
  ) {
    if (!this.client) {
      throw new Error("Redis is not connected");
    }
    await this.setBoard(gameId, oldCellId, oldCellNewVal);
    await this.setBoard(gameId, newCellId, newCellVal);
  }

  public static async updateBoardStateKey(
    gameId: string,
    details: backBone,
    val: any
  ) {
    if (!this.client) {
      throw new Error("Redis is not connected");
    }
   try {
     const key = this.boardStateKey(gameId);
    const state = await this.client.hSet(key, details, JSON.stringify(val));
    // if (!state) {
    //   throw new Error("Invalid   backbone key "); 
    // } 
    return state;
   } catch (error) {
    console.log(error,"error while updating the gamstate")
   }
  }

  public static async getGameStatus(gameId: string) {
    if (!this.client) {
      throw new Error("Redis is not connected");
    }
    const key = this.boardStateKey(gameId);
    const boardStateKey = await this.client.hGetAll(key);
    if (!boardStateKey) {
      throw new Error("Invalid board state key ");
    }
    return boardStateKey;
  }

  public static async getBoardStateKey(gameId: string, details: string) {
    if (!this.client) {
      throw new Error("Redis is not connected");
    }

    const key = this.boardStateKey(gameId);
    const boardStateKey = await this.client.hGet(key, details);
    if (!boardStateKey) {
      throw new Error("Invalid board state key");
    }

    return JSON.parse(boardStateKey);
  }  

 public static async cleanInMemory(gameId:string){
    const cellkey=this.boardKey(gameId); 
    const pawnKey=this.pawnKey(gameId); 
    const state=this.boardStateKey(gameId); 
    const userWithColor= this.userWithColorKey(gameId);   
    const initBoard= this.initializedKey(gameId); 
    const totalUser= this.joinedUserKey(gameId);  
    const game=this.gameKey(gameId);

    if(!this.client){
      throw new Error("Redis is not connected")  
    }    
     const deleted= await this.client.unlink([cellkey,pawnKey,state,userWithColor,initBoard,totalUser,game]); 
     console.log("we are deleted from the redis instance",deleted);
    return deleted;
 }
}  