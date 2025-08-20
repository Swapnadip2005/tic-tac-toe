"use client";

import React, {
  useState,
  forwardRef,
  useImperativeHandle,
  useRef,
  useEffect,
} from "react";
import Cell from "./Cell";
import { Circle, X } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import confetti from "canvas-confetti";
import { checkWinner, getBestMove } from "@/utils/minimax";

type Player = "X" | "O" | null;
type GameMode = "friend" | "impossible" | null;

export interface BoardRef {
  resetGame: () => void;
  getCurrentPlayer: () => "X" | "O";
  getScores: () => { xScore: number; oScore: number };
  setGameMode: (mode: GameMode) => void;
  setHumanSymbol: (symbol: "X" | "O") => void;
  resetHumanSymbol: () => void;
}

interface BoardProps {
  onGameStateChange?: (
    currentPlayer: "X" | "O",
    xScore: number,
    oScore: number,
    gameOver: boolean,
    gameStarted?: boolean
  ) => void;
  gameMode?: GameMode;
  humanSymbol?: "X" | "O";
}

const Board = forwardRef<BoardRef, BoardProps>(
  ({ onGameStateChange, gameMode = null, humanSymbol = "X" }, ref) => {
    const [board, setBoard] = useState<Player[]>(Array(9).fill(null));
    const [currentPlayer, setCurrentPlayer] = useState<"X" | "O">("X");
    const [winner, setWinner] = useState<Player>(null);
    const [gameOver, setGameOver] = useState(false);
    const [xScore, setXScore] = useState(0);
    const [oScore, setOScore] = useState(0);
    const [winningCombo, setWinningCombo] = useState<number[] | null>(null);
    const [showMessage, setShowMessage] = useState(false);
    const [currentGameMode, setCurrentGameMode] = useState<GameMode>(gameMode);
    const [currentHumanSymbol, setCurrentHumanSymbol] = useState<"X" | "O">(
      humanSymbol
    );
    const [gameStarted, setGameStarted] = useState(false);
    const [aiShouldMoveNext, setAiShouldMoveNext] = useState(false);

    // Refs
    const messageRef = useRef<HTMLDivElement>(null);
    const lineRef = useRef<SVGLineElement>(null);
    const symbolRef = useRef<SVGSVGElement>(null);
    const drawXRef = useRef<SVGSVGElement>(null);
    const drawORef = useRef<SVGSVGElement>(null);

    const getAISymbol = () => (currentHumanSymbol === "X" ? "O" : "X");

    const makeAIMove = (currentBoard: Player[]) => {
      if (currentGameMode !== "impossible" || gameOver || winner) return;

      const aiSymbol = getAISymbol();

      console.log(
        "AI Move - aiSymbol:",
        aiSymbol,
        "humanSymbol:",
        currentHumanSymbol
      );

      // Create a modified board for minimax where AI is always "O" and human is always "X"
      let minimaxBoard = [...currentBoard];

      // If human chose "O", we need to swap the symbols for minimax calculation
      if (currentHumanSymbol === "O") {
        minimaxBoard = currentBoard.map((cell) => {
          if (cell === "O") return "X";
          if (cell === "X") return "O";
          return cell;
        });
      }

      const bestMove = getBestMove(minimaxBoard);
      console.log("Best move:", bestMove, "for board:", currentBoard);

      if (bestMove !== -1) {
        setTimeout(() => {
          const newBoard = [...currentBoard];
          newBoard[bestMove] = aiSymbol;
          console.log("AI placing", aiSymbol, "at position", bestMove);
          setBoard(newBoard);

          const result = checkWinner(newBoard);
          if (result.player) {
            setWinner(result.player);
            setWinningCombo(result.combo);
            setGameOver(true);

            if (result.player === "X") {
              setXScore((prev) => prev + 1);
            } else if (result.player === "O") {
              setOScore((prev) => prev + 1);
            }
          } else if (newBoard.every((cell) => cell !== null)) {
            // Draw
            setGameOver(true);
          } else {
            // Switch to human's turn
            setCurrentPlayer(currentHumanSymbol);
          }
        }, 500);
      }
    };

    const resetGame = () => {
      // Kill all active animations
      gsap.killTweensOf("*");

      // Reset states
      setBoard(Array(9).fill(null));
      setWinner(null);
      setGameOver(false);
      setWinningCombo(null);
      setShowMessage(false);
      setGameStarted(false);
      setAiShouldMoveNext(false);

      // Always set current player to "X" since X always goes first
      setCurrentPlayer("X");

      // ✅ Reset human symbol back to X by default after restart
      setCurrentHumanSymbol("X");

      // Reset line
      if (lineRef.current) {
        const length = lineRef.current.getTotalLength();
        gsap.set(lineRef.current, {
          strokeDasharray: length,
          strokeDashoffset: length,
        });
      }
    };

    useImperativeHandle(ref, () => ({
      resetGame,
      getCurrentPlayer: () => currentPlayer,
      getScores: () => ({ xScore, oScore }),
      setGameMode: (mode: GameMode) => {
        setCurrentGameMode(mode);
        setXScore(0);
        setOScore(0);
        resetGame();
      },
      setHumanSymbol: (symbol: "X" | "O") => {
        console.log("Setting human symbol to:", symbol);
        setCurrentHumanSymbol(symbol);

        // Don't reset the game first, set the symbol first
        if (currentGameMode === "impossible") {
          // Reset game states but keep the symbol
          gsap.killTweensOf("*");
          setBoard(Array(9).fill(null));
          setWinner(null);
          setGameOver(false);
          setWinningCombo(null);
          setShowMessage(false);
          setGameStarted(true); // Mark as started
          setCurrentPlayer("X"); // X always goes first
          setAiShouldMoveNext(false);

          // Reset line
          if (lineRef.current) {
            const length = lineRef.current.getTotalLength();
            gsap.set(lineRef.current, {
              strokeDasharray: length,
              strokeDashoffset: length,
            });
          }

          // If human selected "O", AI should move first
          if (symbol === "O") {
            setAiShouldMoveNext(true);
          }
        } else {
          resetGame();
        }
      },
      resetHumanSymbol: () => {
        if (currentGameMode === "impossible") {
          setCurrentHumanSymbol("X");
        }
      },
    }));

    // Effect to notify parent component of state changes
    useEffect(() => {
      onGameStateChange?.(currentPlayer, xScore, oScore, gameOver, gameStarted);
    }, [
      currentPlayer,
      xScore,
      oScore,
      gameOver,
      gameStarted,
      onGameStateChange,
    ]);

    // Effect to handle AI moves
    useEffect(() => {
      if (
        currentGameMode === "impossible" &&
        gameStarted &&
        !gameOver &&
        !winner
      ) {
        const aiSymbol = getAISymbol();

        console.log("AI Effect Check:", {
          currentPlayer,
          aiSymbol,
          humanSymbol: currentHumanSymbol,
          aiShouldMoveNext,
          gameStarted,
          boardEmpty: board.every((cell) => cell === null),
        });

        // AI should move if it's their turn
        if (currentPlayer === aiSymbol || aiShouldMoveNext) {
          console.log("AI is making a move...");
          setAiShouldMoveNext(false); // Reset the flag
          makeAIMove(board);
        }
      }
    }, [
      currentPlayer,
      currentGameMode,
      gameOver,
      winner,
      currentHumanSymbol,
      gameStarted,
      board,
      aiShouldMoveNext,
    ]);

    const handleCellClick = (index: number) => {
      if (board[index] || winner || gameOver) return;

      // In impossible mode, only allow human to make moves when it's their turn
      if (
        currentGameMode === "impossible" &&
        currentPlayer !== currentHumanSymbol
      )
        return;

      // Mark game as started on first move (if not already started)
      if (!gameStarted) {
        setGameStarted(true);
      }

      const newBoard = [...board];
      newBoard[index] = currentPlayer;
      setBoard(newBoard);

      const result = checkWinner(newBoard);
      if (result.player) {
        setWinner(result.player);
        setWinningCombo(result.combo);
        setGameOver(true);

        if (result.player === "X") {
          setXScore((prev) => prev + 1);
        } else if (result.player === "O") {
          setOScore((prev) => prev + 1);
        }
      } else if (newBoard.every((cell) => cell !== null)) {
        // Draw
        setGameOver(true);
      } else {
        const nextPlayer =
          currentGameMode === "impossible"
            ? getAISymbol()
            : currentPlayer === "X"
            ? "O"
            : "X";
        setCurrentPlayer(nextPlayer);
      }
    };

    // Fixed: Added null check for combo parameter
    const getLinePosition = (combo: number[] | null) => {
      if (!combo || combo.length < 3) {
        return { x1: "0%", y1: "0%", x2: "0%", y2: "0%" };
      }

      const positions = [
        { x: 16.66, y: 16.66 },
        { x: 50, y: 16.66 },
        { x: 83.33, y: 16.66 },
        { x: 16.66, y: 50 },
        { x: 50, y: 50 },
        { x: 83.33, y: 50 },
        { x: 16.66, y: 83.33 },
        { x: 50, y: 83.33 },
        { x: 83.33, y: 83.33 },
      ];

      const start = positions[combo[0]];
      const end = positions[combo[2]];
      return {
        x1: `${start.x}%`,
        y1: `${start.y}%`,
        x2: `${end.x}%`,
        y2: `${end.y}%`,
      };
    };
    
    useEffect(() => {
      if (winner) {
        const timer = setTimeout(() => {
          confetti({
            particleCount: 150,
            spread: 80,
            origin: { y: 0.6 },
          });
        }, 800); // ⏳ half a second delay

        return () => clearTimeout(timer); // cleanup if component unmounts
      }
    }, [winner]);

    // Fixed: Moved all setState calls inside useEffect
    useGSAP(() => {
      if (winningCombo && lineRef.current) {
        const length = lineRef.current.getTotalLength();
        gsap.set(lineRef.current, {
          strokeDasharray: length,
          strokeDashoffset: length,
        });

        gsap.to(lineRef.current, {
          strokeDashoffset: 0,
          duration: 1,
          ease: "power2.out",
          onComplete: () => {
            // Fixed: Use setTimeout instead of requestAnimationFrame for better reliability
            setTimeout(() => setShowMessage(true), 0);
          },
        });
      }
    }, [winningCombo]);

    // Separate effect for draw case to avoid setState during render
    useGSAP(() => {
      if (gameOver && !winner && !winningCombo) {
        // Draw shows immediately after small delay
        gsap.delayedCall(0.5, () => setShowMessage(true));
      }
    }, [gameOver, winner, winningCombo]);

    // Message animations - Fixed: Proper timeline sequencing
    useGSAP(() => {
      if (showMessage) {
        // Winner/Draw message entrance
        gsap.fromTo(
          messageRef.current,
          { scale: 0.5, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.6, ease: "back.out(1.7)" }
        );

        // Winner symbol floating animation
        if (winner && symbolRef.current) {
          gsap.fromTo(
            symbolRef.current,
            { y: 5 },
            {
              y: 1,
              duration: 1.2,
              ease: "power1.inOut",
              repeat: -1,
              yoyo: true,
            }
          );
        }

        // Draw case: Fixed staggered entrance then continuous shake
        if (!winner && gameOver) {
          const symbols = messageRef.current?.querySelectorAll("svg");
          if (symbols?.length) {
            const tl = gsap.timeline();

            // Staggered entrance animation for symbols
            tl.from(symbols, {
              opacity: 0,
              scale: 0.5,
              y: -20,
              stagger: 0.15,
              duration: 0.6,
              ease: "back.out(1.7)",
            });

            // Continuous staggered floating animation
            tl.to(symbols, {
              y: -8,
              duration: 2,
              ease: "sine.inOut",
              repeat: -1,
              yoyo: true,
              stagger: 0.2,
            });
          }
        }
      }
    }, [showMessage, winner, gameOver]);

    const getGameMessage = () => {
      if (!showMessage) return null;
      if (winner) {
        return (
          <div
            ref={messageRef}
            className="flex flex-col items-center justify-center"
          >
            {winner === "X" ? (
              <X
                ref={symbolRef}
                strokeWidth={2}
                className="w-40 h-40 text-[#FC5185] dark:text-[#5C8374]"
              />
            ) : (
              <Circle
                ref={symbolRef}
                strokeWidth={2}
                className="w-30 h-30 text-[#364F6B] dark:text-[#DFD0B8]"
              />
            )}
            <h1 className="text-4xl font-bold text-[#393E46]">WINNER!</h1>
          </div>
        );
      } else if (gameOver) {
        return (
          <div ref={messageRef} className="flex flex-col items-center gap-2">
            <div className="flex items-center justify-center gap-2">
              <X
                ref={drawXRef}
                strokeWidth={2}
                className="w-30 h-30 text-[#FC5185] dark:text-[#5C8374]"
              />
              <Circle
                ref={drawORef}
                strokeWidth={2}
                className="w-20 h-20 text-[#364F6B] dark:text-[#DFD0B8]"
              />
            </div>
            <h1 className="text-4xl font-bold text-center text-[#393E46]">
              DRAW!
            </h1>
          </div>
        );
      }
      return null;
    };

    return (
      <div className="relative flex flex-col gap-3">
        <div className="grid grid-cols-3 gap-1 bg-transparent relative">
          {board.map((cell, index) => (
            <Cell
              key={index}
              id={index}
              delay={index * 100}
              value={cell}
              currentPlayer={currentPlayer}
              gameOver={gameOver}
              onClick={() => handleCellClick(index)}
            />
          ))}

          {/* SVG Winning Line - Now matches the winning symbol color */}
          {winningCombo && (
            <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
              <line
                ref={lineRef}
                {...getLinePosition(winningCombo)}
                strokeWidth="4"
                strokeLinecap="round"
                className={
                  winner === "X"
                    ? "stroke-[#FC5185] dark:stroke-[#5C8374]"
                    : winner === "O"
                    ? "stroke-[#364F6B] dark:stroke-[#DFD0B8]"
                    : "stroke-black dark:stroke-gray-300"
                }
              />
            </svg>
          )}

          {/* Winning / Draw Message */}
          {getGameMessage() && (
            <div className="absolute inset-0 flex items-center justify-center bg-[#F3F3F3] dark:bg-[#040D12] bg-opacity-90 rounded z-10">
              {getGameMessage()}
            </div>
          )}
        </div>
      </div>
    );
  }
);

Board.displayName = "Board";
export default Board;
