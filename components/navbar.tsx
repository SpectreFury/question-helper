import React from "react";
import { ModeToggle } from "@/components/theme-toggle";
import Container from "./container";

const Navbar = () => {
  return (
    <nav className="border-b">
      <Container>
        <div className="flex justify-between items-center p-2">
          <div className="text-lg font-semibold">Question Helper</div>
          <div>
            <ModeToggle />
          </div>
        </div>
      </Container>
    </nav>
  );
};

export default Navbar;
