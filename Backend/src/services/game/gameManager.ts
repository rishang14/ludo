import type {
  backBone,
  capturedReturnType,
  colors,
  pawn,
} from "../../dto/game.dto";
import {
  dirstributePawn,
  gameStarterkit,
  globaLBoard,
  globalSafePlace,
  mapColor,
  pathToWin,
} from "../../utils/constant";
import { RedisInstance } from "../redis/redisClient";
import { calcMove } from "../../lib/helper";
import { GameRepo } from "../../repositry/game.repositry";
import { UserRepo } from "../../repositry/user.repositry";
import { wss } from "../..";

export class GameManager{
  public static async initBoard(totlPlayerIds: string[], gameId: string) {
    //game pawn
    if (!totlPlayerIds.length || !gameId) {
      throw new Error("GameIds with totalPlayerIds are required");
    } 
    await RedisInstance.setUsers(gameId,totlPlayerIds);
    for (let i = 0; i < totlPlayerIds.length; i++){
      for (const p of dirstributePawn[i]!) {
        if (totlPlayerIds[i]) {
          const userwithColor= await RedisInstance.getUserWithColor(gameId,totlPlayerIds[i] as string) 
          if(!userwithColor){
            await RedisInstance.setUserWithColor(gameId,totlPlayerIds[i] as string, mapColor[p.charAt(0)] as colors )
          } 
        }
        const pawn: pawn = {
          pId: p,
          position: p,
          isFinished: false,
          isHome: true,
          userId: totlPlayerIds[i]!,
          color: mapColor[p.charAt(0)] as colors,
        };
        await RedisInstance.setPawn(gameId, pawn);
        await RedisInstance.setBoard(gameId, p, [p]);
      }
    }
    //gameBoard
    for (const b of globaLBoard) {
      for (const c of b) {
        await RedisInstance.setBoard(gameId, c, [""]);
      }
    }
  

    //gameStarterkit
    for (const p of gameStarterkit) {
      if ((p.key as Partial<backBone>) === "currentUserTurn") {
        await RedisInstance.updateBoardStateKey(
          gameId,
          p.key,
          totlPlayerIds[0]
        );
        return;
      }
      if ((p.key as Partial<backBone>) === "currentTurn") { 
         const color=await RedisInstance.getUserWithColor(gameId,totlPlayerIds[0]!);
        await RedisInstance.updateBoardStateKey(
          gameId,
          p.key,
          color
        );
        return;
      }
      await RedisInstance.updateBoardStateKey(gameId, p.key, p.value);
    }
  }

  public static async getWholeGameState(gameId: string) {
    if (!gameId) return;
    const pawns = await RedisInstance.getAllPawn(gameId);
    const board = await RedisInstance.getFullBoard(gameId);
    const gameStatus = await RedisInstance.getGameStatus(gameId);
    return {
      pawnMap: pawns,
      globaLBoardMap: board,
      gameBackbone: gameStatus,
    };
  }

  private static async getTeamPawn(gameId: string, p: string){
    const pawns: pawn[] = [];

    for (let i = 1; i <= 4; i++) {
      const key = `${p}P${i}`;
      const items = await RedisInstance.getOnePawn(gameId, key);
      pawns.push(items as pawn);
    }
    return pawns;
  }

  private static async calcMovablePawn(
    gameId: string,
    pId: string,
    diceVal: number
  ) {
    const pawns: pawn[] = await this.getTeamPawn(gameId, pId);
    const movablePawns: string[] = [];

    for (const p of pawns) {
      if (p.isHome) {
        if (diceVal === 6) {
          movablePawns.push(p.pId);
        }
        continue;
      }
      if (!p.isFinished) {  
        const {newPos} =calcMove(pathToWin[p.color],p,diceVal); 
        if(newPos !== p.position){
          movablePawns.push(p.pId);
        }
      }
    }
    return movablePawns;
  }

  private static generateDiceVal() {
    return Math.floor(Math.random() * 6) + 1;
  }

  private static async calcNextTurn(userId: string,gameId:string) {
    const turns = await RedisInstance.getTotalUser(gameId) 
    const idx = turns.indexOf(userId);
    const totalLength = turns.length;
    const newIdx = idx + 1 >= totalLength ? 0 : idx + 1;
    return turns[newIdx];
  }

