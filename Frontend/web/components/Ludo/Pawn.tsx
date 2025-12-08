"use client";

import { useGameStore } from "@/state/gameStore";
import { useEffect, useRef } from "react";

interface PawnSVGProps {
  color: string;
  size?: number;
  id: string;
  isActive: boolean; 
  isFinished:boolean
}

export const Pawn = ({
  color = "#EF4444",
  size = 30,
  id,
  isActive, 
  isFinished
}: PawnSVGProps) => {
  const pawnRef = useRef<HTMLElement | null>(null);
  const { movePawn, currTurn, canPawnMove } = useGameStore();
  const pawncolor: Record<string, any> = {
    Blue: "#93c5fd",
    Red: "#fb7185",
    Green: "#a7f3d0",
    Yellow: "#fef08a",
  };

  return (
    <span
      id={id}
      ref={pawnRef}
      className={`  ${!isFinished && "absolute"}  ${isActive ? "z-50" : "z-10"}`}
      onClick={(e) => {
        e.stopPropagation();
        if (canPawnMove) {
          movePawn(id);
        }
      }}
    >
      <svg
        width={isActive ?size+5 :size}
        id={id}
        height={isActive ? size+5 :size}
        viewBox="0 0 100 100"
        className={`transition-transform  cursor-pointer  ${isActive ? "scale-110  z-50 " : "hover:scale-105"}`}
      >
        <ellipse cx="50" cy="85" rx="35" ry="8" fill="rgba(0,0,0,0.1)" />

        <circle cx="50" cy="40" r="28" fill={pawncolor[color]} />

        <rect x="42" y="60" width="16" height="15" fill={pawncolor[color]} />

        <ellipse cx="50" cy="80" rx="20" ry="12" fill={pawncolor[color]} />
        <circle cx="40" cy="30" r="8" fill="white" opacity="0.3" />
        <circle
          cx="50"
          cy="40"
          r="28"
          fill="none"
          stroke="rgba(0,0,0,0.1)"
          strokeWidth="1"
        />
      </svg>
    </span>
  );
};
