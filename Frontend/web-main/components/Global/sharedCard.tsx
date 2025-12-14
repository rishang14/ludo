"use client";
import { Users } from "lucide-react";
import {
  Card,
  CardHeader,
  CardContent,
  CardDescription,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";

type cardProp = {
  title: string;
  desc: string;
  contentIcon: any;
  buttonIcon: any;
  buttonName: string;
  contentHeader: string;
  contentPara: string; 
  titleIcon:any, 
  onClick:()=>void
};

export const SharedCard: React.FC<cardProp> = ({
  title,
  desc,
  contentIcon,
  contentHeader,
  buttonIcon,
  buttonName,
  contentPara, 
  titleIcon,
  onClick
}) => {
  return (
    <Card className="max-w-md border-2  border-primary     shadow-2xl transition-all  hover:shadow-primary/40 hover:border-primary/70">
      <CardHeader className="text-center space-y-2 pb-3 z-10">
        <div className="mx-auto w-fit rounded-xl bg-linear-to-br from-primary  to-primary/80 p-4 shadow-2xl shadow-primary/50 ring-4 ring-primary/20 animate-pulse animate-duration-[3s]">
          {titleIcon}
        </div>
        <CardTitle className="text-gaming text-2xl text-balance tracking-wide uppercase">
          <span className="bg-linear-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            {title}
          </span>
        </CardTitle>
        <CardDescription className="text-sm text-balance leading-relaxed font-medium">
          {desc}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 flex flex-col z-10">
        <div className="space-y-3">
          <div className="group flex items-center gap-2 rounded-xl bg-linear-to-r from-primary/20 to-primary/10 p-2 border-2 border-primary/30 hover:border-primary/60 transition-all hover:from-primary/30 hover:to-primary/20">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/30 group-hover:bg-primary/50 transition-colors">
              {contentIcon}
            </div>
            <div>
              <h3 className="font-bold text-sm uppercase tracking-wide">
                {contentHeader}
              </h3>
              <p className="text-xs text-muted-foreground font-medium">
                {contentPara}
              </p>
            </div>
          </div>
        </div>
        <Button
          size="default"
          className="w-full bg-linear-to-r cursor-pointer from-primary via-primary to-primary/80 hover:from-primary/90 hover:to-primary text-base h-12 shadow-xl shadow-primary/30 font-bold uppercase tracking-widest hover:shadow-2xl hover:shadow-primary/50 transition-all hover:scale-[1.02] border-2 border-primary/50"
          onClick={onClick}
        >
          {buttonIcon}
          {buttonName}
        </Button>
      </CardContent>
    </Card>
  );
};
