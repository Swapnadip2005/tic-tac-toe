"use client";

import React from "react";

type Player = "X" | "O" | null;

interface CellProps {
  id: number;
  delay: number;
  value: Player;
  currentPlayer: "X" | "O";
  gameOver: boolean;
  onClick: () => void;
}

export default function Cell({ id, delay, value, currentPlayer, gameOver, onClick }: CellProps) {
  const canShowHover = !value && !gameOver;

  // Determine border color based on the cell's value
  const getBorderColor = () => {
    if (value === "X") return "border-[#FC5185] dark:border-[#5C8374]"; // Pink for X
    if (value === "O") return "border-[#364F6B] dark:border-[#DFD0B8]"; // Blue for O
    return "border-[#393E46] dark:border-[#393E46]"; // Default gray for empty cells
  };

  // Determine background color based on the cell's value
  const getBackgroundColor = () => {
    if (value === "X") return "bg-[#FC5185]/10 dark:bg-[#5C8374]/10"; // Light pink for X (10% opacity)
    if (value === "O") return "bg-[#364F6B]/10 dark:bg-[#DFD0B8]/10"; // Light blue for O (10% opacity)
    return "bg-transparent"; // Transparent for empty cells
  };

  // Determine hover background color based on current player
  const getHoverBackgroundColor = () => {
    if (canShowHover) {
      if (currentPlayer === "X") return "hover:bg-[#FC5185]/10 dark:hover:bg-[#183D3D]/10"; // Light pink for X hover
      if (currentPlayer === "O") return "hover:bg-[#364F6B]/10 hover:dark:bg-[#DFD0B8]/10"; // Light blue for O hover
    }
    return "";
  };

  const getHoverBorderColor = () => {
    if (canShowHover) {
      if (currentPlayer === "X") return "hover:border-[#FC5185] dark:hover:border-[#5C8374]"; // Light pink for X hover
      if (currentPlayer === "O") return "hover:border-[#364F6B] hover:dark:border-[#DFD0B8]"; // Light blue for O hover
    }
    return "";
  };

  // Add hover scale effect only for empty cells
  const getHoverScale = () => {
    if (canShowHover) {
      return "hover:scale-103";
    }
    return "";
  };

  return (
    <button
      aria-label={`Cell ${id + 1}`}
      className={`aspect-square flex items-center justify-center rounded-lg transform transition-all duration-200 focus:outline-none focus:ring-0 cursor-pointer animate-fade-in opacity-0 border group ${getBorderColor()} ${getBackgroundColor()} ${getHoverBackgroundColor()} ${getHoverBorderColor()} ${getHoverScale()}`}
      style={{
        animationDelay: `${delay}ms`,
        animationFillMode: "forwards",
      }}
      onClick={onClick}
      disabled={gameOver || !!value}
    >
      {/* Placeholder for X and O */}
      <div className="w-2/3 h-2/3 flex items-center justify-center select-none relative">
        {/* Original symbols with stroke animation */}
        {value === "X" && (
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
            className="w-full h-full lucide lucide-x-icon lucide-x relative z-10 text-[#FC5185] dark:text-[#5C8374]"
          >
            <path
              d="M18 6 6 18"
              style={{
                strokeDasharray: "17",
                strokeDashoffset: "17",
                animation: "drawLine 0.2s ease-out forwards"
              }}
            />
            <path
              d="m6 6 12 12"
              style={{
                strokeDasharray: "17",
                strokeDashoffset: "17",
                animation: "drawLine 0.2s ease-out 0.2s forwards"
              }}
            />
          </svg>
        )}

        {value === "O" && (
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
            className="w-full h-full lucide lucide-circle-icon lucide-circle relative z-10 text-[#364F6B] dark:text-[#DFD0B8]"
            style={{
              transform: "rotate(-90deg)", // Start from top (12 o'clock position)
            }}
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              style={{
                strokeDasharray: "62.83",
                strokeDashoffset: "62.83",
                animation: "drawCircleClockwise 0.3s ease-out forwards",
                transformOrigin: "center"
              }}
            />
          </svg>
        )}

        {/* Hover preview for current player - only shows on empty cells */}
        {canShowHover && (
          <div className="absolute inset-0 opacity-0 group-hover:opacity-50 transition-all duration-200 flex items-center justify-center">
            {currentPlayer === "X" && (
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
                className="w-full h-full lucide lucide-x-icon lucide-x text-[#FC5185] dark:text-[#5C8374]"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            )}
            {currentPlayer === "O" && (
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
                className="w-full h-full lucide lucide-circle-icon lucide-circle text-[#364F6B] dark:text-[#DFD0B8]"
              >
                <circle cx="12" cy="12" r="10" />
              </svg>
            )}
          </div>
        )}
      </div>
    </button>
  );
}