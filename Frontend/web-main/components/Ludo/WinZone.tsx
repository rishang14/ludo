"use client";
import {  useGameStore } from "@/state/gameStore";
import { Pawn } from "./Pawn";

const WinZone = () => {
  const { pawnMap } = useGameStore();

  return (
    <div className=" flex  felx-wrap"> 
    
      {[...pawnMap.entries()].map(([Key, val]) => {
        return val.isFinished ? (
          <Pawn key={Key} id={val.pId} color={val.color} isFinished={val.isFinished} isActive={false} />
        ) : null;
      })}
    </div>
  );
};

export default WinZone;
