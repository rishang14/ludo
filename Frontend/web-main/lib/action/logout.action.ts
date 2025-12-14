"use client"
import { redirect } from "next/navigation";
import { authClient } from "../auth.client";

export async function logOut() { 
    console.log("i am cliecked");
  await authClient.signOut({
    fetchOptions: {
      onSuccess: () => {
        redirect("/login"); 
      },
    },
  });
}