import z from "zod";
import { initGameSchema, validId, type gameInitType } from "../dto/game.dto";
import { type Request, type Response } from "express";
import { ApiError } from "../utils/apiError";
import { GameRepo } from "../repositry/game.repositry";
import { ApiResponse } from "../utils/apiResponse";
import { UserRepo } from "../repositry/user.repositry";
import { GameManager } from "../services/game/gameManager"; 
import {v4 as uuidV4} from "uuid"
import { wss } from "..";
import { RedisInstance } from "../services/redis/redisClient";

export const initGame = async (req: Request, res: Response) => {
  try {
    console.log(req.body, "body of init game");
    const validate = initGameSchema.safeParse(req.body);
    if (!validate.success) {
      return res
        .status(400)
        .json(
          new ApiError(400, "Invalid Inputs", z.treeifyError(validate.error))
        );
    }
    const onGoingGame = req.cookies.gameId;

    if (onGoingGame) {
      return res.json(
        new ApiResponse(
          403,
          onGoingGame,
          "Complete this game First or go and exit from the game ",
          true
        )
      );
    }
    const { totalPlayers } = validate.data;
     const createdGameId=uuidV4(); 
     const createUserId=uuidV4(); 
     
     res.cookie('gameId',createdGameId,{
      maxAge:1000*60*40, 
      httpOnly:true, 
     }) 
     res.cookie('playerId',createUserId,{
      maxAge:40*60*1000, 
      httpOnly:true, 
     })   
     
     const payload:gameInitType={
      gameId:createdGameId,
      totalPlayers: totalPlayers.toString()
     }
     const setGame= await RedisInstance.setGame(createdGameId,payload); 
     const addUser= await RedisInstance.setUsers(createdGameId,createUserId)
    
    return res
      .status(201)
      .json(
        new ApiResponse(201,createdGameId, "Game Created Successfully join game using this id", true)
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

export const gameValidation = async (req: Request, res: Response) => {
  try {
    const { gameId, userId } = req.params;
    if (!gameId || !userId) {
      return res.json(
        new ApiError(403, "Missing Field", "Missing  gameId or userId")
      );
    }
    if (!(validId.safeParse(gameId) || validId.safeParse(userId))) {
      return res.json(
        new ApiError(403, "Invalid request", "Invalid gameId or userId")
      );
    }
    const game = await GameRepo.getGame(gameId);
    const user = req.user;
    if (user?.id !== userId) {
      return res.json(
        new ApiError(
          403,
          "Unauthorized request",
          "You are not part of the ongoing game"
        )
      );
    }
    const playerExists = game.playerIds.includes(userId as string);
    if (!playerExists) {
      return res.json(
        new ApiError(
          403,
          "Unauthorized request",
          "You are not part of the ongoing game"
        )
      );
    }
    return res.json(new ApiResponse(200, game, `Welcome ${user?.name}`, true));
  } catch (error: any) {
    return res.json(
      new ApiError(500, "Error", error.message ?? "Internal Server Error")
    );
  }
};

export const getOngoingGame = async (req: Request, res: Response) => {
  try {
    const user = req.user;

    const { success, data } = await UserRepo.userOnGoingGame(
      user?.email as string
    );
    if (success) {
      return res.json(new ApiResponse(403, data, "You are already in a game"));
    }
    return res.json(new ApiResponse(200, null, "No onGoing game found"));
  } catch (error: any) {
    return res.json(
      new ApiError(500, error.message ?? "Internal server Error")
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
    wss.broadcastToUsers(gameId, "user_Exited", req.user?.name);
    const gameExist = await GameRepo.getGame(gameId);
    if (!gameExist) {
      return res.json(new ApiResponse(200, "", "Game already deleted"));
    }
    const deletegame = await GameManager.exitOrDeleteGame(gameId);

    //todo send via socket of the gameId connected user that user exited the game game-canceled and clear the whole game board
    return res.json(
      new ApiResponse(200, deletegame, "Game removed successfully")
    );
  } catch (error: any) {
    console.log("Error", error);
    return res.json(
      new ApiError(500, error.message ?? "Internal server error")
    );
  }
};
