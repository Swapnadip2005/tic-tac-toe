"use client";

import React from "react";
import ScoreTabs from "./ScoreTabs";

type GameMode = "friend" | "impossible" | null;

interface ControlBarProps {
  currentPlayer: "X" | "O";
  xScore: number;
  oScore: number;
  gameOver: boolean;
  gameMode?: GameMode;
  humanSymbol?: "X" | "O";
  onSymbolSelect?: (symbol: "X" | "O") => void;
  gameStarted?: boolean; // Add this prop
}

export default function ControlBar({
  currentPlayer,
  xScore,
  oScore,
  gameOver,
  gameMode = null,
  humanSymbol = "X",
  onSymbolSelect,
  gameStarted = false
}: ControlBarProps) {
  return (
    <div className="w-full md:w-150 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div className="flex justify-center flex-1 order-2 sm:order-none">
        <ScoreTabs
          currentPlayer={currentPlayer}
          xScore={xScore}
          oScore={oScore}
          gameOver={gameOver}
          gameMode={gameMode}
          humanSymbol={humanSymbol}
          onSymbolSelect={onSymbolSelect}
          gameStarted={gameStarted} // Pass the gameStarted prop
        />
      </div>
    </div>
  );
}