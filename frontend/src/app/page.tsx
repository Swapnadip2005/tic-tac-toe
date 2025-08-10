"use client";

import React, { useState, useEffect } from "react";
import GameHeader from "@/components/GameHeader";
import GameStatus from "@/components/GameStatus";
import GameBoard from "@/components/GameBoard";
import { useGameLogic } from "@/hooks/useGameLogic";

const Page = () => {
  const {
    cells,
    currentPlayer,
    winner,
    draw,
    xScore,
    oScore,
    gameMode,
    isAITurn,
    humanPlayer,
    gameStarted,
    winningLine,
    handleClick,
    restartGame,
    handleModeChange,
    handlePlayerChoice,
    aiSymbol,
  } = useGameLogic();

  const [showCelebration, setShowCelebration] = useState(false);
  const [winningAnimationComplete, setWinningAnimationComplete] = useState(false);

  console.log("Game State:", { gameMode, gameStarted, winner, draw, cells });

  useEffect(() => {
    if (!winner && !draw) {
      setShowCelebration(false);
      setWinningAnimationComplete(false);
    }
  }, [winner, draw, cells]);

  const handleWinningAnimationComplete = () => {
    setWinningAnimationComplete(true);
    setTimeout(() => {
      setShowCelebration(true);
    }, 200);
  };

  const handleRestartGame = () => {
    setShowCelebration(false);
    setWinningAnimationComplete(false);
    restartGame();
  };

  const shouldShowGameBoard = () => {
    if (gameMode === "friend") {
      return !winner && !draw;
    }
    if (gameMode === "impossible") {
      return gameStarted && !winner && !draw;
    }
    return false;
  };

  const shouldShowGameStatus = () => {
    if (draw) return true;
    if (gameMode === "impossible" && !gameStarted) return true;
    if (winner && showCelebration) return true;
    return false;
  };

  const shouldShowBoardWithWinningLine = () => {
    return winner && winningLine && !showCelebration;
  };

  return (
    <div className="h-[calc(100vh-9rem)] font-druk flex flex-col items-center md:justify-center justify-items-start bg-white dark:bg-[#1a1a1a] p-4">
      <div className="w-full flex flex-col items-center justify-center gap-5 border rounded-lg p-4 dark:border-[#7c7c7c]">
        <GameHeader
          gameMode={gameMode}
          currentPlayer={currentPlayer}
          isAITurn={isAITurn}
          humanPlayer={humanPlayer}
          xScore={xScore}
          oScore={oScore}
          onModeChange={handleModeChange}
        />

        <div className="flex flex-col items-center justify-center gap-8">
          {shouldShowGameStatus() && (
            <GameStatus
              gameMode={gameMode}
              gameStarted={gameStarted}
              winner={winner}
              draw={draw}
              humanPlayer={humanPlayer}
              onPlayerChoice={handlePlayerChoice}
              showCelebration={showCelebration}
            />
          )}
          
          {shouldShowGameBoard() && (
            <GameBoard
              cells={cells}
              onCellClick={handleClick}
              disabled={
                gameMode === "impossible" &&
                (currentPlayer !== humanPlayer || isAITurn)
              }
              winner={null}
              winningLine={null}
            />
          )}

          {shouldShowBoardWithWinningLine() && (
            <GameBoard
              cells={cells}
              onCellClick={() => {}}
              disabled={true}
              winner={winner}
              winningLine={winningLine}
              onWinningAnimationComplete={handleWinningAnimationComplete}
            />
          )}

          <button
            onClick={handleRestartGame}
            className="w-77 px-5 py-2.5 cursor-pointer border border-b-4 border-[#7c7c7c] dark:text-white font-druk rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            {gameMode === "impossible" && !gameStarted
              ? "Select Symbol to Start"
              : "Restart Game"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Page;