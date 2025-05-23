
import { useEffect, useState } from "react";
import { useLocalStorage } from "./use-local-storage";

type Theme = "dark" | "light" | "system";

export function useTheme() {
  const [theme, setThemeState] = useLocalStorage<Theme>(
    "crm-theme",
    "system"
  );
  const [resolvedTheme, setResolvedTheme] = useState<"dark" | "light">();

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      if (theme === "system") {
        setResolvedTheme(mediaQuery.matches ? "dark" : "light");
      }
    };

    handleChange();
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme]);

  useEffect(() => {
    const resolved = theme === "system" 
      ? resolvedTheme 
      : theme;
    
    if (resolved === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme, resolvedTheme]);

  return {
    theme,
    resolvedTheme: theme === "system" ? resolvedTheme : theme,
    setTheme: setThemeState,
  };
}
