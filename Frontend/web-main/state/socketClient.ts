import { create } from "zustand";
import { useGameStore } from "./gameStore";

type JoinedUser = {
  gameId: string;
  userId: string;
};
interface SocketType {
  socket: WebSocket | null;
  isConnected: boolean;
  connectToSocket: () => void;
  sendToServer: (type: string, payload: any) => void;
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
      console.log(e);
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
      case "game_status":
        const { pawnMap, gameBackbone, globaLBoardMap } = payload.data;
        useGameStore
          .getState()
          .initGameBoard(pawnMap, globaLBoardMap, gameBackbone);
        break;
      case "dice_Rolled":  
      console.log(payload,"payload"); 
     useGameStore.getState().updateBackbone(payload.data.backBone);
      break;
      default:
        break;
    }
  },
}));
