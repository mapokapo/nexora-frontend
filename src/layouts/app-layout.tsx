import React from "react";
import { Outlet } from "react-router";

const AppLayout: React.FC = () => {
  return (
    <div className="min-h-full w-full">
      <Outlet />
    </div>
  );
};

export default AppLayout;
