'use client';

import React from 'react';
import katex from 'katex';

interface MathRendererProps {
  content: string;
  className?: string;
}

export const MathRenderer: React.FC<MathRendererProps> = ({ content, className = '' }) => {
  if (!content) return null;

  // Split by $$ (block math) first, then by $ (inline math)
  const renderFormattedText = (text: string) => {
    // Regular expression to find $$...$$ or $...$
    const parts = [];
    const regex = /(\$\$[\s\S]*?\$\$|\$[^\$\n]+?\$)/g;
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
      // Push preceding plain text
      if (match.index > lastIndex) {
        parts.push({
          type: 'text',
          value: text.substring(lastIndex, match.index),
        });
      }

      const matchStr = match[0];
      if (matchStr.startsWith('$$') && matchStr.endsWith('$$')) {
        parts.push({
          type: 'block-math',
          value: matchStr.slice(2, -2).trim(),
        });
      } else if (matchStr.startsWith('$') && matchStr.endsWith('$')) {
        parts.push({
          type: 'inline-math',
          value: matchStr.slice(1, -1).trim(),
        });
      }

      lastIndex = regex.lastIndex;
    }

    if (lastIndex < text.length) {
      parts.push({
        type: 'text',
        value: text.substring(lastIndex),
      });
    }

    return parts.map((part, idx) => {
      if (part.type === 'block-math') {
        try {
          const html = katex.renderToString(part.value, { displayMode: true, throwOnError: false });
          return <div key={idx} className="my-2 overflow-x-auto text-center" dangerouslySetInnerHTML={{ __html: html }} />;
        } catch (e) {
          return <pre key={idx} className="text-red-500">{part.value}</pre>;
        }
      } else if (part.type === 'inline-math') {
        try {
          const html = katex.renderToString(part.value, { displayMode: false, throwOnError: false });
          return <span key={idx} dangerouslySetInnerHTML={{ __html: html }} />;
        } catch (e) {
          return <code key={idx} className="text-red-500">{part.value}</code>;
        }
      } else {
        // Render simple line breaks
        const lines = part.value.split('\n');
        return (
          <span key={idx}>
            {lines.map((line, lIdx) => (
              <React.Fragment key={lIdx}>
                {line}
                {lIdx < lines.length - 1 && <br />}
              </React.Fragment>
            ))}
          </span>
        );
      }
    });
  };

  return <div className={`prose prose-slate max-w-none ${className}`}>{renderFormattedText(content)}</div>;
};
