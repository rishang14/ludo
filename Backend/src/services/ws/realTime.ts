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
        this.room.joinRoom(`game:${gameId}`, `user:${userId}`, socket);
        const getGame = await GameManager.getGame(gameId);
        console.log(getGame, "game in the webscoket");
        if (!getGame) return;
        const totalPlayers = JSON.parse(getGame.totalPlayers as string);
        const allUserWithTheNewOne = await GameManager.addUserToGame(
          gameId,
          userId
        ); 
        console.log(totalPlayers,"length of totalUser"); 
        console.log(allUserWithTheNewOne,"added the new one also");
        if (allUserWithTheNewOne?.length === +totalPlayers){
          // const game =   await GameManager.initBoard(allUserWithTheNewOne, gameId); 
          // console.log(game,"game in the real time")
          const wholeBoard = await GameManager.getWholeGameState(gameId); 
          console.log(wholeBoard,"board") 
          this.room.broadcastInRoom(`game:${gameId}`,{
          type:"waiting", 
          data:{
            gameStarted:true, 
            totalPlayers:+totalPlayers, 
            joinedPlayers:allUserWithTheNewOne?.length ?? 0
          } })
          socket.send(
            JSON.stringify({
              type: "game_status",
              data: wholeBoard,
            })
          ); 
        }else{ 
          this.room.broadcastInRoom(`game:${gameId}`,{
          type:"waiting", 
          data:{
            gameStarted:false, 
            totalPlayers:+totalPlayers, 
            joinedPlayers:allUserWithTheNewOne?.length ?? 0
          }
        })
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
