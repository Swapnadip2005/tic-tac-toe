"use client";

import Cell from "@/components/Cell";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";

interface GameBoardProps {
  cells: string[];
  onCellClick: (index: number) => void;
  disabled: boolean;
  winner?: string | null;
  winningLine?: number[] | null;
  onWinningAnimationComplete?: () => void;
}

const GameBoard = ({
  cells,
  onCellClick,
  disabled,
  winner,
  winningLine,
  onWinningAnimationComplete,
}: GameBoardProps) => {
  const boardRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (boardRef.current) {
      const cellElements = Array.from(boardRef.current.children).slice(0, 9);

      gsap.set(boardRef.current, {
        opacity: 1,
        scale: 1,
        y: 0,
      });

      gsap.set(cellElements, {
        opacity: 0,
        scale: 0.5,
        y: 15,
      });

      cellElements.forEach((cell, index) => {
        gsap.to(cell, {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.5,
          ease: "back.out(1.3)",
          delay: index * 0.06,
        });
      });
    }
  }, []);

  // Winning animation
  useEffect(() => {
    if (winner && winningLine && lineRef.current && boardRef.current) {
      const lineStyle = getLineStyle(winningLine);

      gsap.set(lineRef.current, {
        ...lineStyle,
        opacity: 0,
        scaleX: 0,
        transformOrigin: "center",
      });

      const tl = gsap.timeline({
        onComplete: () => {
          setTimeout(() => {
            onWinningAnimationComplete?.();
          }, 400);
        },
      });

      // Get winning cells and symbols
      const winningCellElements: HTMLElement[] = [];
      const winningSymbolElements: HTMLElement[] = [];

      winningLine.forEach((cellIndex) => {
        const cellElements = Array.from(boardRef.current!.children).slice(0, 9);
        const cellElement = cellElements[cellIndex] as HTMLElement;
        if (cellElement) {
          winningCellElements.push(cellElement);

          const symbolElement = cellElement.querySelector("[data-symbol]") as HTMLElement;
          if (symbolElement) {
            winningSymbolElements.push(symbolElement);
            gsap.killTweensOf(symbolElement);
            gsap.set(symbolElement, {
              opacity: 1,
              scale: 1,
              filter: "none",
            });
          }
        }
      });

      if (winningCellElements.length > 0) {
        gsap.set(winningCellElements, {
          scale: 1,
          boxShadow: "none",
        });
      }

      tl
        .to(lineRef.current, {
          opacity: 1,
          scaleX: 1,
          duration: 0.8,
          ease: "power2.out",
        })
        
        .to(winningCellElements, {
          scale: 1.05,
          duration: 0.3,
          ease: "power2.out",
        }, "-=0.3")
        
        .to(winningSymbolElements, {
          scale: 1.3,
          filter: "brightness(1.4) drop-shadow(0 0 12px rgba(255, 255, 255, 0.8))",
          duration: 0.5,
          ease: "back.out(1.5)",
        }, "-=0.2")

        .to([winningCellElements, winningSymbolElements], {
          scale: 1.02,
          duration: 0.3,
          ease: "power2.out",
        });
    }

    return () => {
      if (boardRef.current) {
        const cellElements = Array.from(boardRef.current.children).slice(0, 9);
        gsap.killTweensOf(cellElements);
        gsap.killTweensOf(lineRef.current);

        cellElements.forEach((cell) => {
          const symbolElement = cell.querySelector("[data-symbol]") as HTMLElement;
          if (symbolElement) {
            gsap.killTweensOf(symbolElement);
          }
        });
      }
    };
  }, [winner, winningLine, onWinningAnimationComplete]);

  const getLineStyle = (winningLine: number[]) => {
    const [a, b, c] = winningLine;

    // Horizontal lines
    if (
      (a === 0 && b === 1 && c === 2) ||
      (a === 3 && b === 4 && c === 5) ||
      (a === 6 && b === 7 && c === 8)
    ) {
      const row = Math.floor(a / 3);
      return {
        top: `${16.67 + row * 33.33}%`,
        left: "8%",
        width: "84%",
        height: "4px",
        borderRadius: "2px",
      };
    }

    // Vertical lines
    if (
      (a === 0 && b === 3 && c === 6) ||
      (a === 1 && b === 4 && c === 7) ||
      (a === 2 && b === 5 && c === 8)
    ) {
      const col = a % 3;
      return {
        top: "8%",
        left: `${16.67 + col * 33.33}%`,
        width: "4px",
        height: "84%",
        borderRadius: "2px",
      };
    }

    // Diagonal lines
    if (a === 0 && b === 4 && c === 8) {
      return {
        top: "50%",
        left: "50%",
        width: "115%",
        height: "4px",
        borderRadius: "2px",
        transform: "translate(-50%, -50%) rotate(45deg)",
      };
    }

    if (a === 2 && b === 4 && c === 6) {
      return {
        top: "50%",
        left: "50%",
        width: "115%",
        height: "4px",
        borderRadius: "2px",
        transform: "translate(-50%, -50%) rotate(-45deg)",
      };
    }

    return {};
  };

  return (
    <div
      ref={boardRef}
      className="w-77 h-77 grid grid-cols-3 gap-1 place-items-center relative"
    >
      {cells.map((cell, index) => (
        <Cell
          key={index}
          value={cell}
          onClick={() => onCellClick(index)}
          disabled={disabled}
          isWinning={winningLine?.includes(index)}
          disableWinningAnimation={winner && winningLine ? true : false}
        />
      ))}

      <div
        ref={lineRef}
        className="absolute bg-gradient-to-r from-yellow-400 via-orange-400 to-red-500 shadow-lg z-10"
        style={{ 
          display: winner && winningLine ? "block" : "none",
          boxShadow: "0 0 15px rgba(255, 165, 0, 0.5)"
        }}
      />
    </div>
  );
};

export default GameBoard;