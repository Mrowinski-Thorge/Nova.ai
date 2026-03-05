'use client';

import { useState, KeyboardEvent } from 'react';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  toolsEnabled: {
    wikipedia: boolean;
    websearch: boolean;
    autoMode: boolean;
  };
  onToolsChange: (tools: { wikipedia: boolean; websearch: boolean; autoMode: boolean }) => void;
}

export function ChatInput({ onSend, disabled, toolsEnabled, onToolsChange }: ChatInputProps) {
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim() && !disabled) {
      onSend(input.trim());
      setInput('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleTool = (tool: 'wikipedia' | 'websearch' | 'autoMode') => {
    if (tool === 'autoMode') {
      onToolsChange({ ...toolsEnabled, autoMode: !toolsEnabled.autoMode });
    } else {
      onToolsChange({ ...toolsEnabled, [tool]: !toolsEnabled[tool], autoMode: false });
    }
  };

  return (
    <div className="p-4 bg-white dark:bg-black transition-colors duration-300">
      <div className="max-w-3xl mx-auto">
        {/* Input Container */}
        <div className="relative rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#111] transition-all duration-300 focus-within:border-gray-400 dark:focus-within:border-gray-600">
          {/* Active Tool Indicators */}
          {(toolsEnabled.autoMode || toolsEnabled.websearch || toolsEnabled.wikipedia) && (
            <div className="flex items-center gap-1.5 px-4 pt-3 pb-0">
              {toolsEnabled.autoMode && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-medium">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Auto
                </span>
              )}
              {toolsEnabled.websearch && !toolsEnabled.autoMode && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-medium">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <circle cx="11" cy="11" r="8" />
                    <path strokeLinecap="round" d="M21 21l-4.35-4.35" />
                  </svg>
                  Web
                </span>
              )}
              {toolsEnabled.wikipedia && !toolsEnabled.autoMode && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-green-500/10 text-green-600 dark:text-green-400 text-xs font-medium">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  Wiki
                </span>
              )}
            </div>
          )}

          {/* Textarea */}
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Message Nova AI..."
            disabled={disabled}
            rows={1}
            className="w-full px-4 py-3 bg-transparent text-black dark:text-white placeholder-black/30 dark:placeholder-white/30 focus:outline-none resize-none disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            style={{ minHeight: '44px', maxHeight: '160px' }}
          />

          {/* Bottom Bar: Tools + Send */}
          <div className="flex items-center justify-between px-3 pb-2">
            {/* Tool Toggles */}
            <div className="flex items-center gap-1">
              {/* Auto Mode */}
              <button
                onClick={() => toggleTool('autoMode')}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                  toolsEnabled.autoMode
                    ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                    : 'text-black/40 dark:text-white/40 hover:text-black/60 dark:hover:text-white/60 hover:bg-black/5 dark:hover:bg-white/5'
                }`}
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Auto
              </button>

              {/* Web Search */}
              <button
                onClick={() => toggleTool('websearch')}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                  toolsEnabled.websearch
                    ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                    : 'text-black/40 dark:text-white/40 hover:text-black/60 dark:hover:text-white/60 hover:bg-black/5 dark:hover:bg-white/5'
                }`}
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <circle cx="11" cy="11" r="8" />
                  <path strokeLinecap="round" d="M21 21l-4.35-4.35" />
                </svg>
                Web Search
              </button>

              {/* Wikipedia */}
              <button
                onClick={() => toggleTool('wikipedia')}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                  toolsEnabled.wikipedia
                    ? 'bg-green-500/10 text-green-600 dark:text-green-400'
                    : 'text-black/40 dark:text-white/40 hover:text-black/60 dark:hover:text-white/60 hover:bg-black/5 dark:hover:bg-white/5'
                }`}
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                Wikipedia
              </button>
            </div>

            {/* Send Button */}
            <button
              onClick={handleSend}
              disabled={disabled || !input.trim()}
              className="p-2 rounded-lg bg-black dark:bg-white text-white dark:text-black disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 hover:bg-gray-800 dark:hover:bg-gray-100 active:scale-95"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        <div className="text-[11px] text-black/30 dark:text-white/30 mt-2 text-center">
          Enter to send · Shift+Enter for new line
        </div>
      </div>
    </div>
  );
}
