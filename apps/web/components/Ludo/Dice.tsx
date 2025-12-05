"use client";
import React from "react";
import {
  Dice1Icon,
  Dice2Icon,
  Dice3Icon,
  Dice4Icon,
  Dice5Icon,
  Dice6Icon,
} from "lucide-react";
import { useGameStore } from "@/state/gameStore";

const diceMap: Record<number, any> = {
  1: <Dice1Icon className="w-full" size={"80px"} />,
  2: <Dice2Icon className="w-full" size={"80px"} />,
  3: <Dice3Icon className="w-full" size={"80px"} />,
  4: <Dice4Icon className="w-full" size={"80px"} />,
  5: <Dice5Icon className="w-full" size={"80px"} />,
  6: <Dice6Icon className="w-full" size={"80px"} />,
};


export const Dice = () => {  

  const {diceVal,rollDice,canDiceRoll}=useGameStore()
  return (
    <div 
      onClick={(e) => { 
        e.stopPropagation();
        if(canDiceRoll){
          rollDice();
        }
      }}
      className="flex cursor-pointer  transform ease-in-out rounded-md bg-neutral-900  text-white"
    >
      {diceMap[diceVal]}
    </div>
  );
};
