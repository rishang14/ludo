import { createClient, type RedisClientType } from "redis";
import { redisConfig } from "../../utils/redisConfig";
import type { pawn, updatePawn } from "../../dto/game.dto";

export class RedisInstance {
  private static client: RedisClientType | null = null;
  private static pawnKey(gameId: string) {
    return `${gameId}:pawn`;
  }
  private static boardKey(gameId: string) {
    return `${gameId}:board`;
  }

  private static boardState(gameId: string) {
    return `${gameId}:state`;
  }

  public static async initialize() {
    if (this.client) {
      return;
    }

    this.client = createClient({
      socket: {
        host: redisConfig.host,
        port: redisConfig.port,
      },
    });

    this.client.on("connect", () => {
      console.log("redis is connected ");
    });

    this.client.on("error", (err) => {
      console.log(err);
    });

    await this.client.connect();
  }

  public static async getOnePawn(gameId: string, pId: string) {
    const key = this.pawnKey(gameId);
    if (!this.client) {
      throw new Error("Redis is not connected");
    }
    const pawn = await this.client.hGet(key, pId);
    if (!pawn) {
      throw new Error("Invalid gameId or pawnId");
    }

    return JSON.parse(pawn);
  }

  public static async getAllPawn(gameId: string) {
    if (!this.client) {
      throw new Error("Redis is not connected");
    }
    const key = this.pawnKey(gameId);

    const pawns = await this.client.hGetAll(key);
    if (!pawns) {
      throw new Error("Pawn Not found for this gameId");
    }
    console.log("allpawns of the game", pawns);

    return pawns;
  }

  public static async setPawn(gameId: string, pawnVal: pawn) {
    if (!this.client) {
      throw new Error("Redis is not Connected");
    }

    const pawn = await this.client.HSET(
      `${gameId}:pawn`,
      pawnVal.pId,
      JSON.stringify(pawnVal)
    );
    console.log("pawnStored: ", pawnVal.pId);
  }

  public static async updatePawnVlalue(
    gameId: string,
    pId: string,
    value: updatePawn
  ) {
    if (!this.client) {
      throw new Error("Redis is not connected");
    }

    const pawn = await this.getOnePawn(gameId, pId);

    const updatedPawn: pawn = {
      ...pawn,
      ...value,
    };

    await this.setPawn(gameId, updatedPawn);
  }

  public static async setBoard(
    gameId: string,
    cellId: string,
    cellval: string[]
  ) {
    if (!this.client) {
      throw new Error("Redis is  not connected");
    }
    const key = this.boardKey(gameId);
    const board = await this.client.HSET(key, cellId, JSON.stringify(cellval));
    console.log("board stored:", cellId);
  }

  public static async getFullBoard(gameId: string) {
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

  public static async getOneBoardCell(gameId: string, cellId: string) {
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

  public static async updateBoardCell(
    gameId: string,
    oldCellId: string,
    oldCellNewVal: string[],
    newCellId: string,
    newCellVal: string[]
  ) {
    if (!this.client) {
      throw new Error("Redis is not connected");
    }
    await this.setBoard(gameId, oldCellId, oldCellNewVal);
    await this.setBoard(gameId, newCellId, newCellVal);
  }

  public static async updateBoardState(
    gameId: string,
    details: string,
    val: any
  ) {
    if (!this.client) {
      throw new Error("Redis is not connected");
    }
    const key = this.boardState(gameId);
    const state = await this.client.hSet(key, details, JSON.stringify(val));
    console.log("State value done:", state);
  }

  public static async getAllGameState(gameId: string) {
    if (!this.client) {
      throw new Error("Redis is not connected");
    }
    const key = this.boardState(gameId);
    const boardState = await this.client.hGetAll(key);
    if (!boardState) {
      throw new Error("Invalid board state key ");
    }
    return boardState;
  }

  public static async getBoardState(gameId: string, details: string) {
    if (!this.client) {
      throw new Error("Redis is not connected");
    }

    const key = this.boardState(gameId);
    const boardState = await this.client.hGet(key, details);
    if (!boardState) {
      throw new Error("Invalid board state key");
    }

    return JSON.parse(boardState);
  }
}