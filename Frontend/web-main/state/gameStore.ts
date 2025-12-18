import { globalSafePlace } from "@/lib/constant";
import { sendPawnMoveToServer } from "@/lib/ws.helper";
import { create } from "zustand";

type colors = "Red" | "Blue" | "Green" | "Yellow";
export type pawn = {
  pId: string;
  position: string;
  isHome: boolean;
  userId: string;
  isFinished: boolean;
  color: colors;
};

interface gameBoard {
  pawnMap: Map<string, pawn>; 
  gameId:string, 
  userId:string,
  boardMap: Map<string, Set<string>>;
  currentTurn: string;
  currentUserTurn: string;
  canDiceRoll: boolean; 
  winnerFound:boolean,  
  winnerName:string, 
  winnerColor:string, 
  canPawnMove: boolean;
  winnerOrders: string[];
  diceVal: number;
  movablePawn: Set<string>;
  safePlace: Set<string>; 
  setGameAndUser:(gameId:string ,userId:string)=> void
  setWinnerFound:(winnerName:string,winnerColor:string)=>void
  updateBackbone: (gState: any) => void;
  updateBoard: (
    pId: string,
    captured: boolean,
    capturedPawn: string,
    newPos: string,
    isFinished: boolean
  ) => void;
  updatePawnState:(
    pId: string,
    captured: boolean,
    isFinished: boolean,
    newpos?: string
  ) => void;
  updateBoardState: (pId: string, oldPos: string, newPos: string) => void;
  initGameBoard: (pawnMap: any, globalBoard: any, gameState: any) => void;
}

