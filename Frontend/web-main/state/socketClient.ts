import { create } from "zustand";
import { useGameStore } from "./gameStore";
import {
  redirectUserTohomeWithToast,
  userJoinedBroadCast,
} from "@/lib/ws.helper";

interface SocketType {
  socket: WebSocket | null;
  isConnected: boolean;
  connectToSocket: () => void;
  sendToServer: (type: string, payload?: any) => void;
  disconnectSocket: () => void;
  handleMessage: (message: any) => void;
}

export const useSocket = create<SocketType>()((set, get) => ({
  socket: null,
  isConnected: false,
  connectToSocket: () => {
    const existing = get().socket;
    if (
      existing &&
      (existing.readyState === WebSocket.OPEN ||
        existing.readyState === WebSocket.CONNECTING)
    ) {
      return;
    }
    const ws = new WebSocket(process.env.NEXT_PUBLIC_API_WS_ENDPOINT!);
    ws.onopen = () => {
      set({ isConnected: true, socket: ws });
    };
    ws.onclose = () => {
      set({ socket: null, isConnected: false });
    };

    ws.onerror = () => {
      ws.close();
    };

    ws.onmessage = (e) => {
      const payload = JSON.parse(e.data);
      get().handleMessage(payload);
    };
  },
  sendToServer: (type: string, payload: any) => {
    const ws = get().socket;
    if (!ws || ws.readyState !== WebSocket.OPEN) return;
    ws.send(JSON.stringify({ type, payload }));
  },
  disconnectSocket: () => {
    console.log("i am disconnected");
    const ws = get().socket;
    if (ws) {
      set({ socket: null, isConnected: false });
      ws.close();
    }
  },
  handleMessage: (payload: any) => {
    switch (payload.type) {
      case "game_Status":
        const { pawnMap, gameBackbone, globaLBoardMap } = payload.data;
        useGameStore
          .getState()
          .initGameBoard(pawnMap, globaLBoardMap, gameBackbone);
        break;
      case "dice_Rolled":
        useGameStore.getState().updateBackbone(payload.data.backbone);
        break;
      case "move_Pawn":
        if (payload?.data && payload.data?.backbone){
          useGameStore.getState().updateBackbone(payload.data.backbone);
        }
        const { pawnId, pawnNewPos, pawnWon, capturedPawn } = payload.data;
        const captured = capturedPawn.length > 0; 
        useGameStore
          .getState()
          .updateBoard(pawnId, captured, capturedPawn, pawnNewPos, pawnWon);
        break;

      case "user_Exited":
        redirectUserTohomeWithToast(payload.data as string);
        break;
      case "user_Joined":
        userJoinedBroadCast(payload.data);
        break;
      case "winner_Found":
        console.log(payload, "payload");
        const { winnerName, winnerColor } = payload.data;
        useGameStore.getState().setWinnerFound(winnerName, winnerColor); 
        break; 
        case"waiting":  
        console.log(payload.data,"data for payload") 
        console.log(payload.data.totalPlayers,"totalPlayers") 
        console.log(payload.data.joinedPlayers)   
        const {gameStarted,joinedPlayers,totalPlayers}= payload.data 
         useGameStore.getState().updateGameStart(gameStarted,totalPlayers,joinedPlayers)
        break;
      default:
        break;
    }
  },
}));
