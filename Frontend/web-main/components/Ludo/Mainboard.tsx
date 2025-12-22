"use client";
export const dynamic = "force-dynamic";
import { Dice } from "@/components/Ludo/Dice";
import { DrawPath } from "@/components/Ludo/DrawPath";
import { StartBorad } from "@/components/Ludo/StartBorad";
import WinZone from "@/components/Ludo/WinZone";
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
} from "@/lib/constant";
import { useGameStore } from "@/state/gameStore";
import { useSocket } from "@/state/socketClient";
import React, { useEffect } from "react";
import { WinScreen } from "../Global/winner.model";
import { useRouter } from "next/navigation";
import axios from "axios";
import { LudoWaitingDialog } from "../Global/ludoWaiting";

type LudoProp = {
  gameId: string;
};

const Ludo: React.FC<LudoProp> = ({ gameId }) => {
  const {
    winnerFound,
    diceVal,
    currentUserTurn,
    setGameAndUser,
    userId,
    gameStarted,
    joinedPlayers,
    totalPlayers,
  } = useGameStore();
  const { connectToSocket, disconnectSocket, sendToServer, isConnected } =
    useSocket();
  const router = useRouter();

  useEffect(() => {
    if (!gameId) return;
    const handlers = async () => {
      try {
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_API_HTTP_ENDPOINT}/game/${gameId}`,
          {},
          { withCredentials: true }
        );
        if (res.data.data) {
          setGameAndUser(gameId, res.data.data);
        } else {
          router.push("/");
        }
      } catch (error) {
        router.push("/");
      }
    };

    handlers();
  }, []);

  useEffect(() => {
    if (!gameId || !userId) return;
    connectToSocket();

    return disconnectSocket();
  }, [gameId, userId]);
  useEffect(() => {
    if (!gameId || !userId) return;
    setGameAndUser(gameId, userId);
    if (isConnected) {
      sendToServer("join_User");
    }
  }, [isConnected, gameId, userId]);
   if(!gameStarted){
   return <LudoWaitingDialog/>
   }
  return (
    <>   

      <div className=" md:max-w-5xl md:mx-auto h-screen flex  items-center md:p-5 md:flex-row flex-col  md:items-center  gap-2   ">
             <div className="md:flex md:items-center md:flex-col md:flex-1 space-y-2">
          <h2 className="text-white text-center  text-4xl font-serif">
            Ludo Board
          </h2>

        <div id="ludoBoard" className="rounded-sm"> 
          <div className="red-board flex items-center justify-center rounded-sm bg-red-700/70">
            <StartBorad bgColor="bg-red-500/80" pawnHome={redPawnHome} />
          </div>
          <div className="red-path horizontal-path bg-zinc-50">
            <DrawPath
              className=" -m-px border  border-b-0   border-slate-950"
              path={redBoardPath}
              drawBgColorOnPath={drawRedColor}
              userId={userId}
              color="#fb2c36cc"
              pathname="redPath"
            />
          </div>
          <div className="green-board flex items-center justify-center rounded-sm bg-green-500/80">
            <StartBorad bgColor="bg-green-500" pawnHome={greenPawnHome} />
          </div>
          <div className="green-path vertical-path bg-zinc-50">
            <DrawPath
              path={greenBoardPath}
              drawBgColorOnPath={drawGreenColor}
              pathname="greenPath"
              userId={userId}
              color="#00c950"
              className="border-b-[.25px]  border-r-[.25px] border-l-0  border-slate-950"
            />
          </div>
          <div className="win-zone rounded-sm bg-zinc-50  border-t-0 border-r-0 border-b-[0.25px] border-l-[.25px] border-slate-950">
            <WinZone />
          </div>
          <div className="blue-board rounded-sm  flex items-center justify-center bg-blue-500/70">
            <StartBorad bgColor="bg-blue-500" pawnHome={bluePawnHome} />
          </div>
          <div className="blue-path vertical-path bg-zinc-50">
            <DrawPath
              path={blueBoardPath}
              pathname="bluepPath"
              drawBgColorOnPath={drawBlueColor}
              userId={userId}
              color="#2b7fff"
              className="border-b-[.25px]  border-r-[.25px]   border-slate-950"
            />
          </div>
          <div className="yellow-board flex items-center justify-center rounded-sm  bg-yellow-300/70">
            <StartBorad bgColor="bg-yellow-400" pawnHome={yellowPawnHome} />
          </div>
          <div className="yellow-path horizontal-path bg-zinc-50">
            <DrawPath
              className=" -m-px border border-b-0 border-slate-950"
              path={yellowBoardPath}
              drawBgColorOnPath={drawYellowColor}
              userId={userId}
              color="#fdc700"
              pathname="yellow"
            />
          </div>
        </div> 
          </div>
        <div className=" md:mx-auto flex md:p-2 justify-center flex-col    gap-2 items-center md:w-[20%] w-full rounded-md ">
          <h1 className="text-white font-serif   ">Roll Dice: {diceVal}</h1>
          <h2 className="text-white font-serif">
            {currentUserTurn === userId ? "Your" : "Opponent"} turn
          </h2>
          {currentUserTurn === userId && (
            <Dice gameId={gameId} userId={userId} />
          )}
        </div>
      </div>
      {winnerFound && <WinScreen />}
    </>
  );
};

export default Ludo;
