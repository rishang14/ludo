"use client";
import { googleLogin } from "@/lib/action/login.action";
import { Button } from "../ui/button";

export const LoginButton = () => {
  return <Button onClick={googleLogin}>Google</Button>;
};
