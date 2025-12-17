import { createClient, type RedisClientType } from "redis";
import { redisConfig } from "../../utils/redisConfig";
import type { backBone, pawn, updatePawn } from "../../dto/game.dto";

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
    return `${gameId}:userWithKey`  
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

  public static async getOnePawn(gameId: string, pId: string) {
    const key = this.pawnKey(gameId);
    if (!this.client) {
      throw new Error("Redis is not connected");
    }
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
    } catch (error) {
       console.log("errorwhile seting up the userwith color", error)
    }
    }  

      public static async getUserWithColor(gameId:string,userId:string){
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

    if(!this.client){
      throw new Error("Redis is not connected")  
    }    
     const deleted= await this.client.unlink([cellkey,pawnKey,state,userWithColor]); 
     console.log("we are deleted from the redis instance",deleted);
    return deleted;
 }
}