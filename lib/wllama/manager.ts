import { ModelConfig } from '@/types';

/* eslint-disable @typescript-eslint/no-explicit-any */

export class WllamaManager {
  private wllama: any = null;
  private currentModel: string | null = null;
  private loadingPromise: Promise<void> | null = null;

  private async createInstance(): Promise<any> {
    const { Wllama } = await import('@wllama/wllama');
    return new Wllama({
      'single-thread/wllama.wasm': 'https://unpkg.com/@wllama/wllama@2.3.7/esm/single-thread/wllama.wasm',
      'multi-thread/wllama.wasm': 'https://unpkg.com/@wllama/wllama@2.3.7/esm/multi-thread/wllama.wasm',
    });
  }

  async initialize(): Promise<void> {
    if (this.wllama) return;
    this.wllama = await this.createInstance();
  }

  async loadModel(config: ModelConfig, onProgress?: (progress: number) => void): Promise<void> {
    if (this.loadingPromise) {
      await this.loadingPromise;
    }

    if (this.currentModel === config.id) {
      return;
    }

    this.loadingPromise = this._loadModel(config, onProgress);
    try {
      await this.loadingPromise;
    } finally {
      this.loadingPromise = null;
    }
  }

  private async _loadModel(config: ModelConfig, onProgress?: (progress: number) => void): Promise<void> {
    if (this.currentModel && this.wllama) {
      try {
        await this.wllama.exit();
      } catch {
        // ignore exit errors
      }
      this.wllama = null;
    }

    await this.initialize();

    if (!this.wllama) {
      throw new Error('Wllama not initialized');
    }

    const maxRetries = 3;
    let lastError: Error | null = null;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        await this.wllama.loadModelFromUrl(config.url, {
          n_ctx: config.contextSize,
          n_threads: Math.min(navigator.hardwareConcurrency || 4, 4),
          progressCallback: (progress: { loaded: number; total: number }) => {
            if (onProgress && progress.total > 0) {
              onProgress(progress.loaded / progress.total);
            }
          },
        });

        this.currentModel = config.id;
        return;
      } catch (error) {
        lastError = error as Error;
        console.error(`Model loading attempt ${attempt + 1} failed:`, error);

        try { await this.wllama?.exit(); } catch { /* ignore */ }
        this.wllama = null;
        await this.initialize();

        if (attempt < maxRetries - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
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

    try {
      let previousText = '';

      const result = await this.wllama.createCompletion(prompt, {
        nPredict: 512,
        sampling: {
          temp: 0.7,
          top_k: 40,
          top_p: 0.9,
        },
        onNewToken: (_token: number, _piece: Uint8Array, currentText: string) => {
          if (onToken && currentText.length > previousText.length) {
            const newPart = currentText.slice(previousText.length);
            previousText = currentText;
            onToken(newPart);
          }
        },
      });

      return typeof result === 'string' ? result : String(result);
    } catch (error) {
      console.error('Generation error:', error);
      throw error;
    }
  }

  async unloadModel(): Promise<void> {
    if (this.wllama && this.currentModel) {
      try {
        await this.wllama.exit();
      } catch { /* ignore */ }
      this.wllama = null;
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

let wllamaInstance: WllamaManager | null = null;

export function getWllamaManager(): WllamaManager {
  if (!wllamaInstance) {
    wllamaInstance = new WllamaManager();
  }
  return wllamaInstance;
}
