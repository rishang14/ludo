import { Bot, ComputerIcon, Swords, Zap } from "lucide-react";

import { SharedCard } from "../ui/sharedCard";

const PlaywithCompCard = () => {
  return (
    <SharedCard
      title="Solo Mode"
      desc="Challenge AI opponents and master your skills!"
      titleIcon={<Bot className="h-8 w-8 text-primary-foreground" />}
      buttonIcon={
        <Swords className="h-5 w-5 mr-2" />
      }
      buttonName="Play With Bot"
      contentIcon={<ComputerIcon className="h-5 w-5 " />}
      contentHeader="Practice Mode"
      contentPara="Play with computer"
    />
  );
};

export default PlaywithCompCard;
