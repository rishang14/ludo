import "ws";

declare module "ws" {
  interface WebSocket {
    gameId?: string;
    playerId?: string;
  }
}