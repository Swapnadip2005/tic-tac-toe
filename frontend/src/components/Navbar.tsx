"use client";

import React from "react";
import { Sun, Moon } from "lucide-react";

interface NavbarProps {
  toggleTheme: () => void;
  currentTheme: "light" | "dark";
}

export default function Navbar({ toggleTheme, currentTheme }: NavbarProps) {
  return (
    <nav className="fixed top-0 left-0 w-full bg-[#F5F5F5] border-b-2 rounded-b-lg border-[#393E46] dark:border-[#393E46] dark:bg-[#040D12] z-50">
      <div className="max-w-8xl mx-auto px-6">
        <div className="flex justify-between items-center h-15">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <span className="text-3xl tracking-wide font-extrabold whitespace-nowrap dark:text-[#DFD0B8]">
              Tic Tac Toe
            </span>
          </div>

          {/* Dark/Light Mode Toggle */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={toggleTheme}>
            {currentTheme === "dark" ? (
              <Sun className="w-6 h-6 text-[#DFD0B8]" />
            ) : (
              <Moon className="w-6 h-6 text-gray-800" />
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}