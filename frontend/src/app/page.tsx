"use client";

import Cell from "@/components/Cell";
import React, { useState, useEffect } from "react";
import { Circle, Share2, X } from "lucide-react";
import Turn from "@/components/Turn";
import Level from "@/components/Level";

type GameMode = "friend" | "impossible";
type PlayerSymbol = "X" | "O";

const Page = () => {
  const [cells, setCells] = useState<string[]>(Array(9).fill(""));
  const [currentPlayer, setCurrentPlayer] = useState<string>("X");
  const [winner, setWinner] = useState<string | null>(null);
  const [draw, setDraw] = useState<boolean>(false);
  const [xScore, setXScore] = useState<number>(0);
  const [oScore, setOScore] = useState<number>(0);
  const [gameMode, setGameMode] = useState<GameMode>("friend");
  const [isAITurn, setIsAITurn] = useState<boolean>(false);
  const [humanPlayer, setHumanPlayer] = useState<PlayerSymbol>("X");
  const [gameStarted, setGameStarted] = useState<boolean>(false);

  console.log("cells", cells);

  const checkWinner = (cells: string[]) => {
    const winPatterns = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (const pattern of winPatterns) {
      const [a, b, c] = pattern;
      if (cells[a] && cells[a] === cells[b] && cells[a] === cells[c]) {
        return cells[a];
      }
    }
    return null;
  };

  // Minimax algorithm 
  const minimax = (
    board: string[],
    depth: number,
    isMaximizing: boolean,
    aiSymbol: string
  ): number => {
    const winner = checkWinner(board);
    const humanSymbol = aiSymbol === "O" ? "X" : "O";

    if (winner === aiSymbol) return 10 - depth;
    if (winner === humanSymbol) return depth - 10;
    if (board.every((cell) => cell !== "")) return 0;

    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let i = 0; i < 9; i++) {
        if (board[i] === "") {
          board[i] = aiSymbol;
          const score = minimax(board, depth + 1, false, aiSymbol);
          board[i] = "";
          bestScore = Math.max(score, bestScore);
        }
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < 9; i++) {
        if (board[i] === "") {
          board[i] = humanSymbol;
          const score = minimax(board, depth + 1, true, aiSymbol);
          board[i] = "";
          bestScore = Math.min(score, bestScore);
        }
      }
      return bestScore;
    }
  };

  const getBestMove = (board: string[]): number => {
    const aiSymbol = humanPlayer === "X" ? "O" : "X";
    
    const emptyCells = board.filter(cell => cell === "").length;
    
    if (emptyCells === 9) {
      const strategicMoves = [4, 0, 2, 6, 8];
      return strategicMoves[Math.floor(Math.random() * strategicMoves.length)];
    }
    
    if (emptyCells === 8 && aiSymbol === "X") {
      if (board[4] === aiSymbol) {
        if (board[0] !== "") return 8; 
        if (board[2] !== "") return 6;
        if (board[6] !== "") return 2; 
        if (board[8] !== "") return 0;
        
        const corners = [0, 2, 6, 8].filter(i => board[i] === "");
        return corners[Math.floor(Math.random() * corners.length)];
      }
      
      else {
        
        if (board[4] !== "") {
          const corners = [0, 2, 6, 8].filter(i => board[i] === "");
          return corners[Math.floor(Math.random() * corners.length)];
        }
      }
    }
    
  
    let bestScore = -Infinity;
    let bestMove = -1;

    for (let i = 0; i < 9; i++) {
      if (board[i] === "") {
        board[i] = aiSymbol;
        const score = minimax(board, 0, false, aiSymbol);
        board[i] = "";
        
        if (score > bestScore) {
          bestScore = score;
          bestMove = i;
        }
      }
    }
    return bestMove;
  };

  const makeAIMove = (currentCells: string[]) => {
    const aiSymbol = humanPlayer === "X" ? "O" : "X";
    const bestMove = getBestMove([...currentCells]);
    if (bestMove !== -1) {
      const newCells = [...currentCells];
      newCells[bestMove] = aiSymbol;
      setCells(newCells);

      const win = checkWinner(newCells);
      if (win) {
        setWinner(win);
        if (win === "X") {
          setXScore((prev) => prev + 1);
        } else {
          setOScore((prev) => prev + 1);
        }
      } else if (newCells.every((cell) => cell !== "")) {
        setDraw(true);
      } else {
        setCurrentPlayer(humanPlayer);
        setIsAITurn(false);
      }
    }
  };

  const aiSymbol = humanPlayer === "X" ? "O" : "X";

  useEffect(() => {
    if (
      gameMode === "impossible" &&
      gameStarted &&
      currentPlayer === aiSymbol &&
      !winner &&
      !draw &&
      !isAITurn
    ) {
      setIsAITurn(true);
      setTimeout(() => {
        makeAIMove(cells);
      }, 500);
    }
  }, [
    currentPlayer,
    gameMode,
    winner,
    draw,
    cells,
    isAITurn,
    aiSymbol,
    gameStarted,
  ]);

  const handleClick = (index: number) => {
    if (cells[index] || winner || draw) return;

    if (gameMode === "impossible" && currentPlayer !== humanPlayer) return;

    const newCells = [...cells];
    newCells[index] = currentPlayer;
    setCells(newCells);

    const win = checkWinner(newCells);

    if (win) {
      setWinner(win);
      if (win === "X") {
        setXScore((prev) => prev + 1);
      } else {
        setOScore((prev) => prev + 1);
      }
    } else if (newCells.every((cell) => cell !== "")) {
      setDraw(true);
    } else {
      if (gameMode === "friend") {
        setCurrentPlayer(currentPlayer === "X" ? "O" : "X");
      } else {
        setCurrentPlayer(aiSymbol);
      }
    }
  };

  const restartGame = () => {
    setCells(Array(9).fill(""));
    setWinner(null);
    setCurrentPlayer("X");
    setDraw(false);
    setIsAITurn(false);
    if (gameMode === "impossible") {
      setGameStarted(false);
    }
  };

  const handleModeChange = (mode: GameMode) => {
    setGameMode(mode);
    setGameStarted(false);
    setCells(Array(9).fill(""));
    setWinner(null);
    setCurrentPlayer("X");
    setDraw(false);
    setIsAITurn(false);
    setHumanPlayer("X");
    setXScore(0);
    setOScore(0);
  };

  const handlePlayerChoice = (symbol: PlayerSymbol) => {
    setHumanPlayer(symbol);
    setCurrentPlayer("X"); // Always start with X
    setGameStarted(true);
  };

  return (
    <div className="h-[calc(100vh-9rem)] font-druk flex flex-col items-center md:justify-center justify-items-start bg-white dark:bg-[#1a1a1a] p-4">
      <div className="w-full flex flex-col items-center justify-center gap-5 border rounded-lg p-4 dark:border-[#7c7c7c]">
        <div className="w-full flex flex-col md:flex-row items-center justify-between gap-5">
          <div className="md:hidden w-full flex items-center justify-between">
            <Level gameMode={gameMode} onModeChange={handleModeChange} />
            <Share2
              strokeWidth={2.5}
              className="cursor-pointer dark:text-white"
            />
          </div>
          <div className="hidden md:block">
            <Level gameMode={gameMode} onModeChange={handleModeChange} />
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

        <div className="w- flex flex-col items-center justify-center gap-8">
          {gameMode === "impossible" && !gameStarted ? (
            <div className="w-77 h-77 flex flex-col items-center justify-center gap-6">
              <h2 className="text-2xl font-bold text-center text-black dark:text-white">
                Choose Your Symbol
              </h2>
              <div className="flex gap-6">
                <button
                  onClick={() => handlePlayerChoice("X")}
                  className="w-24 h-24 flex items-center justify-center border-2 border-[#0071bb] bg-[#0071bb]/10 rounded-lg cursor-pointer hover:bg-[#0071bb]/20 transition-colors"
                >
                  <X className="w-12 h-12 text-[#0071bb]" strokeWidth={4} />
                </button>
                <button
                  onClick={() => handlePlayerChoice("O")}
                  className="w-24 h-24 flex items-center justify-center border-2 border-[#ff521c] bg-[#ff521c]/10 rounded-lg cursor-pointer hover:bg-[#ff521c]/20 transition-colors"
                >
                  <Circle
                    className="w-12 h-12 text-[#ff521c]"
                    strokeWidth={4}
                  />
                </button>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                X always goes first
              </p>
            </div>
          ) : winner ? (
            <div className="w-77 h-77 flex flex-col items-center justify-center">
              <h2 className="text-2xl font-bold text-center">
                {winner === "O" ? (
                  <Circle
                    className="w-13 h-13 text-[#ff521c]"
                    strokeWidth={4}
                  />
                ) : (
                  <X className="w-16 h-16 text-[#0071bb]" strokeWidth={4} />
                )}
              </h2>
              <p className="text-2xl font-bold text-center uppercase text-black dark:text-white">
                {gameMode === "impossible"
                  ? winner === humanPlayer
                    ? "You Win!"
                    : "AI Wins!"
                  : `Wins!`}
              </p>
            </div>
          ) : draw ? (
            <div className="w-77 h-77 flex flex-col items-center justify-center">
              <div className="flex items-center justify-center">
                <Circle className="w-13 h-13 text-[#ff521c]" strokeWidth={4} />
                <X className="w-16 h-16 text-[#0071bb]" strokeWidth={4} />
              </div>
              <p className="text-2xl font-bold text-center uppercase text-black dark:text-white">
                Draw!!
              </p>
            </div>
          ) : (
            <div className="w-77 h-77 grid grid-cols-3 gap-1 place-items-center">
              {cells.map((cell, index) => (
                <Cell
                  key={index}
                  value={cell}
                  onClick={() => handleClick(index)}
                  disabled={
                    gameMode === "impossible" &&
                    (currentPlayer !== humanPlayer || isAITurn)
                  }
                />
              ))}
            </div>
          )}

          <button
            onClick={restartGame}
            className="w-full px-5 py-2.5 cursor-pointer border border-b-4 border-[#7c7c7c] dark:text-white font-druk rounded-lg"
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