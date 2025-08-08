import { Circle, Moon, Sun, X } from "lucide-react";
import React from "react";

interface NavbarProps {
  currentTheme: "light" | "dark";
  toggleTheme: () => void;
}

const Navbar = ({ currentTheme, toggleTheme }: NavbarProps) => {
  return (
    <div className="w-full h-21 flex items-center justify-between px-4 bg-white dark:bg-[#1a1a1a] font-druk">
      <div className="w-full flex items-center justify-between border p-4 rounded-lg dark:border-[#7c7c7c]">
        <div className="flex items-center justify-center gap-2">
          <Circle className="w-7 h-7 text-[#ff521c]" strokeWidth={4} />
          <h1 className="text-2xl font-bold text-black dark:text-white whitespace-nowrap">
            Tic Tac Toe
          </h1>
          <X className="w-8 h-8 text-[#0071bb]" strokeWidth={4} />
        </div>
        <div>
          {currentTheme === "dark" ? (
            <Sun
              onClick={toggleTheme}
              strokeWidth={2.5}
              className="cursor-pointer text-white"
            />
          ) : (
            <Moon
              onClick={toggleTheme}
              strokeWidth={2.5}
              className="cursor-pointer text-black"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