  private static async NewBackBone( 
    gameId:string,
    movablePawns: string[],
    diceVal: number,
    userId: string,
    currentUserTurn: boolean,
    canDiceMove: boolean,
    canPawnMove: boolean
  ) {
    const turn =await this.calcNextTurn(userId,gameId);  
    console.log(turn,"turn"); 
    console.log(currentUserTurn,"current user TURN") 
    console.log("userId", userId)
        console.log(gameId,"gameId",currentUserTurn ? userId : turn!,"userid in the backbone  ") 
   const color = await RedisInstance.getUserWithColor(gameId,currentUserTurn ? userId : turn!)
    const val: Record<backBone, any> = {
      diceVal,
      canDiceRoll: canDiceMove,
      canPawnMove: canPawnMove,
      currentTurn: color,
      winnerOrders: [],
      currentUserTurn: currentUserTurn ? userId : turn!,
      movablePawns,
    }; 
    console.log("val for the backbone",val)
    return val;
  }

  public static async rollDice(gameId: string, userId: string) {
    const gameState = await RedisInstance.getGameStatus(gameId);
  console.log("userId",userId,"gameId",gameId);
    if (JSON.parse(gameState?.currentUserTurn!) !== userId) {
      throw new Error("Its not Ur Turn");
    }
    const diceVal = this.generateDiceVal();
    // console.log(this.userIdWithColor.forEach(t => console.log(t,"for user"))) 
    console.log(gameId,"gameId",userId,"userid in the roll dice one ") 
    const p = await RedisInstance.getUserWithColor(gameId,userId);
    if (!p) throw new Error("UserId is Wrong");
    const movablePawns = await this.calcMovablePawn(
      gameId,
      p.charAt(0),
      diceVal
    );
    console.log("before the movablae pawn in roll dice",movablePawns.length ); 
    console.log("in roll dice one and code crashed here")
    const newBackBone =await  this.NewBackBone( 
      gameId,
      movablePawns,
      diceVal,
      userId,
      movablePawns.length > 0,
      movablePawns.length > 0 ? false : true,
      movablePawns.length > 0
    );
    for (const [key, value] of Object.entries(newBackBone)) {
      // console.log(key ,"value fo the backbone",value); 
      await RedisInstance.updateBoardStateKey(gameId, key as backBone, value);
    }
    return {
      backbone: newBackBone,
    };
  }

  private static async savePawnValue(
    gameId: string,
    isHome: boolean,
    pId: string,
    pathAcheived: boolean,
    newPos?: string
  ) {
    const getPawn: pawn = await RedisInstance.getOnePawn(gameId, pId);
    const newPawnVal: pawn = {
      ...getPawn,
      isHome,
      position: isHome ? getPawn.pId : newPos ?? "",
      isFinished: pathAcheived,
    };
    await RedisInstance.setPawn(gameId, newPawnVal);
  }

  private static async updateBoardVal(
    gameId: string,
    captured: boolean,
    pId: string,
    cellId: string
  ) {
    const boardVal = await RedisInstance.getOneBoardCell(gameId, cellId);
    let pawns: string[] = boardVal;
    // console.log("cell value of the pawn",pawns)
    if (captured) {
      pawns = pawns.filter((i) => i != pId);
    } else {
      pawns.push(pId);
    }
    pawns = pawns.filter((i) => i !== "");
    // console.log("i am pushing this into the cell in the game",pawns)
    await RedisInstance.setBoard(gameId, cellId, pawns);
  }

  private static async capturePawn(
    newPos: string,
    currPawn: pawn,
    gameId: string
  ): Promise<capturedReturnType> {
    const board = await RedisInstance.getOneBoardCell(gameId, newPos);
    if (board.length === 0) {
      return { captruedSuccess: false, capturedPawn: null };
    }
    // console.log("whole board value in the capture pawn",board)
    let captruedSuccess = false;
    let capturedPawn = null;
    for (let p = 0; p < board.length; p++) {
      if (board[p]?.charAt(0) === currPawn.pId.charAt(0)) {
        continue;
      }
      capturedPawn = board[p] as string;
      captruedSuccess = true;
    }
    return { captruedSuccess, capturedPawn };
  }

