import z from "zod";
import { initGameSchema, validId } from "../dto/game.dto";
import type { Request, Response } from "express";
import { ApiError } from "../utils/apiError";
import { GameRepo } from "../repositry/game.repositry";
import { ApiResponse } from "../utils/apiResponse";
import { UserRepo } from "../repositry/user.repositry";
import { GameManager } from "../services/game/gameManager";

export const initGame = async (req: Request, res: Response) => {
  try {  
    console.log(req.body,"body of init game")
    const validate = initGameSchema.safeParse(req.body);
    if (!validate.success) {
      return res
        .status(400)
        .json(
          new ApiError(400, "Invalid Inputs", z.treeifyError(validate.error))
        );
    }
    // const user = req.user;
    // const onGoingGame = await UserRepo.userOnGoingGame(user?.email as string);
    // if (onGoingGame) {
    //   throw new ApiError(403, "Already in a Game", "Can;t create game now");
    // }
    // no need to check for user exist or not alredy checked in the middleware;
    const { totalPlayers, emails } = validate.data;
    const gameCreated = await GameRepo.createGame(
      "jjfY1uWIdHXaLLXzbvlG9oDLdGc5I2z9",
      totalPlayers,
      emails
    );  



    GameManager.initBoard(gameCreated.playerIds,gameCreated.id);

    return res
      .status(201)
      .json(new ApiResponse(201,gameCreated, "Game Initialised Successfully", true));
  } catch (error: any) {
    return res
      .status(500)
      .json(new ApiError(500, error.message || "Internal Server Error"));
  }
};

export const gameValidation = async (req: Request, res: Response) => {
  try {
    const { gameId, userId } = req.params;
    if (!gameId || !userId) {
      throw new Error("One Field is missing GameId or UserId");
    }
    if (!(validId.safeParse(gameId) || validId.safeParse(userId))) {
      throw new Error("Invalid userId or gameId");
    }
    const game = await GameRepo.getGame(gameId);
    const user = req.user;
    const playerExists = game.playerIds.includes(user?.id as string);
    if (!playerExists) {
      throw new ApiError(
        403,
        "Unauthorized request",
        "You are not part of the ongoing game"
      );
    }
    if (user?.id !== game.createdById) {
      const userInfo = await UserRepo.getAndKnowUser(user?.email as string);
      if (userInfo.onGoingGame) {
        return new ApiError(
          409,
          "You are already a part of other game",
          "One user can Play one Game at a time"
        );
      }
      const updated = await UserRepo.updateUserData(userInfo.id, {
        onGoingGame: game.id,
      });
    }
    return new ApiResponse(200, game, `Welcome ${user?.name}`, true);
  } catch (error: any) {
    return new ApiError(
      500,
      "Something went wrong",
      error.message || "Internal Server Error"
    );
  }
};
