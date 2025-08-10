"use client";

import { Share2 } from "lucide-react";
import Turn from "@/components/Turn";
import Level from "@/components/Level";

type GameMode = "friend" | "impossible";
type PlayerSymbol = "X" | "O";

interface GameHeaderProps {
  gameMode: GameMode;
  currentPlayer: string;
  isAITurn: boolean;
  humanPlayer: PlayerSymbol;
  xScore: number;
  oScore: number;
  onModeChange: (mode: GameMode) => void;
}

const GameHeader = ({
  gameMode,
  currentPlayer,
  isAITurn,
  humanPlayer,
  xScore,
  oScore,
  onModeChange,
}: GameHeaderProps) => {
  const aiSymbol = humanPlayer === "X" ? "O" : "X";

  return (
    <div className="w-full flex flex-col md:flex-row items-center justify-between gap-5">
      <div className="md:hidden w-full flex items-center justify-between">
        <Level gameMode={gameMode} onModeChange={onModeChange} />
        <Share2
          strokeWidth={2.5}
          className="cursor-pointer dark:text-white"
        />
      </div>
      <div className="hidden md:block">
        <Level gameMode={gameMode} onModeChange={onModeChange} />
      </div>
      <div className="w-full md:relative md:-left-22 flex items-center justify-center md:gap-10 gap-5">
        <Turn
          player="X"
          score={xScore}
          isCurrentTurn={currentPlayer === "X" && !isAITurn}
          playerName={
            gameMode === "impossible"
              ? humanPlayer === "X"
                ? "You"
                : "AI"
              : "Player 1"
          }
        />
        <Turn
          player="O"
          score={oScore}
          isCurrentTurn={
            currentPlayer === "O" || (isAITurn && aiSymbol === "O")
          }
          playerName={
            gameMode === "impossible"
              ? humanPlayer === "O"
                ? "You"
                : "AI"
              : "Player 2"
          }
        />
      </div>
      <div className="hidden md:block">
        <Share2
          strokeWidth={2.5}
          className="cursor-pointer dark:text-white"
        />
      </div>
    </div>
  );
};

export default GameHeader;