  public static async movePawn(gameId: string, userId: string, pId: string) {
    const gameState = await RedisInstance.getGameStatus(gameId); 
    const gameDetails=await GameRepo.getGame(gameId); 
    const movablePawns: string[] = JSON.parse(gameState.movablePawns!);
    const diceVal = JSON.parse(gameState.diceVal!);
    const color = JSON.parse(gameState.currentTurn!);
    const pawnPath: string[] = pathToWin[color as colors];
    if (JSON.parse(gameState.currentUserTurn!) !== userId) {
      throw new Error("Invalid User turn");
    }
    if (!movablePawns.includes(pId)) {
      return;
    }
    const currPawn: pawn = await RedisInstance.getOnePawn(gameId, pId);
    const { newPos, pathAcheived, isHome } = calcMove(
      pawnPath,
      currPawn,
      +diceVal
    );
    let captured: string = "";
    let nextTurn: boolean = false;
    if (!globalSafePlace.has(newPos)  && !pathAcheived){ 
      console.log("i entered in !pathachived one with the global safeplace")
      const { capturedPawn, captruedSuccess } = await this.capturePawn(
        newPos,
        currPawn,
        gameId
      );
      // console.log("captured pawn",capturedPawn)
      if (captruedSuccess && capturedPawn) {
        captured = capturedPawn ?? "";
        //update the pawn new pos of the curpawn to newpos and also update the board
        await this.savePawnValue(
          gameId,
          true,
          capturedPawn,
          false,
          capturedPawn
        );
        await this.updateBoardVal(
          gameId,
          captruedSuccess,
          capturedPawn,
          newPos
        ); //reomved from the old cell
        await this.updateBoardVal(gameId, false, capturedPawn, capturedPawn); // put it in the new cell
        // console.log("updation triggers in the capturedone ")
        nextTurn = true;
      }
    }
    if (pathAcheived){   
        await RedisInstance.updatePawnVlalue(gameId, currPawn.pId, {
        ...currPawn,
        isFinished: true,
        isHome,
      });
      const allpawn= await this.getTeamPawn(gameId,currPawn.pId.charAt(0))  
      let totalFinishedPawn=allpawn.filter(i => i.isFinished === true);  
      console.log("length of finished pawn",totalFinishedPawn)
      if(totalFinishedPawn.length ===4){  
        const getUser= await UserRepo.getUserById(userId)
        wss.broadcastToUsers(gameId,"winner_Found",{ 
          winnerColor: currPawn.color, 
          userId:userId, 
          winnerName:getUser?.name, 
          gameId:gameId, 
         pawnId: pId,
         pawnNewPos: newPos,
         pawnWon: pathAcheived,
        capturedPawn: captured,
        backbone: gameState,
        })   
        return;
      } 
         
      await this.updateBoardVal(gameId, true, pId, currPawn.position); //reomved from the global board
      nextTurn = true;
    }
    if (+diceVal === 6) {
      nextTurn = true;
    }

    if(!pathAcheived){
    await this.savePawnValue(gameId, false, pId, false, newPos); // saved for the normal value  like normal nothing happend
    await this.updateBoardVal(gameId, false, pId, newPos); //updated in the board
    await this.updateBoardVal(gameId, true, pId, currPawn.position); //dele from the old one
    } 
    console.log("before the click from the movepawn after the !pathacivedn",userId)
    const newBackBone: Record<backBone, any> =await this.NewBackBone( 
      gameId,
      [],
      1,
      userId,
      nextTurn,
      true,
      false
    );
    for (const [key, value] of Object.entries(newBackBone)) {
      await RedisInstance.updateBoardStateKey(gameId, key as backBone, value);
    }
    return {
      pawnId: pId,
      pawnNewPos: newPos,
      pawnWon: pathAcheived,
      capturedPawn: captured,
      backbone: newBackBone,
    };
  }

  public static async exitOrDeleteGame(gameId: string) {
    try {
      const getGame = await GameRepo.getGame(gameId);
      for (const i of getGame.playerIds) {
        await UserRepo.updateUserData(i, { onGoingGame: null });
      }
      const gameData = await GameRepo.deleteGame(gameId);
      const data = await RedisInstance.cleanInMemory(gameId);  
       return true;
    } catch (error) {
      console.log("Error in game manager", error);
      throw new Error("Error while deleting the gameData and redis instance");
    }
  }
}
