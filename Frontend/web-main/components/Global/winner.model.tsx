"use client";

import  { useState } from "react";
import { Button } from "@/components/ui/button";
import { useGameStore } from "@/state/gameStore";
import { exitOrCancelGame } from "@/lib/action/server.action";
import { usePathname, useRouter } from "next/navigation";


export const WinScreen = () => { 
const [loading,setLoadig]=useState<boolean>(false)
  const [mounted, setMounted] = useState(false); 
  const pathName= usePathname() 
  const gameId =pathName.split("/")[2]
  const {winnerColor,winnerName,winnerFound,winnerOrders}=useGameStore() 
  const router=useRouter()
  const handleClick=async()=>{
  try { 
    setLoadig(true)
    const res= await exitOrCancelGame(gameId); 
   router.push("/")
  } catch (error) {
    
  }finally{
    setLoadig(false)
  }
  }

  if (!winnerFound) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center w-full md:max-w-2xl border-4 border-yellow-600 bg-yellow-100 p-8 rounded-lg backdrop-blur-sm animate-fade-in">

       <div className="space-y-6 text-center">
          {/* Title */}
          <div className="space-y-2">
            <h1 className="text-5xl font-bold text-yellow-900" style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.3)" }}>
              GAME OVER!
            </h1>
            <p className="text-lg font-semibold text-yellow-800">Final Rankings</p>
          </div>

         <div className="space-y-3">
            {winnerOrders.map((winner,index) => {

              return (
                <div
                  key={winner}
                  className={`rounded-lg border-4 ${winner} bg-linear-to-r ${winner} p-4 shadow-lg`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {/* <div className="text-4xl font-bold">{config.medal}</div> */}
                      <div className="text-left">
                        <p className={`text-sm font-bold  uppercase tracking-wider`}>
                          {index+1} Position
                        </p>
                        {/* <p className={`text-2xl font-bold ${config.textClass}`}>{winner.name}</p> */}
                      </div>
                    </div>
                    <div
                      className={`h-12 w-12 rounded-full border-4 shadow-md`}
                      style={{
                        backgroundColor: winner,
                      }}
                    />
                  </div>
                </div>
              )
            })}
          </div>

          {/* Close Button */}
          <Button
            // onClick={handleClose}
            className="w-full rounded-lg border-4 border-yellow-900 bg-yellow-500 px-6 py-3 text-lg font-bold text-white shadow-lg hover:bg-yellow-600 active:scale-95 transition-all"
          >
            OK
          </Button>
        </div>
    </div>
  );
}
