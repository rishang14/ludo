import z from "zod";
import { initGameSchema, validId, type gameInitType } from "../dto/game.dto";
import { type Request, type Response } from "express";
import { ApiError } from "../utils/apiError";
// import { GameRepo } from "../repositry/game.repositry";
import { ApiResponse } from "../utils/apiResponse";
// import { UserRepo } from "../repositry/user.repositry";
import { GameManager } from "../services/game/gameManager";
import { v4 as uuidV4 } from "uuid";
// import { wss } from "../index";
import { RedisInstance } from "../services/redis/redisClient";

export const initGame = async (req: Request, res: Response) => {
  try {
    const validate = initGameSchema.safeParse(req.body);
    if (!validate.success) {
      return res
        .status(400)
        .json(
          new ApiError(400, "Invalid Inputs", z.treeifyError(validate.error))
        );
    }

    const { totalPlayers } = validate.data;
    const createdGameId = uuidV4();
    const payload: gameInitType = {
      gameId: createdGameId,
      totalPlayers: totalPlayers.toString(),
      status: "created",
    };
    await RedisInstance.setGame(createdGameId, payload);
    await RedisInstance.setGameInIt(createdGameId, false);
    return res
      .status(201)
      .json(
        new ApiResponse(
          201,
          createdGameId,
          "Game Created Successfully join game using this id",
          true
        )
      );
  } catch (error: any) {
    console.log("Error found here in initgame", error.message);
    return res
      .status(500)
      .json(
        new ApiError(500, "Error", error.message ?? "Internal Server Error")
      );
  }
};

// export const gameValidation = async (req: Request, res: Response) => {
//   try {
//     const { gameId, userId } = req.params;
//     if (!gameId || !userId) {
//       return res.json(
//         new ApiError(403, "Missing Field", "Missing  gameId or userId")
//       );
//     }
//     if (!(validId.safeParse(gameId) || validId.safeParse(userId))) {
//       return res.json(
//         new ApiError(403, "Invalid request", "Invalid gameId or userId")
//       );
//     }
//     const game = await GameRepo.getGame(gameId);
//     const user = req.user;
//     if (user?.id !== userId) {
//       return res.json(
//         new ApiError(
//           403,
//           "Unauthorized request",
//           "You are not part of the ongoing game"
//         )
//       );
//     }
//     const playerExists = game.playerIds.includes(userId as string);
//     if (!playerExists) {
//       return res.json(
//         new ApiError(
//           403,
//           "Unauthorized request",
//           "You are not part of the ongoing game"
//         )
//       );
//     }
//     return res.json(new ApiResponse(200, game, `Welcome ${user?.name}`, true));
//   } catch (error: any) {
//     return res.json(
//       new ApiError(500, "Error", error.message ?? "Internal Server Error")
//     );
//   }
// };

export const getOngoingGame = async (req: Request, res: Response) => {
  try {
    const { gameId } = req.params;
    if (!gameId) {
      return res.json(new ApiError(500, "Pls provide gameId"));
    }
    const game = await GameManager.getGame(gameId);
    if (!game || game.status === "completed") {
      return res.json(new ApiResponse(404, null, "Game not exist"));
    }
    return res.json(new ApiResponse(200, game, "Game details"));
  } catch (error: any) {
    return res.json(
      new ApiError(500, error.message ?? "Internal server Error")
    );
  }
};

export const joinGame = async (req: Request, res: Response) => {
  try {
    const { gameId } = req.params;

    if (!gameId) {
      return res.json(new ApiError(500, "Pls provide the gameId"));
    }
    const getGame = await GameManager.getGame(gameId);
    if (!getGame || getGame.status === "completed")
      console.log(getGame, "game in the join game");
    if (!getGame || getGame.status === "completed") {
      return res.json(new ApiError(500, "Game not Found"));
    }
 
    let playerId;
    if (!req.cookies.playerId) { 
      playerId = uuidV4();
      res.cookie("playerId", playerId, {
        maxAge: 40 * 60 * 1000, 
        secure:true,
        httpOnly: true,  
      });
      console.log("setting up in gameAPI",playerId)
    } else { 
      console.log(" From cookie playerId",req.cookies.playerId)
      playerId = req.cookies.playerId;
    }
    return res.json(new ApiResponse(200, playerId, "Welocme"));
  } catch (error: any) {
    console.log("error  while joining the game", error);
    return res.json(
      new ApiError(500, error.message || "Internal Server Error")
    );
  }
};

export const exitGame = async (req: Request, res: Response) => {
  try {
    const { gameId } = req.params;
    console.log(gameId);
    if (!gameId) {
      throw new Error("GameId is missing");
    }
    if (!validId.safeParse(gameId)) {
      throw new Error("Invalid gameId");
    }
    // wss.broadcastToUsers(gameId, "user_Exited", req.user?.name);
    const gameExist = await GameManager.getGame(gameId);
    if (!gameExist) {
      return res.json(new ApiResponse(200, "", "Game already deleted"));
    }
    // const deletegame = await GameManager.exitOrDeleteGame(gameId);

    return res.json(new ApiResponse(200, "", "Game removed successfully"));
  } catch (error: any) {
    console.log("Error", error);
    return res.json(
      new ApiError(500, error.message ?? "Internal server error")
    );
  }
};
