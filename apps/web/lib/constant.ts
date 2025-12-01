import { one, two, three, four, five, six } from "../public/index";

interface diceType {
  value: number;
  img: any;
}

export const redPath = [
  "B13",
  "R1",
  "R2",
  "R3",
  "R4",
  "R5",
  "B12",
  "RW1",
  "RW2",
  "RW3",
  "RW4",
  "RW5",
  "B11",
  "B10",
  "B9",
  "B8",
  "B7",
  "B6",
];

export const greenPath = [
  "R11",
  "R12",
  "R13",
  "R10",
  "GW1",
  "G1",
  "R9",
  "GW2",
  "G2",
  "R8",
  "GW3",
  "G3",
  "R7",
  "GW4",
  "G4",
  "R6",
  "GW5",
  "G5",
];

export const bluePath = [
  "B5",
  "BW5",
  "Y6",
  "B4",
  "BW5",
  "Y7",
  "B3",
  "BW5",
  "Y8",
  "B3",
  "BW5",
  "Y9",
  "B1",
  "BW5",
  "Y10",
  "Y13",
  "Y12",
  "Y11",
];

export const yellowPath = [
  "G6",
  "G7",
  "G8",
  "G9",
  "G10",
  "G11",
  "YW5",
  "YW4",
  "YW3",
  "YW2",
  "YW1",
  "G12",
  "Y5",
  "Y4",
  "Y3",
  "Y2",
  "Y1",
  "G13",
];

export const globalSafePlace = ["G1", "R1", "Y1", "B1", "G8", "Y8", "B8", "R8"];

export type redSafePlace = ["R1", "B8"];
export type blueSafePlace = ["B1", "Y8"];
export type greenSafePlace = ["G1", "R8"];
export type yellowSafePlace = ["Y1", "G8"];

export const DiceValues: diceType[] = [
  {
    value: 1,
    img: one,
  },
  {
    value: 2,
    img: two,
  },
  {
    value: 3,
    img: three,
  },
  {
    value: 4,
    img: four,
  },
  {
    value: 5,
    img: five,
  },
  {
    value: 6,
    img: six,
  },
];


 

export const yellowPawnHome=["YP1","YP2","YP3", "YP4"] 
export const bluePawnHome=["BP1","BP2","BP3", "BP4"]  
export const greenPawnHome=["GP1","GP2","GP3", "GP4"] 
export const redPawnHome= ["RP1","RP2","RP3", "RP4"]   