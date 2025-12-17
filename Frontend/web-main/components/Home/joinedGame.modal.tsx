"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Gamepad2 } from "lucide-react";
import React, { useState } from "react";
import Link from "next/link";
import { exitOrCancelGame } from "@/lib/action/server.action";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface GameModalProps {
  isOpen: boolean;
  gameId: string;
  userId: string;
}

export const ActiveGameDetectModal: React.FC<GameModalProps> = ({
  isOpen,
  gameId,
  userId,
}) => {    
  const router=useRouter();
  const [loading,setLoading]=useState<boolean>(false)
  const exitgame=async ()=>{
try {  
  setLoading(true);
    const res=  await exitOrCancelGame(gameId);  
    toast.success("Exited the game",{duration:2000,description:"You exited the game"})
   router.refresh();
} catch (error) {
}finally{
  setLoading(false)
}
  }   

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent
        className="sm:max-w-md"
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        showCloseButton={false}
      >
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Gamepad2 className="h-8 w-8 text-primary" />
            </div>
          </div>
          <DialogTitle className="text-center text-2xl">
            Game Session Detected
          </DialogTitle>
          <DialogDescription className="text-center text-base pt-2">
            You are currently in an active game session. Would you like to join
            the game or exit?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-col gap-2 sm:flex-col sm:gap-2 mt-4">
          <Link href={`game/${gameId}/user/${userId}`} prefetch={false}  >
            <Button size="lg" className="w-full" disabled={loading}>
              Join the Game
            </Button>
          </Link>
          <Button
            variant="outline"
            size="lg"
            className="w-full bg-transparent"
            onClick={exitgame} 
            disabled={loading}
          >
            Exit the Game
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
