import { useState } from "react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { BarChart3, Eye, EyeOff, Check } from "lucide-react";

export function Register() {
  const { register } = useAuth();
  const [, navigate] = useLocation();
  const [form, setForm] = useState({ name: "", email: "", company: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function update(field: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm(prev => ({ ...prev, [field]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    setIsLoading(true);
    try {
      await register(form.name, form.email, form.password, form.company || undefined);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message ?? "Registration failed");
    } finally {
      setIsLoading(false);
    }
  }

  const passwordStrength = form.password.length === 0 ? null
    : form.password.length < 8 ? "weak"
    : form.password.length < 12 ? "medium"
    : "strong";

  return (
    <div className="min-h-screen bg-[#0B1F3A] flex items-center justify-center p-4">
      <div className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="relative w-full max-w-sm"
      >
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-[#D4A843] flex items-center justify-center mb-3">
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">PropAgent OS</h1>
          <p className="text-white/40 text-xs mt-0.5 uppercase tracking-widest">AI Real Estate Intelligence</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-7 backdrop-blur-sm">
          <h2 className="text-white font-semibold text-lg mb-1">Create your account</h2>
          <p className="text-white/40 text-sm mb-6">Get your free AI audit in minutes</p>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-white/50 font-medium mb-1.5 uppercase tracking-wider">Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={update("name")}
                  placeholder="Amit Sharma"
                  required
                  className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/20 text-sm focus:outline-none focus:border-[#D4A843]/60 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs text-white/50 font-medium mb-1.5 uppercase tracking-wider">Company</label>
                <input
                  type="text"
                  value={form.company}
                  onChange={update("company")}
                  placeholder="Prestige Group"
                  className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/20 text-sm focus:outline-none focus:border-[#D4A843]/60 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-white/50 font-medium mb-1.5 uppercase tracking-wider">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={update("email")}
                placeholder="amit@prestige.com"
                required
                className="w-full px-3.5 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/20 text-sm focus:outline-none focus:border-[#D4A843]/60 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs text-white/50 font-medium mb-1.5 uppercase tracking-wider">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={update("password")}
                  placeholder="Min. 8 characters"
                  required
                  className="w-full px-3.5 py-2.5 pr-10 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/20 text-sm focus:outline-none focus:border-[#D4A843]/60 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {passwordStrength && (
                <div className="mt-1.5 flex items-center gap-2">
                  <div className="flex gap-1">
                    {["weak", "medium", "strong"].map((level, i) => (
                      <div
                        key={level}
                        className={`h-1 w-8 rounded-full transition-colors ${
                          passwordStrength === "weak" && i === 0 ? "bg-red-500"
                          : passwordStrength === "medium" && i <= 1 ? "bg-yellow-500"
                          : passwordStrength === "strong" ? "bg-green-500"
                          : "bg-white/10"
                        }`}
                      />
                    ))}
                  </div>
                  <span className={`text-[10px] font-medium capitalize ${
                    passwordStrength === "weak" ? "text-red-400"
                    : passwordStrength === "medium" ? "text-yellow-400"
                    : "text-green-400"
                  }`}>
                    {passwordStrength}
                  </span>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 bg-[#D4A843] hover:bg-[#C49933] disabled:opacity-60 text-[#0B1F3A] font-bold text-sm rounded-lg transition-colors mt-1"
            >
              {isLoading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <div className="mt-4 space-y-1.5">
            {["Free AI Scorecard included", "No credit card required", "Results in 24 hours"].map(item => (
              <div key={item} className="flex items-center gap-2 text-xs text-white/30">
                <Check className="w-3 h-3 text-green-500 shrink-0" />
                {item}
              </div>
            ))}
          </div>

          <div className="mt-5 pt-4 border-t border-white/10 text-center">
            <p className="text-white/30 text-sm">
              Already have an account?{" "}
              <Link href="/login" className="text-[#D4A843] hover:text-[#C49933] font-medium transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-4 text-center">
          <Link href="/" className="text-white/20 hover:text-white/40 text-xs transition-colors">
            ← Back to home
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