export const useGameStore = create<gameBoard>()((set, get) => ({
  pawnMap: new Map(),
  boardMap: new Map(),
  safePlace: new Set(globalSafePlace),
  canDiceRoll: true,
  canPawnMove: false, 
  winnerFound:false, 
  winnerColor:"", 
  winnerName:"", 
  gameId:"", 
  userId:"",
  winnerOrders: [],
  diceVal: 1,
  currentUserTurn: "",
  currentTurn: "Red",
  movablePawn: new Set(), 


  setWinnerFound:(winnerName,winnerColor)=>{
    set({winnerFound:true , winnerColor,winnerName})
  }, 

  setGameAndUser:(gameId,userId)=>{
    set({gameId,userId})
  },

  initGameBoard: (pMap, gMap, gState) => {
    const pawnMap = new Map<string, pawn>();
    const boardMap = new Map<string, Set<string>>();
    for (const [key, value] of Object.entries(pMap)) {
      const val: pawn = JSON.parse(value as any);
      pawnMap.set(key, val);
    }
    for (const [key, value] of Object.entries(gMap)) {
      boardMap.set(key, new Set());
      const val: string[] = JSON.parse(value as any);
      for (const c of val) {
        boardMap.get(key)?.add(c);
      }
    }

    for (const [key, value] of Object.entries(gState)) {
      if (key === "movablePawns") {
        set({ movablePawn: new Set(JSON.parse(value as any)) });
        continue;
      }
      set({ [key as keyof gameBoard]: JSON.parse(value as any) });
    }

    set({ pawnMap, boardMap });
  },

  updateBoard: (pId, captured, capturendPawn, newPos, isFinished) => {
    const pawn = get().pawnMap.get(pId);
    if (!pawn) return;
    console.log(pawn, "pawn");
    if (captured) {
      const capPawn = get().pawnMap.get(capturendPawn);
      if (!capPawn) return;
      get().updatePawnState(capturendPawn, true, false);
      get().updatePawnState(pId, false, false, newPos);
      get().updateBoardState(pId, pawn.position, newPos);
      get().updateBoardState(capturendPawn, capPawn.position, capturendPawn);
      return;
    }
    if (isFinished) {
      get().updatePawnState(pId, false, true, "");
      get().updateBoardState(pId, pawn.position, "");
      return;
    }

    get().updatePawnState(pId, false, false, newPos);
    get().updateBoardState(pId, pawn.position, newPos);
  },

  updateBackbone: (gState: any) => {
    for (const [key, value] of Object.entries(gState)) {
      if (key === "movablePawns") {  
        // @ts-ignore
        if( value.length === 1 && get().currentUserTurn ===get().userId){ 
          console.log("i am inside the auto move") 
          // @ts-ignore
          sendPawnMoveToServer(get().gameId,get().userId,value[0])
        }
        set({ movablePawn: new Set(value as any) });
        continue;
      }
      set({ [key as keyof gameBoard]: value as any });
    }
  },

  updateBoardState: (pId, oldPos, newPos) => {
    const board = new Map(get().boardMap);

    board.get(oldPos)?.delete(pId);
    board.get(newPos)?.add(pId);
    set({ boardMap: board });
  },

  updatePawnState: (pId, captured, isFinished, newPos) => {
    const pawns= new Map(get().pawnMap);  
    const pawn= pawns.get(pId);  
  if(!pawn) return;
    pawns.set(pId, {  
      ...pawn,
      position: captured
        ? pId
        : isFinished
        ? ""
        : newPos ?? pawn.position,
      isFinished: isFinished ? true : pawn.isFinished,
    })

    set({pawnMap: pawns})
  },

  // capturePawn: (newPos, currentpawn): boolean => {
  //   const boardMap = new Map(get().boardMap);
  //   const allpawn = new Map(get().pawnMap);
  //   const pawnsAtNewPos = boardMap.get(newPos);
  //   if (!pawnsAtNewPos || pawnsAtNewPos.size === 0) {
  //     return false;
  //   }

  //   for (let p of pawnsAtNewPos) {
  //     if (p.charAt(0) === currentpawn.pId.charAt(0)) return false;
  //     const capturedpawn = allpawn.get(p);
  //     // console.log(" that pawn  ",capturedpawn);
  //     if (!capturedpawn) return false;
  //     allpawn.set(capturedpawn.pId, {
  //       ...capturedpawn,
  //       isHome: true,
  //       position: capturedpawn.pId,
  //     });
  //     boardMap.get(p)?.add(p);
  //     boardMap.get(newPos)?.delete(p);
  //   }
  //   boardMap.get(newPos)?.add(currentpawn.pId);
  //   allpawn.set(currentpawn.pId, { ...currentpawn, position: newPos });

  //   set({ pawnMap: allpawn, boardMap, canDiceRoll: true });
  //   return true;
  // },

  // movePawn: (pawnId: string) => {
  //   set({ canDiceRoll: true });
  //   const currnetTurnPawns = get().movablePawn;
  //   const diceVal = get().diceVal;
  //   const allpawn = new Map(get().pawnMap);
  //   const currentTurn = get().currentTurn;
  //   const globaLBoard = new Map(get().boardMap);
  //   const getPawnPath = getPathOfPawn({ color: currentTurn as any });
  //   if (!currnetTurnPawns.has(pawnId)) {
  //     // console.log("You can't move the pawn");
  //     return;
  //   }
  //   const currPawn = allpawn.get(pawnId);
  //   if (!currPawn) return;
  //   const { newPos, pathAcheived, isHome } = calcMove(
  //     getPawnPath,
  //     currPawn,
  //     diceVal
  //   );

  //   if (!get().safePlace.has(newPos)) {
  //     const captured = get().capturePawn(newPos, currPawn);
  //     if (captured) {
  //       console.log("returned from here");
  //       return;
  //     }
  //   }

  //   if (currPawn.position === newPos) {
  //     set({ canPawnMove: true });
  //     return;
  //   }

  //   if (pathAcheived) {
  //     allpawn.set(currPawn.pId, { ...currPawn, isFinished: true, isHome }); //  it is winner
  //     globaLBoard.get(currPawn.position)?.delete(currPawn.pId); // remove this pawn from the gloabal paht
  //     set({ pawnMap: allpawn, boardMap: globaLBoard, canPawnMove: false });
  //     return;
  //   }

  //   allpawn.set(currPawn.pId, { ...currPawn, position: newPos, isHome });
  //   globaLBoard.get(currPawn.position)?.delete(currPawn.pId);
  //   globaLBoard.get(newPos)?.add(currPawn.pId);

  //   set({ pawnMap: allpawn, boardMap: globaLBoard, canPawnMove: false });
  //   if (diceVal !== 6) {
  //   }

  //   return;
  // },

}));
