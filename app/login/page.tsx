import { GraduationCap, ArrowRight, UserPlus, Sparkles, FileQuestion, CheckSquare, Zap, ShieldCheck, Award } from 'lucide-react'

export default function LoginPage() {
  return (
    <div 
      className="min-h-screen flex flex-col relative scroll-smooth text-slate-900"
      style={{
        backgroundImage: `linear-gradient(rgba(235, 243, 255, 0.93), rgba(239, 246, 255, 0.95)), url('/bg-doodles.png?v=2')`,
        backgroundSize: '550px auto',
        backgroundRepeat: 'repeat',
      }}
    >
      {/* 1. TOP HEADER / NAVBAR */}
      <header className="sticky top-0 z-50 bg-gradient-to-r from-blue-950 via-indigo-950 to-slate-900 text-white border-b border-blue-900/60 shadow-md backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/30 ring-2 ring-blue-400/30">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg font-extrabold text-white tracking-tight flex items-center gap-2">
                JEE Prep AI
                <span className="text-[10px] uppercase font-bold bg-blue-500/30 text-blue-200 border border-blue-400/40 px-2 py-0.5 rounded-full">
                  Mains & Advanced
                </span>
              </h1>
            </div>
          </div>

          {/* Top Auth Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <a 
              href="/auth?mode=signup"
              className="py-2 px-3.5 sm:px-4 text-xs sm:text-sm font-bold text-blue-200 hover:text-white hover:bg-blue-900/40 rounded-xl transition"
            >
              Sign Up
            </a>
            <a 
              href="/auth?mode=login"
              className="py-2 px-4 sm:px-5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-md shadow-blue-600/30 hover:shadow-lg transition text-xs sm:text-sm flex items-center gap-1.5 border border-blue-400/30 ring-1 ring-white/10"
            >
              <span>Login</span>
              <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </a>
          </div>
        </div>
      </header>

      {/* 2. HERO SECTION */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-12 pb-16 text-center">
        <div className="inline-flex items-center gap-2 bg-blue-100 border border-blue-200 text-blue-800 text-xs font-bold px-3.5 py-1.5 rounded-full uppercase tracking-wider mb-6 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" /> Complete AI Ecosystem for IIT-JEE Aspirants
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-blue-950 tracking-tight leading-tight max-w-4xl mx-auto">
          Master JEE with Instant <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">AI Tutoring</span> & Real Exam Simulations
        </h1>

        <p className="mt-6 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto font-medium leading-relaxed">
          Snap a photo of any tough question for step-by-step LaTeX solutions, take randomized 30-minute CBT chapter tests, and track your official syllabus readiness in real time.
        </p>

        {/* Hero CTAs */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="/auth?mode=signup"
            className="w-full sm:w-auto py-3.5 px-8 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-blue-600/30 hover:shadow-xl hover:-translate-y-0.5 transition text-base flex items-center justify-center gap-2"
          >
            Start Preparing Now <ArrowRight className="w-5 h-5" />
          </a>
          <a
            href="#features"
            className="w-full sm:w-auto py-3.5 px-8 bg-white/90 hover:bg-white border-2 border-blue-200 text-blue-900 font-bold rounded-xl shadow-xs hover:border-blue-300 transition text-base"
          >
            Explore 3 Core Modules
          </a>
        </div>

        {/* Stats Row */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
          <div className="bg-white/90 backdrop-blur-xs p-4 rounded-2xl border border-blue-200/80 shadow-xs">
            <div className="text-2xl font-black text-blue-600">24/7</div>
            <div className="text-xs text-slate-600 font-semibold mt-0.5">Multimodal AI Tutor</div>
          </div>
          <div className="bg-white/90 backdrop-blur-xs p-4 rounded-2xl border border-blue-200/80 shadow-xs">
            <div className="text-2xl font-black text-blue-600">+4 / -1</div>
            <div className="text-xs text-slate-600 font-semibold mt-0.5">Official NTA Marking</div>
          </div>
          <div className="bg-white/90 backdrop-blur-xs p-4 rounded-2xl border border-blue-200/80 shadow-xs">
            <div className="text-2xl font-black text-blue-600">100+ Topics</div>
            <div className="text-xs text-slate-600 font-semibold mt-0.5">Granular Syllabus</div>
          </div>
          <div className="bg-white/90 backdrop-blur-xs p-4 rounded-2xl border border-blue-200/80 shadow-xs">
            <div className="text-2xl font-black text-blue-600">3 Modes</div>
            <div className="text-xs text-slate-600 font-semibold mt-0.5">Solution, Hint, 30s Trick</div>
          </div>
        </div>
      </section>

      {/* 3. APPLICATION SHOWCASE & FEATURES SECTION */}
      <section id="features" className="max-w-6xl mx-auto px-4 sm:px-6 py-12 scroll-mt-20">
        <div className="text-center mb-12">
          <span className="text-xs font-bold text-blue-700 uppercase tracking-wider bg-blue-100 px-3 py-1 rounded-full">
            All-In-One Toolkit
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-blue-950 mt-3">
            Designed Exclusively for JEE Aspirants
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-2 max-w-2xl mx-auto">
            Everything you need to boost your percentile—from conceptual clarity to exam endurance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: AI Doubt Solver */}
          <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 border-2 border-blue-200/80 shadow-xl shadow-blue-900/5 hover:-translate-y-1 transition duration-300 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 mb-5 shadow-xs">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-blue-950 mb-2">Multimodal AI Doubt Solver</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                Snap or paste screenshot diagrams of circuits, complex coordinate geometry, or organic reactions. Receive instant, step-by-step LaTeX formulas with clear explanations.
              </p>
              <ul className="space-y-2 text-xs text-slate-700 font-medium border-t border-blue-100 pt-4">
                <li className="flex items-center gap-2">
                  <Zap className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span><strong>3 Pedagogical Modes:</strong> Full Solution, Progressive Hint, or 30s Exam Shortcut</span>
                </li>
                <li className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>Automatic model fallback ensures zero downtime</span>
                </li>
              </ul>
            </div>
            <div className="mt-6 pt-4 border-t border-blue-50">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wide">Module 01 • Instant Help</span>
            </div>
          </div>

          {/* Card 2: Chapter-Wise Quiz */}
          <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 border-2 border-blue-200/80 shadow-xl shadow-blue-900/5 hover:-translate-y-1 transition duration-300 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 mb-5 shadow-xs">
                <FileQuestion className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-blue-950 mb-2">NTA-Style CBT Simulator</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                Practice 10 randomized questions in 30 minutes. Features an authentic NTA palette (answered, review, unattempted) and official +4 / -1 scoring.
              </p>
              <ul className="space-y-2 text-xs text-slate-700 font-medium border-t border-blue-100 pt-4">
                <li className="flex items-center gap-2">
                  <Award className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                  <span>Instant detailed scorecard and question-by-question review</span>
                </li>
                <li className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                  <span>Real past JEE Mains questions with verified solutions</span>
                </li>
              </ul>
            </div>
            <div className="mt-6 pt-4 border-t border-blue-50">
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-wide">Module 02 • Exam Speed</span>
            </div>
          </div>

          {/* Card 3: Granular Syllabus Tracker */}
          <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 border-2 border-blue-200/80 shadow-xl shadow-blue-900/5 hover:-translate-y-1 transition duration-300 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 mb-5 shadow-xs">
                <CheckSquare className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-blue-950 mb-2">Granular Syllabus Tracker</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                Never lose track of your progress. Track subtopics across Class 11 & 12 Physics, Chemistry, and Mathematics with a live Exam Readiness meter.
              </p>
              <ul className="space-y-2 text-xs text-slate-700 font-medium border-t border-blue-100 pt-4">
                <li className="flex items-center gap-2">
                  <Award className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>Dynamic readiness score calculates preparedness %</span>
                </li>
                <li className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>Subject-wise completion bars and subtopic checklists</span>
                </li>
              </ul>
            </div>
            <div className="mt-6 pt-4 border-t border-blue-50">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wide">Module 03 • Progress</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. BOTTOM CTA BANNER */}
      <section className="max-w-5xl mx-auto w-full px-4 sm:px-6 pt-6 pb-20">
        <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 rounded-3xl p-8 sm:p-12 text-white border border-blue-800/60 shadow-2xl shadow-blue-950/20 text-center relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">Ready to Elevate Your JEE Percentile?</h2>
            <p className="text-blue-200/80 text-sm sm:text-base mt-2 font-medium">
              Join thousands of aspirants solving doubts instantly and building exam stamina.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href="/auth?mode=signup"
                className="w-full sm:w-auto py-3 px-8 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg shadow-blue-600/30 transition text-sm flex items-center justify-center gap-2 ring-2 ring-blue-400/40"
              >
                <UserPlus className="w-4 h-4" /> Create Free Account
              </a>
              <a
                href="/auth?mode=login"
                className="w-full sm:w-auto py-3 px-8 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl border border-white/20 transition text-sm flex items-center justify-center gap-2"
              >
                Sign In to Dashboard <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FOOTER */}
      <footer className="border-t border-blue-200/80 bg-white/70 backdrop-blur-xs py-6 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-4">
          <p>© {new Date().getFullYear()} JEE Prep AI • Built for IIT-JEE Aspirants.</p>
        </div>
      </footer>
    </div>
  )
}
