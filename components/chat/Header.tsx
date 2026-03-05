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
}

export function Header({
  currentModel,
  onModelSelect,
  theme,
  onThemeToggle,
  isLoading,
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
          <ThemeToggle theme={theme} onToggle={onThemeToggle} />
        </div>
      </div>
    </header>
  );
}
