import { Circle, X } from "lucide-react";
import React from "react";

interface TurnProps {
  player: "X" | "O";
  score: number;
  isCurrentTurn: boolean;
}

const Turn: React.FC<TurnProps> = ({ player, score, isCurrentTurn }) => {
  const getBorderColor = () => {
    if (isCurrentTurn) {
      return player === "O" ? "border-[#ff521c]" : "border-[#0071bb]"; // Orange for O, Blue for X
    } else {
      return "border-[#7c7c7c]"; // Gray for not current turn
    }
  };

  return (
    <div className="md:w-[20%] w-full">
      <button className={`w-full px-5 py-2.5 flex items-center justify-between cursor-pointer border border-b-4 ${getBorderColor()} dark:text-white font-druk rounded-lg`}>
        {player === "O" ? (
          <Circle className="text-[#ff521c]" strokeWidth={4} />
        ) : (
          <X className="text-[#0071bb]" strokeWidth={4} />
        )}
        <h1>{score === 0 ? "-" : score}</h1>
      </button>
    </div>
  );
};

export default Turn;