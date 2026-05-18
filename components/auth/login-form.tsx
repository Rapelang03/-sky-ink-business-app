"use client";

import { useState } from "react";
import { useAuth } from "@/context/auth-context";
import { COMPANY_NAME, COMPANY_TAGLINE, DEMO_CREDENTIALS } from "@/lib/constants";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    const success = login(email, password);
    if (!success) {
      setError("Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#003366] to-[#00AEEF] p-4">
      <div className="bg-card text-card-foreground rounded-2xl shadow-xl w-full max-w-md p-8">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-[#00AEEF] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-white font-black text-3xl italic">S</span>
          </div>
          <h1 className="text-3xl font-black text-[#003366] dark:text-[#00AEEF] tracking-tight">
            {COMPANY_NAME}
          </h1>
          <p className="text-muted-foreground mt-1">{COMPANY_TAGLINE}</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-xl text-destructive text-sm text-center">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3.5 bg-muted border border-input rounded-xl focus:ring-2 focus:ring-[#00AEEF] focus:border-transparent outline-none transition-all"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3.5 bg-muted border border-input rounded-xl focus:ring-2 focus:ring-[#00AEEF] focus:border-transparent outline-none transition-all"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-[#00AEEF] hover:bg-[#0095cc] text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-200"
          >
            Sign In
          </button>
        </form>

        {/* Demo Credentials */}
        <div className="mt-8 p-4 bg-muted rounded-xl">
          <p className="text-xs text-center text-muted-foreground font-medium mb-3 uppercase tracking-wide">
            Demo Credentials
          </p>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between items-center p-2 bg-card rounded-lg">
              <span className="font-semibold text-[#003366] dark:text-[#00AEEF]">Admin</span>
              <span className="text-muted-foreground text-xs">
                {DEMO_CREDENTIALS.admin.email} / {DEMO_CREDENTIALS.admin.password}
              </span>
            </div>
            <div className="flex justify-between items-center p-2 bg-card rounded-lg">
              <span className="font-semibold text-[#003366] dark:text-[#00AEEF]">Customer</span>
              <span className="text-muted-foreground text-xs">
                {DEMO_CREDENTIALS.customer.email} / {DEMO_CREDENTIALS.customer.password}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
