// src/index.ts
import express2 from "express";
import cors from "cors";
import http from "http";
import cookieParser from "cookie-parser";

// src/services/ws/realTime.ts
import { WebSocketServer } from "ws";

// src/services/ws/roomManager.ts
var RoomManager = class {
  gamwWithSocket = /* @__PURE__ */ new Map();
  userWithSocket = /* @__PURE__ */ new Map();
  joinRoom(gameId, userId, socket) {
    if (!gameId || !userId) return;
    if (!this.gamwWithSocket.has(gameId)) {
      this.gamwWithSocket.set(gameId, /* @__PURE__ */ new Set());
    }
    if (!this.userWithSocket.has(userId)) {
      this.userWithSocket.set(userId, /* @__PURE__ */ new Set());
    }
    this.gamwWithSocket.get(gameId)?.add(socket);
    this.userWithSocket.get(userId)?.add(socket);
  }
  //   public getTotalUser(gameId:string){
  //     if(!this.gameIdWithUser.has(gameId))throw new Error("Invalid Game Id");
  //     return this.gameIdWithUser.get(gameId)?.size;
  //   }
  //   public removeUserFromTheGame(gameId:string,userId:string){
  //     if(!this.gameIdWithUser.has(gameId)) throw new Error("Invalid Game Id");
  //     if(this.gameIdWithUser.get(gameId)?.has(userId)){
  //         this.gameIdWithUser.get(gameId)?.delete(userId);
  //         return;
  //     }
  //     throw new Error("Invalid User Id");
  //   }
  clearConnection(socket) {
    for (const [game, connection] of this.gamwWithSocket.entries()) {
      connection.delete(socket);
      if (connection.size === 0) {
        this.gamwWithSocket.delete(game);
      }
    }
  }
  broadcastInRoom(gameId, payload) {
    const client = this.gamwWithSocket.get(gameId);
    if (!client) return;
    client.forEach((socket) => {
      try {
        const data = JSON.stringify(payload);
        socket.send(data);
      } catch (error) {
        console.log("Error while sending the data", error);
      }
    });
  }
  broadCastTouser(UserId, payload) {
    const client = this.userWithSocket.get(UserId);
    if (!client) return;
    client.forEach((socket) => {
      try {
        socket.send(payload);
      } catch (error) {
      }
    });
  }
};

