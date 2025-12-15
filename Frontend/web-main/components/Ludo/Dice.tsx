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
import { useSocket } from "@/state/socketClient";

const diceMap: Record<number, any> = {
  1: <Dice1Icon className="w-full" size={"80px"} />,
  2: <Dice2Icon className="w-full" size={"80px"} />,
  3: <Dice3Icon className="w-full" size={"80px"} />,
  4: <Dice4Icon className="w-full" size={"80px"} />,
  5: <Dice5Icon className="w-full" size={"80px"} />,
  6: <Dice6Icon className="w-full" size={"80px"} />,
};

type DiceProp={
  userId:string, 
  gameId:string
}

export const Dice:React.FC<DiceProp> = ({userId,gameId}) => {  

  const {diceVal,currentUserTurn, canDiceRoll}=useGameStore();  
  console.log(canDiceRoll,"dice roll"); 
  console.log(currentUserTurn,"currTrurn");
  const {sendToServer}=useSocket() 
  const rollDice=()=>{
    if(currentUserTurn !== userId) return;   
    console.log("clicked and send to the server");
    sendToServer("roll_Dice",{gameId,userId})
  }
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
