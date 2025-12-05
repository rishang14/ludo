import { FiStar } from "react-icons/fi";
import {
  blueSafePlace,
  greenSafePlace,
  redSafePlace,
  yellowSafePlace,
} from "@/lib/constant";
import { pawn, useGameStore } from "@/state/gameStore";
import { Pawn } from "./Pawn";

interface prop {
  path: string[]; 
  safePlace?: redSafePlace | greenSafePlace | yellowSafePlace | blueSafePlace;
  pathname: string;
  drawBgColorOnPath: string[];
  className: string;
  color: string;
}

export const DrawPath = ({
  path,
  className,
  drawBgColorOnPath,
  color,
}: prop) => {
  const coloured = new Set(drawBgColorOnPath);
  const { pawnMap, boardMap ,moveablePawn,safePlace} = useGameStore(); 
  return (
    <>
      {path.map((p: string, i: number) => {
        const cell = boardMap.get(p);
        let pawns: pawn[] = [];
        if (cell) {
          for (let p of cell) {
            if (p) {
              pawns.push(pawnMap.get(p)!);
            }
          }
        }
        return (
          <div
            key={i}
            id={p}
            className={`${className} flex items-center justify-center relative `}
            style={{ backgroundColor: coloured.has(p) ? color : undefined }}
          >
            {(safePlace.has(p)) && (
              <span>
                <FiStar size={20} />
              </span>
            )}  
            {pawns.map((i) =>
              i.position === p ? ( 
                <Pawn key={i.pId} id={i.pId} color={i.color} isFinished={i.isFinished}  isActive={moveablePawn.has(i.pId)}/>
              ) : null
            )}</div>
        );
      })}
    </>
  );
};