// src/utils/constant.ts
var redBoardPath = [
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
  "B6"
];
var greenBoardPath = [
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
  "G5"
];
var blueBoardPath = [
  "B5",
  "BW5",
  "Y6",
  "B4",
  "BW4",
  "Y7",
  "B3",
  "BW3",
  "Y8",
  "B2",
  "BW2",
  "Y9",
  "B1",
  "BW1",
  "Y10",
  "Y13",
  "Y12",
  "Y11"
];
var yellowBoardPath = [
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
  "G13"
];
var globalSafePlace = /* @__PURE__ */ new Set(["G1", "R1", "Y1", "B1", "G9", "Y9", "B9", "R9"]);
var yellowPawn = ["YP1", "YP2", "YP3", "YP4"];
var bluePawn = ["BP1", "BP2", "BP3", "BP4"];
var greenPawn = ["GP1", "GP2", "GP3", "GP4"];
var redPawn = ["RP1", "RP2", "RP3", "RP4"];
var dirstributePawn = [redPawn, yellowPawn, greenPawn, bluePawn];
var globaLBoard = [
  redBoardPath,
  greenBoardPath,
  blueBoardPath,
  yellowBoardPath
];
var redPawnPathToWin = [
  "R1",
  "R2",
  "R3",
  "R4",
  "R5",
  "R6",
  "R7",
  "R8",
  "R9",
  "R10",
  "R11",
  "R12",
  "R13",
  "G1",
  "G2",
  "G3",
  "G4",
  "G5",
  "G6",
  "G7",
  "G8",
  "G9",
  "G10",
  "G11",
  "G12",
  "G13",
  "Y1",
  "Y2",
  "Y3",
  "Y4",
  "Y5",
  "Y6",
  "Y7",
  "Y8",
  "Y9",
  "Y10",
  "Y11",
  "Y12",
  "Y13",
  "B1",
  "B2",
  "B3",
  "B4",
  "B5",
  "B6",
  "B7",
  "B8",
  "B9",
  "B10",
  "B11",
  "B12",
  "RW1",
  "RW2",
  "RW3",
  "RW4",
  "RW5"
];
var bluePawnPathToWin = [
  "B1",
  "B2",
  "B3",
  "B4",
  "B5",
  "B6",
  "B7",
  "B8",
  "B9",
  "B10",
  "B11",
  "B12",
  "B13",
  "R1",
  "R2",
  "R3",
  "R4",
  "R5",
  "R6",
  "R7",
  "R8",
  "R9",
  "R10",
  "R11",
  "R12",
  "R13",
  "G1",
  "G2",
  "G3",
  "G4",
  "G5",
  "G6",
  "G7",
  "G8",
  "G9",
  "G10",
  "G11",
  "G12",
  "G13",
  "Y1",
  "Y2",
  "Y3",
  "Y4",
  "Y5",
  "Y6",
  "Y7",
  "Y8",
  "Y9",
  "Y10",
  "Y11",
  "Y12",
  "BW1",
  "BW2",
  "BW3",
  "BW4",
  "BW5"
];
var mapColor = {
  R: "Red",
  G: "Green",
  B: "Blue",
  Y: "Yellow"
};
var yellowPawnPathToWin = [
  "Y1",
  "Y2",
  "Y3",
  "Y4",
  "Y5",
  "Y6",
  "Y7",
  "Y8",
  "Y9",
  "Y10",
  "Y11",
  "Y12",
  "Y13",
  "B1",
  "B2",
  "B3",
  "B4",
  "B5",
  "B6",
  "B7",
  "B8",
  "B9",
  "B10",
  "B11",
  "B12",
  "B13",
  "R1",
  "R2",
  "R3",
  "R4",
  "R5",
  "R6",
  "R7",
  "R8",
  "R9",
  "R10",
  "R11",
  "R12",
  "R13",
  "G1",
  "G2",
  "G3",
  "G4",
  "G5",
  "G6",
  "G7",
  "G8",
  "G9",
  "G10",
  "G11",
  "G12",
  "YW1",
  "YW2",
  "YW3",
  "YW4",
  "YW5"
];
var greenPawnPathToWin = [
  "G1",
  "G2",
  "G3",
  "G4",
  "G5",
  "G6",
  "G7",
  "G8",
  "G9",
  "G10",
  "G11",
  "G12",
  "G13",
  "Y1",
  "Y2",
  "Y3",
  "Y4",
  "Y5",
  "Y6",
  "Y7",
  "Y8",
  "Y9",
  "Y10",
  "Y11",
  "Y12",
  "Y13",
  "B1",
  "B2",
  "B3",
  "B4",
  "B5",
  "B6",
  "B7",
  "B8",
  "B9",
  "B10",
  "B11",
  "B12",
  "B13",
  "R1",
  "R2",
  "R3",
  "R4",
  "R5",
  "R6",
  "R7",
  "R8",
  "R9",
  "R10",
  "R11",
  "R12",
  "GW1",
  "GW2",
  "GW3",
  "GW4",
  "GW5"
];
var gameStarterkit = [
  {
    key: "diceVal",
    value: 1
  },
  {
    key: "canDiceRoll",
    value: true
  },
  {
    key: "canPawnMove",
    value: false
  },
  {
    key: "movablePawns",
    value: []
  },
  {
    key: "currentUserTurn",
    value: ""
  },
  {
    key: "winnerOrders",
    value: []
  },
  {
    key: "currentTurn",
    value: ""
  }
];
var pathToWin = {
  Red: redPawnPathToWin,
  Green: greenPawnPathToWin,
  Blue: bluePawnPathToWin,
  Yellow: yellowPawnPathToWin
};

// src/services/redis/redisClient.ts
import { createClient } from "redis";

// src/utils/redisConfig.ts
var redisConfig = {
  host: "127.0.0.1",
  port: 6379
};

