"use client"
import { useCallback, useState } from "react";
import { Dice } from "@/components/Ludo/Dice";
import { DrawPath } from "@/components/Ludo/DrawPath";
import { StartBorad } from "@/components/Ludo/StartBorad";
import {
  bluePath,
  bluePawnHome,
  greenPath,
  greenPawnHome,
  redPath,
  redPawnHome,
  yellowPath,
  yellowPawnHome,
} from "@/lib/constant"; 

export default function Page() {  
const [val, setVal] = useState(1); 
const [show, setShow]= useState(false)
  const rollDice=useCallback(
    () => {
    const randomNumber=Math.floor(Math.random() * 6) + 1 
    setVal(randomNumber);   
    setShow(true) 
    },
    [],
  )
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
            className=" -m-px border border-slate-950"
            path={redPath}
            safePlace={["R1", "B8"]}
            pathname="redPath"
          />
        </div>
        <div className="green-board flex items-center justify-center rounded-sm bg-green-500/80">
          <StartBorad bgColor="bg-green-500" pawnHome={greenPawnHome} pawnColor="#a7f3d0"/>
        </div>
        <div className="green-path vertical-path bg-zinc-50">
          <DrawPath
            path={greenPath}
            pathname="greenPath"
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
            path={bluePath}
            pathname="bluepPath"
            safePlace={["B1", "Y8"]}
            className="border-b-[.25px]  border-r-[.25px] border-l-0  border-slate-950"
          />
        </div>
        <div className="yellow-board flex items-center justify-center rounded-sm  bg-yellow-300/70">
          <StartBorad bgColor="bg-yellow-400" pawnHome={yellowPawnHome} pawnColor="#fef08a"/>
        </div>
        <div className="yellow-path horizontal-path bg-zinc-50">
          <DrawPath
            className=" -m-px border border-slate-950"
            path={yellowPath}
            safePlace={["Y1", "G8"]}
            pathname="yellow"
          />
        </div>
      </div>
      <div className="h-[150px] mx-auto flex p-2 justify-center flex-col gap-2 items-center w-[80%] bg-slate-800 rounded-md ">
        <h1 className="text-white font-serif   ">Roll Dice: {show && ` You got ${val}`}</h1> 
        <Dice value={val} rollDice={rollDice}/>
      </div>
    </div>
  );
}
