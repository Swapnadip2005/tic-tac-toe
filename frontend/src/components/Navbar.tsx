import { Moon, Sun } from "lucide-react";
import Image from "next/image";
import React from "react";

interface NavbarProps {
  currentTheme: "light" | "dark";
  toggleTheme: () => void;
}

const Navbar = ({ currentTheme, toggleTheme }: NavbarProps) => {
  return (
    <div className="w-full h-21 flex items-center justify-between px-4 shadow bg-white dark:bg-[#1a1a1a] font-druk">
      <div className="w-full flex items-center justify-between border p-4 rounded-lg border dark:border-[#7c7c7c]">
        <h1 className="text-2xl font-bold text-black dark:text-white whitespace-nowrap">
          Tic Tac Toe
        </h1>
        <div>
          {currentTheme === "dark" ? (
            <Sun
              onClick={toggleTheme}
              strokeWidth={2.5}
              className="mt-1 cursor-pointer text-white"
            />
          ) : (
            <Moon
              onClick={toggleTheme}
              strokeWidth={2.5}
              className="mt-1 cursor-pointer text-black"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
