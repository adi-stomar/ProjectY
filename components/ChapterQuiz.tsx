'use client';

import React, { useState, useEffect } from 'react';
import { MathRenderer } from './MathRenderer';
import { Clock, CheckCircle2, XCircle, AlertCircle, Award, RotateCcw, ArrowRight, ArrowLeft, Bookmark } from 'lucide-react';

interface Question {
  question_id: string;
  question: string;
  question_images: string[];
  option_1: string;
  option_2: string;
  option_3: string;
  option_4: string;
  correct_option: number | null;
  numerical_answer: string | null;
  solution: string;
  solution_images: string[];
  subject: string;
  topic: string;
  subtopic: string;
  question_type: 'single_correct' | 'numerical';
}

export const ChapterQuiz: React.FC = () => {
  const [subject, setSubject] = useState('Physics');
  const [chapters, setChapters] = useState<{ topic: string; count: number }[]>([]);
  const [selectedChapter, setSelectedChapter] = useState('');
  const [quizState, setQuizState] = useState<'setup' | 'running' | 'completed'>('setup');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [index: number]: number | string }>({});
  const [reviewed, setReviewed] = useState<{ [index: number]: boolean }>({});
  const [visited, setVisited] = useState<{ [index: number]: boolean }>({ 0: true });
  const [timeLeft, setTimeLeft] = useState(3600); // 60 minutes in seconds
  const [loading, setLoading] = useState(false);

  // Fetch chapters when subject changes
  useEffect(() => {
    async function fetchChapters() {
      try {
        const res = await fetch(`/api/quiz?action=chapters&subject=${subject}`);
        const data = await res.json();
        
        // Group chapters with less than 10 questions into "Miscellaneous"
        let miscCount = 0;
        const mainChapters: { topic: string, count: number }[] = [];
        
        (data.chapters || []).forEach((ch: any) => {
          if (ch.count < 10) {
            miscCount += ch.count;
          } else {
            mainChapters.push(ch);
          }
        });
        
        if (miscCount > 0) {
          mainChapters.push({ topic: 'Miscellaneous', count: miscCount });
        }
        
        setChapters(mainChapters);
        setSelectedChapter('');
      } catch (e) {
        console.error('Failed to load chapters:', e);
      }
    }
    fetchChapters();
  }, [subject]);

  // Timer countdown
  useEffect(() => {
    if (quizState !== 'running') return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [quizState]);

  const startQuiz = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/quiz?subject=${subject}&chapter=${encodeURIComponent(selectedChapter)}&count=10`);
      const data = await res.json();

      if (data.questions && data.questions.length > 0) {
        setQuestions(data.questions);
        setCurrentIndex(0);
        setAnswers({});
        setReviewed({});
        setVisited({ 0: true });
        setTimeLeft(1800); // 30 mins
        setQuizState('running');
      } else {
        alert('No questions found for this chapter.');
      }
    } catch (err) {
      alert('Failed to load questions.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = (optIndex: number) => {
    setAnswers((prev) => ({ ...prev, [currentIndex]: optIndex }));
  };

  const handleNumericalInput = (val: string) => {
    setAnswers((prev) => ({ ...prev, [currentIndex]: val.trim() }));
  };

  const toggleReview = () => {
    setReviewed((prev) => ({ ...prev, [currentIndex]: !prev[currentIndex] }));
  };

  const clearResponse = () => {
    setAnswers((prev) => {
      const copy = { ...prev };
      delete copy[currentIndex];
      return copy;
    });
  };

  const goToQuestion = (idx: number) => {
    setVisited((prev) => ({ ...prev, [idx]: true }));
    setCurrentIndex(idx);
  };

  const handleSubmitQuiz = () => {
    setQuizState('completed');
  };

  // Score calculation
  const calculateResults = () => {
    let score = 0;
    let correct = 0;
    let wrong = 0;
    let unattempted = 0;

    questions.forEach((q, idx) => {
      const ans = answers[idx];
      if (ans === undefined || ans === '') {
        unattempted++;
      } else if (q.question_type === 'numerical') {
        if (String(ans).trim() === String(q.numerical_answer).trim()) {
          score += 4;
          correct++;
        } else {
          score -= 1;
          wrong++;
        }
      } else {
        if (Number(ans) === q.correct_option) {
          score += 4;
          correct++;
        } else {
          score -= 1;
          wrong++;
        }
      }
    });

    return { score, correct, wrong, unattempted, maxScore: questions.length * 4 };
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // 1. SETUP SCREEN
  if (quizState === 'setup') {
    return (
      <div className="bg-transparent h-full w-full overflow-y-auto relative flex flex-col">
        <div className="flex-1 p-6 md:p-12">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
                NTA CBT Simulator
              </span>
              <h2 className="text-2xl font-bold text-slate-800 mt-2">Chapter-Wise Practice Quiz</h2>
              <p className="text-slate-500 text-sm mt-1">
                10 randomized real JEE questions in 30 minutes with official +4 / -1 marking scheme.
              </p>
            </div>

            {/* Subject Selection - Blue Theme */}
            <div className="mb-10 max-w-3xl mx-auto">
              <div className="grid grid-cols-3 gap-3 p-1.5 bg-blue-900/10 rounded-2xl border border-blue-200/80 backdrop-blur-xs">
                {['Physics', 'Chemistry', 'Mathematics'].map((s) => (
                  <button
                    key={s}
                    onClick={() => setSubject(s)}
                    className={`py-3 px-4 rounded-xl text-sm font-semibold transition ${
                      subject === s
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 font-bold ring-1 ring-blue-400/40'
                        : 'text-blue-950 hover:text-blue-800 hover:bg-blue-100/60'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Chapter Cards Grid */}
            <div className="mb-8">
              <label className="block text-base font-bold text-blue-950 mb-4">Select Chapter to Practice</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {chapters.map((ch) => {
                  // Seed the image using the chapter name so it stays consistent
                  const slug = ch.topic.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
                  const isSelected = selectedChapter === ch.topic;
                  
                  return (
                    <div 
                      key={ch.topic}
                      onClick={() => setSelectedChapter(ch.topic)}
                      className={`group cursor-pointer rounded-2xl overflow-hidden border-2 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                        isSelected 
                          ? 'border-blue-600 shadow-lg shadow-blue-600/20 ring-4 ring-blue-500/20 bg-white' 
                          : 'border-blue-200/80 bg-white/95 hover:border-blue-500 hover:shadow-blue-500/10'
                      }`}
                    >
                      <div className="h-36 w-full bg-slate-200 relative overflow-hidden">
                        <img 
                           src={`/topic-images/${slug}.jpg`} 
                           alt={ch.topic}
                           onError={(e) => {
                             // Fallback if no specific image was downloaded
                             (e.target as HTMLImageElement).src = `https://placehold.co/400x200/1e293b/ffffff?text=${encodeURIComponent(ch.topic.slice(0, 15))}`;
                           }}
                           className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-blue-950/90 via-slate-900/40 to-transparent"></div>
                        <div className="absolute bottom-4 left-4 right-4 text-white">
                           <h3 className="font-bold text-sm leading-snug drop-shadow-md">{ch.topic}</h3>
                        </div>
                      </div>
                      <div className="p-4 flex justify-between items-center bg-white border-t border-blue-100/70">
                         <span className="text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200/60 px-2.5 py-1 rounded-lg">{ch.count} Questions</span>
                         <div className={`w-5 h-5 rounded-full flex items-center justify-center border-2 transition-colors ${
                           isSelected ? 'border-blue-600 bg-blue-600' : 'border-slate-300 group-hover:border-blue-400'
                         }`}>
                           {isSelected && <div className="w-2 h-2 rounded-full bg-white"></div>}
                         </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Sticky Start Button Footer - Blue Theme */}
        <div className="sticky bottom-0 w-full bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 text-white backdrop-blur-md border-t border-blue-800 p-4 md:px-12 flex justify-center z-10 shrink-0 shadow-2xl">
          <div className="max-w-7xl w-full flex items-center justify-between">
            <div className="hidden md:block">
              <div className="text-xs text-blue-300 font-semibold uppercase tracking-wider">Selected Topic:</div>
              <div className="text-lg font-extrabold text-white">{selectedChapter || 'None selected'}</div>
            </div>
            <button
              onClick={startQuiz}
              disabled={loading || !selectedChapter}
              className={`py-3 px-8 rounded-xl font-bold shadow-md transition flex items-center gap-2 text-base w-full md:w-auto justify-center ${
                loading || !selectedChapter 
                  ? 'bg-blue-900/60 text-blue-400/50 cursor-not-allowed border border-blue-800/40' 
                  : 'bg-blue-600 hover:bg-blue-500 hover:shadow-lg shadow-blue-500/30 text-white ring-2 ring-blue-400/40'
              }`}
            >
              {loading ? 'Preparing Questions...' : 'Start 30-Min Quiz'}
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2. RUNNING QUIZ SCREEN (NTA CBT Interface)
  if (quizState === 'running') {
    const currentQ = questions[currentIndex];
    const isAnswered = answers[currentIndex] !== undefined && answers[currentIndex] !== '';
    const isMarkedReview = reviewed[currentIndex];

    return (
      <div className="bg-white flex flex-col h-full w-full overflow-hidden">
        {/* Top Bar: Subject, Chapter & Countdown Timer */}
        <div className="p-4 bg-slate-900 text-white flex shrink-0 items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 uppercase tracking-wide">{subject}</span>
            <h3 className="text-base font-bold truncate max-w-md">{selectedChapter}</h3>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-slate-800 px-4 py-2 rounded-lg border border-slate-700 text-amber-400 font-mono font-bold text-lg">
              <Clock className="w-5 h-5 animate-pulse" />
              {formatTime(timeLeft)}
            </div>
            <button
              onClick={handleSubmitQuiz}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-lg transition"
            >
              Submit Quiz
            </button>
          </div>
        </div>

        {/* Main Exam Canvas & Question Palette */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 overflow-hidden min-h-0">
          {/* Question View (Left 3 Columns) */}
          <div className="lg:col-span-3 flex flex-col h-full border-r border-slate-200 min-h-0">
            <div className="flex-1 overflow-y-auto p-4 md:p-6 min-h-0">
              {/* Question Header */}
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200 text-sm">
                <span className="font-bold text-slate-800 text-base">
                  Question {currentIndex + 1} of {questions.length}
                </span>
                <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md font-medium">
                  Marking: +4 / -1
                </span>
              </div>

              {/* Question Text */}
              <div className="text-slate-800 text-base leading-relaxed mb-4">
                <MathRenderer content={currentQ.question} />
              </div>

              {/* Question Images (Diagrams / Circuits / Reactions) */}
              {currentQ.question_images && currentQ.question_images.length > 0 && (
                <div className="my-4 flex flex-wrap gap-4">
                  {currentQ.question_images.map((imgUrl, i) => (
                    <img
                      key={i}
                      src={imgUrl}
                      alt="Diagram"
                      className="max-h-56 rounded-lg border border-slate-200 bg-white p-2 shadow-sm"
                    />
                  ))}
                </div>
              )}

              {/* Options Section */}
              <div className="mt-6 space-y-3">
                {currentQ.question_type === 'numerical' ? (
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Enter Numerical Integer Value:
                    </label>
                    <input
                      type="text"
                      value={answers[currentIndex] || ''}
                      onChange={(e) => handleNumericalInput(e.target.value)}
                      placeholder="e.g. 5"
                      className="w-48 p-3 border-2 border-slate-300 rounded-xl text-lg font-mono focus:border-blue-600 outline-none"
                    />
                  </div>
                ) : (
                  [currentQ.option_1, currentQ.option_2, currentQ.option_3, currentQ.option_4].map((optText, optIdx) => {
                    const optNumber = optIdx + 1;
                    const isSelected = answers[currentIndex] === optNumber;
                    if (!optText && optText !== '0' && currentQ.question_type !== 'single_correct') return null;

                    return (
                      <button
                        key={optIdx}
                        onClick={() => handleSelectOption(optNumber)}
                        className={`w-full flex items-start gap-3 p-4 rounded-xl border text-left transition ${
                          isSelected
                            ? 'border-blue-600 bg-blue-50 text-blue-900 font-medium'
                            : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <span
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                            isSelected ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'
                          }`}
                        >
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <div className="flex-1">
                          {optText.startsWith('/dataset/') ? (
                            <img src={optText} alt={`Option ${optNumber}`} className="max-h-32 object-contain rounded" />
                          ) : (
                            <MathRenderer content={optText || ' '} />
                          )}
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            {/* Question Actions */}
            <div className="p-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0 bg-slate-50">
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleReview}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition flex items-center gap-1.5 ${
                    isMarkedReview
                      ? 'bg-purple-600 text-white'
                      : 'border border-purple-300 text-purple-700 hover:bg-purple-50'
                  }`}
                >
                  <Bookmark className="w-4 h-4" />
                  {isMarkedReview ? 'Marked for Review' : 'Mark for Review'}
                </button>
                <button
                  onClick={clearResponse}
                  className="px-3 py-2 text-slate-500 hover:text-slate-800 text-sm font-medium"
                >
                  Clear Response
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => goToQuestion(Math.max(0, currentIndex - 1))}
                  disabled={currentIndex === 0}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-semibold text-slate-600 disabled:opacity-40 hover:bg-slate-50"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => goToQuestion(Math.min(questions.length - 1, currentIndex + 1))}
                  disabled={currentIndex === questions.length - 1}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold shadow-sm flex items-center gap-1"
                >
                  Save & Next
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* NTA Question Palette (Right Column) */}
          <div className="bg-slate-50 p-4 border-l border-slate-200 overflow-y-auto h-full">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
              Question Palette ({questions.length})
            </h4>

            {/* Legend */}
            <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 mb-4 pb-3 border-b border-slate-200">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-emerald-500"></span> Answered
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-rose-500"></span> Unanswered
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-purple-500"></span> Review
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-slate-300"></span> Not Visited
              </div>
            </div>

            {/* Grid of numbers */}
            <div className="grid grid-cols-5 gap-2">
              {questions.map((_, i) => {
                const isCurrent = i === currentIndex;
                const hasAnswer = answers[i] !== undefined && answers[i] !== '';
                const isRev = reviewed[i];
                const isVis = visited[i];

                let badgeColor = 'bg-slate-200 text-slate-700'; // not visited
                if (isRev) badgeColor = 'bg-purple-600 text-white';
                else if (hasAnswer) badgeColor = 'bg-emerald-600 text-white';
                else if (isVis) badgeColor = 'bg-rose-500 text-white';

                return (
                  <button
                    key={i}
                    onClick={() => goToQuestion(i)}
                    className={`h-9 w-9 rounded-lg font-bold text-xs flex items-center justify-center transition ${badgeColor} ${
                      isCurrent ? 'ring-2 ring-blue-500 ring-offset-2' : ''
                    }`}
                  >
                    {i + 1}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 3. COMPLETED SCORECARD & REVIEW SCREEN
  const results = calculateResults();

  return (
    <div className="bg-transparent h-full w-full overflow-y-auto p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        {/* Score Summary Banner */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl p-6 md:p-8 text-center mb-8 shadow-md">
        <Award className="w-12 h-12 mx-auto mb-2 text-yellow-300" />
        <h2 className="text-2xl font-bold">Quiz Completed!</h2>
        <p className="text-blue-100 text-sm mt-1">{selectedChapter} • {subject}</p>

        <div className="mt-6 inline-flex items-baseline gap-2 bg-white/10 px-6 py-3 rounded-xl backdrop-blur-sm">
          <span className="text-4xl font-extrabold">{results.score}</span>
          <span className="text-blue-200 text-lg font-medium">/ {results.maxScore} Marks</span>
        </div>

        <div className="grid grid-cols-3 gap-4 max-w-md mx-auto mt-6 text-sm">
          <div className="bg-emerald-500/20 p-2 rounded-lg border border-emerald-400/30">
            <div className="font-bold text-lg text-emerald-300">{results.correct}</div>
            <div className="text-xs text-emerald-100">Correct (+4)</div>
          </div>
          <div className="bg-rose-500/20 p-2 rounded-lg border border-rose-400/30">
            <div className="font-bold text-lg text-rose-300">{results.wrong}</div>
            <div className="text-xs text-rose-100">Incorrect (-1)</div>
          </div>
          <div className="bg-slate-500/20 p-2 rounded-lg border border-slate-400/30">
            <div className="font-bold text-lg text-slate-200">{results.unattempted}</div>
            <div className="text-xs text-slate-300">Skipped (0)</div>
          </div>
        </div>
      </div>

      {/* Action to re-attempt */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-slate-800">Detailed Solutions & Explanations</h3>
        <button
          onClick={() => setQuizState('setup')}
          className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-semibold transition"
        >
          <RotateCcw className="w-4 h-4" /> Practice Another Chapter
        </button>
      </div>

      {/* Question by question review */}
      <div className="space-y-6">
        {questions.map((q, i) => {
          const userAns = answers[i];
          const isCorrect =
            q.question_type === 'numerical'
              ? String(userAns).trim() === String(q.numerical_answer).trim()
              : Number(userAns) === q.correct_option;
          const isSkipped = userAns === undefined || userAns === '';

          return (
            <div key={i} className="p-5 rounded-xl border border-slate-200 bg-slate-50/50">
              <div className="flex items-center justify-between mb-3 text-sm">
                <span className="font-bold text-slate-700">Question {i + 1}</span>
                {isSkipped ? (
                  <span className="text-xs text-slate-500 font-medium">Skipped</span>
                ) : isCorrect ? (
                  <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Correct (+4)
                  </span>
                ) : (
                  <span className="text-xs text-rose-600 font-bold flex items-center gap-1">
                    <XCircle className="w-4 h-4" /> Incorrect (-1)
                  </span>
                )}
              </div>

              <div className="text-slate-800 mb-3">
                <MathRenderer content={q.question} />
              </div>

              {/* Diagrams */}
              {q.question_images && q.question_images.length > 0 && (
                <div className="my-2 flex flex-wrap gap-2">
                  {q.question_images.map((img, idx) => (
                    <img key={idx} src={img} alt="Question figure" className="max-h-40 rounded border bg-white p-1" />
                  ))}
                </div>
              )}

              {/* Correct Answer & Solution Box */}
              <div className="mt-4 p-4 rounded-lg bg-emerald-50/80 border border-emerald-200 text-sm">
                <div className="font-bold text-emerald-900 mb-1">
                  Correct Answer:{' '}
                  {q.question_type === 'numerical'
                    ? q.numerical_answer
                    : `Option (${String.fromCharCode(64 + (q.correct_option || 1))})`}
                </div>
                {q.solution && (
                  <div className="text-slate-700 mt-2">
                    <div className="font-semibold text-xs text-emerald-800 uppercase tracking-wide">Solution:</div>
                    <MathRenderer content={q.solution} />
                  </div>
                )}
                {q.solution_images && q.solution_images.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {q.solution_images.map((sImg, sIdx) => (
                      <img key={sIdx} src={sImg} alt="Solution figure" className="max-h-40 rounded border bg-white p-1" />
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      </div>
    </div>
  );
};
