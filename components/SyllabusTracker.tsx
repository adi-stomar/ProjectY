'use client';

import React, { useState, useEffect } from 'react';
import { JEE_SYLLABUS, Chapter, Subtopic } from '@/lib/syllabusData';
import { CheckCircle2, Circle, ChevronDown, ChevronUp, Trophy, BookOpen, Layers } from 'lucide-react';

export const SyllabusTracker: React.FC = () => {
  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  const [completedSubtopics, setCompletedSubtopics] = useState<{ [id: string]: boolean }>({});
  const [expandedChapters, setExpandedChapters] = useState<{ [id: string]: boolean }>({});

  // Load saved progress from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('jee_syllabus_subtopics');
      if (saved) {
        setCompletedSubtopics(JSON.parse(saved));
      }
    } catch (e) {
      console.warn('LocalStorage not available');
    }
  }, []);

  // Save to localStorage whenever completedSubtopics changes
  const toggleSubtopic = (subtopicId: string) => {
    setCompletedSubtopics((prev) => {
      const updated = { ...prev, [subtopicId]: !prev[subtopicId] };
      try {
        localStorage.setItem('jee_syllabus_subtopics', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const toggleChapterExpand = (chapterId: string) => {
    setExpandedChapters((prev) => ({ ...prev, [chapterId]: !prev[chapterId] }));
  };

  // Compute readiness stats
  const computeStats = () => {
    let totalSubtopics = 0;
    let completedCount = 0;
    const subjectStats: { [sub: string]: { total: number; done: number } } = {};

    Object.entries(JEE_SYLLABUS).forEach(([sub, chapters]) => {
      subjectStats[sub] = { total: 0, done: 0 };
      chapters.forEach((ch) => {
        ch.subtopics.forEach((st) => {
          totalSubtopics++;
          subjectStats[sub].total++;
          if (completedSubtopics[st.id]) {
            completedCount++;
            subjectStats[sub].done++;
          }
        });
      });
    });

    const overallPct = totalSubtopics > 0 ? Math.round((completedCount / totalSubtopics) * 100) : 0;
    return { totalSubtopics, completedCount, overallPct, subjectStats };
  };

  const stats = computeStats();

  // Filter chapters
  const filteredSubjects =
    selectedSubject === 'All'
      ? Object.entries(JEE_SYLLABUS)
      : Object.entries(JEE_SYLLABUS).filter(([sub]) => sub === selectedSubject);

  return (
    <div className="w-full h-full overflow-y-auto bg-transparent p-4 md:p-8 space-y-6">
      {/* Exam Readiness Meter Header - Blue Theme */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 text-white p-6 md:p-8 rounded-2xl shadow-xl shadow-blue-950/20 border border-blue-800/60">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs uppercase tracking-wider mb-1">
              <Trophy className="w-4 h-4" /> JEE Exam Readiness
            </div>
            <h2 className="text-2xl font-bold">Official Syllabus & Subtopic Tracker</h2>
            <p className="text-blue-200/70 text-sm mt-1">
              {stats.completedCount} of {stats.totalSubtopics} subtopics mastered. Aligned with official NTA syllabus.
            </p>
          </div>

          {/* Radial / Large Percentage Display */}
          <div className="flex items-center gap-4 bg-blue-900/40 p-4 rounded-xl border border-blue-700/60 backdrop-blur-xs">
            <div className="text-right">
              <div className="text-3xl font-extrabold text-blue-300">{stats.overallPct}%</div>
              <div className="text-[11px] text-blue-200/70 font-medium uppercase tracking-wide">Prepared</div>
            </div>
            <div className="w-16 h-16 rounded-full border-4 border-blue-900 flex items-center justify-center relative">
              <div
                className="absolute inset-0 rounded-full border-4 border-blue-400 transition-all duration-500"
                style={{ clipPath: `polygon(0 0, 100% 0, 100% ${stats.overallPct}%, 0 ${stats.overallPct}%)` }}
              />
              <BookOpen className="w-6 h-6 text-blue-200" />
            </div>
          </div>
        </div>

        {/* Subject-Wise Progress Bars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-blue-900/60">
          {Object.entries(stats.subjectStats).map(([sub, data]) => {
            const pct = data.total > 0 ? Math.round((data.done / data.total) * 100) : 0;
            return (
              <div key={sub} className="bg-blue-900/30 p-3 rounded-xl border border-blue-800/40">
                <div className="flex justify-between text-xs font-semibold mb-1.5">
                  <span className="text-slate-200">{sub}</span>
                  <span className="text-blue-300">{pct}%</span>
                </div>
                <div className="w-full bg-blue-950/80 h-2 rounded-full overflow-hidden border border-blue-900">
                  <div
                    className="bg-blue-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <div className="text-[11px] text-blue-300/70 mt-1">
                  {data.done} / {data.total} Subtopics
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filter Tabs - Blue Theme */}
      <div className="flex items-center gap-2 bg-blue-900/10 p-1.5 rounded-2xl border border-blue-200/80 backdrop-blur-xs shadow-sm">
        {['All', 'Physics', 'Chemistry', 'Mathematics'].map((s) => (
          <button
            key={s}
            onClick={() => setSelectedSubject(s)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${
              selectedSubject === s
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 font-bold ring-1 ring-blue-400/40'
                : 'text-blue-950 hover:bg-blue-100/60 font-semibold'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Chapter & Subtopic Accordions */}
      <div className="space-y-4">
        {filteredSubjects.map(([subjectName, chapters]) => (
          <div key={subjectName} className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-blue-950 px-1 pt-2">
              {subjectName}
            </h3>

            {chapters.map((chapter) => {
              const totalCh = chapter.subtopics.length;
              const doneCh = chapter.subtopics.filter((st) => completedSubtopics[st.id]).length;
              const isExpanded = expandedChapters[chapter.id];
              const pct = Math.round((doneCh / totalCh) * 100);

              return (
                <div
                  key={chapter.id}
                  className="bg-white/95 rounded-2xl border border-blue-200/80 shadow-sm shadow-blue-900/5 overflow-hidden transition hover:border-blue-400"
                >
                  {/* Chapter Header */}
                  <div
                    onClick={() => toggleChapterExpand(chapter.id)}
                    className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition select-none"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-2 h-10 rounded-full ${
                          pct === 100 ? 'bg-emerald-500' : pct > 0 ? 'bg-blue-500' : 'bg-slate-300'
                        }`}
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-base font-bold text-slate-800">{chapter.name}</h4>
                          <span className="text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium">
                            Class {chapter.classLevel}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {doneCh} of {totalCh} subtopics completed ({pct}%)
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-24 bg-slate-100 h-2 rounded-full overflow-hidden hidden sm:block">
                        <div
                          className={`h-full rounded-full transition-all ${
                            pct === 100 ? 'bg-emerald-500' : 'bg-blue-600'
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-slate-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-slate-400" />
                      )}
                    </div>
                  </div>

                  {/* Expanded Subtopics List */}
                  {isExpanded && (
                    <div className="px-5 pb-4 pt-2 border-t border-slate-100 bg-slate-50/50 space-y-2">
                      {chapter.subtopics.map((st) => {
                        const isDone = !!completedSubtopics[st.id];
                        return (
                          <div
                            key={st.id}
                            onClick={() => toggleSubtopic(st.id)}
                            className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition ${
                              isDone
                                ? 'bg-emerald-50/60 border-emerald-200 text-emerald-900'
                                : 'bg-white border-slate-200 hover:bg-slate-100 text-slate-700'
                            }`}
                          >
                            <span className="text-sm font-medium pr-2">{st.name}</span>
                            {isDone ? (
                              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                            ) : (
                              <Circle className="w-5 h-5 text-slate-300 shrink-0" />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};
