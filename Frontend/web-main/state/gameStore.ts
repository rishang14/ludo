import { globaLBoard, globalSafePlace } from "@/lib/constant";
import { create } from "zustand";
import { calcMove, getPathOfPawn } from "./gameHleper";


type colors = "Red" | "Blue" | "Green" | "Yellow";
export type pawn = {
  pId: string;
  position: string;
  isHome: boolean;
  isFinished: boolean;
  color: colors;
};

interface gameBoard {
  pawnMap: Map<string, pawn>;
  boardMap: Map<string, Set<string>>;
  currTurn: string;
  canDiceRoll: boolean;
  canPawnMove: boolean;
  nextTurn: () => void;
  movement: string[];
  moveablePawn: Set<string>;
  initGameBoard: () => void;
  getMovablePawn: (diceVal: number) => string[];
  diceVal: number;
  safePlace: Set<string>;
  capturePawn: (newPos: string, currentpawn: pawn) => boolean;
  movePawn: (pawnId: string) => void;
  rollDice: () => void;
}

export const useGameStore = create<gameBoard>()((set, get) => ({
  pawnMap: new Map(),
  boardMap: new Map(),
  safePlace: new Set(),
  canDiceRoll: true,
  canPawnMove: false,
  diceVal: 1,
  movement: ["Red", "Green", "Yellow", "Blue"],
  currTurn: "Red",
  moveablePawn: new Set(),

  initGameBoard: () => {
    const pawnMap = new Map<string, pawn>();
    const boardMap = new Map<string, Set<string>>();
    const safePlace = new Set<string>();
    globaLBoard.flatMap((cell) => {
      //board is ready with all the cell with empty set
      for (let val of cell) {
        boardMap.set(val, new Set());
      }
    });
    // Currently this start with assuming 4 player in the match make it customizable

    for (const p of globalSafePlace) {
      safePlace.add(p);
    }

    let pawnColor = ["R", "G", "B", "Y"];
    let mapColor: Record<string, string> = {
      R: "Red",
      G: "Green",
      B: "Blue",
      Y: "Yellow",
    };
    for (const c of pawnColor) {
      [1, 2, 3, 4].forEach((v) => {
        const pId = `${c}P${v}`; // pawn id
        const color = mapColor[c];
        const pawn = {
          pId,
          position: pId,
          isHome: true,
          isFinished: false,
          color: color as colors,
        }; // pawn value
        pawnMap.set(pId, pawn); // pawn is placed in pawn map for all board
        boardMap.get(pId)?.add(pId); //pawn is placed inside the main map
      });
    }
    set({ pawnMap, boardMap, safePlace });
  },

  capturePawn: (newPos, currentpawn): boolean => {
    const boardMap = new Map(get().boardMap);
    const allpawn = new Map(get().pawnMap);
    const pawnsAtNewPos = boardMap.get(newPos);
    if (!pawnsAtNewPos || pawnsAtNewPos.size === 0) {
      console.log("No pawn are available");
      return false;
    }
    console.log("cell value whith pawn set:", pawnsAtNewPos);
    for (let p of pawnsAtNewPos) {
      if (p.charAt(0) === currentpawn.pId.charAt(0)) return false;
      const capturedpawn = allpawn.get(p);
      console.log("pawn to be kill of pawn id", p);
      // console.log(" that pawn  ",capturedpawn);
      if (!capturedpawn) return false;
      allpawn.set(capturedpawn.pId, {
        ...capturedpawn,
        isHome: true,
        position: capturedpawn.pId,
      });
      boardMap.get(p)?.add(p);
      boardMap.get(newPos)?.delete(p);
    }
    boardMap.get(newPos)?.add(currentpawn.pId);
    allpawn.set(currentpawn.pId, { ...currentpawn, position: newPos });

    set({ pawnMap: allpawn, boardMap, canDiceRoll: true });
    return true;
  },

  movePawn: (pawnId: string) => {
    set({ canDiceRoll: true });
    const currnetTurnPawns = get().moveablePawn;
    const diceVal = get().diceVal;
    const allpawn = new Map(get().pawnMap);
    const currentTurn = get().currTurn;
    const globaLBoard = new Map(get().boardMap);
    const getPawnPath = getPathOfPawn({ color: currentTurn as any });
    if (!currnetTurnPawns.has(pawnId)) {
      // console.log("You can't move the pawn");
      return;
    }
    const currPawn = allpawn.get(pawnId);
    if (!currPawn) return;
    const { newPos, pathAcheived, isHome } = calcMove(
      getPawnPath,
      currPawn,
      diceVal
    );

    if (!get().safePlace.has(newPos)) {
      const captured = get().capturePawn(newPos, currPawn);
      if (captured) {
        console.log("returned from here");
        return;
      }
    }

    if (currPawn.position === newPos) {
      set({ canPawnMove: true });
      return;
    }

    if (pathAcheived) {
      allpawn.set(currPawn.pId, { ...currPawn, isFinished: true, isHome }); //  it is winner
      globaLBoard.get(currPawn.position)?.delete(currPawn.pId); // remove this pawn from the gloabal paht
      set({ pawnMap: allpawn, boardMap: globaLBoard, canPawnMove: false });
      return;
    }

    allpawn.set(currPawn.pId, { ...currPawn, position: newPos, isHome });
    globaLBoard.get(currPawn.position)?.delete(currPawn.pId);
    globaLBoard.get(newPos)?.add(currPawn.pId);

    set({ pawnMap: allpawn, boardMap: globaLBoard, canPawnMove: false });
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

  getMovablePawn: (diceVal: number) => {
    const currentTurnPawnPos: string[] = [];
    const turn = get().currTurn;
    const pawnPath = getPathOfPawn({ color: turn as any });
    for (let i = 1; i <= 4; i++) {
      const pId = `${turn.charAt(0)}P${i}`;
      const pawn = get().pawnMap.get(pId);
      if (!pawn) continue;

      if (pawn?.isHome) {
        if (diceVal === 6) {
          currentTurnPawnPos.push(pawn.pId);
        }
        continue;
      }

      if (!pawn?.isFinished) {
        const { newPos } = calcMove(pawnPath, pawn, diceVal);
        if (newPos != pawn.position) {
          currentTurnPawnPos.push(pawn.pId);
        }
      }
    }

    return currentTurnPawnPos;
  },

  rollDice: () => {
    const diceVal = Math.floor(Math.random() * 6) + 1;
    let currentTurnPawnPos: string[] = get().getMovablePawn(diceVal);

    set({ canPawnMove: true });
    const movable = get().moveablePawn;
    movable.clear();

    if (currentTurnPawnPos.length === 0) {
      set({ diceVal });
      get().nextTurn();
      return;
    }
    currentTurnPawnPos.forEach((v) => movable.add(v));

    if (currentTurnPawnPos.length === 1) {
      set({ diceVal, moveablePawn: movable, canDiceRoll: false });
      get().movePawn(currentTurnPawnPos[0] as string);
      return;
    }

    // this is pushing into movable item
    set({ diceVal, moveablePawn: movable, canDiceRoll: false });
    return;
  },
}));
