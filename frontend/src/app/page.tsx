"use client";

import React, { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Board from "@/components/Board";
import ControlBar from "@/components/ControlBar";
import DifficultyDropdown from "@/components/DifficultyDropdown";
import { Share2 } from "lucide-react";

gsap.registerPlugin(useGSAP);

type GameMode = "friend" | "impossible" | null;

export default function TicTacToeBoard() {
  const containerRef = useRef(null);
  const boardRef = useRef<{
    resetGame: () => void;
    getCurrentPlayer: () => "X" | "O";
    getScores: () => { xScore: number; oScore: number };
    setGameMode: (mode: GameMode) => void;
    setHumanSymbol: (symbol: "X" | "O") => void;
    resetHumanSymbol: () => void; // Added missing method
  }>(null);

  const [currentPlayer, setCurrentPlayer] = useState<"X" | "O">("X");
  const [xScore, setXScore] = useState(0);
  const [oScore, setOScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameMode, setGameMode] = useState<GameMode>("impossible");
  const [humanSymbol, setHumanSymbol] = useState<"X" | "O">("X");
  const [gameStarted, setGameStarted] = useState(false);

  useGSAP(
    () => {
      const tl = gsap.timeline({
        defaults: { ease: "power3.out", duration: 0.4 },
      });

      // Animate DifficultyDropdown (from left)
      tl.to(".difficulty-dropdown", {
        x: 0,
        opacity: 1,
      });

      // Animate Share icons (from right, staggered)
      tl.to(
        ".share-icon",
        {
          x: 0,
          opacity: 1,
          stagger: 0.2, // one after another
        },
        "-=0.4"
      );

      // Animate Turn Message (from top)
      tl.to(".turn-message", {
        opacity: 1,
        y: 0,
        duration: 0.7,
      });

      // Animate Restart Button
      tl.to(".restart-btn", {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.3,
        ease: "back.out",
      });
    },
    { scope: containerRef }
  );

  const handleRestart = () => {
    // Reset human symbol to default when restarting in impossible mode
    if (gameMode === "impossible") {
      setHumanSymbol("X");
      setGameStarted(false); // Ensure game is marked as not started
    }
    boardRef.current?.resetGame();
  };

  const handleGameStateChange = (
    player: "X" | "O",
    newXScore: number,
    newOScore: number,
    gameOverState: boolean,
    gameStartedState?: boolean
  ) => {
    setCurrentPlayer(player);
    setXScore(newXScore);
    setOScore(newOScore);
    setGameOver(gameOverState);

    // Update gameStarted state if provided
    if (gameStartedState !== undefined) {
      setGameStarted(gameStartedState);
    }
  };

  const handleGameModeChange = (mode: GameMode) => {
    setGameMode(mode);
    boardRef.current?.setGameMode(mode);
    // Reset human symbol to X when changing modes
    if (mode !== "impossible") {
      setHumanSymbol("X");
    }
  };

  const handleSymbolSelect = (symbol: "X" | "O") => {
    if (gameMode === "impossible" && !gameOver) {
      setHumanSymbol(symbol);
      boardRef.current?.setHumanSymbol(symbol);
      setGameStarted(true);
    }
  };

  return (
    <div
      ref={containerRef}
      className="min-h-screen flex flex-col bg-[#F3F3F3] dark:bg-[#040D12] p-6 pt-[90px]"
    >
      <div className="flex flex-col items-center justify-center gap-5">
        <div className="w-full flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-10">
          {/* Row for mobile: Dropdown + Share */}
          <div className="w-full flex items-center justify-between md:w-auto md:justify-start md:gap-6">
            {/* DifficultyDropdown hidden initially */}
            <div className="difficulty-dropdown opacity-0 -translate-x-10">
              <DifficultyDropdown onModeChange={handleGameModeChange} />
            </div>

            {/* Share icon hidden initially */}
            <Share2 className="share-icon opacity-0 translate-x-10 w-6 h-6 shrink-0 md:hidden cursor-pointer dark:text-[#DFD0B8]" />
          </div>

          {/* Control Bar */}
          <div className="flex justify-center md:flex-1 md:pb-0 md:mr-55">
            <ControlBar
              currentPlayer={currentPlayer}
              xScore={xScore}
              oScore={oScore}
              gameOver={gameOver}
              gameMode={gameMode}
              humanSymbol={humanSymbol}
              onSymbolSelect={handleSymbolSelect}
              gameStarted={gameStarted} // Pass the gameStarted prop
            />
          </div>

          {/* Share icon for md+ hidden initially */}
          <Share2 className="share-icon opacity-0 translate-x-10 hidden md:block w-6 h-6 shrink-0 dark:text-[#DFD0B8]" />
        </div>

        <div className="w-full max-w-sm flex flex-col gap-5">
          <div className="flex items-center justify-center text-center text-lg font-semibold text-gray-700">
            <div className="flex items-center justify-center turn-message opacity-0 -translate-y-10">
              {gameOver ? (
                <p>Game Over</p>
              ) : gameMode === "impossible" && !gameStarted ? (
                <p>Select Player or Start the game</p>
              ) : (
                <>
                  {currentPlayer === "X" ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-7 h-7 lucide lucide-x-icon lucide-x text-[#FC5185] dark:text-[#5C8374]"
                    >
                      <path d="M18 6 6 18" />
                      <path d="m6 6 12 12" />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-5 h-5 lucide lucide-circle-icon lucide-circle text-[#364F6B] dark:text-[#DFD0B8]"
                    >
                      <circle cx="12" cy="12" r="10" />
                    </svg>
                  )}
                  <p className="dark:text-[#393E46]">Turn</p>
                </>
              )}
            </div>
          </div>

          <Board
            ref={boardRef}
            onGameStateChange={handleGameStateChange}
            gameMode={gameMode}
            humanSymbol={humanSymbol}
          />

          <button
            className="restart-btn opacity-0 translate-y-10 scale-90 group relative w-full px-5 py-2 rounded-lg text-[#DFD0B8] bg-[#183D3D] font-semibold text-lg transition-all duration-200 overflow-hidden cursor-pointer focus:outline-none focus:ring-0 dark:bg-[#DFD0B8]/20"
            onClick={handleRestart}
          >
            <span className="relative flex items-center justify-center gap-2">
              <svg
                className="w-5 h-5 transition-transform duration-500 group-hover:rotate-180"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Restart Game
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}