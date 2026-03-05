// Core types for Nova AI

export type Theme = 'light' | 'dark';

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  isStreaming?: boolean;
  toolUsed?: 'wikipedia' | 'websearch' | null;
  toolCalls?: ToolCall[];
}

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
  modelId: string;
}

export interface ModelConfig {
  id: string;
  name: string;
  size: string;
  url: string;
  contextSize: number;
  description: string;
}

export interface ToolCall {
  id: string;
  name: string;
  parameters: Record<string, any>;
  result?: ToolResult;
}

export interface ToolResult {
  success: boolean;
  data?: any;
  error?: string;
}

export interface WikipediaResult {
  title: string;
  summary: string;
  link: string;
}

export interface WebSearchResult {
  title: string;
  snippet: string;
  link: string;
}
