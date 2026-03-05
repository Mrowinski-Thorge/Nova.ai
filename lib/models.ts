import { ModelConfig } from '@/types';

export const MODELS: ModelConfig[] = [
  {
    id: 'lfm2-350m-q4k',
    name: 'LFM2-350M Q4_K',
    size: '350M',
    url: 'https://huggingface.co/LiquidAI/LFM-2-350M-GGUF/resolve/main/LFM-2-350M-Q4_K_M.gguf',
    contextSize: 4096,
    description: 'Fast and efficient 350M parameter model',
  },
  {
    id: 'lfm2-700m-q4k',
    name: 'LFM2-700M Q4_K',
    size: '700M',
    url: 'https://huggingface.co/LiquidAI/LFM-2-700M-GGUF/resolve/main/LFM-2-700M-Q4_K_M.gguf',
    contextSize: 4096,
    description: 'Balanced performance and quality',
  },
  {
    id: 'lfm2-1.2b-q4k',
    name: 'LFM2-1.2B Q4_K',
    size: '1.2B',
    url: 'https://huggingface.co/LiquidAI/LFM-2-1.2B-GGUF/resolve/main/LFM-2-1.2B-Q4_K_M.gguf',
    contextSize: 4096,
    description: 'Highest quality responses',
  },
];

export const DEFAULT_MODEL = MODELS[0];
