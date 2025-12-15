import { Prisma, type Game } from "@prisma/client";
import prisma from "../prisma";
import { UserRepo } from "./user.repositry";

export class GameRepo {
  public static async createGame(
    ownerId: string,
    totalPlayer: number,
    email: string[]
  ): Promise<Game> {
    const playerIds: string[] = [];
    for (const e of email) {
      let user = await UserRepo.getAndKnowUser(e);
      if (user.onGoingGame) {
        throw new Error(`${user.email} is Currently in some game`);
      }
      playerIds.push(user.id);
    }
    playerIds.push(ownerId);
    const createdGame = await prisma.game.create({
      data: {
        totalPlayer,
        createdById: ownerId,
        playerIds: playerIds,
      },
    });
    if (!createdGame) {
      throw new Error("Game is not created try again");
    }
    for (const i of playerIds) {
      await UserRepo.updateUserData(i, { onGoingGame: createdGame.id });
    }

    return createdGame;
  }

  public static async getGame(gameId: string): Promise<Game> { 
    const game = await prisma.game.findFirstOrThrow({
      where: {
        id: gameId,
      },
    }); 
    if (!gameId) {
      throw new Error("Game Not Found");
    }
    return game;
  }

  public static async deleteGame(gameId: string): Promise<Game> {
    try {   
      const deleted = await prisma.game.delete({
        where: {
          id: gameId,
        },
      });
      return deleted;
    } catch (error: any) {  
      console.log("Error in delte game ",error);
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          throw new Error("Item already deleted");
        }
      }
      throw new Error(error);
    }
  }

  public static async removeUserFromTheGame(gameId: string) {
    const game = await this.getGame(gameId);
    const playerIds: string[] = game.playerIds;

    for (const id of playerIds) {
      const updatedUser = await UserRepo.updateUserData(id, {
        onGoingGame: null,
      });
      if (!updatedUser) {
        throw new Error(
          "Something Went Wrong while removing the user From the game"
        );
      }
    }
    return true;
  }
}
