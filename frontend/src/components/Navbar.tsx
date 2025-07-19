import { Moon } from "lucide-react";
import Image from "next/image";
import React from "react";

const Navbar = () => {
  return (
    <div className="w-full h-15 border-b flex items-center justify-between py-10 px-4">
      <div className="flex items-center gap-3">
        <Image
          src="/logoLight.png"
          alt=""
          height={50}
          width={50}
          quality={100}
        />
        <h1 className="text-2xl font-bold">Tic Tac Toe</h1>
      </div>
      <div>
        <Moon strokeWidth={1.25} />
      </div>
    </div>
  );
};

export default Navbar;
