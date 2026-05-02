import { Link } from "wouter";
import { useState } from "react";
import {
  Building2, Database, BarChart3, Globe, Sparkles, ArrowRight,
  Check, Star, ChevronLeft, ChevronRight, Menu, X,
  Eye, TrendingUp, Users, Zap
} from "lucide-react";

const AI_PLATFORMS = [
  { name: "ChatGPT", color: "#10A37F", bg: "#D1FAE5" },
  { name: "Perplexity", color: "#20808D", bg: "#CFFAFE" },
  { name: "Gemini", color: "#4285F4", bg: "#DBEAFE" },
  { name: "Copilot", color: "#0078D4", bg: "#E0F2FE" },
  { name: "Google SGE", color: "#EA4335", bg: "#FEE2E2" },
];

const STATS = [
  { icon: Building2, value: "50+", label: "Projects Onboarded" },
  { icon: Zap, value: "12.4K+", label: "API Calls Daily" },
  { icon: Star, value: "78/100", label: "Average AI Score" },
  { icon: Globe, value: "4+", label: "Cities Covered" },
];

const PROBLEMS = [
  {
    icon: "📄",
    title: "Unstructured Data",
    desc: "Brochures, PDFs, Excel sheets — useless for AI systems to parse and recommend.",
  },
  {
    icon: "👁️",
    title: "Zero AI Visibility",
    desc: "Your project doesn't appear in AI searches, comparisons, or shortlists.",
  },
  {
    icon: "📊",
    title: "No Standardization",
    desc: "No common data format means no ranking, no trust, no recommendation.",
  },
  {
    icon: "🎯",
    title: "Missed Opportunities",
    desc: "High-intent AI-driven buyers and investors never discover your project.",
  },
];

const STEPS = [
  { icon: Building2, step: "01", title: "Upload Your Data", desc: "Excel or manual project entry in minutes." },
  { icon: Database, step: "02", title: "We Structure It", desc: "Converted into clean, AI-readable data format." },
  { icon: BarChart3, step: "03", title: "AI Scores & Analyzes", desc: "Scored across 5 key decision dimensions." },
  { icon: Globe, step: "04", title: "Get API + AI Report", desc: "Machine-accessible endpoint + shareable report." },
  { icon: Sparkles, step: "05", title: "AI Discovers You", desc: "Your project becomes visible on all AI platforms." },
];

const SCORE_ITEMS = [
  { label: "Value Score", score: 80, color: "#22c55e" },
  { label: "Location Score", score: 78, color: "#22c55e" },
  { label: "Lifestyle Score", score: 75, color: "#eab308" },
  { label: "Investment Score", score: 89, color: "#22c55e" },
  { label: "Trust Score", score: 72, color: "#eab308" },
];

const DEVELOPER_LOGOS = ["LODHA", "KALPATARU", "Rustomjee", "Raymond Realty", "Sunteck", "MICL"];

const TESTIMONIALS = [
  {
    quote: "PropAgent OS helped us get AI-ready in just a few hours. We now show up in AI searches and get better quality inquiries.",
    name: "Marketing Head",
    title: "Leading Developer in Mumbai",
  },
  {
    quote: "The AI scorecard gave us clarity on where to improve. Our overall score jumped from 62 to 81 in 2 weeks.",
    name: "Sales Director",
    title: "Top Developer in Pune",
  },
  {
    quote: "Finally, our inventory is discoverable by AI agents. The API endpoint alone saved us weeks of integration work.",
    name: "CTO",
    title: "Proptech Startup, Bengaluru",
  },
];

function ScoreBar({ label, score, color }: { label: string; score: number; color: string }) {
  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="text-gray-600 w-36 text-right text-xs shrink-0">{label}</span>
      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all" style={{ width: `${score}%`, backgroundColor: color }} />
      </div>
      <span className="font-mono font-bold text-xs w-12" style={{ color }}>{score}/100</span>
    </div>
  );
}

