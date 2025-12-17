import { bluePath, greenPath, redPath, yellowPath } from "@/lib/constant";
import { pawn } from "./gameStore";

type  color= "Red" | "Blue" | "Green" | "Yellow";

type calcMoveReturn = {
  newPos: string;
  pathAcheived: boolean;
  isHome: boolean;
};

export const getPathOfPawn = (  {color}:{color:color}):string[] => {
  const path: Record<string, any> = {
    Red: redPath,
    Green: greenPath,
    Blue: bluePath,
    Yellow: yellowPath,
  };
  return path[color];
};

export const calcMove = (
  pawnPath: string[],
  currPawn: pawn,
  diceVal: number
): calcMoveReturn => {

  if (currPawn.isHome) {
    return {
      newPos: pawnPath[0] as string,
      pathAcheived: false,
      isHome: false,
    };
  }

  const currentPos = pawnPath.indexOf(currPawn?.position);
  const totalSize = pawnPath.length;
  if (currentPos + diceVal < totalSize) {
    return {
      newPos: pawnPath[currentPos + diceVal] as string,
      pathAcheived: false,
      isHome: false,
    };
  } else if (currentPos + diceVal == totalSize) {
    return {
      newPos: "", 
      pathAcheived: true,
      isHome: false,
    };
  }

  return { newPos: currPawn.position, pathAcheived: false, isHome: false };
};


// 
