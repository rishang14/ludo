import PlaywithCompCard from "@/components/Home/playWithCompCard";
import { PlaywithfriendCard } from "@/components/Home/playWithFriendCard";
import { Dice1, Dice6 } from "lucide-react";

export default function Page() {
  return (
    <div className=" min-h-screen w-full relative  overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-linear-to-br from-destructive/10 via-primary/10 to-accent/10" />
        <div className="absolute inset-0 bg-linear-to-tr from-transparent via-secondary/5 to-transparent " />
      </div>

      <div className=" z-10 mx-auto w-full max-w-[1040px] px-4 py-8 md:py-12">
        <div className="mb-8 text-center md:mb-10">
          <div className="mb-6 flex items-center justify-center gap-4">
            <Dice1 className="h-10 w-10 md:h-12 md:w-12 text-destructive animate-bounce animate-duration-[2s]" />
            <h1 className="text-gaming text-4xl font-bold tracking-wider md:text-6xl ">
              <span className="text-white ">LUDO LEGENDS</span>
            </h1>
            <Dice6 className="h-10 w-10 md:h-12 md:w-12 text-accent animate-bounce animate-duration-[2s] animate-delay-300" />
          </div>
        </div>

        <div className="flex gap-2  flex-wrap justify-center items-center">
          <PlaywithfriendCard />
          <PlaywithCompCard />
        </div>
      </div>
    </div>
  );
}
