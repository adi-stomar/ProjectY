'use client';

import React, { useState, useEffect } from 'react';
import { AiTutor } from '@/components/AiTutor';
import { ChapterQuiz } from '@/components/ChapterQuiz';
import { SyllabusTracker } from '@/components/SyllabusTracker';
import { MessageSquare, FileQuestion, CheckSquare, GraduationCap, LogOut, Phone, BookOpen, Target, User, ChevronDown } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

interface UserProfile {
  id?: string;
  full_name?: string;
  phone_number?: string;
  target_class?: string;
  target_exam?: string;
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<'chat' | 'quiz' | 'syllabus'>('chat');
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (user) {
        // Query profiles table
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profileData) {
          setProfile(profileData);
        } else {
          // Fallback to user metadata
          setProfile({
            full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Student',
            phone_number: user.user_metadata?.phone_number || '+91 98765 43210',
            target_class: user.user_metadata?.target_class || 'Class 12',
            target_exam: user.user_metadata?.target_exam || 'JEE Main & Advanced',
          });
        }
      }
    };
    fetchUserData();
  }, [supabase]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  return (
    <main className="h-[100dvh] bg-blue-50/40 flex flex-col overflow-hidden">
      {/* Top Header / Navigation Bar - Blue Theme */}
      <header className="bg-gradient-to-r from-blue-950 via-indigo-950 to-slate-900 text-white border-b border-blue-900/60 z-50 shadow-md shrink-0">
        <div className="w-full px-4 sm:px-6 py-3 flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Logo & Branding */}
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

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-1.5 bg-blue-900/40 p-1 rounded-xl border border-blue-800/60 backdrop-blur-xs">
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition ${
                activeTab === 'chat'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 ring-1 ring-blue-400/40'
                  : 'text-blue-200 hover:text-white hover:bg-blue-800/40'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>AI Doubt Solver</span>
            </button>

            <button
              onClick={() => setActiveTab('quiz')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition ${
                activeTab === 'quiz'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 ring-1 ring-blue-400/40'
                  : 'text-blue-200 hover:text-white hover:bg-blue-800/40'
              }`}
            >
              <FileQuestion className="w-4 h-4" />
              <span>Chapter Quiz (60m)</span>
            </button>

            <button
              onClick={() => setActiveTab('syllabus')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition ${
                activeTab === 'syllabus'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 ring-1 ring-blue-400/40'
                  : 'text-blue-200 hover:text-white hover:bg-blue-800/40'
              }`}
            >
              <CheckSquare className="w-4 h-4" />
              <span>Syllabus Tracker</span>
            </button>
          </nav>
          
          {user && (
            <div className="relative flex items-center">
              <button
                onClick={() => setShowProfileModal(!showProfileModal)}
                className="flex items-center gap-2.5 py-1.5 px-3 rounded-xl bg-blue-900/40 hover:bg-blue-800/60 border border-blue-800/60 transition shadow-xs group"
                title="View Student Profile"
              >
                {/* Student Initials Avatar */}
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold text-xs shadow-sm ring-1 ring-blue-300/40">
                  {profile?.full_name ? profile.full_name.charAt(0).toUpperCase() : 'S'}
                </div>
                <div className="text-left hidden md:block">
                  <div className="text-xs font-bold text-white group-hover:text-blue-200 transition truncate max-w-[130px]">
                    {profile?.full_name || user.email?.split('@')[0]}
                  </div>
                  <div className="text-[10px] text-blue-300 font-medium">
                    {profile?.target_class || 'Class 12'}
                  </div>
                </div>
                <ChevronDown className={`w-3.5 h-3.5 text-blue-300 transition-transform duration-200 ${showProfileModal ? 'rotate-180' : ''}`} />
              </button>

              {/* Profile Dropdown Modal */}
              {showProfileModal && (
                <>
                  <div 
                    className="fixed inset-0 z-40"
                    onClick={() => setShowProfileModal(false)}
                  />
                  <div className="absolute right-0 top-12 z-50 w-80 bg-white text-slate-800 rounded-2xl shadow-2xl border-2 border-blue-200 p-5 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="flex items-center gap-3 pb-4 border-b border-blue-100">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-lg shadow-md shadow-blue-500/20 ring-2 ring-blue-100">
                        {profile?.full_name ? profile.full_name.charAt(0).toUpperCase() : 'S'}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-extrabold text-blue-950 text-base truncate">
                          {profile?.full_name || 'JEE Aspirant'}
                        </div>
                        <div className="text-xs text-slate-500 truncate">{user.email}</div>
                      </div>
                    </div>

                    <div className="py-3.5 space-y-2.5 text-xs">
                      <div className="flex items-center justify-between py-1 border-b border-slate-100">
                        <span className="text-slate-500 font-medium flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-blue-600" /> Phone
                        </span>
                        <span className="font-bold text-slate-800">{profile?.phone_number || 'Not set'}</span>
                      </div>
                      <div className="flex items-center justify-between py-1 border-b border-slate-100">
                        <span className="text-slate-500 font-medium flex items-center gap-1.5">
                          <BookOpen className="w-3.5 h-3.5 text-blue-600" /> Enrolled
                        </span>
                        <span className="font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                          {profile?.target_class || 'Class 12'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between py-1 border-b border-slate-100">
                        <span className="text-slate-500 font-medium flex items-center gap-1.5">
                          <Target className="w-3.5 h-3.5 text-blue-600" /> Target
                        </span>
                        <span className="font-bold text-slate-800">{profile?.target_exam || 'JEE Main & Advanced'}</span>
                      </div>
                    </div>

                    <button
                      onClick={handleSignOut}
                      className="w-full mt-2 py-2.5 px-4 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-xl border border-rose-200 transition text-xs flex items-center justify-center gap-2"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </header>

      {/* Main Tab Content with Ice-Blue Doodle Theme */}
      <div 
        className="flex-1 w-full flex flex-col overflow-hidden min-h-0 relative"
        style={{
          backgroundImage: `linear-gradient(rgba(235, 243, 255, 0.93), rgba(239, 246, 255, 0.95)), url('/bg-doodles.png?v=2')`,
          backgroundSize: '550px auto',
          backgroundRepeat: 'repeat',
        }}
      >
        {activeTab === 'chat' && <AiTutor />}
        {activeTab === 'quiz' && <ChapterQuiz />}
        {activeTab === 'syllabus' && <SyllabusTracker />}
      </div>
    </main>
  );
}
