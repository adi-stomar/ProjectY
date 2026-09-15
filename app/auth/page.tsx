'use client'

import React, { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { login, signup } from './actions'
import { GraduationCap, ArrowRight, UserPlus, ArrowLeft, CheckCircle2, Loader2 } from 'lucide-react'
import { useSearchParams } from 'next/navigation'

function AuthContent() {
  const searchParams = useSearchParams()
  const initialMode = searchParams.get('mode') === 'signup' ? 'signup' : 'login'
  const message = searchParams.get('message')

  const [mode, setMode] = useState<'login' | 'signup'>(initialMode)

  useEffect(() => {
    const urlMode = searchParams.get('mode')
    if (urlMode === 'signup' || urlMode === 'login') {
      setMode(urlMode)
    }
  }, [searchParams])

  return (
    <div 
      className="min-h-screen flex flex-col justify-center items-center p-4 relative text-slate-900"
      style={{
        backgroundImage: `linear-gradient(rgba(235, 243, 255, 0.93), rgba(239, 246, 255, 0.95)), url('/bg-doodles.png?v=2')`,
        backgroundSize: '550px auto',
        backgroundRepeat: 'repeat',
      }}
    >
      {/* Top back button */}
      <div className="absolute top-6 left-6 z-20">
        <Link 
          href="/login" 
          className="inline-flex items-center gap-2 py-2 px-4 rounded-xl bg-white/90 hover:bg-white text-blue-950 font-bold text-xs border border-blue-200/80 shadow-xs transition hover:-translate-x-0.5"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-blue-600" />
          <span>Back to Overview</span>
        </Link>
      </div>

      {/* Auth Card */}
      <div className="w-full max-w-md bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl shadow-blue-900/15 border-2 border-blue-200/80 p-8 sm:p-10 relative z-10 my-8">
        
        {/* Header Branding */}
        <div className="flex flex-col items-center justify-center text-center mb-6">
          <div className="w-14 h-14 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mb-3 shadow-lg shadow-blue-500/30 ring-4 ring-blue-100">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-blue-950 tracking-tight">JEE Prep AI</h1>
          <span className="text-[10px] uppercase font-bold bg-blue-100 text-blue-700 border border-blue-200 px-2.5 py-0.5 rounded-full mt-1.5">
            Mains & Advanced
          </span>
        </div>

        {/* Tab Switcher: Sign In vs Sign Up */}
        <div className="grid grid-cols-2 gap-1 p-1 bg-blue-900/10 rounded-xl border border-blue-200/80 mb-6">
          <button
            type="button"
            onClick={() => setMode('login')}
            className={`py-2 rounded-lg text-xs font-bold transition ${
              mode === 'login'
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30'
                : 'text-blue-950 hover:bg-blue-100/60'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setMode('signup')}
            className={`py-2 rounded-lg text-xs font-bold transition ${
              mode === 'signup'
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30'
                : 'text-blue-950 hover:bg-blue-100/60'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Status / Error Message */}
        {message && (
          <div className="mb-5 p-3.5 bg-blue-50/90 border border-blue-200 text-blue-900 text-xs rounded-xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
            <span className="font-medium">{decodeURIComponent(message)}</span>
          </div>
        )}

        {/* Form */}
        <form className="flex flex-col gap-3.5">
          {mode === 'signup' && (
            <>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-blue-950 uppercase tracking-wider" htmlFor="full_name">
                  Full Name
                </label>
                <input
                  id="full_name"
                  className="w-full px-4 py-2.5 bg-blue-50/40 border-2 border-blue-200/80 rounded-xl text-sm focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-500/15 transition text-slate-800 placeholder:text-slate-400 font-medium"
                  name="full_name"
                  type="text"
                  placeholder="e.g. Aditya Sharma"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-blue-950 uppercase tracking-wider" htmlFor="phone_number">
                    Phone Number
                  </label>
                  <input
                    id="phone_number"
                    className="w-full px-4 py-2.5 bg-blue-50/40 border-2 border-blue-200/80 rounded-xl text-sm focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-500/15 transition text-slate-800 placeholder:text-slate-400 font-medium"
                    name="phone_number"
                    type="tel"
                    placeholder="+91 98765 43210"
                    required
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-blue-950 uppercase tracking-wider" htmlFor="target_class">
                    Current Class
                  </label>
                  <select
                    id="target_class"
                    name="target_class"
                    defaultValue="Class 12"
                    className="w-full px-3 py-2.5 bg-blue-50/40 border-2 border-blue-200/80 rounded-xl text-sm focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-500/15 transition text-slate-800 font-medium cursor-pointer"
                  >
                    <option value="Class 11">Class 11</option>
                    <option value="Class 12">Class 12</option>
                    <option value="Dropper / Repeater">Dropper / Repeater</option>
                  </select>
                </div>
              </div>
            </>
          )}

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-blue-950 uppercase tracking-wider" htmlFor="email">
              Email Address
            </label>
            <input
              id="email"
              className="w-full px-4 py-2.5 bg-blue-50/40 border-2 border-blue-200/80 rounded-xl text-sm focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-500/15 transition text-slate-800 placeholder:text-slate-400 font-medium"
              name="email"
              type="email"
              placeholder="student@jeeprep.com"
              required
            />
          </div>
          
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-blue-950 uppercase tracking-wider" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              className="w-full px-4 py-2.5 bg-blue-50/40 border-2 border-blue-200/80 rounded-xl text-sm focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-500/15 transition text-slate-800 placeholder:text-slate-400 font-medium"
              name="password"
              type="password"
              placeholder="••••••••"
              required
            />
          </div>

          <div className="mt-2">
            {mode === 'login' ? (
              <button
                formAction={login}
                className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-blue-600/30 hover:shadow-xl transition text-sm flex items-center justify-center gap-2"
              >
                <span>Sign In to Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                formAction={signup}
                className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-blue-600/30 hover:shadow-xl transition text-sm flex items-center justify-center gap-2"
              >
                <UserPlus className="w-4 h-4" />
                <span>Create Student Account</span>
              </button>
            )}
          </div>
        </form>

        {/* Toggle Mode Footer */}
        <div className="mt-6 pt-4 border-t border-blue-100/80 text-center">
          {mode === 'login' ? (
            <p className="text-xs text-slate-500 font-medium">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => setMode('signup')}
                className="text-blue-600 hover:text-blue-800 font-bold underline transition"
              >
                Sign up free
              </button>
            </p>
          ) : (
            <p className="text-xs text-slate-500 font-medium">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-blue-600 hover:text-blue-800 font-bold underline transition"
              >
                Sign in here
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default function AuthPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-blue-50">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    }>
      <AuthContent />
    </Suspense>
  )
}

