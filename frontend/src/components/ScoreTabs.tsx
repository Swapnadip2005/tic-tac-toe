"use client"

import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

type GameMode = "friend" | "impossible" | null;

interface ScoreTabsProps {
  currentPlayer: "X" | "O";
  xScore: number;
  oScore: number;
  gameOver: boolean;
  gameMode?: GameMode;
  humanSymbol?: "X" | "O";
  onSymbolSelect?: (symbol: "X" | "O") => void;
  gameStarted?: boolean; // Add this prop to track if game has started
}

export default function ScoreTabs({ 
  currentPlayer, 
  xScore, 
  oScore, 
  gameOver, 
  gameMode = null,
  humanSymbol = "X",
  onSymbolSelect,
  gameStarted = false
}: ScoreTabsProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const xSymbolRef = useRef<SVGSVGElement | null>(null);
  const oSymbolRef = useRef<SVGSVGElement | null>(null);

  useGSAP(() => {
    const tl = gsap.timeline();
    
    tl.to(".score-tab", {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.5,
      delay: 0.1,
      ease: "back.out(1.7)",
      stagger: 0.2
    });

  }, { scope: containerRef });

  // Tab hover animation handlers
  const handleTabMouseEnter = (player: "X" | "O") => {
    const el = player === "X" ? xSymbolRef.current : oSymbolRef.current;
    if (el && isClickableTab(player)) {
      gsap.to(el, {
        scale: 1.3,
        duration: 0.4,
        ease: "back.out(1.7)",
        transformOrigin: "center center"
      });
    }
  };

  const handleTabMouseLeave = (player: "X" | "O") => {
    const el = player === "X" ? xSymbolRef.current : oSymbolRef.current;
    if (el && isClickableTab(player)) {
      gsap.to(el, {
        scale: 1,
        duration: 0.3,
        ease: "power2.out",
        transformOrigin: "center center"
      });
    }
  };

  // Handle tab click for symbol selection in impossible mode
  const handleTabClick = (symbol: "X" | "O") => {
    if (isClickableTab(symbol) && onSymbolSelect) {
      onSymbolSelect(symbol);
    }
  };

  // Function to determine if a tab is active (current player's turn or selected human symbol)
  const isActiveTab = (player: "X" | "O") => {
    // If game is over, show default state (no active tab)
    if (gameOver) {
      return false;
    }
    
    if (gameMode === "impossible") {
      // In impossible mode, show human symbol as active only when game hasn't started or during their turn
      if (!gameStarted) {
        return humanSymbol === player;
      }
      // During gameplay, show current player as active
      return currentPlayer === player;
    }
    
    // In friend mode, show current player as active
    return currentPlayer === player;
  };

  // Function to determine if a tab is clickable (only in impossible mode when game hasn't started and not game over)
  const isClickableTab = (player: "X" | "O") => {
    return gameMode === "impossible" && !gameOver && !gameStarted;
  };

  // Function to display score (show "-" for 0, actual number for scores > 0)
  const displayScore = (score: number) => {
    return score === 0 ? "-" : score.toString();
  };

  return (
    <div ref={containerRef} className="flex gap-3 flex-1 justify-center">
      {/* X Tab */}
      <div 
        className={`score-tab opacity-0 -translate-y-7 scale-0 flex items-center justify-between flex-1 px-4 py-2 rounded-lg border border-b-0 transition-all duration-300 ${
          isActiveTab("X")
            ? "bg-[#FC5185]/20 dark:bg-[#5C8374]/20 border-[#FC5185] dark:border-[#5C8374] border-b-2" 
            : "bg-transparent border-[#393E46]"
        } ${isClickableTab("X") ? "cursor-pointer" : "cursor-default"}`}
        onMouseEnter={() => handleTabMouseEnter("X")}
        onMouseLeave={() => handleTabMouseLeave("X")}
        onClick={() => handleTabClick("X")}
      >
        <svg
          ref={xSymbolRef}
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`w-7 h-7 transition-colors duration-300 ${
            isActiveTab("X") ? "text-[#FC5185] dark:text-[#5C8374]" : "text-[#393E46]"
          }`}
        >
          <path d="M18 6 6 18" />
          <path d="m6 6 12 12" />
        </svg>
        <span 
          className={`text-xl font-semibold transition-colors duration-300 ${
            isActiveTab("X") ? "text-[#FC5185] dark:text-[#5C8374]" : "text-[#393E46]"
          }`}
        >
          {displayScore(xScore)}
        </span>
      </div>

      {/* O Tab */}
      <div 
        className={`score-tab opacity-0 -translate-y-7 scale-0 flex items-center justify-between flex-1 px-4 py-2 rounded-lg border border-b-0 transition-all duration-300 ${
          isActiveTab("O")
            ? "bg-[#364F6B]/20 dark:bg-[#DFD0B8]/20 border-[#364F6B] dark:border-[#DFD0B8] border-b-2" 
            : "bg-transparent border-[#393E46]"
        } ${isClickableTab("O") ? "cursor-pointer" : "cursor-default"}`}
        onMouseEnter={() => handleTabMouseEnter("O")}
        onMouseLeave={() => handleTabMouseLeave("O")}
        onClick={() => handleTabClick("O")}
      >
        <svg
          ref={oSymbolRef}
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`lucide lucide-circle-icon lucide-circle transition-colors duration-300 ${
            isActiveTab("O") ? "text-[#364F6B] dark:text-[#DFD0B8]" : "text-[#393E46]"
          }`}
        >
          <circle cx="12" cy="12" r="10" />
        </svg>
        <span 
          className={`text-xl font-semibold transition-colors duration-300 ${
            isActiveTab("O") ? "text-[#364F6B] dark:text-[#DFD0B8]" : "text-[#393E46]"
          }`}
        >
          {displayScore(oScore)}
        </span>
      </div>
    </div>
  );
}