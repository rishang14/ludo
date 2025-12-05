import React from "react";
import { Pawn } from "./Pawn";
import { useGameStore } from "@/state/gameStore";

interface homeType {
  bgColor: string;
  pawnHome: string[];
}

export const StartBorad = ({ bgColor, pawnHome }: homeType) => {
  const { pawnMap, moveablePawn } = useGameStore();
  return (
    <div className="w-[65%] p-2 rounded-sm h-[65%] bg-zinc-50">
      <div className=" h-full w-full flex items-center justify-between flex-wrap  ">
        {pawnHome.map((i) => {
          return (
            <div
              className={`rounded-full h-[40%] flex  items-center  relative  justify-center w-[40%] ${bgColor}`}
              key={i}
            >
              {pawnMap.get(i)?.position === i && (
                <Pawn
                  key={i}
                  id={i}
                  size={50}
                  color={pawnMap.get(i)?.color as string}
                  isActive={moveablePawn.has(i)} 
                  isFinished={pawnMap.get(i)?.isFinished ?? false}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
