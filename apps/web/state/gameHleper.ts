import { bluePath, greenPath, redPath, yellowPath } from "@/lib/constant";
import { pawn } from "./gameStore";

type  color= "Red" | "Blue" | "Green" | "Yellow";

type calcMoveReturn = {
  newPos: string;
  pathAcheived: boolean;
  isHome: boolean;
};

export const getPathOfPawn = (  {color}:{color:color}) => {
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
  //todo have to implement the kill logic here also

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
    console.log("Next cell value", pawnPath[currentPos + diceVal]);
    console.log("dice value", diceVal);
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


//i am calculating the movable pawn as per the dice val that if is in home and not 6 then not gonna put it and if its outside  
//  then put it in the set  and if 6 then even home one is also allowed to move   
// by current func i am getting 
// movable pawn ->set which conatins id of the pawns  
// diceval 
// able to know that if the previous and current val of the pawn is same then  just  dont switch the turn  -> improvement needed here 
// and in the getmovable pawn -> here 