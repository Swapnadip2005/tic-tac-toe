import { Circle, X } from "lucide-react";
import React from "react";

interface CellProps {
  value: string;
  onClick: () => void;
}

const Cell = ({ value, onClick }: CellProps) => {
  return (
    <button
      className={`w-20 h-20 text-2xl font-bold flex items-center justify-center cursor-pointer
    ${
      value === "X"
        ? "border border-[#46A3FF] bg-[#46A3FF]/20"
        : value === "O"
        ? "border border-[#FF827E] bg-[#FF827E]/20"
        : "border border-gray-300 bg-[#F1F1F1] hover:bg-gray-200"
    }
  `}
      onClick={onClick}
    >
      {value === "O" && <Circle className="w-10 h-10 text-[#FF827E]" />}
      {value === "X" && <X className="w-12 h-12 text-[#46A3FF]" />}
    </button>
  );
};

export default Cell;
