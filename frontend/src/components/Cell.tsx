"use client";

import { Circle, X } from "lucide-react";
import React, { useEffect, useRef } from "react";

let gsap: any;
try {
  gsap = require("gsap").gsap;
} catch (error) {
  console.warn("GSAP not available, animations will be disabled");
}

interface CellProps {
  value: string;
  onClick: () => void;
  disabled?: boolean;
  isWinning?: boolean;
  disableWinningAnimation?: boolean;
}

const Cell = ({ value, onClick, disabled = false, isWinning = false, disableWinningAnimation = false }: CellProps) => {
  const cellRef = useRef<HTMLButtonElement>(null);
  const symbolRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value && symbolRef.current && gsap) {
      gsap.killTweensOf(symbolRef.current);
      
      gsap.set(symbolRef.current, {
        scale: 0,
        rotation: value === "X" ? -180 : 180,
        opacity: 0
      });

      gsap.to(symbolRef.current, {
        scale: 1,
        rotation: 0,
        opacity: 1,
        duration: 0.6,
        ease: "back.out(1.7)",
        onComplete: () => {
          if (symbolRef.current) {
            symbolRef.current.style.opacity = "1";
            symbolRef.current.style.transform = "scale(1) rotate(0deg)";
          }
        }
      });
    } else if (value && symbolRef.current && !gsap) {
      symbolRef.current.style.opacity = "1";
      symbolRef.current.style.transform = "scale(1) rotate(0deg)";
      symbolRef.current.style.visibility = "visible";
    }
  }, [value]);

  useEffect(() => {
    if (!value && symbolRef.current) {
      if (gsap) {
        gsap.set(symbolRef.current, {
          opacity: 0,
          scale: 0
        });
      } else {
        symbolRef.current.style.opacity = "0";
        symbolRef.current.style.transform = "scale(0)";
      }
    }
  }, [value]);

  useEffect(() => {
    if (!gsap) return;

    const cleanup = () => {
      if (cellRef.current) {
        gsap.killTweensOf(cellRef.current);
        gsap.set(cellRef.current, { 
          boxShadow: "none", 
          scale: 1
        });
      }
      if (symbolRef.current) {
        gsap.killTweensOf(symbolRef.current);
        gsap.set(symbolRef.current, { 
          scale: 1, 
          filter: "none",
          opacity: value ? 1 : 0
        });
      }
    };

    if (isWinning && !disableWinningAnimation && value) {

      gsap.to(cellRef.current, {
        boxShadow: value === "X" 
          ? "0 0 25px rgba(0, 113, 187, 0.8)" 
          : "0 0 25px rgba(255, 82, 28, 0.8)",
        duration: 0.8,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut"
      });

      gsap.to(symbolRef.current, {
        scale: 1.3,
        filter: "brightness(1.4) drop-shadow(0 0 10px rgba(255, 255, 255, 0.8))",
        duration: 0.8,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut"
      });
    } else if (isWinning && disableWinningAnimation && value) {
      gsap.set(symbolRef.current, {
        opacity: 1,
        scale: 1,
        filter: "none"
      });
      gsap.set(cellRef.current, {
        scale: 1,
        boxShadow: "none"
      });
    } else {
      cleanup();
    }

    return cleanup;
  }, [isWinning, disableWinningAnimation, value]);

  const handleClick = () => {
    if (!disabled && !value && cellRef.current && gsap) {
      gsap.killTweensOf(cellRef.current);
      
      gsap.to(cellRef.current, {
        scale: 0.92,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        ease: "power2.inOut",
        onComplete: () => {
          if (cellRef.current) {
            gsap.set(cellRef.current, { scale: 1 });
          }
        }
      });
    }
    onClick();
  };

  const handleMouseEnter = () => {
    if (!disabled && !value && cellRef.current && gsap) {
      gsap.to(cellRef.current, {
        scale: 1.03,
        duration: 0.2,
        ease: "power2.out"
      });
    }
  };

  const handleMouseLeave = () => {
    if (!disabled && !value && cellRef.current && gsap && !isWinning) {
      gsap.to(cellRef.current, {
        scale: 1,
        duration: 0.2,
        ease: "power2.out"
      });
    }
  };

  return (
    <button
      ref={cellRef}
      className={`w-25 h-25 text-2xl font-bold rounded-lg flex items-center justify-center border transition-colors duration-200
        ${
          value === "X"
            ? "border-[#0071bb] bg-[#0071bb]/10"
            : value === "O"
            ? "border-[#ff521c] bg-[#ff521c]/20"
            : "border-[#7c7c7c] hover:border-[#7c7c7c]/60"
        }
        ${disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"}
        ${isWinning ? "ring-2 ring-yellow-400 ring-opacity-75" : ""}
      `}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      disabled={disabled || !!value}
    >
      <div 
        ref={symbolRef} 
        className="flex items-center justify-center" 
        style={{ minHeight: '100%', minWidth: '100%' }}
        data-symbol
      >
        {value === "O" && (
          <Circle className="w-13 h-13 text-[#ff521c]" strokeWidth={4} />
        )}
        {value === "X" && (
          <X className="w-16 h-16 text-[#0071bb]" strokeWidth={4} />
        )}
      </div>
    </button>
  );
};

export default Cell;