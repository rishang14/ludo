"use client";

import  { useEffect, useState } from "react";
import { Trophy, Crown, Sparkles, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useGameStore } from "@/state/gameStore";
import { exitOrCancelGame } from "@/lib/action/server.action";
import { usePathname, useRouter } from "next/navigation";


export const WinScreen = () => { 
const [loading,setLoadig]=useState<boolean>(false)
  const [mounted, setMounted] = useState(false); 
  const pathName= usePathname() 
  const gameId =pathName.split("/")[2]
  const {winnerColor,winnerName,winnerFound}=useGameStore() 
  const router=useRouter()
  const [confetti, setConfetti] = useState<
    Array<{ id: number; left: number; delay: number; duration: number }>
  >([]);

  useEffect(() => {
    if (winnerFound) {
      setMounted(true);
      // Generate confetti particles
      const particles = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 0.5,
        duration: 2 + Math.random() * 2,
      }));
      setConfetti(particles);
    }
  }, [winnerFound]);


  const handleClick=async()=>{
  try { 
    setLoadig(true)
    const res= await exitOrCancelGame(gameId); 
   router.push("/")
  } catch (error) {
    
  }finally{
    setLoadig(false)
  }
  }

  if (!winnerFound) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
      {/* Confetti */}
      {confetti.map((particle) => (
        <div
          key={particle.id}
          className="absolute top-0 w-3 h-3 rounded-full animate-confetti-fall"
          style={{
            left: `${particle.left}%`,
            background: `hsl(${Math.random() * 360}, 80%, 60%)`,
            animationDelay: `${particle.delay}s`,
            animationDuration: `${particle.duration}s`,
          }}
        />
      ))}

      {/* Main Card */}
      <div
        className={cn(
          "relative mx-4 w-full max-w-lg overflow-hidden rounded-3xl bg-linear-to-br from-amber-50 via-yellow-50 to-orange-50 p-8 shadow-2xl",
          mounted && "animate-scale-in"
        )}
      >
        {/* Decorative elements */}
        <div className="absolute -right-8 -top-8 h-32 w-32 animate-spin-slow rounded-full bg-linear-to-br from-amber-300/30 to-yellow-300/30 blur-2xl" />
        <div className="absolute -bottom-8 -left-8 h-32 w-32 animate-spin-slow rounded-full bg-linear-to-br from-orange-300/30 to-yellow-300/30 blur-2xl animation-delay-2000" />

        {/* Content */}
        <div className="relative space-y-6 text-center">
          {/* Trophy Icon */}
          <div className="relative mx-auto w-fit">
            <div className="absolute inset-0 animate-ping rounded-full bg-amber-400/30" />
            <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-linear-to-br from-amber-400 to-yellow-500 shadow-xl">
              <Trophy className="h-12 w-12 text-white animate-bounce-slow" />
            </div>
            <Crown className="absolute -right-2 -top-2 h-8 w-8 text-amber-500 animate-wiggle" />
            <Sparkles className="absolute -left-2 -bottom-2 h-6 w-6 text-orange-500 animate-pulse" />
            <Star className="absolute -right-1 top-1 h-5 w-5 text-yellow-400 animate-twinkle" />
          </div>

          {/* Title */}
          <div className="space-y-2">
            <h1 className="animate-slide-up font-bold text-5xl tracking-tight text-gray-900 text-balance">
              Victory! 🎉
            </h1>
            <p className="animate-slide-up text-lg text-gray-600 animation-delay-200 text-pretty">
              Congratulations  on your amazing win!
            </p>
          </div>

          {/* Winner Card */}
          <div className="animate-slide-up rounded-2xl bg-white/80 p-6 shadow-lg backdrop-blur-sm animation-delay-400">
            <div className="flex items-center justify-center gap-3">
              <div
                className="h-12 w-12 animate-pulse rounded-full border-4 border-white shadow-lg"
                style={{ backgroundColor: winnerColor }}
              />
              <div className="text-left">
                <p className="font-semibold text-gray-600 text-sm uppercase tracking-wide">
                  Champion
                </p>
                <p className="font-bold text-2xl text-gray-900">{winnerName}</p>
              </div>
            </div>
          </div>

          {/* Stats or Fun Message */}
          <div className="animate-slide-up space-y-2 animation-delay-600">
            <p className="font-medium text-amber-600 text-sm">
              ⭐ Outstanding Performance ⭐
            </p>
            <p className="text-gray-500 text-sm">
              You've conquered the board with skill and strategy!
            </p>
          </div>

          {/* OK Button */}
          <Button
            onClick={handleClick}
            size="lg" 
            disabled={loading}
            className="animate-slide-up w-full rounded-full bg-linear-to-r from-amber-500 to-orange-500 font-bold text-lg shadow-lg transition-all hover:scale-105 hover:shadow-xl active:scale-95 animation-delay-800"
          >
            Close the WinScreen
          </Button>
        </div>
      </div>
    </div>
  );
}
