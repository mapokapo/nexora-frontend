import { UserCircle2 } from "lucide-react";
import React from "react";
import { Link } from "react-router";

const Sidebar: React.FC = () => {
  return (
    <aside className="sticky top-0 flex h-min min-w-56 flex-col justify-start border-r border-border bg-card p-4 xl:min-w-64">
      <Link
        to="/app/profile"
        className="flex w-full cursor-pointer items-center gap-2 rounded-lg p-2 hover:bg-muted">
        <UserCircle2 />
        <span className="text-lg">Profile</span>
      </Link>
    </aside>
  );
};

export default Sidebar;
