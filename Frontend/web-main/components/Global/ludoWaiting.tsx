"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useGameStore } from "@/state/gameStore";
import { useEffect, useState } from "react";



export const LudoWaitingDialog = () => {
 const {totalPlayers,joinedPlayers,gameStarted}=useGameStore()

  const playerColors = [
    { bg: "bg-[#ef4444]", border: "border-[#ef4444]" }, // Red
    { bg: "bg-[#22c55e]", border: "border-[#22c55e]" }, // Green
    { bg: "bg-[#eab308]", border: "border-[#eab308]" }, // Yellow
    { bg: "bg-[#3b82f6]", border: "border-[#3b82f6]" }, // Blue
  ];

  return (
    <Dialog open={!gameStarted}>
      <DialogContent className="max-w-md border-2 shadow-2xl p-0" > 
        <Card className="border-0 shadow-none">
          <CardHeader className="space-y-4 pb-4">
            <div className="flex justify-center">
              <div className="relative">
                {/* Animated dice */}
                <div className="h-15 w-15 rounded-xl bg-primary shadow-lg ">
                  <svg
                    viewBox="0 0 100 100"
                    className="h-full w-full p-3 text-primary-foreground"
                    fill="currentColor"
                  >
                    <circle cx="30" cy="30" r="8" />
                    <circle cx="70" cy="30" r="8" />
                    <circle cx="30" cy="70" r="8" />
                    <circle cx="70" cy="70" r="8" />
                    <circle cx="50" cy="50" r="8" />
                  </svg>
                </div>
                {/* Pulsing ring */}
                <div className="absolute -inset-2 rounded-2xl bg-primary/20 animate-ping" />
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6 pb-8">
            {/* Player slots */}
            <div className="grid grid-cols-2 gap-4">
              {playerColors.slice(0, totalPlayers).map((color, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-3 rounded-lg border-2 p-4 transition-all duration-300 ${
                    index < joinedPlayers
                      ? `${color.border} bg-card shadow-md scale-100`
                      : "border-muted bg-muted/30 scale-95 opacity-50"
                  }`}
                >
                  <div
                    className={`h-10 w-10 rounded-full ${
                      index < joinedPlayers ? color.bg : "bg-muted"
                    } flex items-center justify-center text-primary-foreground font-bold text-lg shadow-md transition-all duration-300 ${
                      index < joinedPlayers ? "animate-pulse" : ""
                    }`}
                  >
                    {index < joinedPlayers ? "✓" : index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm">
                      {index < joinedPlayers ? "Ready" : "Waiting"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Player {index + 1}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Message */}
            <div className="space-y-3 text-center">
              <p className="text-lg font-semibold text-foreground">
                Please Wait for Others to Join
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                The game will start automatically once all players have joined
                the match
              </p>
            </div>

            {/* Loading bar */}
            <div className="space-y-2">
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full bg-primary transition-all duration-1000 animate-pulse rounded-full"
                  style={{ width: `${(joinedPlayers / totalPlayers) * 100}%` }}
                />
              </div>
              <p className="text-center text-xs text-muted-foreground font-medium">
                {joinedPlayers} of {totalPlayers} players ready
              </p>
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};
