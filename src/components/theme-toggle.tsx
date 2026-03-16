"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { setTheme, theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  const hasInteracted = theme !== "system";

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const currentTheme = hasInteracted ? theme : resolvedTheme || "light";

  const handleToggle = () => {
    if (!hasInteracted) {
      const systemTheme = resolvedTheme || "light";
      setTheme(systemTheme === "dark" ? "light" : "dark");
    } else {
      setTheme(theme === "dark" ? "light" : "dark");
    }
  };

  if (!mounted) {
    return <Sun size={16} className="text-muted-foreground" />;
  }

  return (
    <button
      onClick={handleToggle}
      className="hover:text-foreground flex cursor-pointer items-center"
      title={
        currentTheme === "dark" ? "Switch to light mode" : "Switch to dark mode"
      }
    >
      {currentTheme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}
