import { globaLBoard } from "@/lib/constant";
import { create } from "zustand";

type pawn = {
  pId: string;
  position: string;
  isHome: boolean;
  isFinished: boolean;
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
  movePawn: (pawnId: string, pawnColor: string) => void;
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
    for (const c of pawnColor) {
      [1, 2, 3, 4].forEach((v) => {
        const pId = `${c}P${v}`; // pawn id
        const pawn = { pId, position: pId, isHome: true, isFinished: false }; // pawn value
        pawnMap.set(pId, pawn); // pawn is placed in pawn map for all board
        boardMap.get(pId)?.add(pId); //pawn is placed inside the main map
      });
    }
    set({ pawnMap, boardMap });
  },

  movePawn: (pawnId: string) => {},

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

      if (!pawn?.isFinished) {
        currentTurnPawnPos.push(pawn.pId);
      }
    }

    return currentTurnPawnPos;
  },

  rollDice: () => {
    const diceVal = Math.floor(Math.random() * 6) + 1;
    const currentTurn = get().currTurn.charAt(0);
    let currentTurnPawnPos: string[] = get().getMovablePawn(
      diceVal,
      currentTurn
    );

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
