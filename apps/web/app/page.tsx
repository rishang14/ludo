"use client"
import { useCallback, useEffect, useState } from "react";
import { Dice } from "@/components/Ludo/Dice";
import { DrawPath } from "@/components/Ludo/DrawPath";
import { StartBorad } from "@/components/Ludo/StartBorad";
import {
  blueBoardPath,
  bluePawnHome,
  drawBlueColor,
  drawGreenColor,
  drawRedColor,
  drawYellowColor,
  greenBoardPath,
  greenPawnHome,
  redBoardPath,
  redPawnHome,
  yellowBoardPath,
  yellowPawnHome, 
  globaLBoard
} from "@/lib/constant"; 
import { useGameStore } from "@/state/gameStore";

export default function Page() {  

const {initGameBoard,currTurn,diceVal,moveablePawn}=useGameStore(); 
console.log(currTurn,"movement") 
console.log("movable pawn",moveablePawn)
  
useEffect(()=>{
initGameBoard()
},[])

  return (
    <div className=" md:max-w-5xl mx-auto h-screen flex items-center p-5 flex-col  justify-start gap-2   ">
      <div className=" space-y-2">
        <h2 className="text-white text-center  text-4xl font-serif">
          Ludo Board
        </h2>
      </div>

      <div id="ludoBoard" className="rounded-sm">
        <div className="red-board flex items-center justify-center rounded-sm bg-red-700/70">
          <StartBorad bgColor="bg-red-500/80" pawnHome={redPawnHome} pawnColor="#fb7185"/>
        </div>
        <div className="red-path horizontal-path bg-zinc-50">
          <DrawPath
            className=" -m-px border border-r-0   border-slate-950"
            path={redBoardPath} 
            drawBgColorOnPath={drawRedColor}
            safePlace={["R1", "B8"]} 
            color="#fb2c36cc"
            pathname="redPath"
          />
        </div>
        <div className="green-board flex items-center justify-center rounded-sm bg-green-500/80">
          <StartBorad bgColor="bg-green-500" pawnHome={greenPawnHome} pawnColor="#a7f3d0"/>
        </div>
        <div className="green-path vertical-path bg-zinc-50">
          <DrawPath
            path={greenBoardPath} 
            drawBgColorOnPath={drawGreenColor}
            pathname="greenPath" 
            color="#00c950"
            safePlace={["G1", "R8"]}
            className="border-b-[.25px]  border-r-[.25px] border-l-0  border-slate-950"
          />
        </div>
        <div className="win-zone rounded-sm bg-zinc-50  border-t-0 border-r-0 border-b-[0.25px] border-l-[.25px] border-slate-950"></div>
        <div className="blue-board rounded-sm  flex items-center justify-center bg-blue-500/70">
          <StartBorad bgColor="bg-blue-500"  pawnHome={bluePawnHome} pawnColor="#93c5fd"/>
        </div>
        <div className="blue-path vertical-path bg-zinc-50">
          <DrawPath
            path={blueBoardPath}
            pathname="bluepPath"  
            drawBgColorOnPath={drawBlueColor}
            safePlace={["B1", "Y8"]} 
            color="#2b7fff"
            className="border-b-[.25px]  border-r-[.25px]   border-slate-950"
          />
        </div>
        <div className="yellow-board flex items-center justify-center rounded-sm  bg-yellow-300/70">
          <StartBorad bgColor="bg-yellow-400" pawnHome={yellowPawnHome} pawnColor="#fef08a"/>
        </div>
        <div className="yellow-path horizontal-path bg-zinc-50">
          <DrawPath
            className=" -m-px border border-r-0 border-slate-950"
            path={yellowBoardPath} 
            drawBgColorOnPath={drawYellowColor}
            safePlace={["Y1", "G8"]} 
            color="#fdc700"
            pathname="yellow"
          />
        </div>
      </div>
      <div className="h-[150px] mx-auto flex p-2 justify-center flex-col gap-2 items-center w-[80%] bg-slate-800 rounded-md ">
        <h1 className="text-white font-serif   ">Roll Dice: {diceVal} </h1>   
        <h2 className="text-white font-serif">Current turn is of : {currTurn}</h2>
        <Dice />
      </div>
    </div>
  );
}
