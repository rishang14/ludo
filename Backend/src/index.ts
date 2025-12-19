import express from "express";
import type { NextFunction, Request, Response } from "express";
import { toNodeHandler, fromNodeHeaders } from "better-auth/node";
import cors from "cors";
import http from "http"; 
import cookieParser from "cookie-parser"
import { auth } from "./lib/auth";
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

app.all("/api/auth/*splat", toNodeHandler(auth));

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

app.get("/api/me", async (req: Request, res: Response) => {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });
  return res.json(session);
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
