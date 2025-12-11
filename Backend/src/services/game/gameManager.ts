import type { backBone, colors, pawn } from "../../dto/game.dto";
import {
  dirstributePawn,
  gameStarterkit,
  globaLBoard,
  mapColor,
} from "../../utils/constant";
import { RedisInstance } from "../redis/redisClient";

export class GameManager { 

 private static totalPlayer:number=0;
 private static turnArray:Set<string>= new Set();

  public static async initBoard(totlPlayerIds: string[], gameId: string) {
    //game pawn    
    if(!totlPlayerIds.length || !gameId){
      throw new Error("GameIds with totalPlayerIds are required"); 
    }
    this.totalPlayer=totlPlayerIds.length;
    for (let i = 0; i < totlPlayerIds.length; i++) {
      for (const p of dirstributePawn[i]!) { 
        this.turnArray.add(totlPlayerIds[i]!) 
        const pawn: pawn ={
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
    for (const p of gameStarterkit){
      if (p.key === "currentTurn") { 
        this.turnArray?.add(totlPlayerIds[0]!);
        await RedisInstance.updateBoardState(gameId, p.key, totlPlayerIds[0]);
      } else {
        await RedisInstance.updateBoardState(gameId, p.key, p.value);
      }
    }
  }

  public static async getWholeGameState(gameId: string) {
    const pawns = await RedisInstance.getAllPawn(gameId);
    const board = await RedisInstance.getFullBoard(gameId);
    const gameStatus = await RedisInstance.getGameStatus(gameId);

    return {
      pawnMap: pawns,
      globaLBoardMap: board,
      gameBackbone: gameStatus,
    };
  }      
     
  
}