// src/services/redis/redisClient.ts
var RedisInstance = class {
  static client = null;
  static pawnKey(gameId) {
    return `${gameId}:pawn`;
  }
  static boardKey(gameId) {
    return `${gameId}:board`;
  }
  static boardStateKey(gameId) {
    return `${gameId}:state`;
  }
  static userWithColorKey(gameId) {
    return `${gameId}:userWithColorKey`;
  }
  static joinedUserKey(gameId) {
    return `${gameId}:totalUser`;
  }
  static gameKey(gameId) {
    return `${gameId}:game`;
  }
  static initializedKey(gameId) {
    return `${gameId}:gameInit`;
  }
  static winnerKey(gameId) {
    return `gameId:${gameId}:winner`;
  }
  static async initialize() {
    if (this.client) {
      return;
    }
    this.client = createClient({
      socket: {
        host: redisConfig.host,
        port: redisConfig.port
      }
    });
    this.client.on("connect", () => {
      console.log("redis is connected ");
    });
    this.client.on("error", (err) => {
      console.log(err);
    });
    await this.client.connect();
  }
  static async expire(key) {
    if (!this.client) return;
    await this.client.expire(key, 60 * 40);
  }
  static async setGameInIt(gameId, value) {
    if (!this.client) {
      throw new Error("Redis is not conneced");
    }
    const key = this.initializedKey(gameId);
    const val = await this.client.hSet(key, "initalized", JSON.stringify(value));
    await this.expire(key);
  }
  static async getInitGameStatus(gameId) {
    if (!this.client) {
      throw new Error("Redis is not connected");
    }
    const key = this.initializedKey(gameId);
    const val = await this.client.hGet(key, "initalized");
    if (!val) {
      return null;
    }
    return JSON.parse(val);
  }
  static async setGame(gameId, payload) {
    if (!this.client) {
      throw new Error("Redis is not connected");
    }
    const key = this.gameKey(gameId);
    const details = await this.client.hSet(key, "gameDetails", JSON.stringify(payload));
    await this.expire(key);
  }
  static async alreadyInJoinedUser(gameId, userId) {
    if (!this.client) {
      throw new Error("Redis is not connected");
    }
    const key = this.joinedUserKey(gameId);
    const userExists = await this.client.sIsMember(key, userId);
    return userExists;
  }
  static async getGame(gameId) {
    if (!this.client) {
      throw new Error("Redis is not connected");
    }
    const key = this.gameKey(gameId);
    const gameDetails = await this.client.HGET(key, "gameDetails");
    if (!gameDetails) {
      throw new Error("game not found");
    }
    return JSON.parse(gameDetails);
  }
  static async getOnePawn(gameId, pId) {
    if (!this.client) {
      throw new Error("Redis is not connected");
    }
    const key = this.pawnKey(gameId);
    const pawn = await this.client.hGet(key, pId);
    if (!pawn) {
      throw new Error("Invalid gameId or pawnId");
    }
    return JSON.parse(pawn);
  }
  static async setUserWithColor(gameId, userId, val) {
    if (!this.client) {
      throw new Error("Redis is not connected");
    }
    try {
      const key = this.userWithColorKey(gameId);
      const setUserWithColor = await this.client.HSET(key, userId, JSON.stringify(val));
      await this.expire(key);
    } catch (error) {
      console.log("errorwhile seting up the userwith color", error);
    }
  }
  static async getUserWithColor(gameId, userId) {
    console.log("user with color", userId);
    const key = this.userWithColorKey(gameId);
    if (!this.client) {
      throw new Error("Redis is not connected");
    }
    try {
      const userWithColor = await this.client.hGet(key, userId);
      if (!userWithColor) {
        throw new Error("Invalid gameId or pawnId");
      }
      return JSON.parse(userWithColor);
    } catch (error) {
      console.log("error while getting up userwith color", error);
    }
  }
  static async setJoinedUsers(gameId, val) {
    if (!this.client) {
      throw new Error("Redis is not connected");
    }
    const key = this.joinedUserKey(gameId);
    const totalUser = await this.client.SADD(key, val);
    await this.expire(key);
  }
  static async getJoinedUser(gameId) {
    if (!this.client) {
      throw new Error("Redis is not connected");
    }
    const key = this.joinedUserKey(gameId);
    const totalUser = await this.client.SMEMBERS(key);
    if (!totalUser) {
      return [];
    }
    return totalUser;
  }
  static async setWinner(gameId, userId) {
    if (!this.client) {
      throw new Error("Redis is not connected");
    }
    const key = this.winnerKey(gameId);
    await this.client.SADD(key, userId);
    await this.expire(key);
  }
  static async getWinners(gameId) {
    if (!this.client) {
      throw new Error("Redis is not connected");
    }
    const key = this.winnerKey(gameId);
    const winner = this.client.SMEMBERS(gameId);
    if (!winner) {
      return [];
    }
    return winner;
  }
  static async getAllPawn(gameId) {
    if (!this.client) {
      throw new Error("Redis is not connected");
    }
    const key = this.pawnKey(gameId);
    const pawns = await this.client.hGetAll(key);
    if (!pawns) {
      throw new Error("Pawn Not found for this gameId");
    }
    return pawns;
  }
  static async setPawn(gameId, pawnVal) {
    if (!this.client) {
      throw new Error("Redis is not Connected");
    }
    const pawn = await this.client.HSET(
      `${gameId}:pawn`,
      pawnVal.pId,
      JSON.stringify(pawnVal)
    );
  }
  static async updatePawnVlalue(gameId, pId, value) {
    if (!this.client) {
      throw new Error("Redis is not connected");
    }
    const pawn = await this.getOnePawn(gameId, pId);
    const updatedPawn = {
      ...pawn,
      ...value
    };
    await this.setPawn(gameId, updatedPawn);
  }
  static async setBoard(gameId, cellId, cellval) {
    if (!this.client) {
      throw new Error("Redis is  not connected");
    }
    const key = this.boardKey(gameId);
    const board = await this.client.HSET(key, cellId, JSON.stringify(cellval));
  }
  static async getFullBoard(gameId) {
    if (!this.client) {
      throw new Error("Redis is not connected");
    }
    const key = this.boardKey(gameId);
    const board = await this.client.hGetAll(key);
    if (!board) {
      throw new Error("Board cell not found for this gameId");
    }
    return board;
  }
  static async getOneBoardCell(gameId, cellId) {
    if (!this.client) {
      throw new Error("Redis is not connected");
    }
    const key = this.boardKey(gameId);
    const boardCell = await this.client.hGet(key, cellId);
    if (!boardCell) {
      throw new Error("Cell not found with this boardId and cellId");
    }
    return JSON.parse(boardCell);
  }
  static async updateBoardCell(gameId, oldCellId, oldCellNewVal, newCellId, newCellVal) {
    if (!this.client) {
      throw new Error("Redis is not connected");
    }
    await this.setBoard(gameId, oldCellId, oldCellNewVal);
    await this.setBoard(gameId, newCellId, newCellVal);
  }
  static async updateBoardStateKey(gameId, details, val) {
    if (!this.client) {
      throw new Error("Redis is not connected");
    }
    try {
      const key = this.boardStateKey(gameId);
      const state = await this.client.hSet(key, details, JSON.stringify(val));
      return state;
    } catch (error) {
      console.log(error, "error while updating the gamstate");
    }
  }
  static async getGameStatus(gameId) {
    if (!this.client) {
      throw new Error("Redis is not connected");
    }
    const key = this.boardStateKey(gameId);
    const boardStateKey = await this.client.hGetAll(key);
    if (!boardStateKey) {
      throw new Error("Invalid board state key ");
    }
    return boardStateKey;
  }
  static async getBoardStateKey(gameId, details) {
    if (!this.client) {
      throw new Error("Redis is not connected");
    }
    const key = this.boardStateKey(gameId);
    const boardStateKey = await this.client.hGet(key, details);
    if (!boardStateKey) {
      throw new Error("Invalid board state key");
    }
    return JSON.parse(boardStateKey);
  }
  static async cleanInMemory(gameId) {
    const cellkey = this.boardKey(gameId);
    const pawnKey = this.pawnKey(gameId);
    const state = this.boardStateKey(gameId);
    const userWithColor = this.userWithColorKey(gameId);
    const initBoard = this.initializedKey(gameId);
    const totalUser = this.joinedUserKey(gameId);
    const game = this.gameKey(gameId);
    if (!this.client) {
      throw new Error("Redis is not connected");
    }
    const deleted = await this.client.unlink([cellkey, pawnKey, state, userWithColor, initBoard, totalUser, game]);
    console.log("we are deleted from the redis instance", deleted);
    return deleted;
  }
};

