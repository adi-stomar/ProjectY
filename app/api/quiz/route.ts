import { NextRequest, NextResponse } from 'next/server';
import { getChaptersForSubject, getQuizQuestions, getSubjects } from '@/lib/questions';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const action = searchParams.get('action');
  const subject = searchParams.get('subject') || 'Physics';
  const chapter = searchParams.get('chapter') || '';
  const count = parseInt(searchParams.get('count') || '20', 10);

  if (action === 'subjects') {
    return NextResponse.json({ subjects: getSubjects() });
  }

  if (action === 'chapters') {
    const chapters = getChaptersForSubject(subject);
    return NextResponse.json({ chapters });
  }

  // Default: generate quiz
  const questions = getQuizQuestions(subject, chapter, count);
  return NextResponse.json({
    subject,
    chapter: chapter || 'All Chapters',
    total: questions.length,
    questions,
  });
}
