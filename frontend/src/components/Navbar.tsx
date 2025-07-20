import { Moon, Sun } from "lucide-react";
import Image from "next/image";
import React from "react";

interface NavbarProps {
  currentTheme: "light" | "dark";
  toggleTheme: () => void;
}

const Navbar = ({ currentTheme, toggleTheme }: NavbarProps) => {
  return (
    <div className="w-full h-15 flex items-center justify-between py-10 px-4 shadow bg-white dark:bg-[#12161F]">
      <div className="flex items-center gap-3">
        <Image
          src={currentTheme === "dark" ? "/logoDark.png" : "/logoLight.png"}
          alt="logo"
          height={50}
          width={50}
          quality={100}
        />
        <h1 className="text-2xl font-bold text-black dark:text-white">
          Tic Tac Toe
        </h1>
      </div>
      <div>
        {currentTheme === "dark" ? (
          <Sun
            onClick={toggleTheme}
            strokeWidth={1.25}
            className="mt-1 cursor-pointer text-white"
          />
        ) : (
          <Moon
            onClick={toggleTheme}
            strokeWidth={1.25}
            className="mt-1 cursor-pointer text-black"
          />
        )}
      </div>
    </div>
  );
};

export default Navbar;
