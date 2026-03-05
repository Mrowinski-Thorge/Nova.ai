'use client';

import { motion } from 'framer-motion';
import { ModelConfig } from '@/types';
import { MODELS } from '@/lib/models';

interface ModelSelectorProps {
  currentModel: string;
  onModelSelect: (model: ModelConfig) => void;
  disabled?: boolean;
}

export function ModelSelector({ currentModel, onModelSelect, disabled }: ModelSelectorProps) {
  return (
    <div className="relative">
      <select
        value={currentModel}
        onChange={(e) => {
          const model = MODELS.find((m) => m.id === e.target.value);
          if (model) onModelSelect(model);
        }}
        disabled={disabled}
        className="appearance-none px-4 py-2 pr-10 rounded-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 text-gray-900 dark:text-white font-medium hover:bg-white dark:hover:bg-gray-800 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-lg"
      >
        {MODELS.map((model) => (
          <option key={model.id} value={model.id} className="bg-white dark:bg-gray-800">
            {model.name}
          </option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
        <svg
          className="w-4 h-4 text-gray-900 dark:text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
}
