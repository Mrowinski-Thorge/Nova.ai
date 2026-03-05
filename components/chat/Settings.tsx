'use client';

import { useState } from 'react';

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
  toolsEnabled: {
    wikipedia: boolean;
    websearch: boolean;
    autoMode: boolean;
  };
  onToolsChange: (tools: { wikipedia: boolean; websearch: boolean; autoMode: boolean }) => void;
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

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/30 dark:bg-black/50 backdrop-blur-sm z-40 transition-opacity"
      />

      {/* Panel */}
      <div className="fixed right-0 top-0 bottom-0 w-96 bg-white dark:bg-[#0a0a0a] border-l border-gray-200 dark:border-gray-800 z-50 flex flex-col transition-colors duration-300">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-black dark:text-white tracking-tight">
              Settings
            </h2>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
            >
              <svg className="w-5 h-5 text-black dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex gap-1 mt-4 p-1 rounded-xl bg-gray-100 dark:bg-white/5">
            <button
              onClick={() => setActiveTab('tools')}
              className={`flex-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === 'tools'
                  ? 'bg-white dark:bg-white/10 text-black dark:text-white shadow-sm'
                  : 'text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white'
              }`}
            >
              Tools
            </button>
            <button
              onClick={() => setActiveTab('debug')}
              className={`flex-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === 'debug'
                  ? 'bg-white dark:bg-white/10 text-black dark:text-white shadow-sm'
                  : 'text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white'
              }`}
            >
              Debug
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'tools' && (
            <div className="space-y-3">
              <p className="text-sm text-black/50 dark:text-white/50 mb-4">
                Configure which tools the AI can use.
              </p>

              {/* Auto Mode */}
              <div className="p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-gray-800">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-black dark:text-white">Auto Mode</h3>
                    <p className="text-xs text-black/50 dark:text-white/50 mt-0.5">AI decides when to use tools</p>
                  </div>
                  <button
                    onClick={() => onToolsChange({ ...toolsEnabled, autoMode: !toolsEnabled.autoMode })}
                    className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
                      toolsEnabled.autoMode ? 'bg-black dark:bg-white' : 'bg-gray-300 dark:bg-gray-700'
                    }`}
                  >
                    <div className={`absolute top-0.5 w-5 h-5 rounded-full shadow-sm transition-all duration-200 ${
                      toolsEnabled.autoMode
                        ? 'left-[22px] bg-white dark:bg-black'
                        : 'left-0.5 bg-white dark:bg-gray-400'
                    }`} />
                  </button>
                </div>
              </div>

              {/* Wikipedia */}
              <div className="p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-gray-800">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-black dark:text-white">Wikipedia</h3>
                    <p className="text-xs text-black/50 dark:text-white/50 mt-0.5">Search for factual information</p>
                  </div>
                  <button
                    onClick={() => onToolsChange({ ...toolsEnabled, wikipedia: !toolsEnabled.wikipedia })}
                    className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
                      toolsEnabled.wikipedia ? 'bg-black dark:bg-white' : 'bg-gray-300 dark:bg-gray-700'
                    }`}
                  >
                    <div className={`absolute top-0.5 w-5 h-5 rounded-full shadow-sm transition-all duration-200 ${
                      toolsEnabled.wikipedia
                        ? 'left-[22px] bg-white dark:bg-black'
                        : 'left-0.5 bg-white dark:bg-gray-400'
                    }`} />
                  </button>
                </div>
              </div>

              {/* Web Search */}
              <div className="p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-gray-800">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-black dark:text-white">Web Search</h3>
                    <p className="text-xs text-black/50 dark:text-white/50 mt-0.5">Search the web for current info</p>
                  </div>
                  <button
                    onClick={() => onToolsChange({ ...toolsEnabled, websearch: !toolsEnabled.websearch })}
                    className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
                      toolsEnabled.websearch ? 'bg-black dark:bg-white' : 'bg-gray-300 dark:bg-gray-700'
                    }`}
                  >
                    <div className={`absolute top-0.5 w-5 h-5 rounded-full shadow-sm transition-all duration-200 ${
                      toolsEnabled.websearch
                        ? 'left-[22px] bg-white dark:bg-black'
                        : 'left-0.5 bg-white dark:bg-gray-400'
                    }`} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'debug' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-black/50 dark:text-white/50">Debug logs</p>
                <button
                  onClick={onClearLogs}
                  className="px-3 py-1 text-xs font-medium rounded-lg bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/20 transition-colors"
                >
                  Clear
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-gray-800 max-h-96 overflow-y-auto">
                {debugLogs.length > 0 ? (
                  <div className="space-y-1">
                    {debugLogs.map((log, index) => (
                      <div key={index} className="text-xs font-mono text-black/60 dark:text-white/60 break-all">
                        {log}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-black/30 dark:text-white/30 text-center py-4">No logs</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
