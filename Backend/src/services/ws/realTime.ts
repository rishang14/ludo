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
        console.log("Connection message", msg);
        this.handlers(socket, msg);
      });

      socket.on("close", () => {
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
    console.log("message any", msg);

    switch (msg.type) {
      case "joinUser":
        this.room.joinRoom(`game:${msg.gameId}`, `user:${msg.userId}`, socket);
        const wholeBoard = await GameManager.getWholeGameState(msg.gameId);
        socket.send(
          JSON.stringify({
          type: "game_status",
          data: wholeBoard,
        })); 
        this.room.broadcastInRoom(`game:${msg.gameId}`,JSON.stringify({
          type:"user_Joined", 
          id:msg.userId
        }))
    }
  }
}
