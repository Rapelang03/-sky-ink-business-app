"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/auth-context";
import { LoginForm } from "@/components/auth/login-form";
import { Header } from "@/components/layout/header";
import { AdminDashboard } from "@/components/admin/admin-dashboard";
import { CustomerDashboard } from "@/components/customer/customer-dashboard";

export function AppContent() {
  const { user, isAdmin, isCustomer } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // During SSR and first client render, show same LoginForm as server
  if (!mounted) {
    return <LoginForm />;
  }

  // After hydration, check actual auth state
  if (!user) {
    return <LoginForm />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="p-6 md:p-10 max-w-7xl mx-auto">
        {isAdmin && <AdminDashboard />}
        {isCustomer && <CustomerDashboard />}
      </main>
    </div>
  );
}