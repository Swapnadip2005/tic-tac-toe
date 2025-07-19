"use client";

import Cell from "@/components/Cell";
import React, { useState } from "react";
import { Circle, X } from "lucide-react";

const Page = () => {
  const [cells, setCells] = useState<string[]>(Array(9).fill(""));
  const [x, setX] = useState<string>("X");
  const [winner, setWinner] = useState<string | null>(null);
  const [draw, setDraw] = useState<boolean>(false);
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
    } else if (newCells.every((cell) => cell !== "")) {
      setDraw(true);
    } else {
      setX(x === "X" ? "O" : "X");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      {winner ? (
        <h1 className="my-5 text-xl font-semibold">End Game!</h1>
      ) : draw ? (
        <h1 className="my-5 text-xl font-semibold">End Game!</h1>
      ) : (
        <h1 className="my-5 text-xl font-semibold">Now {x}'s turn</h1>
      )}

      <div className="h-63 w-63 flex items-center justify-center">
        {winner ? (
          <div className="flex flex-col items-center justify-center">
            <h2 className="text-2xl font-bold text-center">
              {winner === "O" ? (
                <Circle className="w-10 h-10 text-[#46A3FF]" />
              ) : (
                <X className="w-12 h-12 text-[#46A3FF]" />
              )}{" "}
            </h2>
            <p className="text-2xl font-bold text-center uppercase">Winner!</p>
          </div>
        ) : draw ? (
          <div>
            <div className="flex items-center justify-center">
              <Circle className="w-10 h-10 text-[#46A3FF]" />
              <X className="w-12 h-12 text-[#46A3FF]" />
            </div>
            <p className="text-2xl font-bold text-center uppercase">Draw!!</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-1">
            {cells.map((cell, index) => (
              <Cell
                key={index}
                value={cell}
                onClick={() => handleClick(index)}
              />
            ))}
          </div>
        )}
      </div>

      <button
        onClick={() => {
          setCells(Array(9).fill(""));
          setWinner(null);
          setX("X");
          setDraw(false);
        }}
        className="my-5 border px-5 py-1 cursor-pointer bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Restart Game
      </button>
    </div>
  );
};

export default Page;
