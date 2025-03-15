import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import React from "react";

interface SearchBarProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  onSearch: (value: string) => void;
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = "Search...",
  value,
  onChange,
  onSearch,
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        "flex w-full min-w-32 items-center rounded-lg border-border bg-background ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
        className
      )}
      {...props}>
      <Input
        className="w-full border-none !ring-0 !ring-offset-0"
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.currentTarget.value)}
        onInput={e => {
          onSearch(e.currentTarget.value);
        }}
      />
      <Button
        className="my-1 mr-1 aspect-square h-min rounded-full bg-inherit !text-foreground hover:bg-foreground/15"
        variant="ghost"
        size="icon"
        onClick={() => onSearch(value)}>
        <Search />
      </Button>
    </div>
  );
};

export default SearchBar;
