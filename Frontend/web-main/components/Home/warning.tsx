import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogHeader,
} from "../ui/dialog";
import { AlertTriangle } from "lucide-react";
import { Button } from "../ui/button";   
import Link from "next/link";


type warningprop={
isPlaying:boolean,  
link?:string,  
}

export const WarningComp:React.FC<warningprop> = ({isPlaying,link}) => {
  return (
    <Dialog open={isPlaying} >
      <DialogContent className="sm:max-w-[450px] border-2 border-destructive/50 bg-linear-to-br from-card to-destructive/5">
        <DialogHeader>
          <div className="mx-auto mb-4 w-fit rounded-full bg-destructive/20 p-4 ring-4 ring-destructive/30">
            <AlertTriangle className="h-12 w-12 text-destructive animate-pulse" />
          </div>
          <DialogTitle className="text-3xl font-bold uppercase tracking-wide text-center">
            <span className="bg-linear-to-r from-destructive to-destructive/70 bg-clip-text text-transparent">
              Game In Progress
            </span>
          </DialogTitle>
          <DialogDescription className="text-center text-base font-medium pt-2">
            You are already in an active game. Please finish your current game
            before starting a new one. { link && <Link href={link}>Game-url</Link>}
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
