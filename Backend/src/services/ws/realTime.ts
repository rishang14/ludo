import { WebSocketServer } from "ws";
import { RoomManager } from "./roomManager";
import { GameManager } from "../game/gameManager";
import { UserRepo } from "../../repositry/user.repositry";
import cookie from "cookie";
import { RedisInstance } from "../redis/redisClient";

export class RealTime {
  public wss: WebSocketServer;
  private room: RoomManager;

  constructor(server: any) {
    this.wss = new WebSocketServer({ server });
    this.room = new RoomManager();
    this.initialize();
  }

  private initialize() {
    this.wss.on("connection", (socket, req) => {
      const cookies = req.headers.cookie
        ? cookie.parse(req.headers.cookie)
        : {};

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

  private async handlers(socket: any, msg: any) {
    const gameId = socket.gameId;
    const userId = socket.playerId;
    switch (msg.type) {
      case "join_User":
        const gameDetails = await GameManager.getGame(gameId);
        if (!gameDetails) {
          socket.send(
            JSON.stringify({
              type: "error",
              error: "game  not found",
            })
          );
          socket.close();
          return;
        }
        const { success, sendGameStatus, error, sendWaiting } =
          await GameManager.handleGameJoin(gameId, userId); 

          console.log("success",success);  
          console.log("gamestatus",sendGameStatus); 
          console.log("tell hime to wait",sendWaiting)
         if (!success) {
          socket.send(
            JSON.stringify({
              type: "error",
              error,
            })
          );
          socket.close();
        }
        this.room.joinRoom(`game:${gameId}`, `user:${userId}`, socket);
        const totalPlayers = Number(
          JSON.parse(gameDetails.totalPlayers as string)
        );
        const joinedPlayers = await GameManager.getTotalJoinedUsers(gameId);

        if (sendGameStatus) {
          const wholeBoard = await GameManager.getWholeGameState(gameId);
          this.room.broadcastInRoom(`game:${gameId}`, {
            type: "game_Status",
            data: wholeBoard,
          });
        }

        if (!sendGameStatus && sendWaiting) {
          this.room.broadcastInRoom(`game:${gameId}`, {
            type: "waiting",
            data: {
              gameStarted: false,
              totalPlayers: totalPlayers,
              joinedPlayers: joinedPlayers?.length ?? 0,
            },
          });
        } else if (sendGameStatus && !sendWaiting) {
          this.room.broadcastInRoom(`game:${gameId}`, {
            type: "waiting",
            data: {
              gameStarted: true,
              totalPlayers: totalPlayers,
              joinedPlayers: joinedPlayers?.length ?? 0,
            },
          });
        }
        this.room.broadcastInRoom(`game:${gameId}`, {
          type: "user_Joined",
          data: userId,
        });
        break;
      case "roll_Dice":
        console.log("roll dice val", msg);
        const backBone = await GameManager.rollDice(gameId, userId);
        this.room.broadcastInRoom(`game:${gameId}`, {
          type: "dice_Rolled",
          data: backBone,
        });
        break;
      case "pawn_Clicked":
        console.log("pawnClicked getting userId or not", msg);
        const move = await GameManager.movePawn(
          gameId,
          userId,
          msg.payload.pId
        );
        this.room.broadcastInRoom(`game:${gameId}`, {
          type: "move_Pawn",
          data: move,
        });
        break;
    }
  }

  public broadcastToUsers(gameId: string, type: string, details: any) {
    this.room.broadcastInRoom(`game:${gameId}`, {
      type: type,
      data: details,
    });
  }
}
