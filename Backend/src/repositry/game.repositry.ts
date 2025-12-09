import type { Game, User } from "@prisma/client";
import prisma from "../prisma";
import { UserRepo } from "./user.repositry";

export class GameRepositry {
  public async createGame(
    ownerId: string,
    totalPlayer: number,
    email: string[]
  ): Promise<Game> {
    const playerIds: string[] = [];

    for (const e of email) {
      let user = await UserRepo.getAndKnowUser(e);
      if (user.onGoingGame) {
        throw new Error(`${user.email} is Currently in Game`);
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

    return createdGame;
  }
}
