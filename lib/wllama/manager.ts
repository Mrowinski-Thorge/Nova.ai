import { Wllama } from '@wllama/wllama';
import { ModelConfig } from '@/types';

export class WllamaManager {
  private wllama: Wllama | null = null;
  private currentModel: string | null = null;
  private loadingPromise: Promise<void> | null = null;
  private modelCache: Map<string, boolean> = new Map();

  async initialize() {
    if (this.wllama) return;

    const { Wllama } = await import('@wllama/wllama');
    this.wllama = new Wllama({
      'single-thread/wllama.wasm': 'https://unpkg.com/@wllama/wllama@latest/esm/single-thread/wllama.wasm',
      'multi-thread/wllama.wasm': 'https://unpkg.com/@wllama/wllama@latest/esm/multi-thread/wllama.wasm',
    });
  }

  async loadModel(config: ModelConfig, onProgress?: (progress: number) => void): Promise<void> {
    if (this.loadingPromise) {
      await this.loadingPromise;
    }

    if (this.currentModel === config.id && this.modelCache.has(config.id)) {
      return;
    }

    this.loadingPromise = this._loadModel(config, onProgress);
    await this.loadingPromise;
    this.loadingPromise = null;
  }

  private async _loadModel(config: ModelConfig, onProgress?: (progress: number) => void): Promise<void> {
    await this.initialize();

    if (!this.wllama) {
      throw new Error('Wllama not initialized');
    }

    const maxRetries = 3;
    let lastError: Error | null = null;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        // Unload previous model if exists
        if (this.currentModel) {
          await this.wllama.exit();
        }

        // Load new model
        await this.wllama.loadModelFromUrl(config.url, {
          n_ctx: config.contextSize,
          n_threads: navigator.hardwareConcurrency || 4,
          embeddings: false,
          progressCallback: (progress) => {
            if (onProgress) {
              onProgress(progress.loaded / progress.total);
            }
          },
        });

        this.currentModel = config.id;
        this.modelCache.set(config.id, true);
        return; // Success
      } catch (error) {
        lastError = error as Error;
        console.error(`Model loading attempt ${attempt + 1} failed:`, error);

        // Wait before retrying (exponential backoff)
        if (attempt < maxRetries - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, attempt)));
        }
      }
    }

    this.currentModel = null;
    throw new Error(`Failed to load model after ${maxRetries} attempts: ${lastError?.message || 'Unknown error'}`);
  }

  async generateResponse(
    prompt: string,
    onToken?: (token: string) => void
  ): Promise<string> {
    if (!this.wllama || !this.currentModel) {
      throw new Error('Model not loaded');
    }

    let fullResponse = '';

    try {
      const result = await this.wllama.createCompletion(prompt, {
        nPredict: 512,
        sampling: {
          temp: 0.7,
          top_k: 40,
          top_p: 0.9,
        },
        stopTokens: [],
      });

      for await (const token of result) {
        fullResponse += token;
        if (onToken) {
          onToken(token);
        }
      }

      return fullResponse;
    } catch (error) {
      console.error('Generation error:', error);
      throw error;
    }
  }

  async unloadModel(): Promise<void> {
    if (this.wllama && this.currentModel) {
      await this.wllama.exit();
      this.currentModel = null;
    }
  }

  isModelLoaded(modelId: string): boolean {
    return this.currentModel === modelId;
  }

  getCurrentModel(): string | null {
    return this.currentModel;
  }
}

// Singleton instance
let wllamaInstance: WllamaManager | null = null;

export function getWllamaManager(): WllamaManager {
  if (!wllamaInstance) {
    wllamaInstance = new WllamaManager();
  }
  return wllamaInstance;
}
