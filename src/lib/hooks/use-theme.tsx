import {
  ThemeProviderContext,
  ThemeProviderState,
} from "@/lib/context/theme-context";
import { useContext } from "react";

export const useTheme = () => {
  const context = useContext(ThemeProviderContext) as
    | ThemeProviderState
    | undefined;

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};
