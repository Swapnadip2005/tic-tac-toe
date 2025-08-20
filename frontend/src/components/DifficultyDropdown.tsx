"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { ChevronDown } from "lucide-react";

type GameMode = "friend" | "impossible" | null;

interface DifficultyDropdownProps {
  onModeChange?: (mode: GameMode) => void;
}

export default function DifficultyDropdown({ onModeChange }: DifficultyDropdownProps) {
  const [selectedDifficulty, setSelectedDifficulty] = useState("impossible");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0 });

  const options = [
    { value: "impossible", label: "Impossible" },
    { value: "friend", label: "Play against a friend" },
  ];

  const handleSelect = (option: any) => {
    setSelectedDifficulty(option.value);
    setIsOpen(false);
    onModeChange?.(option.value as GameMode);
  };

  const updatePosition = () => {
    const rect = buttonRef.current?.getBoundingClientRect();
    if (rect) {
      setPosition({
        top: rect.bottom + window.scrollY + 8, // gap of 8px
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !buttonRef.current?.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      updatePosition(); // recalc right when opening
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <>
      <div className="relative w-64">
        <button
          ref={buttonRef}
          onClick={() => {
            updatePosition(); // calculate before open
            setIsOpen((prev) => !prev);
          }}
            className="relative w-full px-4 py-2 text-left bg-[#3FC1C9]/20 dark:bg-[#DFD0B8]/20 border border-[#3FC1C9] dark:border-[#DFD0B8] rounded-lg font-semibold text-lg focus:outline-none transition-colors duration-200"
        >
          <div className="flex items-center justify-between">
            <span className={selectedDifficulty ? "dark:text-[#DFD0B8] text-[#3FC1C9]" : "text-white"}>
              {selectedDifficulty
                ? options.find((opt) => opt.value === selectedDifficulty)?.label
                : "Impossible"}
            </span>
            <ChevronDown
              className={`w-5 h-5 text-[#3FC1C9] dark:text-[#DFD0B8] transition-transform duration-200 ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </div>
        </button>
      </div>

      {isOpen && position.width > 0 && // only render once position is ready
        createPortal(
          <div
            ref={dropdownRef}
            style={{
              position: "absolute",
              top: position.top,
              left: position.left,
              width: position.width,
              zIndex: 9999,
            }}
            className="bg-white border border-[#3FC1C9] rounded-lg shadow-lg font-semibold text-lg"
          >
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSelect(option)}
                className="w-full dark:bg-[#183D3D] px-4 py-3 text-left hover:tracking-wide focus:outline-none transition-all duration-150 cursor-pointer first:rounded-t-lg last:rounded-b-lg border-b border-[#3FC1C9]/30 last:border-b-0"
              >
                <span className="text-[#3FC1C9] dark:text-[#DFD0B8]">{option.label}</span>
              </button>
            ))}
          </div>,
          document.body
        )}
    </>
  );
}
