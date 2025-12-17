"use client";
import {  useGameStore } from "@/state/gameStore";
import { Pawn } from "./Pawn";

const WinZone = () => {
  const { pawnMap } = useGameStore();

  return (
    <div className="grid  grid-cols-5 min-grid-rows-4 min-w-full max-w-full"> 
    
      {[...pawnMap.entries()].map(([Key, val]) => {
        return val.isFinished ? (
          <Pawn key={Key} id={val.pId} color={val.color} isFinished={val.isFinished} />
        ) : null;
      })}
    </div>
  );
};

export default WinZone;
