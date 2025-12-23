import React from "react";
import { Pawn } from "./Pawn";
import { useGameStore } from "@/state/gameStore";

interface homeType {
  bgColor: string;
  pawnHome: string[];
  color: "Red" | "Green" | "Blue" | "Yellow";
}
const medals = ["🥇", "🥈", "🥉"];
export const StartBorad: React.FC<homeType> = ({
  bgColor,
  pawnHome,
  color,
}) => {
  const { pawnMap, movablePawn, winnerOrders } = useGameStore();
  let isWinner = winnerOrders.includes(color);
  let position = winnerOrders.indexOf(color);
  return (
    <div className="w-[65%] p-2 rounded-sm h-[65%] bg-zinc-50">
      <div className={` h-full w-full flex items-center  flex-wrap  ${isWinner ? `${bgColor} justify-center`: "justify-between"}`}>
        {isWinner && (
          <div className="flex items-center justify-center">
            <div
              className={`bg-linear-to-b ${color} rounded-full m-auto md:w-16 md:h-16 h-8 w-8  text-3xl shadow-lg border-4  transform animate-pulse`}
            >
              {medals[Math.min(position, 2)]}
            </div>
            <span className="text-xs font-bold mt-1 text-center  text-white px-2 py-1 rounded-full">
              {position + 1}
              {position+1 === 1 ? "st" : position+1 === 2 ? "nd" : "rd"}
            </span>
          </div>
        )}
        {!isWinner && pawnHome.map((i) => {
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
