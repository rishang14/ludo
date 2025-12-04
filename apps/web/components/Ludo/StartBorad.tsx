import React from "react";
import { Pawn } from "./Pawn";  
import { useGameStore } from "@/state/gameStore";


interface homeType{
  bgColor:string,
  pawnHome:string[], 
  pawnColor:string
}

export const StartBorad = ({bgColor,pawnHome,pawnColor}:homeType) => { 
  const {pawnMap} =useGameStore(); 
  return (
    <div className="w-[65%] p-2 rounded-sm h-[65%] bg-zinc-50">
      <div className=" h-full w-full flex items-center justify-between flex-wrap  ">
        {pawnHome.map((i) => { 
          return (
            <div
              className={`rounded-full h-[40%] flex  items-center    justify-center w-[40%] ${bgColor}`}
              key={i}
            >
             {  
              pawnMap.get(i)?.pId === i   &&  (<Pawn key={i} id={i}  size={80}  color={pawnColor}/> ) 
             }
            </div>
          );
        })}
      </div>
    </div>
  );
};