export function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [testimonialIdx, setTestimonialIdx] = useState(0);

  return (
    <div className="min-h-screen font-sans text-gray-900 bg-white">
      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0B1F3A]/95 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#D4A843] flex items-center justify-center shrink-0">
              <BarChart3 className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="font-bold text-white text-[14px] leading-none">PropAgent OS</div>
              <div className="text-[8px] text-white/40 uppercase tracking-widest">AI-Ready Real Estate Intelligence</div>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-6 text-[13px] text-white/70">
            {["Product", "Solutions", "Pricing", "Resources", "About"].map(item => (
              <a key={item} href="#" className="hover:text-white transition-colors">{item}</a>
            ))}
          </div>

          <div className="hidden md:block">
            <Link href="/dashboard">
              <button className="px-4 py-2 text-[13px] font-semibold bg-[#D4A843] hover:bg-[#C49933] text-[#0B1F3A] rounded-md transition-colors">
                Get Free AI Audit
              </button>
            </Link>
          </div>

          <button className="md:hidden text-white p-1.5" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#0B1F3A] border-t border-white/10 px-4 pb-4 pt-2 space-y-3">
            {["Product", "Solutions", "Pricing", "Resources", "About"].map(item => (
              <a key={item} href="#" className="block text-white/70 hover:text-white text-sm">{item}</a>
            ))}
            <Link href="/dashboard">
              <button className="w-full px-4 py-2 text-[13px] font-semibold bg-[#D4A843] text-[#0B1F3A] rounded-md">
                Get Free AI Audit
              </button>
            </Link>
          </div>
        )}
      </nav>

      {/* HERO */}
      <section className="relative min-h-screen flex items-center pt-16 bg-[#0B1F3A] overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
        />
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0B1F3A] via-[#0B1F3A]/90 to-[#0B1F3A]/80" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0B1F3A] to-transparent" />
        {/* City skyline suggestion */}
        <div className="absolute bottom-0 right-0 w-1/2 h-3/4 opacity-20"
          style={{ background: "linear-gradient(to top left, #1a3a6b 0%, transparent 70%)" }}
        />

        {/* AI Platform badges */}
        <div className="absolute top-28 right-8 md:right-24 flex flex-col gap-3 opacity-0 md:opacity-100">
          {AI_PLATFORMS.map((p, i) => (
            <div
              key={p.name}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg border border-white/10"
              style={{
                backgroundColor: `${p.bg}15`,
                color: p.color,
                borderColor: `${p.color}30`,
                transform: `translateX(${i % 2 === 0 ? "0" : "20px"})`,
                backdropFilter: "blur(12px)",
              }}
            >
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
              {p.name}
            </div>
          ))}
        </div>

        <div className="relative max-w-6xl mx-auto px-4 py-20">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#D4A843]/10 border border-[#D4A843]/30 text-[#D4A843] text-xs font-medium mb-6">
              <div className="w-1.5 h-1.5 rounded-full bg-[#D4A843] animate-pulse" />
              Trusted by forward-thinking developers
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight">
              Make Your Projects<br />
              <span className="text-[#D4A843]">Discoverable by AI.</span><br />
              Get Recommended.
            </h1>

            <p className="mt-6 text-lg text-white/60 leading-relaxed max-w-xl">
              PropAgent OS converts your real estate data into AI-ready intelligence so AI agents can read, rank, and recommend your projects to the right buyers.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/projects/new">
                <button className="flex items-center gap-2 px-6 py-3 bg-[#D4A843] hover:bg-[#C49933] text-[#0B1F3A] font-bold text-sm rounded-md transition-colors shadow-lg">
                  Get Free AI Audit <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
              <Link href="/dashboard">
                <button className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold text-sm rounded-md transition-colors border border-white/20">
                  Book a Demo
                </button>
              </Link>
            </div>

            <p className="mt-4 text-xs text-white/30 flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-green-400" />
              Free AI Scorecard &nbsp;·&nbsp;
              <Check className="w-3.5 h-3.5 text-green-400" />
              No Credit Card Required &nbsp;·&nbsp;
              <Check className="w-3.5 h-3.5 text-green-400" />
              Results in 24 Hours
            </p>
          </div>
        </div>
      </section>

      {/* STATS STRIP */}
      <section className="bg-white border-b border-gray-100 py-10">
        <div className="max-w-4xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6">
          {STATS.map(({ icon: Icon, value, label }) => (
            <div key={label} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#0B1F3A]/5 flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5 text-[#0B1F3A]" />
              </div>
              <div>
                <div className="text-2xl font-bold text-[#0B1F3A] leading-none">{value}</div>
                <div className="text-xs text-gray-500 mt-0.5">{label}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PROBLEM SECTION */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="text-xs font-bold uppercase tracking-widest text-[#D4A843] mb-3">The Problem</div>
            <h2 className="text-3xl md:text-4xl font-bold text-[#0B1F3A] leading-tight">
              Why Your Project Isn't<br />Getting Found by AI
            </h2>
            <p className="mt-4 text-gray-500 max-w-xl mx-auto">
              You're spending crores on marketing—but AI systems still can't understand your project.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {PROBLEMS.map(({ icon, title, desc }) => (
              <div key={title} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="text-3xl mb-4">{icon}</div>
                <h3 className="font-bold text-[#0B1F3A] mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BIG SHIFT */}
      <section className="py-16 bg-[#0B1F3A]">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="text-xs font-bold uppercase tracking-widest text-[#D4A843] mb-3">The Big Shift</div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
            Search Is Dead.<br />AI Shortlisting Has Begun.
          </h2>
          <div className="grid md:grid-cols-2 gap-6 text-left max-w-2xl mx-auto">
            <div className="bg-white/5 rounded-xl p-5 border border-white/10">
              <div className="text-xs font-bold uppercase tracking-wider text-white/40 mb-3">Before</div>
              <div className="space-y-2 text-white/70 text-sm">
                {["Buyer", "Google", "Portals", "Site Visit", "Decision"].map((step, i) => (
                  <div key={step} className="flex items-center gap-2">
                    {i > 0 && <div className="w-3 h-px bg-white/20 shrink-0" />}
                    <span className={i === 0 ? "font-semibold text-white" : ""}>{step}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-[#D4A843]/10 rounded-xl p-5 border border-[#D4A843]/30">
              <div className="text-xs font-bold uppercase tracking-wider text-[#D4A843] mb-3">Now</div>
              <div className="space-y-2 text-white/70 text-sm">
                {["Buyer", "AI Agent", "Shortlist", "Decision"].map((step, i) => (
                  <div key={step} className="flex items-center gap-2">
                    {i > 0 && <div className="w-3 h-px bg-[#D4A843]/40 shrink-0" />}
                    <span className={i === 1 ? "font-semibold text-[#D4A843]" : i === 0 ? "font-semibold text-white" : ""}>{step}</span>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-xs text-[#D4A843]/80 font-medium">
                👉 If you're not in the AI shortlist, you don't exist.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SOLUTION SECTION */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-14">
            <div className="text-xs font-bold uppercase tracking-widest text-[#D4A843] mb-3">The Solution</div>
            <h2 className="text-3xl md:text-4xl font-bold text-[#0B1F3A]">
              The AI-Readiness Layer<br />for Real Estate
            </h2>
          </div>
          <div className="flex flex-col md:flex-row gap-3 items-start justify-between">
            {STEPS.map(({ icon: Icon, step, title, desc }, i) => (
              <div key={step} className="flex md:flex-col items-start md:items-center gap-4 md:gap-2 flex-1 text-left md:text-center">
                <div className="relative shrink-0">
                  <div className="w-14 h-14 rounded-2xl bg-[#0B1F3A] flex items-center justify-center">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-[#D4A843] flex items-center justify-center text-[9px] font-bold text-[#0B1F3A]">
                    {i + 1}
                  </div>
                </div>
                <div className="flex-1 md:flex-none">
                  <div className="font-bold text-[#0B1F3A] text-sm mt-1">{title}</div>
                  <div className="text-xs text-gray-500 mt-1 leading-relaxed">{desc}</div>
                </div>
                {i < STEPS.length - 1 && (
                  <div className="hidden md:block absolute right-0 top-7 text-gray-300 translate-x-1/2">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRODUCT SHOWCASE */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="text-xs font-bold uppercase tracking-widest text-[#D4A843] mb-3">See It In Action</div>
              <h2 className="text-3xl font-bold text-[#0B1F3A] mb-5">
                Here's How AI Sees Your Project
              </h2>
              <ul className="space-y-3 mb-8">
                {[
                  "AI Scorecard across 5 dimensions",
                  "AI-generated summary & highlights",
                  "Comparable positioning in market",
                  "API access for all AI agents & partners",
                  "Shareable report in one click",
                ].map(item => (
                  <li key={item} className="flex items-center gap-3 text-sm text-gray-700">
                    <div className="w-5 h-5 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 text-green-600" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/projects/new">
                <button className="flex items-center gap-2 px-5 py-2.5 bg-[#D4A843] hover:bg-[#C49933] text-[#0B1F3A] font-bold text-sm rounded-md transition-colors">
                  Get Your Free AI Audit <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
              <p className="mt-2 text-xs text-gray-400">Takes less than 2 minutes</p>
            </div>

            {/* Mock product card */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="bg-[#0B1F3A] px-4 py-3 flex items-center justify-between">
                <div>
                  <div className="text-white font-semibold text-sm">Nirvana Heights</div>
                  <div className="text-white/40 text-xs">Thane West, Mumbai · 2 & 3 BHK</div>
                </div>
                <div className="flex gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-red-400" />
                  <div className="w-2 h-2 rounded-full bg-yellow-400" />
                  <div className="w-2 h-2 rounded-full bg-green-400" />
                </div>
              </div>
              <div className="p-4 space-y-4">
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold mb-3">AI Scorecard</div>
                  <div className="flex items-center gap-4">
                    <div className="relative w-20 h-20 shrink-0">
                      <svg viewBox="0 0 80 80" className="rotate-[-90deg] w-full h-full">
                        <circle cx="40" cy="40" r="32" stroke="#f3f4f6" strokeWidth="7" fill="none" />
                        <circle cx="40" cy="40" r="32" stroke="#22c55e" strokeWidth="7" fill="none"
                          strokeDasharray={`${2 * Math.PI * 32}`}
                          strokeDashoffset={`${2 * Math.PI * 32 * (1 - 82 / 100)}`}
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-xl font-bold text-green-600">82</span>
                        <span className="text-[8px] text-gray-400">Overall</span>
                      </div>
                    </div>
                    <div className="flex-1 space-y-2">
                      {SCORE_ITEMS.map(s => (
                        <ScoreBar key={s.label} label={s.label} score={s.score} color={s.color} />
                      ))}
                    </div>
                  </div>
                  <div className="mt-3 text-[10px] text-green-700 font-semibold bg-green-50 rounded px-2 py-1 inline-block">
                    ✨ Excellent — Top 15% projects in your market
                  </div>
                </div>

                <div>
                  <div className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold mb-2">AI Summary</div>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Nirvana Heights offers excellent value for money in Thane West with well-designed 2 & 3 BHK homes...
                  </p>
                  <div className="mt-2 flex gap-1.5 flex-wrap">
                    {["Families", "End Users", "Long Term Investment"].map(tag => (
                      <span key={tag} className="text-[9px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">{tag}</span>
                    ))}
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-3">
                  <div className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold mb-2">API Endpoint</div>
                  <div className="flex items-center gap-2 bg-gray-50 rounded px-2 py-1.5 font-mono text-[10px]">
                    <span className="text-green-700 font-bold border border-green-200 bg-green-50 px-1 rounded text-[8px]">GET</span>
                    <span className="text-blue-600 truncate">https://api-propagentos.com/v1/public/project/nh12345</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DEVELOPER LOGOS */}
      <section className="py-12 bg-white border-y border-gray-100">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center text-xs font-bold uppercase tracking-widest text-gray-400 mb-8">
            Trusted by Leading Developers
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
            {DEVELOPER_LOGOS.map(logo => (
              <div key={logo} className="text-gray-400 font-bold text-sm tracking-wide hover:text-gray-600 transition-colors">
                {logo}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VALUE PROPS */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="text-xs font-bold uppercase tracking-widest text-[#D4A843] mb-3">Why Choose Us</div>
            <h2 className="text-3xl font-bold text-[#0B1F3A]">Why Developers Choose PropAgent OS</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: Eye, title: "Higher Visibility", desc: "Get discovered in AI-driven searches and recommendation engines.", color: "bg-blue-50 text-blue-600" },
              { icon: Users, title: "Better Leads", desc: "AI filters and delivers high-intent buyers to your project.", color: "bg-green-50 text-green-600" },
              { icon: TrendingUp, title: "Faster Sales", desc: "AI shortlisting means shorter decision cycles and faster closings.", color: "bg-amber-50 text-amber-600" },
              { icon: Sparkles, title: "Future-Proof", desc: "Stay ahead of the market shift to AI-first property discovery.", color: "bg-purple-50 text-purple-600" },
            ].map(({ icon: Icon, title, desc, color }) => (
              <div key={title} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
                <div className={`w-10 h-10 rounded-lg ${color} flex items-center justify-center mb-4`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-[#0B1F3A] mb-1.5">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-20 bg-[#0B1F3A]">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="text-xs font-bold uppercase tracking-widest text-[#D4A843] mb-10">What Developers Say</div>

          <div className="relative min-h-[160px]">
            <div className="text-5xl text-[#D4A843]/20 font-serif leading-none mb-4">"</div>
            <p className="text-lg md:text-xl text-white/90 leading-relaxed font-medium">
              {TESTIMONIALS[testimonialIdx].quote}
            </p>
            <div className="mt-6 text-sm text-white/50">
              <span className="font-semibold text-white/80">{TESTIMONIALS[testimonialIdx].name}</span>
              {" — "}{TESTIMONIALS[testimonialIdx].title}
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={() => setTestimonialIdx((i) => (i - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)}
              className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-white/40 hover:text-white hover:border-white/40 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="flex gap-1.5">
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setTestimonialIdx(i)}
                  className={`w-1.5 h-1.5 rounded-full transition-colors ${i === testimonialIdx ? "bg-[#D4A843]" : "bg-white/20"}`}
                />
              ))}
            </div>
            <button
              onClick={() => setTestimonialIdx((i) => (i + 1) % TESTIMONIALS.length)}
              className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-white/40 hover:text-white hover:border-white/40 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-20 bg-gradient-to-br from-[#0B1F3A] to-[#142d52] relative overflow-hidden">
        <div className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "30px 30px",
          }}
        />
        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Don't Let Your Project Be Invisible to AI.
          </h2>
          <p className="text-xl text-[#D4A843] font-semibold mb-6">
            Get Your Free AI Audit Now.
          </p>
          <p className="text-white/50 mb-8 max-w-xl mx-auto">
            In the next 24 months, AI will decide what gets sold. Make sure your project is one of them.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/projects/new">
              <button className="flex items-center gap-2 px-7 py-3.5 bg-[#D4A843] hover:bg-[#C49933] text-[#0B1F3A] font-bold rounded-md transition-colors shadow-lg text-sm">
                Get Free AI Audit <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
            <Link href="/dashboard">
              <button className="flex items-center gap-2 px-7 py-3.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-md transition-colors border border-white/20 text-sm">
                Book a Demo
              </button>
            </Link>
          </div>
          <div className="mt-6 flex items-center justify-center gap-4 text-xs text-white/30 flex-wrap">
            <span className="flex items-center gap-1.5"><Check className="w-3 h-3 text-green-400" /> Free AI Scorecard</span>
            <span className="flex items-center gap-1.5"><Check className="w-3 h-3 text-green-400" /> No Credit Card Required</span>
            <span className="flex items-center gap-1.5"><Check className="w-3 h-3 text-green-400" /> Results in 24 Hours</span>
          </div>
          <div className="mt-4 flex items-center justify-center gap-1 text-xs text-white/20">
            Join 50+ developers growing with AI
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#060F1E] py-10">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-start justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded bg-[#D4A843] flex items-center justify-center">
                  <BarChart3 className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="text-white font-bold text-sm">PropAgent OS</span>
              </div>
              <p className="text-white/30 text-xs max-w-xs">AI-Ready Real Estate Intelligence for forward-thinking developers.</p>
            </div>
            <div className="flex gap-8 text-xs text-white/40">
              {["Product", "Solutions", "Pricing", "Privacy Policy", "Terms"].map(item => (
                <a key={item} href="#" className="hover:text-white/70 transition-colors">{item}</a>
              ))}
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-3">
            <p className="text-white/20 text-xs">© 2024 PropAgent OS. All rights reserved.</p>
            <div className="flex gap-3 text-white/20 text-xs">
              <a href="#" className="hover:text-white/40 transition-colors">LinkedIn</a>
              <a href="#" className="hover:text-white/40 transition-colors">Twitter / X</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
