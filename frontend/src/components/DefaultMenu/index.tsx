import { Search, SunIcon, MoonIcon } from "lucide-react";
import { useTheme } from "../ThemeProvider";

export function DefaultMenu() {
  const { theme, changeTheme } = useTheme();

  const NextThemeIcon = {
    light: <MoonIcon className="w-5 h-5" />,
    dark: <SunIcon className="w-5 h-5" />,
    system:
      theme === "dark" ? (
        <MoonIcon className="w-5 h-5" />
      ) : (
        <SunIcon className="w-5 h-5" />
      ),
  };

  return (
    <header className="h-[81px] flex items-center justify-between px-6 bg-background dark:bg-[#18181B] border-b border-border dark:border-[#27272A]">
      {/* Search bar */}
      <div className="relative flex-1 max-w-2xl">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#71717B] dark:text-[#71717B] pointer-events-none" />
        <input
          type="text"
          placeholder="Buscar questões por tema, palavra-chave ou matéria..."
          className="w-full h-[42px] bg-input dark:bg-[#27272A] border border-border dark:border-[#3F3F47] rounded-[10px] pl-12 pr-4 text-sm text-foreground dark:placeholder:text-[#71717B] placeholder:text-muted-foreground focus:outline-none focus:ring-0 focus:border-[#51A2FF] dark:focus:border-[#51A2FF] transition-colors"
        />
      </div>

      {/* Theme toggle */}
      <button
        onClick={changeTheme}
        aria-label="Alternar tema"
        className="ml-4 w-10 h-10 flex items-center justify-center bg-input dark:bg-[#27272A] rounded-[10px] text-muted-foreground dark:text-[#9F9FA9] hover:text-foreground dark:hover:text-white transition-colors shrink-0"
      >
        {NextThemeIcon[theme]}
      </button>
    </header>
  );
}
