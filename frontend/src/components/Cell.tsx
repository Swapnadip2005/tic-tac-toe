import { Circle, X } from "lucide-react";
import React from "react";

interface CellProps {
  value: string;
  onClick: () => void;
}

const Cell = ({ value, onClick }: CellProps) => {
  return (
    <button
      className="w-20 h-20 border border-[#46A3FF] text-2xl font-bold flex items-center justify-center cursor-pointer bg-[#46A3FF]/20"
      onClick={onClick}
    >
      {value === "O" && <Circle className="w-10 h-10 text-[#46A3FF]" />}
      {value === "X" && <X className="w-12 h-12 text-[#46A3FF]" />}
    </button>
  );
};

export default Cell;
