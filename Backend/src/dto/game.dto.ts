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
 

export const validId= z.cuid({error:"Invlalid Cuid"});