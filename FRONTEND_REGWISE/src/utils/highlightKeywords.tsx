// Utility to highlight compliance keywords in text
import React from 'react';

const KEYWORDS = [
  'KYC',
  'AML',
  'CTF',
  'CDD',
  'EDD',
  'PEP',
  'sanctions',
  'threshold',
  'beneficial ownership',
  'due diligence',
  'suspicious activity',
  'transaction monitoring',
  'risk assessment',
  'compliance',
  'regulation',
  'GDPR',
  'data protection',
  'consent',
  'reporting',
];

export const highlightKeywords = (text: string): React.ReactNode[] => {
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;

  // Create a regex pattern that matches any of the keywords (case-insensitive)
  const pattern = new RegExp(
    `\\b(${KEYWORDS.join('|')})\\b`,
    'gi'
  );

  let match;
  while ((match = pattern.exec(text)) !== null) {
    // Add text before the match
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }

    // Add the highlighted keyword
    parts.push(
      <span
        key={match.index}
        className="bg-accent/20 text-accent-foreground px-1 rounded font-medium"
      >
        {match[0]}
      </span>
    );

    lastIndex = match.index + match[0].length;
  }

  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return parts.length > 0 ? parts : [text];
};
