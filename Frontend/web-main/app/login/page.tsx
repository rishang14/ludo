"use client";
import { Button } from "@/components/ui/button";
import { googleLogin } from "./action";

const page = () => {
  return (
    <div className=" flex items-center justify-center h-screen w-full">
      <Button onClick={googleLogin}>Google</Button>
    </div>
  );
};

export default page;
