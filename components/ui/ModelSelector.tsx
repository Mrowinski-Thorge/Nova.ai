'use client';

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
        className="appearance-none px-4 py-2 pr-8 rounded-full bg-black/5 dark:bg-white/10 border-none text-black dark:text-white font-medium text-sm hover:bg-black/10 dark:hover:bg-white/15 transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none"
      >
        {MODELS.map((model) => (
          <option key={model.id} value={model.id} className="bg-white dark:bg-gray-900">
            {model.name}
          </option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
        <svg className="w-4 h-4 text-black dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
}
