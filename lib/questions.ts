import fs from 'fs';
import path from 'path';

export interface Question {
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
  difficulty: string;
  question_type: 'single_correct' | 'numerical';
  has_image: boolean;
  exam: string;
}

let cachedQuestions: Question[] | null = null;

export function getAllQuestions(): Question[] {
  if (cachedQuestions) {
    return cachedQuestions;
  }

  const subjects = ['chemistry', 'physics', 'mathematics'];
  const questions: Question[] = [];
  const baseDir = fs.existsSync(path.join(process.cwd(), 'public', 'dataset'))
    ? path.join(process.cwd(), 'public', 'dataset')
    : path.join(process.cwd(), 'dataset');

  for (const subj of subjects) {
    const subjDir = path.join(baseDir, subj);
    const files = ['test.jsonl', 'train.jsonl'];

    for (const file of files) {
      const filePath = path.join(subjDir, file);
      if (fs.existsSync(filePath)) {
        try {
          const content = fs.readFileSync(filePath, 'utf-8');
          const lines = content.split('\n');

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed) continue;

            try {
              const q = JSON.parse(trimmed) as Question;
              
              // Normalize image paths to point to public/dataset/{subj}/...
              if (q.question_images && Array.isArray(q.question_images)) {
                q.question_images = q.question_images.map(img => 
                  img.startsWith('images/') ? `/dataset/${subj}/${img}` : img
                );
              }
              if (q.solution_images && Array.isArray(q.solution_images)) {
                q.solution_images = q.solution_images.map(img => 
                  img.startsWith('images/') ? `/dataset/${subj}/${img}` : img
                );
              }

              // Normalize options if they are images
              ['option_1', 'option_2', 'option_3', 'option_4'].forEach(opt => {
                const val = (q as any)[opt];
                if (typeof val === 'string' && val.startsWith('images/')) {
                  (q as any)[opt] = `/dataset/${subj}/${val}`;
                }
              });

              // Standardize subject capitalization
              if (subj === 'chemistry') q.subject = 'Chemistry';
              if (subj === 'physics') q.subject = 'Physics';
              if (subj === 'mathematics') q.subject = 'Mathematics';

              // Fallback topic if empty
              if (!q.topic || q.topic.trim() === '') {
                q.topic = q.subtopic || 'General';
              }

              questions.push(q);
            } catch (parseErr) {
              // skip malformed lines
            }
          }
        } catch (err) {
          console.error(`Error reading ${filePath}:`, err);
        }
      }
    }
  }

  cachedQuestions = questions;
  return questions;
}

export function getSubjects(): string[] {
  return ['Physics', 'Chemistry', 'Mathematics'];
}

export function getChaptersForSubject(subject: string): { topic: string; count: number }[] {
  const all = getAllQuestions();
  const filtered = all.filter(q => q.subject.toLowerCase() === subject.toLowerCase());
  const counts: { [topic: string]: number } = {};

  for (const q of filtered) {
    const topic = q.topic.trim() || 'General';
    counts[topic] = (counts[topic] || 0) + 1;
  }

  return Object.entries(counts)
    .map(([topic, count]) => ({ topic, count }))
    .sort((a, b) => b.count - a.count);
}

export function getQuizQuestions(subject: string, chapter: string, count: number = 20): Question[] {
  const all = getAllQuestions();
  let pool = all.filter(q => q.subject.toLowerCase() === subject.toLowerCase());

  if (chapter === 'Miscellaneous') {
    const counts: { [topic: string]: number } = {};
    for (const q of pool) {
      const topic = q.topic.trim() || 'General';
      counts[topic] = (counts[topic] || 0) + 1;
    }
    const miscTopics = Object.keys(counts).filter(t => counts[t] < 10);
    pool = pool.filter(q => miscTopics.includes(q.topic.trim() || 'General'));
  } else if (chapter && chapter !== 'All Chapters') {
    const chapterLower = chapter.toLowerCase();
    const exact = pool.filter(q => 
      q.topic.toLowerCase() === chapterLower || 
      q.subtopic.toLowerCase().includes(chapterLower)
    );
    if (exact.length > 0) {
      pool = exact;
    }
  }

  // Shuffle pool randomly
  const shuffled = [...pool].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}
