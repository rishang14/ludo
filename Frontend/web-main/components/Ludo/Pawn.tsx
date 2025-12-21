"use client";
import { sendPawnMoveToServer } from "@/lib/ws.helper";
import { useGameStore } from "@/state/gameStore";
import { useRef } from "react";

interface PawnSVGProps {
  color: string;
  size?: number;
  id: string;
  isFinished: boolean;
}

export const Pawn = ({
  color = "#EF4444",
  size = 30,
  id,
  isFinished,
}: PawnSVGProps) => {
  const pawnRef = useRef<HTMLElement | null>(null);
  const { currentUserTurn, canPawnMove, movablePawn, gameId, userId } =
    useGameStore();
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
      className={`  ${!isFinished && "absolute"}  ${
        movablePawn.has(id) ? "z-50" : "z-10"
      }`}
      onClick={(e) => {
        e.stopPropagation();
        if (!userId || !gameId) return;
        if (canPawnMove && movablePawn.has(id)) {
          if (currentUserTurn === userId) {
            sendPawnMoveToServer(gameId, userId, id);
            console.log(" i am send");
          }
        }
      }}
    >
      <svg
        width={movablePawn.has(id) ? size + 5 : isFinished ? 20 : size}
        id={id}
        height={movablePawn.has(id) ? size + 5 : size}
        viewBox="0 0 100 100"
        className={`
    block transition-transform  cursor-pointer
    ${
      movablePawn.has(id)
        ? "w-10 h-10  scale-110  z-50 "
        : "hover:scale-105 w-8 h-8"
    }
    w-8 h-8
  `}
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
