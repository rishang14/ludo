import express from "express";
import type { NextFunction, Request, Response } from "express";
import cors from "cors";
import http from "http"; 
import cookieParser from "cookie-parser"
import { RealTime } from "./services/ws/realTime";
import { RedisInstance } from "./services/redis/redisClient";
import { GameRoutes } from "./routes";

export const app = express();
export const server = http.createServer(app);
export const  wss = new RealTime(server);

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);


app.use(express.json()); 
app.use(cookieParser());
try {
  await RedisInstance.initialize();
} catch (error: any) {
  console.error(" Database or Redis connection failed:", error.message);
  process.exit(1); // Exit if DB or Redis fails
}


app.get("/", (req: Request, res: Response) => {
  res.send("hello").status(200);
});


app.use("/game",GameRoutes);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(" Global error caught:", err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

process.on("uncaughtException", (err) => {
  console.error(" Uncaught Exception:", err);
  process.exit(1);
});

process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Rejection:", reason);
  process.exit(1);
});

app.listen(8000, () => {
  console.log(" Listening on port 8000");
});

server.listen(8001, () => {
  console.log("Server running on port 8001");
});