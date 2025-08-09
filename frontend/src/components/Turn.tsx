import { Circle, X } from "lucide-react";
import React from "react";

interface TurnProps {
  player: "X" | "O";
  score: number;
  isCurrentTurn: boolean;
  playerName?: string;
}

const Turn: React.FC<TurnProps> = ({ player, score, isCurrentTurn, playerName }) => {
  const getBorderColor = () => {
    if (isCurrentTurn) {
      return player === "O" ? "border-[#ff521c]" : "border-[#0071bb]";
    } else {
      return "border-[#7c7c7c]";
    }
  };

  return (
    <div className="md:w-[20%] w-full">
      <button className={`w-full px-5 py-2.5 flex flex-col items-center justify-center cursor-pointer border border-b-4 ${getBorderColor()} dark:text-white font-druk rounded-lg gap-1`}>
        <div className="flex items-center justify-between w-full">
          {player === "O" ? (
            <Circle className="text-[#ff521c]" strokeWidth={4} />
          ) : (
            <X className="text-[#0071bb]" strokeWidth={4} />
          )}
          <h1>{score === 0 ? "-" : score}</h1>
        </div>
      </button>
    </div>
  );
};

export default Turn;