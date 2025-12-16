import { WebSocketServer } from "ws";
import { RoomManager } from "./roomManager";
import { GameManager } from "../game/gameManager";

export class RealTime {
  public wss: WebSocketServer;
  private room: RoomManager;

  constructor(server: any) {
    this.wss = new WebSocketServer({ server });
    this.room = new RoomManager();
    this.initialize();
  }

  private initialize() {
    this.wss.on("connection", (socket) => {
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
    switch (msg.type) {
      case "join_User": 
      console.log("Join happened")
        this.room.joinRoom(
          `game:${msg.payload.gameId}`,
          `user:${msg.payload.userId}`,
          socket
        );
        const wholeBoard = await GameManager.getWholeGameState(
          msg.payload.gameId
        );
        socket.send(
          JSON.stringify({
            type: "game_status",
            data: wholeBoard,
          })
        );
        this.room.broadcastInRoom(`game:${msg.payload.gameId}`, {
          type: "user_Joined",
          id: msg.payload.userId,
        });
        break;
      case "roll_Dice":
        const backBone = await GameManager.rollDice(
          msg.payload.gameId,
          msg.payload.userId
        );
        this.room.broadcastInRoom(`game:${msg.payload.gameId}`, {
          type: "dice_Rolled",
          data: backBone,
        });
        break; 
      case "pawn_Clicked":  
      const move= await GameManager.movePawn(msg.payload.gameId,msg.payload.userId,msg.payload.pId); 
      console.log("val in the move section  for sending it to client",move);  
      this.room.broadcastInRoom(`game:${msg.payload.gameId}`,{
        type:"move_Pawn", 
        data: move
      }) 
      break;
    }
  }
}
