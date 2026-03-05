'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
  toolsEnabled: {
    wikipedia: boolean;
    websearch: boolean;
  };
  onToolsChange: (tools: { wikipedia: boolean; websearch: boolean }) => void;
  debugLogs: string[];
  onClearLogs: () => void;
}

export function Settings({
  isOpen,
  onClose,
  toolsEnabled,
  onToolsChange,
  debugLogs,
  onClearLogs,
}: SettingsProps) {
  const [activeTab, setActiveTab] = useState<'tools' | 'debug'>('tools');

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />

          {/* Settings Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-96 bg-white/90 dark:bg-gray-950/90 backdrop-blur-xl border-l border-gray-200/50 dark:border-gray-700/50 shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-200/50 dark:border-gray-700/50">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Settings
                </h2>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-gray-200/50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <svg className="w-6 h-6 text-gray-900 dark:text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </motion.button>
              </div>

              {/* Tabs */}
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => setActiveTab('tools')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === 'tools'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200/50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 hover:bg-gray-300/50 dark:hover:bg-gray-700/50'
                  }`}
                >
                  Tools
                </button>
                <button
                  onClick={() => setActiveTab('debug')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === 'debug'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200/50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 hover:bg-gray-300/50 dark:hover:bg-gray-700/50'
                  }`}
                >
                  Debug
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {activeTab === 'tools' && (
                <div className="space-y-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Enable or disable tools that the AI can use to enhance responses.
                  </p>

                  {/* Wikipedia Tool */}
                  <div className="p-4 rounded-lg bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          Wikipedia
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          Search Wikipedia for factual information
                        </p>
                      </div>
                      <button
                        onClick={() =>
                          onToolsChange({
                            ...toolsEnabled,
                            wikipedia: !toolsEnabled.wikipedia,
                          })
                        }
                        className={`relative w-12 h-6 rounded-full transition-colors ${
                          toolsEnabled.wikipedia
                            ? 'bg-blue-500'
                            : 'bg-gray-300 dark:bg-gray-600'
                        }`}
                      >
                        <motion.div
                          animate={{ x: toolsEnabled.wikipedia ? 24 : 0 }}
                          className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md"
                        />
                      </button>
                    </div>
                  </div>

                  {/* Web Search Tool */}
                  <div className="p-4 rounded-lg bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          Web Search
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          Search the web for current information
                        </p>
                      </div>
                      <button
                        onClick={() =>
                          onToolsChange({
                            ...toolsEnabled,
                            websearch: !toolsEnabled.websearch,
                          })
                        }
                        className={`relative w-12 h-6 rounded-full transition-colors ${
                          toolsEnabled.websearch
                            ? 'bg-blue-500'
                            : 'bg-gray-300 dark:bg-gray-600'
                        }`}
                      >
                        <motion.div
                          animate={{ x: toolsEnabled.websearch ? 24 : 0 }}
                          className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md"
                        />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'debug' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Debug logs for troubleshooting
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={onClearLogs}
                      className="px-3 py-1 text-sm rounded-lg bg-red-500 hover:bg-red-600 text-white transition-colors"
                    >
                      Clear Logs
                    </motion.button>
                  </div>

                  <div className="p-4 rounded-lg bg-gray-100 dark:bg-gray-900 border border-gray-200/50 dark:border-gray-700/50 max-h-96 overflow-y-auto">
                    {debugLogs.length > 0 ? (
                      <div className="space-y-2">
                        {debugLogs.map((log, index) => (
                          <div
                            key={index}
                            className="text-xs font-mono text-gray-900 dark:text-gray-300 break-all"
                          >
                            {log}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                        No logs available
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
