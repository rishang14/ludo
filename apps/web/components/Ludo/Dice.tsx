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

const diceMap: Record<number, any> = {
  1: <Dice1Icon className="w-full" size={"80px"} />,
  2: <Dice2Icon className="w-full" size={"80px"} />,
  3: <Dice3Icon className="w-full" size={"80px"} />,
  4: <Dice4Icon className="w-full" size={"80px"} />,
  5: <Dice5Icon className="w-full" size={"80px"} />,
  6: <Dice6Icon className="w-full" size={"80px"} />,
};

interface dice {
  value: number;
  rollDice: () => void;
}

export const Dice = ({ value, rollDice }: dice) => {
  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        rollDice();
      }}
      className="flex cursor-pointer  rounded-md bg-neutral-900  text-white"
    >
      {diceMap[value]}
    </div>
  );
};
