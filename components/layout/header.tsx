"use client";

import { useAuth } from "@/context/auth-context";
import { useTheme } from "@/context/theme-context";
import { COMPANY_NAME } from "@/lib/constants";
import { LogOut, Moon, Sun } from "lucide-react";

export function Header() {
  const { user, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();

  const roleLabel = user?.role === "admin" ? "Admin Portal" : "Customer Portal";

  return (
    <header className="sticky top-0 z-30 flex justify-between items-center px-6 py-4 bg-card/80 backdrop-blur-lg border-b border-border shadow-sm">
      <div className="flex items-center gap-3">
        <img 
          src="/assets/logo.jpg" 
          alt={`${COMPANY_NAME} Logo`}
          className="w-10 h-10 rounded-xl object-cover"
        />
        <div>
          <h1 className="text-xl font-black bg-gradient-to-r from-[#003366] to-[#00AEEF] bg-clip-text text-transparent">
            {COMPANY_NAME}
          </h1>
          <p className="text-xs text-muted-foreground font-medium">{roleLabel}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={toggleDarkMode}
          className="p-2.5 rounded-xl bg-muted hover:bg-accent transition-colors"
          aria-label="Toggle dark mode"
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        <button
          onClick={logout}
          className="p-2.5 rounded-xl bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
          aria-label="Logout"
        >
          <LogOut size={20} />
        </button>
      </div>
    </header>
  );
}
