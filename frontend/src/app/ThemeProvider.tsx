"use client";

import React, { useState, useEffect } from "react";
import { Inter } from "next/font/google";
import Navbar from "@/components/Navbar";

interface LayoutClientProps {
  children: React.ReactNode;
}

const inter = Inter({
  weight: "400",
  variable: "--font-inter",
  subsets: ["latin"],
});

export const ThemeProvider: React.FC<LayoutClientProps> = ({ children }) => {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <div className={inter.variable}>
      <Navbar toggleTheme={toggleTheme} currentTheme={theme} />
      <main>{children}</main>
    </div>
  );
};
