import { Bot, ComputerIcon, Swords, Zap } from "lucide-react";

import { SharedCard } from "../ui/sharedCard";

const PlaywithCompCard = () => {
  return (
    <SharedCard
      title="Solo Mode"
      desc="Challenge AI opponents and master your skills!"
      titleIcon={<Bot className="h-8 w-8 text-accent-foreground" />}
      buttonIcon={
        <Swords className="h-5 w-5 text-destructive opacity-0 group-hover:opacity-100 transition-opacity" />
      }
      buttonName="Play With Bot"
      contentIcon={<ComputerIcon className="h-5 w-5 text-primary" />}
      contentHeader="Practice Mode"
      contentPara="Play with computer"
    />
  );
};

export default PlaywithCompCard;
