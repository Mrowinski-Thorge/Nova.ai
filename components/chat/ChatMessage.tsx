'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, vs } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Message } from '@/types';
import { useState } from 'react';

interface ChatMessageProps {
  message: Message;
  theme: 'light' | 'dark';
  onRegenerate?: () => void;
}

export function ChatMessage({ message, theme, onRegenerate }: ChatMessageProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isUser = message.role === 'user';

  return (
    <div className={`py-6 px-6 ${isUser ? '' : 'bg-gray-50/50 dark:bg-white/[0.02]'} transition-colors duration-200`}>
      <div className="max-w-3xl mx-auto flex gap-4">
        {/* Avatar */}
        <div
          className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold ${
            isUser
              ? 'bg-black dark:bg-white text-white dark:text-black'
              : 'bg-gray-200 dark:bg-gray-800 text-black dark:text-white'
          }`}
        >
          {isUser ? (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
          ) : (
            <span className="text-[10px] font-bold">N</span>
          )}
        </div>

        <div className="flex-1 min-w-0">
          {/* Name + Tool Indicator */}
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-sm font-semibold text-black dark:text-white">
              {isUser ? 'You' : 'Nova AI'}
            </span>
            {message.toolUsed && (
              <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium ${
                message.toolUsed === 'websearch'
                  ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                  : 'bg-green-500/10 text-green-600 dark:text-green-400'
              }`}>
                {message.toolUsed === 'websearch' ? (
                  <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <circle cx="11" cy="11" r="8" />
                    <path strokeLinecap="round" d="M21 21l-4.35-4.35" />
                  </svg>
                ) : (
                  <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                )}
                {message.toolUsed === 'websearch' ? 'Web Search' : 'Wikipedia'}
              </span>
            )}
          </div>

          {/* Content */}
          <div className="prose prose-sm dark:prose-invert max-w-none text-black/80 dark:text-white/80">
            <ReactMarkdown
              remarkPlugins={[remarkGfm, remarkBreaks]}
              components={{
                code({ className, children, ...props }: any) {
                  const match = /language-(\w+)/.exec(className || '');
                  const codeString = String(children).replace(/\n$/, '');
                  const isInline = !match;

                  return !isInline && match ? (
                    <div className="relative group my-3">
                      <button
                        onClick={() => handleCopy(codeString)}
                        className="absolute right-2 top-2 p-1.5 rounded-md bg-black/20 hover:bg-black/40 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        {copied ? '✓' : 'Copy'}
                      </button>
                      <SyntaxHighlighter
                        style={theme === 'dark' ? vscDarkPlus : vs}
                        language={match[1]}
                        PreTag="div"
                        customStyle={{ borderRadius: '12px', margin: 0 }}
                        {...props}
                      >
                        {codeString}
                      </SyntaxHighlighter>
                    </div>
                  ) : (
                    <code className={`${className || ''} px-1 py-0.5 rounded bg-black/5 dark:bg-white/10 text-sm`} {...props}>
                      {children}
                    </code>
                  );
                },
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>

          {/* Regenerate */}
          {!isUser && onRegenerate && !message.isStreaming && (
            <button
              onClick={onRegenerate}
              className="mt-3 px-3 py-1 text-xs font-medium rounded-lg border border-gray-200 dark:border-gray-800 text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white hover:border-gray-400 dark:hover:border-gray-600 transition-all duration-200"
            >
              Regenerate
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
