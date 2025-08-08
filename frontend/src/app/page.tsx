"use client";

import Cell from "@/components/Cell";
import React, { useState } from "react";
import { Circle, X } from "lucide-react";
import Turn from "@/components/Turn";

const Page = () => {
  const [cells, setCells] = useState<string[]>(Array(9).fill(""));
  const [x, setX] = useState<string>("X");
  const [winner, setWinner] = useState<string | null>(null);
  const [draw, setDraw] = useState<boolean>(false);
  const [xScore, setXScore] = useState<number>(0);
  const [oScore, setOScore] = useState<number>(0);
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

  const handleClick = (index: number) => {
    if (cells[index]) return;
    const newCells = [...cells];
    newCells[index] = x;
    setX(x === "X" ? "O" : "X");
    setCells(newCells);

    const win = checkWinner(newCells);

    if (win) {
      setWinner(win);
      if (win === "X") {
        setXScore(xScore + 1);
      } else {
        setOScore(oScore + 1);
      }
    } else if (newCells.every((cell) => cell !== "")) {
      setDraw(true);
    } else {
      setX(x === "X" ? "O" : "X");
    }
  };

  return (
    <div className="h-[calc(100vh-9rem)] font-druk flex flex-col items-center md:justify-center justify-items-start bg-white dark:bg-[#1a1a1a] p-4">
      <div className="w-full flex flex-col items-center justify-center gap-5 border rounded-lg p-4 dark:border-[#7c7c7c]">
        <div className="w-full flex items-center justify-center md:gap-10 gap-5">
          <Turn player="X" score={xScore} isCurrentTurn={x === "X"} />
          <Turn player="O" score={oScore} isCurrentTurn={x === "O"} />
        </div>
        <div className="w- flex flex-col items-center justify-center gap-8">
          {winner ? (
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
                Winner!
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
                />
              ))}
            </div>
          )}

          <button
            onClick={() => {
              setCells(Array(9).fill(""));
              setWinner(null);
              setX("X");
              setDraw(false);
            }}
            className="w-full px-5 py-2.5 cursor-pointer border border-b-4 border-[#7c7c7c] dark:text-white font-druk rounded-lg"
          >
            Restart Game
          </button>
        </div>
      </div>
    </div>
  );
};

export default Page;