// src/lib/helper.ts
var calcMove = (pawnPath, currPawn, diceVal) => {
  if (currPawn.isHome) {
    return {
      newPos: pawnPath[0],
      pathAcheived: false,
      isHome: false
    };
  }
  const currentPos = pawnPath.indexOf(currPawn?.position);
  const totalSize = pawnPath.length;
  if (currentPos + diceVal < totalSize) {
    console.log("new pos of the pawn", pawnPath[currentPos + diceVal]);
    return {
      newPos: pawnPath[currentPos + diceVal],
      pathAcheived: false,
      isHome: false
    };
  } else if (currentPos + diceVal == totalSize) {
    console.log("new pos of the pawn for winn", pawnPath[currentPos + diceVal]);
    console.log("for winning totallength", totalSize, "got the dice val", currentPos + diceVal);
    return {
      newPos: "",
      pathAcheived: true,
      isHome: false
    };
  }
  return { newPos: currPawn.position, pathAcheived: false, isHome: false };
};

// src/services/game/gameManager.ts
var GameManager = class {
  static async initBoard(totlPlayerIds, gameId) {
    if (!totlPlayerIds.length || !gameId) {
      throw new Error("GameIds with totalPlayerIds are required");
    }
    for (let i = 0; i < totlPlayerIds.length; i++) {
      for (const p of dirstributePawn[i]) {
        if (totlPlayerIds[i]) {
          const userwithColor = await RedisInstance.getUserWithColor(
            gameId,
            totlPlayerIds[i]
          );
          if (!userwithColor) {
            await RedisInstance.setUserWithColor(
              gameId,
              totlPlayerIds[i],
              mapColor[p.charAt(0)]
            );
          }
        }
        const pawn = {
          pId: p,
          position: p,
          isFinished: false,
          isHome: true,
          userId: totlPlayerIds[i],
          color: mapColor[p.charAt(0)]
        };
        await RedisInstance.setPawn(gameId, pawn);
        await RedisInstance.setBoard(gameId, p, [p]);
      }
    }
    for (const b of globaLBoard) {
      for (const c of b) {
        await RedisInstance.setBoard(gameId, c, [""]);
      }
    }
    for (const p of gameStarterkit) {
      if (p.key === "currentUserTurn") {
        await RedisInstance.updateBoardStateKey(
          gameId,
          p.key,
          totlPlayerIds[0]
        );
        return;
      }
      if (p.key === "currentTurn") {
        const color = await RedisInstance.getUserWithColor(
          gameId,
          totlPlayerIds[0]
        );
        await RedisInstance.updateBoardStateKey(gameId, p.key, color);
        return;
      }
      await RedisInstance.updateBoardStateKey(gameId, p.key, p.value);
    }
  }
  static async handleGameJoin(gameId, userId) {
    const gameStatus = await this.getGame(gameId);
    let totalplayers = Number(JSON.parse(gameStatus.totalPlayers));
    const joinedbefore = await this.getTotalJoinedUsers(gameId);
    const userExists = await RedisInstance.alreadyInJoinedUser(gameId, userId);
    if (!userExists) {
      if (joinedbefore && joinedbefore?.length >= totalplayers) {
        return {
          success: false,
          error: "Game is full",
          sendGameStatus: false,
          sendWaiting: true
        };
      }
    }
    const userJoined = await this.addUserToGame(gameId, userId);
    const updatedLength = await this.getTotalJoinedUsers(gameId);
    if (totalplayers === updatedLength?.length) {
      const gameInitStatus = await RedisInstance.getInitGameStatus(gameId);
      if (!gameInitStatus && updatedLength) {
        await RedisInstance.setGameInIt(gameId, true);
        await this.initBoard(updatedLength, gameId);
      }
      console.log("Returing from the total player equal to scenraio");
      return {
        success: true,
        sendGameStatus: true,
        sendWaiting: false
      };
    }
    return {
      success: true,
      sendGameStatus: false,
      sendWaiting: true
    };
  }
  static async getWholeGameState(gameId) {
    if (!gameId) return;
    const pawns = await RedisInstance.getAllPawn(gameId);
    const board = await RedisInstance.getFullBoard(gameId);
    const gameStatus = await RedisInstance.getGameStatus(gameId);
    return {
      pawnMap: pawns,
      globaLBoardMap: board,
      gameBackbone: gameStatus
    };
  }
  static async getTeamPawn(gameId, p) {
    const pawns = [];
    for (let i = 1; i <= 4; i++) {
      const key = `${p}P${i}`;
      const items = await RedisInstance.getOnePawn(gameId, key);
      pawns.push(items);
    }
    return pawns;
  }
  static async calcMovablePawn(gameId, pId, diceVal) {
    const pawns = await this.getTeamPawn(gameId, pId);
    const movablePawns = [];
    for (const p of pawns) {
      if (p.isHome) {
        if (diceVal === 6) {
          movablePawns.push(p.pId);
        }
        continue;
      }
      if (!p.isFinished) {
        const { newPos } = calcMove(pathToWin[p.color], p, diceVal);
        if (newPos !== p.position) {
          movablePawns.push(p.pId);
        }
      }
    }
    return movablePawns;
  }
  static generateDiceVal() {
    return Math.floor(Math.random() * 6) + 1;
  }
  static async calcNextTurn(userId, gameId) {
    const turns = await RedisInstance.getJoinedUser(
      gameId
    );
    const winnersIds = await RedisInstance.getWinners(gameId);
    console.log("winner ids", winnersIds);
    const idx = turns.indexOf(userId);
    const totalLength = turns.length;
    let newIdx = idx + 1 >= totalLength ? 0 : idx + 1;
    while (winnersIds.includes(turns[newIdx])) {
      newIdx = newIdx >= totalLength ? 0 : newIdx + 1;
    }
    return turns[newIdx];
  }
  static async NewBackBone(gameId, movablePawns, diceVal, userId, currentUserTurn, canDiceMove, canPawnMove, winnerOrders) {
    const turn = await this.calcNextTurn(userId, gameId);
    const color = await RedisInstance.getUserWithColor(
      gameId,
      currentUserTurn ? userId : turn
    );
    console.log("winner orders", winnerOrders);
    const val = {
      diceVal,
      canDiceRoll: canDiceMove,
      canPawnMove,
      currentTurn: color,
      winnerOrders: winnerOrders ?? [],
      currentUserTurn: currentUserTurn ? userId : turn,
      movablePawns
    };
    return val;
  }
  static async rollDice(gameId, userId) {
    const gameState = await RedisInstance.getGameStatus(gameId);
    if (JSON.parse(gameState?.currentUserTurn) !== userId) {
      throw new Error("Its not Ur Turn");
    }
    const diceVal = this.generateDiceVal();
    const p = await RedisInstance.getUserWithColor(gameId, userId);
    if (!p) throw new Error("UserId is Wrong");
    const movablePawns = await this.calcMovablePawn(
      gameId,
      p.charAt(0),
      diceVal
    );
    const newBackBone = await this.NewBackBone(
      gameId,
      movablePawns,
      diceVal,
      userId,
      movablePawns.length > 0,
      movablePawns.length > 0 ? false : true,
      movablePawns.length > 0
    );
    for (const [key, value] of Object.entries(newBackBone)) {
      await RedisInstance.updateBoardStateKey(gameId, key, value);
    }
    return {
      backbone: newBackBone
    };
  }
  static async getTotalJoinedUsers(gameId) {
    if (!gameId) return;
    const totalUser = await RedisInstance.getJoinedUser(gameId);
    return totalUser;
  }
  static async savePawnValue(gameId, isHome, pId, pathAcheived, newPos) {
    const getPawn = await RedisInstance.getOnePawn(gameId, pId);
    const newPawnVal = {
      ...getPawn,
      isHome,
      position: isHome ? getPawn.pId : newPos ?? "",
      isFinished: pathAcheived
    };
    await RedisInstance.setPawn(gameId, newPawnVal);
  }
  static async getGame(gameId) {
    if (!gameId) return;
    const gameDetails = await RedisInstance.getGame(gameId);
    if (!gameDetails) return null;
    return gameDetails;
  }
  static async addUserToGame(gameId, userId) {
    if (!gameId || !userId) return;
    const setuser = await RedisInstance.setJoinedUsers(gameId, userId);
  }
  static async updateBoardVal(gameId, captured, pId, cellId) {
    const boardVal = await RedisInstance.getOneBoardCell(gameId, cellId);
    let pawns = boardVal;
    if (captured) {
      pawns = pawns.filter((i) => i != pId);
    } else {
      pawns.push(pId);
    }
    pawns = pawns.filter((i) => i !== "");
    await RedisInstance.setBoard(gameId, cellId, pawns);
  }
  static async capturePawn(newPos, currPawn, gameId) {
    const board = await RedisInstance.getOneBoardCell(gameId, newPos);
    if (board.length === 0) {
      return { captruedSuccess: false, capturedPawn: null };
    }
    let captruedSuccess = false;
    let capturedPawn = null;
    for (let p = 0; p < board.length; p++) {
      if (board[p]?.charAt(0) === currPawn.pId.charAt(0)) {
        continue;
      }
      capturedPawn = board[p];
      captruedSuccess = true;
    }
    return { captruedSuccess, capturedPawn };
  }
  static async movePawn(gameId, userId, pId) {
    const gameState = await RedisInstance.getGameStatus(gameId);
    console.log("gamestate in the movepawn", gameState);
    const movablePawns = JSON.parse(gameState.movablePawns);
    let winnerOrders = JSON.parse(gameState.winnerOrders);
    const diceVal = JSON.parse(gameState.diceVal);
    const color = JSON.parse(gameState.currentTurn);
    const pawnPath = pathToWin[color];
    if (JSON.parse(gameState.currentUserTurn) !== userId) {
      throw new Error("Invalid User turn");
    }
    if (!movablePawns.includes(pId)) {
      return;
    }
    const currPawn = await RedisInstance.getOnePawn(gameId, pId);
    const { newPos, pathAcheived, isHome } = calcMove(
      pawnPath,
      currPawn,
      +diceVal
    );
    let captured = "";
    let nextTurn = false;
    if (!globalSafePlace.has(newPos) && !pathAcheived) {
      const { capturedPawn, captruedSuccess } = await this.capturePawn(
        newPos,
        currPawn,
        gameId
      );
      if (captruedSuccess && capturedPawn) {
        captured = capturedPawn ?? "";
        await this.savePawnValue(
          gameId,
          true,
          capturedPawn,
          false,
          capturedPawn
        );
        await this.updateBoardVal(
          gameId,
          captruedSuccess,
          capturedPawn,
          newPos
        );
        await this.updateBoardVal(gameId, false, capturedPawn, capturedPawn);
        nextTurn = true;
      }
    }
    if (pathAcheived) {
      await RedisInstance.updatePawnVlalue(gameId, currPawn.pId, {
        ...currPawn,
        isFinished: true,
        isHome
      });
      await this.updateBoardVal(gameId, true, pId, currPawn.position);
      const { success, gameEnded, winnerOrders: winners } = await this.calcGameWinner(gameId, currPawn);
      if (gameEnded) {
        wss.broadcastToUsers(gameId, "winner_Found", {
          winnerColor: currPawn.color,
          userId,
          winnerOrders,
          gameId,
          pawnId: pId,
          pawnNewPos: newPos,
          pawnWon: pathAcheived,
          capturedPawn: captured,
          backbone: gameState
        });
        return;
      }
      winnerOrders = winners;
      nextTurn = true;
    }
    if (+diceVal === 6) {
      nextTurn = true;
    }
    if (!pathAcheived) {
      await this.savePawnValue(gameId, false, pId, false, newPos);
      await this.updateBoardVal(gameId, false, pId, newPos);
      await this.updateBoardVal(gameId, true, pId, currPawn.position);
    }
    const newBackBone = await this.NewBackBone(
      gameId,
      [],
      1,
      userId,
      nextTurn,
      true,
      false,
      winnerOrders
    );
    for (const [key, value] of Object.entries(newBackBone)) {
      await RedisInstance.updateBoardStateKey(gameId, key, value);
    }
    return {
      pawnId: pId,
      pawnNewPos: newPos,
      pawnWon: pathAcheived,
      capturedPawn: captured,
      backbone: newBackBone
    };
  }
  // public static async exitOrDeleteGame(gameId: string) {
  //   try {
  //     const getGame = await GameRepo.getGame(gameId);
  //     for (const i of getGame.playerIds) {
  //       await UserRepo.updateUserData(i, { onGoingGame: null });
  //     }
  //     const gameData = await GameRepo.deleteGame(gameId);
  //     const data = await RedisInstance.cleanInMemory(gameId);
  //     return true;
  //   } catch (error) {
  //     console.log("Error in game manager", error);
  //     throw new Error("Error while deleting the gameData and redis instance");
  //   }
  // }   
  static async calcGameWinner(gameId, pawn) {
    const gameDetail = await this.getGame(gameId);
    const gameState = await RedisInstance.getGameStatus(gameId);
    let totalPlayers = Number(JSON.parse(gameDetail.totalPlayers));
    let winnerOrders = JSON.parse(gameState.winnerOrders);
    const allpawn = await this.getTeamPawn(gameId, pawn.pId.charAt(0));
    console.log("all pawn ", allpawn);
    const totalPawnFinished = allpawn.filter((p) => p.isFinished === true);
    console.log("Finished pawns", totalPawnFinished);
    if (totalPawnFinished.length === 4) {
      console.log("got inside the all pawn if condition \u{1FAE1}\u{1FAE1}");
      if (totalPlayers === 2) {
        console.log("in calcgameWinner totalength 2 from there");
        return { success: true, gameEnded: true, winnerOrders: [pawn.color] };
      }
      if (totalPlayers > 2) {
        if (winnerOrders.length === totalPlayers - 1) {
          console.log("inside the winnerOder length -1 scenario");
          winnerOrders.push(pawn.color);
          return { success: true, gameEnded: true, winnerOrders };
        }
        await RedisInstance.setWinner(gameId, pawn.userId);
        winnerOrders.push(pawn.color);
        return { success: true, gameEnded: false, winnerOrders };
      }
    }
    return { success: false, gameEnded: false, winnerOrders };
  }
};

