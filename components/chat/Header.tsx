'use client';

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
    <header className="h-14 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-black/80 backdrop-blur-2xl transition-all duration-300">
      <div className="h-full px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <svg className="w-7 h-7 text-black dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v8M8 12h8" />
          </svg>
          <span className="text-black dark:text-white font-semibold text-xl tracking-tight">Nova AI</span>
        </Link>

        <div className="absolute left-1/2 -translate-x-1/2">
          <ModelSelector
            currentModel={currentModel}
            onModelSelect={onModelSelect}
            disabled={isLoading}
          />
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle theme={theme} onToggle={onThemeToggle} />
        </div>
      </div>
    </header>
  );
}
