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
       
        this.room.joinRoom(`game:${msg.payload.gameId}`, `user:${msg.payloaduserId}`, socket);
        const wholeBoard = await GameManager.getWholeGameState(msg.payload.gameId); 
        socket.send(
          JSON.stringify({
            type: "game_status",
            data: wholeBoard,
          })
        );
        this.room.broadcastInRoom(
          `game:${msg.payload.gameId}`,
          JSON.stringify({
            type: "user_Joined",
            id: msg.payload.userId,
          })
        );
    }
  }
}
