'use client';

import { motion } from 'framer-motion';
import { ModelSelector } from '@/components/ui/ModelSelector';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { ModelConfig } from '@/types';
import Link from 'next/link';

interface HeaderProps {
  currentModel: string;
  onModelSelect: (model: ModelConfig) => void;
  theme: 'light' | 'dark';
  onThemeToggle: () => void;
  isLoading?: boolean;
  onSettingsClick?: () => void;
}

export function Header({
  currentModel,
  onModelSelect,
  theme,
  onThemeToggle,
  isLoading,
  onSettingsClick,
}: HeaderProps) {
  return (
    <header className="h-16 border-b border-gray-200/50 dark:border-gray-700/50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl shadow-sm">
      <div className="h-full px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-green-400 flex items-center justify-center shadow-lg"
          >
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
              <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
            </svg>
          </motion.div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-500 to-green-500 bg-clip-text text-transparent">
            Nova AI
          </h1>
        </Link>

        <div className="flex items-center gap-4">
          <ModelSelector
            currentModel={currentModel}
            onModelSelect={onModelSelect}
            disabled={isLoading}
          />
          {onSettingsClick && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onSettingsClick}
              className="p-2 rounded-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 hover:bg-white dark:hover:bg-gray-800 transition-colors shadow-lg"
              aria-label="Settings"
            >
              <svg className="w-5 h-5 text-gray-900 dark:text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
              </svg>
            </motion.button>
          )}
          <ThemeToggle theme={theme} onToggle={onThemeToggle} />
        </div>
      </div>
    </header>
  );
}
