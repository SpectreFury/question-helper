"use client";

import React from "react";
import UserDetails from "./user-details";
import WorkspaceDisplay from "./workspace-display";

const Sidebar = () => {
  return (
    <aside className="h-full border-r p-2 min-w-[280px] flex flex-col gap-2">
      <UserDetails />
      <WorkspaceDisplay />
    </aside>
  );
};

export default Sidebar;
