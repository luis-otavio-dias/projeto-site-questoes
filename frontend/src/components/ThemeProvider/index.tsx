import { useEffect, useState } from "react";
import { ThemeProviderContext } from "./context";
import type { Theme, ThemeProviderProps } from "./context";

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "storaged-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  );

  useEffect(() => {
    const root = window.document.documentElement;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const applyTheme = () => {
      root.classList.remove("light", "dark");
      root.classList.add(theme === "system" ? (media.matches ? "dark" : "light") : theme);
    };
    applyTheme();
    if (theme === "system") {
      media.addEventListener("change", applyTheme);
      return () => media.removeEventListener("change", applyTheme);
    }
  }, [theme]);

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme);
      setTheme(theme);
    },
    changeTheme: () => {
      setTheme((prevTheme) => {
        const isDark = prevTheme === "dark" || (prevTheme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
        const nextTheme = isDark ? "light" : "dark";
        localStorage.setItem(storageKey, nextTheme);
        return nextTheme;
      });
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}
