"use client";

import { AuthProvider } from "@/context/auth-context";
import { ThemeProvider } from "@/context/theme-context";
import { StoreProvider } from "@/context/store-context";
import { AppContent } from "@/components/app-content";

export default function Home() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <StoreProvider>
          <AppContent />
        </StoreProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}
