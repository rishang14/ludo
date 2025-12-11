import type { colors, pawn } from "../../dto/game.dto";
import { dirstributePawn } from "../../utils/constant";
import { RedisInstance } from "../redis/redisClient";

export class GameManager{     

public static async initBoard(totlPlayerIds:string[],gameId:string){
     let mapColor: Record<string, string> = {
      R: "Red",
      G: "Green",
      B: "Blue",
      Y: "Yellow",
    }; 
for(let  i=0;i<totlPlayerIds.length;i++){
 for(const p of dirstributePawn[i]!){
   const pawn:pawn= {pId:p,position:p,isFinished:false,isHome:true,userId:totlPlayerIds[i]!,color:mapColor[p.charAt(0)] as colors}; 
    await RedisInstance.setPawn(gameId,pawn); 
 }
}
}

}