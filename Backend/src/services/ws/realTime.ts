import { WebSocketServer } from "ws";

export class RealTime {
  public wss: WebSocketServer;

  constructor(server: any) {
    this.wss = new WebSocketServer({ server });

    this.initialize();
  }

  private initialize() {
    this.wss.on("connection", (socket) => {
      socket.on("message", (data) => {
        const msg = JSON.parse(data.toString());
        console.log("Connection message", msg);
        //   this.handlers(socket, msg);
      });

      socket.on("close", () => {
        //   this.room.clearConnection(socket);
      });

      socket.on("error", () => {
        //   this.room.clearConnection(socket);
      });
    });
    this.wss.on("headers", (headers) => {
      headers.push("Access-Control-Allow-Origin: *");
    });
  }
}
