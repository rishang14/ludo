import { bluePath, greenPath, redPath, yellowPath } from "@/lib/constant";
import { pawn } from "./gameStore";

type prop = {
  currentTurn: "Red" | "Blue" | "Green" | "Yellow";
};

type calcMoveReturn = {
  newPos: string;
  pathAcheived: boolean; 
  isHome:boolean
};

export const getPathOfPawn = ({ currentTurn }: prop) => {
  const path: Record<string, any> = {
    "Red": redPath,
    "Green": greenPath,
    "Blue": bluePath,
    "Yellow": yellowPath,
  };  

  console.log(path[currentTurn],"path")

  return path[currentTurn];
};

export const calcMove = (
  pawnPath: string[],
  currPawn: pawn,
  diceVal: number,
): calcMoveReturn => {
  //todo have to implement the kill logic here also  

  if (currPawn.isHome) {
    return { newPos: pawnPath[0] as string, pathAcheived: false,isHome:false };
  }

  const currentPos = pawnPath.indexOf(currPawn?.position);
  const totalSize = pawnPath.length;

  if (currentPos + diceVal < totalSize) { 
     console.log(pawnPath[currentPos+diceVal])
    return {
      newPos: pawnPath[currentPos + diceVal] as string,
      pathAcheived: false, 
      isHome:false
    };
  }

  return { newPos: "", pathAcheived: true,isHome:false};
};
