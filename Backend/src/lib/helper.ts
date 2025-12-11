import type { calcMoveReturn, pawn } from "../dto/game.dto";

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
