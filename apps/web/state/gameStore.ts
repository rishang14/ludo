import { globaLBoard } from "@/lib/constant";
import { create } from "zustand";
import { calcMove, getPathOfPawn } from "./gameHleper";


type colors = "Red" | "Blue" | "Green" | "Yellow"
export type pawn = {
  pId: string;
  position: string;
  isHome: boolean;
  isFinished: boolean;
  color: colors
};

interface gameBoard {
  pawnMap: Map<string, pawn>;
  boardMap: Map<string, Set<string>>;
  currTurn: string;
  nextTurn: () => void;
  movement: string[];
  moveablePawn: Set<string>;
  initGameBoard: () => void;
  getMovablePawn: (diceVal: number, currentTurn: string) => string[];
  diceVal: number;
  movePawn: (pawnId: string) => void;
  rollDice: () => void;
}

export const useGameStore = create<gameBoard>()((set, get) => ({
  pawnMap: new Map(),
  boardMap: new Map(),
  diceVal: 1,
  movement: ["Red", "Green", "Yellow", "Blue"],
  currTurn: "Red",
  moveablePawn: new Set(),

  initGameBoard: () => {
    const pawnMap = new Map<string, pawn>();
    const boardMap = new Map<string, Set<string>>();

    globaLBoard.flatMap((cell) => {
      //board is ready with all the cell with empty set
      for (let val of cell) {
        boardMap.set(val, new Set());
      }
    });
    // Currently this start with assuming 4 player in the match make it customizable

    let pawnColor = ["R", "G", "B", "Y"];
    let mapColor: Record<string, string> = {
      "R": "Red",
      "G": "Green",
      "B": "Blue",
      "Y": "Yellow"
    }
    for (const c of pawnColor) {
      [1, 2, 3, 4].forEach((v) => {
        const pId = `${c}P${v}`; // pawn id 
        const color = mapColor[c]
        const pawn = { pId, position: pId, isHome: true, isFinished: false, color: color as colors }; // pawn value
        pawnMap.set(pId, pawn); // pawn is placed in pawn map for all board
        boardMap.get(pId)?.add(pId); //pawn is placed inside the main map
      });
    }
    set({ pawnMap, boardMap });
  },

  movePawn: (pawnId: string) => {
    const currnetTurnPawns = get().moveablePawn;
    const diceVal = get().diceVal;
    const allpawn = get().pawnMap;
    const currentTurn = get().currTurn;
    const globaLBoard = get().boardMap;
    const getPawnPath = getPathOfPawn({ currentTurn: currentTurn as any });

    if (!currnetTurnPawns.has(pawnId)) {
      // console.log("You can't move the pawn");
      return;
    }
    const currPawn = allpawn.get(pawnId);
    if (!currPawn) return;
    const { newPos, pathAcheived, isHome } = calcMove(getPawnPath, currPawn, diceVal);
     console.log(newPos,"newpos")
    if (pathAcheived) {
      allpawn.set(currPawn.pId, { ...currPawn, isFinished: true, isHome }); //  it is winner
      globaLBoard.get(currPawn.position)?.delete(currPawn.pId); // remove this pawn from the gloabal paht
      set({ pawnMap: allpawn, boardMap: globaLBoard });
      return;
    }

    allpawn.set(currPawn.pId, { ...currPawn, position: newPos, isHome });
    globaLBoard.get(currPawn.position)?.delete(currPawn.pId);
    globaLBoard.get(newPos)?.add(currPawn.pId);

    set({ pawnMap: allpawn, boardMap: globaLBoard });
    if (diceVal !== 6) {
      get().nextTurn();
    }

    return;
  },

  nextTurn: () => {
    const currTurn = get().currTurn;
    const currIdx = get().movement.indexOf(currTurn);
    const totalSize = get().movement.length;
    const nextTurn = get().movement[currIdx + 1 < totalSize ? currIdx + 1 : 0];
    set({ currTurn: nextTurn });
  },

  getMovablePawn: (diceVal: number, currentTurn: string) => {
    const currentTurnPawnPos: string[] = [];
    for (let i = 1; i <= 4; i++) {
      const pId = `${currentTurn}P${i}`;
      const pawn = get().pawnMap.get(pId);
      if (!pawn) continue;

      if (pawn?.isHome) {
        if (diceVal === 6) {
          currentTurnPawnPos.push(pawn.pId);
        }
        continue;
      }
      console.log("hello after continue")
      if (!pawn?.isFinished) {
        currentTurnPawnPos.push(pawn.pId);
      }
    }

    return currentTurnPawnPos;
  },

  rollDice: () => {
    const diceVal = Math.floor(Math.random() * 6) + 1;
    const currentTurn = get().currTurn.charAt(
      0);
    // console.log("Current Turn",currentTurn)
    let currentTurnPawnPos: string[] = get().getMovablePawn(
      diceVal,
      currentTurn
    );
    // console.log("Curent turn pawn pos",currentTurnPawnPos)



    const movable = get().moveablePawn;
    movable.clear();

    if (currentTurnPawnPos.length === 0) {
      set({ diceVal });
      get().nextTurn();
      return;
    }

    currentTurnPawnPos.forEach((v) => movable.add(v));
    // this is pushing into movable item
    set({ diceVal, moveablePawn: movable });
    return;
  },
}));
