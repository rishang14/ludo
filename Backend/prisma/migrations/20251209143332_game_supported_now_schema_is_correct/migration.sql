/*
  Warnings:

  - You are about to drop the `game` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `game_player` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "GameStatus" AS ENUM ('STARTED', 'COMPLETED', 'SCHEDULED');

-- DropForeignKey
ALTER TABLE "game_player" DROP CONSTRAINT "game_player_gameId_fkey";

-- DropForeignKey
ALTER TABLE "game_player" DROP CONSTRAINT "game_player_userId_fkey";

-- DropTable
DROP TABLE "game";

-- DropTable
DROP TABLE "game_player";

-- CreateTable
CREATE TABLE "Game" (
    "id" TEXT NOT NULL,
    "totalPlayer" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "status" "GameStatus" NOT NULL DEFAULT 'SCHEDULED',
    "playerIds" TEXT[],
    "createdById" TEXT NOT NULL,

    CONSTRAINT "Game_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
