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






// now i have to implement  kill logic  basically 
// thing if it is safe place no kill  happen 
// if it is of same pId no kill 
//  what i have at this point is  
// i can calcMove and send pawn to one place to another place   what  i have to do now is 
// if the place where curr pawn is going  there is already someone on that place which is not from the same team then i just have to send the one 
// who is at destination to the home and move currpawn to their pos but if it is safe place leave it nothing you have to do 
// and then curr chance will be of same team rolldice should become true  
// if its of same team then don't do anything 