// src/services/ws/realTime.ts
import cookie from "cookie";
var RealTime = class {
  wss;
  room;
  constructor(server2) {
    this.wss = new WebSocketServer({ server: server2 });
    this.room = new RoomManager();
    this.initialize();
  }
  initialize() {
    this.wss.on("connection", (socket, req) => {
      const cookies = req.headers.cookie ? cookie.parse(req.headers.cookie) : {};
      const playerId = cookies.playerId;
      const gameId = cookies.gameId;
      if (!playerId || !gameId) {
        socket.close(1008, "unauthorized");
      }
      socket.playerId = playerId ?? "";
      socket.gameId = gameId ?? "";
      socket.on("message", (data) => {
        const msg = JSON.parse(data.toString());
        this.handlers(socket, msg);
      });
      socket.on("close", () => {
        console.log("Close happend");
        this.room.clearConnection(socket);
      });
      socket.on("error", () => {
        this.room.clearConnection(socket);
      });
    });
    this.wss.on("headers", (headers) => {
      headers.push("Access-Control-Allow-Origin: *");
    });
  }
  async handlers(socket, msg) {
    const gameId = socket.gameId;
    const userId = socket.playerId;
    switch (msg.type) {
      case "join_User":
        const gameDetails = await GameManager.getGame(gameId);
        if (!gameDetails) {
          socket.send(
            JSON.stringify({
              type: "error",
              error: "game  not found"
            })
          );
          socket.close();
          return;
        }
        const { success, sendGameStatus, error, sendWaiting } = await GameManager.handleGameJoin(gameId, userId);
        if (!success) {
          socket.send(
            JSON.stringify({
              type: "error",
              error
            })
          );
          socket.close();
        }
        this.room.joinRoom(`game:${gameId}`, `user:${userId}`, socket);
        const totalPlayers = Number(
          JSON.parse(gameDetails.totalPlayers)
        );
        const joinedPlayers = await GameManager.getTotalJoinedUsers(gameId);
        if (sendGameStatus) {
          const wholeBoard = await GameManager.getWholeGameState(gameId);
          this.room.broadcastInRoom(`game:${gameId}`, {
            type: "game_Status",
            data: wholeBoard
          });
        }
        if (!sendGameStatus && sendWaiting) {
          this.room.broadcastInRoom(`game:${gameId}`, {
            type: "waiting",
            data: {
              gameStarted: false,
              totalPlayers,
              joinedPlayers: joinedPlayers?.length ?? 0
            }
          });
        } else if (sendGameStatus && !sendWaiting) {
          this.room.broadcastInRoom(`game:${gameId}`, {
            type: "waiting",
            data: {
              gameStarted: true,
              totalPlayers,
              joinedPlayers: joinedPlayers?.length ?? 0
            }
          });
        }
        this.room.broadcastInRoom(`game:${gameId}`, {
          type: "user_Joined",
          data: userId
        });
        break;
      case "roll_Dice":
        const backBone = await GameManager.rollDice(gameId, userId);
        this.room.broadcastInRoom(`game:${gameId}`, {
          type: "dice_Rolled",
          data: backBone
        });
        break;
      case "pawn_Clicked":
        const move = await GameManager.movePawn(
          gameId,
          userId,
          msg.payload.pId
        );
        this.room.broadcastInRoom(`game:${gameId}`, {
          type: "move_Pawn",
          data: move
        });
        break;
    }
  }
  broadcastToUsers(gameId, type, details) {
    this.room.broadcastInRoom(`game:${gameId}`, {
      type,
      data: details
    });
  }
};

