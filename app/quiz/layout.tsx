import React from "react";
import Sidebar from "../dashboard/_components/sidebar";

const QuizLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-screen">
      <Sidebar />
      {children}
    </div>
  );
};

export default QuizLayout;
