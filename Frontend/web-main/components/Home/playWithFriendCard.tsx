import { Gamepad2, Users, Zap } from "lucide-react";
import { SharedCard } from "../ui/sharedCard";

export const PlaywithfriendCard = () => {
  return (  
    <SharedCard title="Multiplayer" desc="Invite friends and family for an epic battle!" 
    titleIcon={   <Users className="h-8 w-8 text-primary-foreground" />} 
    buttonIcon={ <Gamepad2 className="mr-2 h-5 w-5" />} 
    contentIcon={ <Zap className="h-5 w-5 text-primary" />}  
    buttonName="Start Game" 
    contentHeader="Live Action" 
    contentPara="Real-time gameplay"
    />
 
  );
};
