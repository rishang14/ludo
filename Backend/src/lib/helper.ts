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
    console.log("new pos of the pawn", pawnPath[currentPos+diceVal]);
    return {
      newPos: pawnPath[currentPos + diceVal] as string,
      pathAcheived: false,
      isHome: false,
    };
  } else if (currentPos + diceVal == totalSize) { 
    console.log("new pos of the pawn for winn",pawnPath[currentPos+diceVal]); 
    console.log("for winning totallength",totalSize,"got the dice val",currentPos+diceVal)
    return {
      newPos: "", 
      pathAcheived: true,
      isHome: false,
    };
  }

  return { newPos: currPawn.position, pathAcheived: false, isHome: false };
};


// 
