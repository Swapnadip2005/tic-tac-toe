import { Circle, X } from "lucide-react";
import React from "react";

interface CellProps {
  value: string;
  onClick: () => void;
}

const Cell = ({ value, onClick }: CellProps) => {
  return (
    <button
      className={`w-25 h-25 text-2xl font-bold rounded-lg flex items-center justify-center cursor-pointer
    ${
      value === "X"
        ? "border border-[#0071bb] bg-[#0071bb]/10"
        : value === "O"
        ? "border border-[#ff521c] bg-[#ff521c]/20"
        : "border border-gray-300 dark:border-[#7c7c7c]"
    }
  `}
      onClick={onClick}
    >
      {value === "O" && (
        <Circle className="w-13 h-13 text-[#ff521c]" strokeWidth={4} />
      )}
      {value === "X" && (
        <X className="w-16 h-16 text-[#0071bb]" strokeWidth={4} />
      )}
    </button>
  );
};

export default Cell;
