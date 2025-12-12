export class RoomManager {
  private gamwWithSocket: Map<string, Set<any>> = new Map();
  private userWithSocket: Map<string, Set<any>> = new Map();

  public joinRoom(gameId: string,userId:string, socket: any,) {
    if (!this.gamwWithSocket.has(gameId)) {
      this.gamwWithSocket.set(gameId, new Set());
    }
    if (!this.userWithSocket.has(gameId)) {
      this.userWithSocket.set(gameId, new Set());
    }
    this.gamwWithSocket.get(gameId)?.add(socket);
    this.userWithSocket.get(gameId)?.add(socket);
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

  public clearConnection(socket: any) {
    for (const [game, connection] of this.gamwWithSocket.entries()) {
      connection.delete(socket);
      if (connection.size === 0) {
        this.gamwWithSocket.delete(game);
      }
    }
  }

  public broadcastInRoom(gameId: string, payload: any) {
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

    public broadCastTouser(UserId:string,payload:any){
      const client=this.userWithSocket.get(UserId); 
      if(!client)return; 

      client.forEach((socket)=>{
        try {
            socket.send(payload)
        } catch (error) {
            
        }
      })
    }
}
