'use client';

import { useState, KeyboardEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  websearchMode?: 'off' | 'auto' | 'on';
  onWebsearchModeChange?: (mode: 'off' | 'auto' | 'on') => void;
}

export function ChatInput({ onSend, disabled, websearchMode = 'auto', onWebsearchModeChange }: ChatInputProps) {
  const [input, setInput] = useState('');
  const [showModeMenu, setShowModeMenu] = useState(false);

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

  const getModeIcon = () => {
    switch (websearchMode) {
      case 'off':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
          </svg>
        );
      case 'auto':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        );
      case 'on':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 9a2 2 0 114 0 2 2 0 01-4 0z" />
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a4 4 0 00-3.446 6.032l-2.261 2.26a1 1 0 101.414 1.415l2.261-2.261A4 4 0 1011 5z" clipRule="evenodd" />
          </svg>
        );
    }
  };

  const getModeLabel = () => {
    switch (websearchMode) {
      case 'off': return 'Web Search: Off';
      case 'auto': return 'Web Search: Auto';
      case 'on': return 'Web Search: Always On';
    }
  };

  const getModeColor = () => {
    switch (websearchMode) {
      case 'off': return 'text-gray-500 dark:text-gray-400';
      case 'auto': return 'text-blue-500 dark:text-blue-400';
      case 'on': return 'text-green-500 dark:text-green-400';
    }
  };

  return (
    <div className="p-4 border-t border-gray-200/50 dark:border-gray-700/50 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl">
      <div className="max-w-4xl mx-auto">
        <div className="relative flex items-end gap-2">
          {/* Web Search Mode Selector */}
          {onWebsearchModeChange && (
            <div className="relative mb-1">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowModeMenu(!showModeMenu)}
                className={`p-3 rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 hover:bg-white dark:hover:bg-gray-800 transition-colors shadow-lg ${getModeColor()}`}
                title={getModeLabel()}
              >
                {getModeIcon()}
              </motion.button>

              {/* Mode Menu */}
              <AnimatePresence>
                {showModeMenu && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowModeMenu(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute bottom-full mb-2 left-0 w-56 py-2 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-xl shadow-2xl z-50"
                    >
                      <div className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400">
                        Web Search Mode
                      </div>
                      <button
                        onClick={() => {
                          onWebsearchModeChange('off');
                          setShowModeMenu(false);
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${websearchMode === 'off' ? 'bg-gray-100 dark:bg-gray-800' : ''}`}
                      >
                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                        </svg>
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">Off</div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">No web search</div>
                        </div>
                      </button>
                      <button
                        onClick={() => {
                          onWebsearchModeChange('auto');
                          setShowModeMenu(false);
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${websearchMode === 'auto' ? 'bg-gray-100 dark:bg-gray-800' : ''}`}
                      >
                        <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">Auto</div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">Detect when needed</div>
                        </div>
                      </button>
                      <button
                        onClick={() => {
                          onWebsearchModeChange('on');
                          setShowModeMenu(false);
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${websearchMode === 'on' ? 'bg-gray-100 dark:bg-gray-800' : ''}`}
                      >
                        <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9 9a2 2 0 114 0 2 2 0 01-4 0z" />
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a4 4 0 00-3.446 6.032l-2.261 2.26a1 1 0 101.414 1.415l2.261-2.261A4 4 0 1011 5z" clipRule="evenodd" />
                        </svg>
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">Always On</div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">Search all queries</div>
                        </div>
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          )}

          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            disabled={disabled}
            rows={1}
            className="flex-1 px-4 py-3 rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            style={{ minHeight: '50px', maxHeight: '200px' }}
          />
          <motion.button
            whileHover={{ scale: disabled ? 1 : 1.05 }}
            whileTap={{ scale: disabled ? 1 : 0.95 }}
            onClick={handleSend}
            disabled={disabled || !input.trim()}
            className="p-3 rounded-2xl bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg mb-1"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
          </motion.button>
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
          Press Enter to send, Shift+Enter for new line
        </div>
      </div>
    </div>
  );
}
