import { json } from "express";
import type { backBone, capturedReturnType, colors, pawn } from "../../dto/game.dto";
import {
  dirstributePawn,
  gameStarterkit,
  globaLBoard,
  globalSafePlace,
  mapColor,
  pathToWin,
} from "../../utils/constant";
import { RedisInstance } from "../redis/redisClient";
import { useId } from "react";
import { calcMove } from "../../lib/helper";

export class GameManager {
  public static totalPlayer: number = 0;
  private static turns: Set<string> = new Set();
  private static userIdWithColor: Map<string, string> = new Map();

  public static async initBoard(totlPlayerIds: string[], gameId: string) {
    //game pawn
    if (!totlPlayerIds.length || !gameId) {
      throw new Error("GameIds with totalPlayerIds are required");
    }
    this.totalPlayer = totlPlayerIds.length;
    for (let i = 0; i < totlPlayerIds.length; i++) {
      for (const p of dirstributePawn[i]!) {
        if (!this.userIdWithColor.get(totlPlayerIds[i]!)) {
          this.userIdWithColor.set(
            totlPlayerIds[i]!,
            mapColor[p.charAt(0)] as colors
          );
        }
        this.turns.add(totlPlayerIds[i]!);
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
      if (p.key === "currentUserTurn") {
        await RedisInstance.updateBoardState(gameId, p.key, totlPlayerIds[0]);
      } else if (p.key === "currentTurn") {
        await RedisInstance.updateBoardState(
          gameId,
          p.key,
          this.userIdWithColor.get(totlPlayerIds[0]!)
        );
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

  private static async getTeamPawn(gameId: string, p: string) {
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
        movablePawns.push(p.pId);
      }
    }
    return movablePawns;
  }

  private static generateDiceVal() {
    return Math.floor(Math.random() * 6) + 1;
  }

  private static calcNextTurn(userId: string) {
    const turns = [...this.turns];
    const idx = turns.indexOf(userId);
    const totalLength = turns.length;
    const newIdx = idx + 1 > totalLength ? 0 : idx + 1;
    return turns[newIdx];
  }

  private static NewBackBone(
    movablePawns: string[],
    diceVal: number,
    userId: string
  ) {
    const canMove = movablePawns.length > 0;
    const turn = this.calcNextTurn(userId);
    const color = this.userIdWithColor.get(turn!);
    const val: Record<backBone, any> = {
      diceVal,
      canDiceRoll: !canMove,
      canPawnMove: canMove,
      currentTurn: color,
      winnerOrders: [],
      currentUserTurn: turn,
      movablePawns,
    };
    return val;
  }

  public static async rollDice(gameId: string, userId: string) {
    const gameState = await RedisInstance.getGameStatus(gameId);
    if (JSON.parse(gameState?.currentUserTurn!) !== userId) {
      throw new Error("Its not Ur Turn");
    }
    const diceVal = this.generateDiceVal();
    const p = this.userIdWithColor.get(userId);
    if (!p) throw new Error("UserId is Wrong");
    const movablePawns = await this.calcMovablePawn(
      gameId,
      p.charAt(0),
      diceVal
    );

    const newBackBone = this.NewBackBone(movablePawns, diceVal, userId);
    for (const [key, value] of Object.entries(newBackBone)) {
      await RedisInstance.updateBoardState(gameId, key as backBone, value);
    }
    return newBackBone;
  }

  private static async calcNewPos(diceVal: string, pawn: pawn) {}

  private static async capturePawn(newPos: string, currPawn: pawn,gameId:string):Promise<capturedReturnType> {
  const board:string[] = await RedisInstance.getOneBoardCell(gameId,newPos);  
  
  if(board.length===0){
    return {captruedSuccess:false,capturedPawn:null}; 
  } 
    for(const p of board){
      if(p.charAt(0)===currPawn.pId.charAt(0)){
        return {captruedSuccess:false,capturedPawn:null}
      }
    }

  }

  public static async movePawn(gameId: string, userId: String, pId: string) {
    const gameState = await RedisInstance.getGameStatus(gameId);
    const movablePawns:string[] = JSON.parse(gameState.movablePawns!);
    const diceVal = JSON.parse(gameState.diceVal!);
    const color = JSON.parse(gameState.currentTurn!);
    const pawnPath: string[] = pathToWin[color as colors];
    if (JSON.parse(gameState.currentUserTurn!) !== userId) {
      throw new Error("Invalid User turn");
    }
    const currPawn: pawn = await RedisInstance.getOnePawn(gameId, pId);  
    if(!movablePawns.includes(pId)){
      return ;
    }   

    const  {newPos,pathAcheived,isHome}=calcMove(pawnPath,currPawn,+diceVal);   
     let captured:string | null 
     let pawnWon:string|null 
     let currPawnNewPos:string|null   
      if(!globalSafePlace.has(newPos)){
        const {capturedPawn, captruedSuccess}= await this.capturePawn(newPos,currPawn,gameId); 
        if(captruedSuccess){
          captured=capturedPawn
        } 
      }    
      if(pathAcheived){
         await RedisInstance.updatePawnVlalue(gameId,currPawn.pId,{...currPawn,isFinished:true,isHome})
      }
   }
}
