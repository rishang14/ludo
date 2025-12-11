"use client";
import { authClient } from "@/lib/auth.client";

export async function googleLogin() {
  await authClient.signIn.social({
    provider: "google",
    callbackURL: "/", // optional redirect after login
  });
}
