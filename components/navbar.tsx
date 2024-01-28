import React from "react";
import { ModeToggle } from "@/components/theme-toggle";

const Navbar = () => {
  return (
    <nav className="border-b">
      <div className="flex justify-between max-w-[1440px] mx-auto items-center p-2">
        <div className="text-lg font-semibold">Question Helper</div>
        <div>
          <ModeToggle />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
