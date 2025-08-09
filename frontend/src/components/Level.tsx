import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { ChevronDown } from "lucide-react";

interface LevelProps {
  gameMode: "friend" | "impossible";
  onModeChange: (mode: "friend" | "impossible") => void;
}

export default function Level({ gameMode, onModeChange }: LevelProps) {
  const getModeDisplayName = (mode: string) => {
    switch (mode) {
      case "impossible":
        return "Impossible AI";
      case "friend":
        return "With Friend";
      default:
        return "Select Mode";
    }
  };

  return (
    <Menu as="div" className="relative inline-block">
      <MenuButton className="inline-flex w-53 justify-between items-center rounded-lg dark:text-white px-5 py-3 text-sm border border-b-4 border-[#7c7c7c] cursor-pointer whitespace-nowrap">
        <span className="truncate">{getModeDisplayName(gameMode)}</span>
        <ChevronDown
          aria-hidden="true"
          className="ml-2 size-5 text-gray-400 flex-shrink-0"
        />
      </MenuButton>

      <MenuItems
        transition
        className="absolute left-0 z-10 mt-2 w-60 origin-top-right rounded-lg bg-white dark:bg-gray-800 shadow-lg outline-1 outline-black/5 transition data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
      >
        <div className="py-1">
          <MenuItem>
            <button
              onClick={() => onModeChange("impossible")}
              className={`block w-full text-left px-4 py-2 text-sm cursor-pointer ${
                gameMode === "impossible"
                  ? "bg-gray-200 text-gray-900 dark:bg-gray-600 dark:text-gray-100"
                  : "text-gray-700 dark:text-gray-300"
              }`}
            >
              Impossible AI
            </button>
          </MenuItem>
          <MenuItem>
            <button
              onClick={() => onModeChange("friend")}
              className={`block w-full text-left px-4 py-2 text-sm cursor-pointer ${
                gameMode === "friend"
                  ? "bg-gray-200 text-gray-900 dark:bg-gray-600 dark:text-gray-100"
                  : "text-gray-700 dark:text-gray-300"
              }`}
            >
              Play against a friend
            </button>
          </MenuItem>
        </div>
      </MenuItems>
    </Menu>
  );
}
