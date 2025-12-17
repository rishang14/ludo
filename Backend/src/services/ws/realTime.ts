import { WebSocketServer } from "ws";
import { RoomManager } from "./roomManager";
import { GameManager } from "../game/gameManager";
import { UserRepo } from "../../repositry/user.repositry";

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
      console.log("Join happened",msg)
        this.room.joinRoom(
          `game:${msg.payload.gameId}`,
          `user:${msg.payload.userId}`,
          socket
        );  
        const userName= await UserRepo.getUserById(msg.payload.userId)
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
          data:  userName,
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
      console.log("pawnClicked getting userId or not",msg)
      const move= await GameManager.movePawn(msg.payload.gameId,msg.payload.userId,msg.payload.pId);   
      this.room.broadcastInRoom(`game:${msg.payload.gameId}`,{
        type:"move_Pawn", 
        data: move
      }) 
      break;
    }
  }   

  public  broadcastToUsers(gameId:string,details:any){
      this.room.broadcastInRoom(`game:${gameId}`,{
        type:"user_Exited", 
        data:details
      })   
  }
}
