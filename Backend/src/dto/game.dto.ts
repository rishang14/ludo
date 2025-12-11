import { z } from "zod";

export const initGameSchema = z
  .object({
    totalPlayers: z
      .number({
        error: "Total players is required",
      })
      .min(2, { message: "Minimum 2 players required" })
      .max(4, { message: "Maximum 4 players allowed" })
      .refine((val) => [2, 3, 4].includes(val), {
        message: "Total players must be 2, 3, or 4",
      }),

    emails: z
      .array(z.email({ error: "Invalid email format" }))
      .nonempty("Emails array cannot be empty")
      .max(4, { message: "Cannot provide more than 4 emails" })
      .refine((arr) => new Set(arr).size === arr.length, {
        message: "Duplicate emails are not allowed",
      }),
  })
  .refine((data) => data.emails.length === data.totalPlayers, {
    message: "Emails count must match totalPlayers",
    path: ["emails"],
  });

export const validId = z.cuid({ error: "Invlalid Cuid" });

export type colors = "Red" | "Blue" | "Green" | "Yellow";
export type pawn = {
  pId: string;
  position: string;
  isHome: boolean;
  userId: string;
  isFinished: boolean;
  color: colors;
};

export type updatePawn = {
  position: string;
  isHome: boolean;
  isFinished: boolean;
};

export type allpawns =
    "YP1"
  | "YP2"
  | "YP3"
  | "YP4"
  | "BP1"
  | "BP2"
  | "BP3"
  | "BP4"
  | "GP1"
  | "GP2"
  | "GP3"
  | "GP4"
  | "RP1"
  | "RP2"
  | "RP3"
  | "RP4";
