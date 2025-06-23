"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "../ui/sidebar";

function Header() {
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="border-sidebar-accent bg-sidebar sticky top-0 z-49 flex items-center justify-between gap-2 border-b px-5 py-3">
      <SidebarTrigger />
      <h1 className="text-xl font-semibold">Bodo2</h1>

      <div className="flex-1" />

      <div className="flex items-center gap-4">
        {mounted && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? (
              <Sun className="size-5 text-yellow-300" />
            ) : (
              <Moon className="size-5" />
            )}
          </Button>
        )}
      </div>
    </header>
  );
}

export { Header };
