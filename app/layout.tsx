import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'JEE Prep AI | Smart Doubt Solver, Chapter Quiz & Syllabus Tracker',
  description: 'AI-powered learning platform for IIT-JEE aspirants featuring multimodal doubt solving, chapter quizzes, and official NTA syllabus tracking.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">
        {children}
      </body>
    </html>
  );
}