// src/routes/game.ts
import express from "express";

// src/controller/game.controller.ts
import z2 from "zod";

// src/dto/game.dto.ts
import { z } from "zod";
var initGameSchema = z.object({
  totalPlayers: z.number({
    error: "Total players is required"
  }).min(2, { message: "Minimum 2 players required" }).max(4, { message: "Maximum 4 players allowed" }).refine((val) => [2, 3, 4].includes(val), {
    message: "Total players must be 2, 3, or 4"
  })
});
var validId = z.cuid({ error: "Invlalid Cuid" });

// src/controller/game.controller.ts
import "express";

// src/utils/apiError.ts
var ApiError = class extends Error {
  statusCode;
  data;
  success;
  errors;
  constructor(statusCode, message = "Something went wrong", errors, stack = "") {
    super(message);
    this.statusCode = statusCode;
    this.data = null;
    this.success = false;
    this.errors = errors;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
};

// src/utils/apiResponse.ts
var ApiResponse = class {
  statusCode;
  data;
  message;
  success;
  constructor(statusCode, data, message = "Success", success = true) {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = success;
  }
};

// src/controller/game.controller.ts
import { v4 as uuidV4 } from "uuid";
var initGame = async (req, res) => {
  try {
    const validate = initGameSchema.safeParse(req.body);
    if (!validate.success) {
      return res.status(400).json(
        new ApiError(400, "Invalid Inputs", z2.treeifyError(validate.error))
      );
    }
    if (req.cookies.gameId) {
      return res.json(
        new ApiResponse(
          403,
          req.cookies.gameId,
          "Complete this game First or go and exit from the game ",
          true
        )
      );
    }
    const { totalPlayers } = validate.data;
    const createdGameId = uuidV4();
    const createUserId = uuidV4();
    res.cookie("gameId", createdGameId, {
      maxAge: 1e3 * 60 * 40,
      httpOnly: true
    });
    res.cookie("playerId", createUserId, {
      maxAge: 40 * 60 * 1e3,
      httpOnly: true
    });
    const payload = {
      gameId: createdGameId,
      totalPlayers: totalPlayers.toString()
    };
    await RedisInstance.setGame(createdGameId, payload);
    await RedisInstance.setGameInIt(createdGameId, false);
    return res.status(201).json(
      new ApiResponse(
        201,
        createdGameId,
        "Game Created Successfully join game using this id",
        true
      )
    );
  } catch (error) {
    console.log("Error found here in initgame", error.message);
    return res.status(500).json(
      new ApiError(500, "Error", error.message ?? "Internal Server Error")
    );
  }
};
var getOngoingGame = async (req, res) => {
  try {
    const gameId = req.cookies.gameId;
    if (gameId) {
      return res.json(
        new ApiResponse(403, gameId, "You are already in a game")
      );
    }
    return res.json(new ApiResponse(200, "", "No onGoing game found"));
  } catch (error) {
    return res.json(
      new ApiError(500, error.message ?? "Internal server Error")
    );
  }
};
var joinGame = async (req, res) => {
  try {
    const { gameId } = req.params;
    if (!gameId) {
      return res.json(new ApiError(500, "Game not Found"));
    }
    const getGame = await RedisInstance.getGame(gameId);
    console.log(getGame, "game in the join game");
    if (!getGame) {
      console.log("inside the gamenotFound");
      return res.json(new ApiError(500, "Game not exist"));
    }
    if (!req.cookies.gameId) {
      res.cookie("gameId", gameId, {
        maxAge: 40 * 60 * 1e3,
        httpOnly: true
      });
    }
    let playerId;
    if (!req.cookies.playerId) {
      playerId = uuidV4();
      console.log("setting up the cookie for playerId", playerId);
      res.cookie("playerId", playerId, {
        maxAge: 40 * 60 * 1e3,
        httpOnly: true
      });
    } else {
      playerId = req.cookies.playerId;
      console.log("got playerId from the cookie", playerId);
    }
    return res.json(new ApiResponse(200, playerId, "Welocme"));
  } catch (error) {
    console.log("error  while joining the game", error);
    return res.json(
      new ApiError(500, error.message || "Internal Server Error")
    );
  }
};
var exitGame = async (req, res) => {
  try {
    const { gameId } = req.params;
    console.log(gameId);
    if (!gameId) {
      throw new Error("GameId is missing");
    }
    if (!validId.safeParse(gameId)) {
      throw new Error("Invalid gameId");
    }
    const gameExist = await GameManager.getGame(gameId);
    if (!gameExist) {
      return res.json(new ApiResponse(200, "", "Game already deleted"));
    }
    return res.json(
      new ApiResponse(200, "", "Game removed successfully")
    );
  } catch (error) {
    console.log("Error", error);
    return res.json(
      new ApiError(500, error.message ?? "Internal server error")
    );
  }
};

// src/routes/game.ts
var router = express.Router();
router.post("/creategame", initGame);
router.get("/getongoinggame", getOngoingGame);
router.post("/:gameId/", joinGame);
router.delete("/exitgame/:gameId", exitGame);

// src/index.ts
var app = express2();
var server = http.createServer(app);
var wss = new RealTime(server);
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  })
);
app.use(express2.json());
app.use(cookieParser());
try {
  await RedisInstance.initialize();
} catch (error) {
  console.error(" Database or Redis connection failed:", error.message);
  process.exit(1);
}
app.get("/", (req, res) => {
  res.send("hello").status(200);
});
app.use("/game", router);
app.use((err, req, res, next) => {
  console.error(" Global error caught:", err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error"
  });
});
process.on("uncaughtException", (err) => {
  console.error(" Uncaught Exception:", err);
  process.exit(1);
});
process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Rejection:", reason);
  process.exit(1);
});
app.listen(8e3, () => {
  console.log(" Listening on port 8000");
});
server.listen(8001, () => {
  console.log("Server running on port 8001");
});
export {
  app,
  server,
  wss
};
