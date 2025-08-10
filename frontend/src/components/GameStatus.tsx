"use client";

import { Circle, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

type GameMode = "friend" | "impossible";
type PlayerSymbol = "X" | "O";

interface GameStatusProps {
  gameMode: GameMode;
  gameStarted: boolean;
  winner: string | null;
  draw: boolean;
  humanPlayer: PlayerSymbol;
  onPlayerChoice: (symbol: PlayerSymbol) => void;
  showCelebration?: boolean;
}

const GameStatus = ({
  gameMode,
  gameStarted,
  winner,
  draw,
  humanPlayer,
  onPlayerChoice,
  showCelebration = false,
}: GameStatusProps) => {
  const symbolRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const confettiRef = useRef<HTMLDivElement>(null);
  const drawRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (winner && showCelebration && symbolRef.current && textRef.current) {
      const tl = gsap.timeline();

      gsap.set([symbolRef.current, textRef.current], {
        opacity: 0,
        scale: 0.3,
        y: 50,
      });

      tl.to(symbolRef.current, {
        opacity: 1,
        scale: 1.5,
        y: 0,
        duration: 1.2,
        ease: "back.out(2)",
        rotation: 360,
      })
      .to(symbolRef.current, {
        scale: 1.2,
        duration: 0.6,
        ease: "elastic.out(1.5, 0.3)",
      })
      .to(textRef.current, {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
      }, "-=0.4")
      .to(symbolRef.current, {
        scale: 1.4,
        duration: 0.3,
        ease: "power2.out",
      })
      .to(symbolRef.current, {
        scale: 1.2,
        duration: 0.3,
        ease: "power2.out",
      })
      .call(() => {
        animateNaturalConfetti();
      }, [], 0.8);

      gsap.to(symbolRef.current, {
        y: "-15px",
        duration: 3,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
        delay: 2.5,
      });
    }

    return () => {
      gsap.killTweensOf([
        symbolRef.current,
        textRef.current,
        confettiRef.current,
      ]);
    };
  }, [winner, showCelebration]);

  useEffect(() => {
    if (draw && drawRef.current) {
      gsap.fromTo(
        drawRef.current,
        {
          opacity: 0,
          scale: 0.5,
          rotation: -180,
        },
        {
          opacity: 1,
          scale: 1,
          rotation: 0,
          duration: 1.2,
          ease: "back.out(1.7)",
        }
      );
    }
  }, [draw]);

  const animateNaturalConfetti = () => {
    if (confettiRef.current) {
      const confettiPieces = Array.from(confettiRef.current.children);
      const containerRect = confettiRef.current.getBoundingClientRect();
      
      confettiPieces.forEach((piece, index) => {
        const isLeftSide = index < confettiPieces.length / 2;
        
        const startX = isLeftSide ? -50 : containerRect.width + 50;
        const startY = containerRect.height + 50;
        
        const baseAngle = isLeftSide 
          ? gsap.utils.random(30, 90)
          : gsap.utils.random(90, 150);
        
        const angle = baseAngle + gsap.utils.random(-10, 10);
        const velocity = gsap.utils.random(150, 250);
        const finalX = startX + Math.cos(angle * Math.PI / 180) * velocity;
        const finalY = startY - Math.abs(Math.sin(angle * Math.PI / 180) * velocity);
        
        gsap.set(piece, {
          x: startX,
          y: startY,
          opacity: 0,
          scale: 0,
          rotation: 0,
        });
        
        gsap.to(piece, {
          opacity: 1,
          scale: gsap.utils.random(0.8, 1.2),
          x: startX + (finalX - startX) * 0.4,
          y: startY + (finalY - startY) * 0.4,
          rotation: gsap.utils.random(90, 270),
          duration: 0.4,
          ease: "power3.out",
          delay: gsap.utils.random(0, 0.25),
          onComplete: () => {
            const tl = gsap.timeline();
            
            tl.to(piece, {
              x: finalX,
              y: finalY,
              rotation: gsap.utils.random(360, 540),
              duration: gsap.utils.random(1, 1.5),
              ease: "power2.out",
            })
            .to(piece, {
              x: finalX + gsap.utils.random(-60, 60),
              y: startY + gsap.utils.random(50, 150),
              rotation: `+=${gsap.utils.random(180, 360)}`,
              duration: gsap.utils.random(1.5, 2.5),
              ease: "power1.in",
            })
            .to(piece, {
              opacity: 0,
              duration: 0.6,
              ease: "power2.out",
            }, "-=0.6");

            gsap.to(piece, {
              x: `+=${gsap.utils.random(-25, 25)}`,
              duration: gsap.utils.random(0.5, 0.8),
              yoyo: true,
              repeat: 3,
              ease: "sine.inOut",
              delay: 1.2,
            });
          }
        });
      });
    }
  };

  if (gameMode === "impossible" && !gameStarted) {
    return (
      <div className="w-77 h-77 flex flex-col items-center justify-center gap-6">
        <h2 className="text-2xl font-bold text-center text-black dark:text-white">
          Choose Your Symbol
        </h2>
        <div className="flex gap-6">
          <button
            onClick={() => onPlayerChoice("X")}
            className="w-24 h-24 flex items-center justify-center border-2 border-[#0071bb] bg-[#0071bb]/10 rounded-lg cursor-pointer hover:bg-[#0071bb]/20 transition-colors hover:scale-110 transform duration-200"
          >
            <X className="w-12 h-12 text-[#0071bb]" strokeWidth={4} />
          </button>
          <button
            onClick={() => onPlayerChoice("O")}
            className="w-24 h-24 flex items-center justify-center border-2 border-[#ff521c] bg-[#ff521c]/10 rounded-lg cursor-pointer hover:bg-[#ff521c]/20 transition-colors hover:scale-110 transform duration-200"
          >
            <Circle className="w-12 h-12 text-[#ff521c]" strokeWidth={4} />
          </button>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
          X always goes first
        </p>
      </div>
    );
  }

  if (winner && showCelebration) {
    return (
      <div className="w-77 h-77 flex flex-col items-center justify-center relative overflow-hidden">
        <div ref={symbolRef} className="relative z-10">
          {winner === "O" ? (
            <Circle
              className="w-20 h-20 text-[#ff521c]"
              strokeWidth={4}
            />
          ) : (
            <X
              className="w-20 h-20 text-[#0071bb]"
              strokeWidth={4}
            />
          )}
        </div>

        <p
          ref={textRef}
          className="text-3xl font-bold text-center uppercase text-black dark:text-white mt-6 z-10 relative"
        >
          {gameMode === "impossible"
            ? winner === humanPlayer
              ? "You Win!"
              : "AI Wins!"
            : `Wins!`}
        </p>

        <div
          ref={confettiRef}
          className="absolute inset-0 pointer-events-none"
        >
          {Array.from({ length: 24 }, (_, i) => {
            const shapeType = i % 6;
            return (
              <div
                key={i}
                className={`absolute shadow-lg opacity-0 ${
                  shapeType === 0
                    ? "w-4 h-4 bg-red-500 rounded-full"
                    : shapeType === 1
                    ? "w-3 h-3 bg-blue-500"
                    : shapeType === 2
                    ? "w-4 h-2 bg-green-500 rounded-full"
                    : shapeType === 3
                    ? "w-3 h-5 bg-yellow-500 rounded-sm"
                    : shapeType === 4
                    ? "w-4 h-4 bg-purple-500 rounded-full"
                    : "w-2 h-4 bg-pink-500 rounded-sm"
                }`}
              />
            );
          })}
        </div>
      </div>
    );
  }

  if (draw) {
    return (
      <div
        ref={drawRef}
        className="w-77 h-77 flex flex-col items-center justify-center"
      >
        <div className="flex items-center justify-center gap-2">
          <Circle className="w-13 h-13 text-[#ff521c]" strokeWidth={4} />
          <X className="w-16 h-16 text-[#0071bb]" strokeWidth={4} />
        </div>
        <p className="text-2xl font-bold text-center uppercase text-black dark:text-white mt-4">
          Draw!
        </p>
      </div>
    );
  }

  return null;
};

export default GameStatus;