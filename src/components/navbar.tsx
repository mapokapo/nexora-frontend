import NexoraLogo from "@/components/nexora-logo";
import ProfileDropdown from "@/components/profile-dropdown";
import SearchBar from "@/components/searchbar";
import ThemeModeToggle from "@/components/theme-mode-toggle";
import React, { useState } from "react";

const Navbar: React.FC = () => {
  const [search, setSearch] = useState("");

  return (
    <nav className="flex w-full flex-col items-center justify-between gap-2 bg-card p-4 sm:flex-row sm:gap-8">
      <NexoraLogo className="hidden sm:flex" />
      <SearchBar
        className="min-w-48 sm:max-w-[500px]"
        value={search}
        onChange={setSearch}
        onSearch={() => console.log("searching for", search)}
      />
      <div className="flex h-full items-center gap-3">
        <ProfileDropdown />
        <ThemeModeToggle />
      </div>
    </nav>
  );
};

export default Navbar;
