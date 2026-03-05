'use client';

import { useState, useEffect, useRef } from 'react';
import { Header } from '@/components/chat/Header';
import { ChatSidebar } from '@/components/chat/ChatSidebar';
import { ChatMessage } from '@/components/chat/ChatMessage';
import { ChatInput } from '@/components/chat/ChatInput';
import { Settings } from '@/components/chat/Settings';
import { useTheme } from '@/lib/hooks/useTheme';
import { getWllamaManager } from '@/lib/wllama/manager';
import { MODELS, DEFAULT_MODEL } from '@/lib/models';
import { Chat, Message, ModelConfig } from '@/types';
import { generateId } from '@/lib/utils';
import { searchWikipedia } from '@/lib/tools/wikipedia';
import { webSearch } from '@/lib/tools/websearch';

export default function ChatPage() {
  const { theme, toggleTheme } = useTheme();
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string>('');
  const [currentModel, setCurrentModel] = useState(DEFAULT_MODEL.id);
  const [isModelLoading, setIsModelLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingError, setLoadingError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [toolsEnabled, setToolsEnabled] = useState({ wikipedia: true, websearch: true, autoMode: true });
  const [debugLogs, setDebugLogs] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const wllamaManager = useRef(getWllamaManager());

  const addLog = (msg: string) => {
    setDebugLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  // Load chats from localStorage
  useEffect(() => {
    const savedChats = localStorage.getItem('nova-chats');
    if (savedChats) {
      const parsedChats = JSON.parse(savedChats);
      setChats(parsedChats);
      if (parsedChats.length > 0) {
        setCurrentChatId(parsedChats[0].id);
      }
    } else {
      createNewChat();
    }

    const savedTools = localStorage.getItem('nova-tools');
    if (savedTools) {
      try {
        const parsed = JSON.parse(savedTools);
        setToolsEnabled({ wikipedia: true, websearch: true, autoMode: true, ...parsed });
      } catch { /* use defaults */ }
    }
  }, []);

  // Save chats to localStorage
  useEffect(() => {
    if (chats.length > 0) {
      localStorage.setItem('nova-chats', JSON.stringify(chats));
    }
  }, [chats]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chats, currentChatId]);

  // Load initial model
  useEffect(() => {
    loadModel(DEFAULT_MODEL);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadModel = async (model: ModelConfig) => {
    setIsModelLoading(true);
    setLoadingProgress(0);
    setLoadingError(null);
    addLog(`Loading model: ${model.name}`);

    try {
      await wllamaManager.current.loadModel(model, (progress) => {
        setLoadingProgress(progress * 100);
      });
      setCurrentModel(model.id);
      addLog(`Model loaded: ${model.name}`);
    } catch (error) {
      console.error('Failed to load model:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setLoadingError(errorMessage);
      addLog(`Model load error: ${errorMessage}`);
    } finally {
      setIsModelLoading(false);
      setLoadingProgress(0);
    }
  };

  const createNewChat = () => {
    const newChat: Chat = {
      id: generateId(),
      title: 'New Chat',
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
      modelId: currentModel,
    };
    setChats((prev) => [newChat, ...prev]);
    setCurrentChatId(newChat.id);
  };

  const deleteChat = (chatId: string) => {
    setChats((prev) => prev.filter((c) => c.id !== chatId));
    if (currentChatId === chatId) {
      const remainingChats = chats.filter((c) => c.id !== chatId);
      if (remainingChats.length > 0) {
        setCurrentChatId(remainingChats[0].id);
      } else {
        createNewChat();
      }
    }
  };

  const currentChat = chats.find((c) => c.id === currentChatId);

  const updateChat = (chatId: string, updates: Partial<Chat>) => {
    setChats((prev) =>
      prev.map((chat) =>
        chat.id === chatId
          ? { ...chat, ...updates, updatedAt: Date.now() }
          : chat
      )
    );
  };

  const detectToolUsage = (userMessage: string): { shouldUseTool: boolean; toolName?: 'wikipedia' | 'websearch'; query?: string } => {
    const lowerMessage = userMessage.toLowerCase();

    // Auto mode: AI-like detection
    if (toolsEnabled.autoMode) {
      // Wikipedia triggers
      if (/\b(wiki|wikipedia|who is|who was|what is|what was|history of|biography|define)\b/.test(lowerMessage)) {
        const query = userMessage.replace(/\b(wikipedia|wiki|search|for|about|on|who is|who was|what is|what was|tell me about)\b/gi, '').trim();
        return { shouldUseTool: true, toolName: 'wikipedia', query: query || userMessage };
      }
      // Web search triggers
      if (/\b(search|find|look up|latest|current|news|today|recent|how to|where)\b/.test(lowerMessage)) {
        return { shouldUseTool: true, toolName: 'websearch', query: userMessage };
      }
      return { shouldUseTool: false };
    }

    // Manual mode
    if (toolsEnabled.wikipedia && /\b(wiki|wikipedia)\b/.test(lowerMessage)) {
      const query = userMessage.replace(/\b(wikipedia|wiki|search|for|about|on)\b/gi, '').trim();
      return { shouldUseTool: true, toolName: 'wikipedia', query: query || userMessage };
    }

    if (toolsEnabled.websearch && /\b(search|find|look up)\b/.test(lowerMessage)) {
      return { shouldUseTool: true, toolName: 'websearch', query: userMessage };
    }

    return { shouldUseTool: false };
  };

  const callTool = async (toolName: 'wikipedia' | 'websearch', query: string): Promise<string> => {
    addLog(`Calling tool: ${toolName} with query: "${query}"`);

    try {
      if (toolName === 'wikipedia') {
        const result = await searchWikipedia(query);
        addLog(`Wikipedia result: ${result.title}`);
        return `[Wikipedia Result]\nTitle: ${result.title}\nSummary: ${result.summary}\nLink: ${result.link}`;
      } else if (toolName === 'websearch') {
        const results = await webSearch(query);
        addLog(`Web search: ${results.length} results`);
        const formatted = results
          .map((r) => `- ${r.title}\n  ${r.snippet}\n  ${r.link}`)
          .join('\n\n');
        return `[Web Search Results]\n${formatted}`;
      }
      return '';
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Unknown error';
      addLog(`Tool error (${toolName}): ${msg}`);
      return `[Tool Error] Failed to execute ${toolName}: ${msg}`;
    }
  };

  const sendMessage = async (content: string) => {
    if (!currentChat || isGenerating) return;

    const userMessage: Message = {
      id: generateId(),
      role: 'user',
      content,
      timestamp: Date.now(),
    };

    const updatedMessages = [...currentChat.messages, userMessage];
    updateChat(currentChatId, {
      messages: updatedMessages,
      title: currentChat.messages.length === 0 ? content.slice(0, 50) : currentChat.title,
    });

    setIsGenerating(true);

    try {
      // Check if we should use a tool
      const toolCheck = detectToolUsage(content);
      let prompt = content;
      let toolUsed: 'wikipedia' | 'websearch' | null = null;

      if (toolCheck.shouldUseTool && toolCheck.toolName && toolCheck.query) {
        toolUsed = toolCheck.toolName;
        const toolResult = await callTool(toolCheck.toolName, toolCheck.query);
        prompt = `Context from ${toolCheck.toolName}:\n${toolResult}\n\nUser question: ${content}\n\nPlease provide a helpful response based on the context above.`;
      } else {
        // Build conversation history
        const history = updatedMessages
          .slice(-5)
          .map((m) => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`)
          .join('\n\n');
        prompt = `${history}\n\nAssistant:`;
      }

      const assistantMessage: Message = {
        id: generateId(),
        role: 'assistant',
        content: '',
        timestamp: Date.now(),
        isStreaming: true,
        toolUsed,
      };

      const messagesWithAssistant = [...updatedMessages, assistantMessage];
      updateChat(currentChatId, { messages: messagesWithAssistant });

      let fullResponse = '';

      await wllamaManager.current.generateResponse(prompt, (token) => {
        fullResponse += token;
        const updatedAssistant = {
          ...assistantMessage,
          content: fullResponse,
        };
        const finalMessages = [...updatedMessages, updatedAssistant];
        updateChat(currentChatId, { messages: finalMessages });
      });

      const finalAssistant = {
        ...assistantMessage,
        content: fullResponse,
        isStreaming: false,
      };
      const finalMessages = [...updatedMessages, finalAssistant];
      updateChat(currentChatId, { messages: finalMessages });
      addLog(`Response generated: ${fullResponse.length} chars`);
    } catch (error) {
      console.error('Generation error:', error);
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      addLog(`Generation error: ${errorMsg}`);
      const errorMessage: Message = {
        id: generateId(),
        role: 'assistant',
        content: 'Sorry, I encountered an error generating a response. Please try again.',
        timestamp: Date.now(),
      };
      updateChat(currentChatId, {
        messages: [...updatedMessages, errorMessage],
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const regenerateLastMessage = async () => {
    if (!currentChat || currentChat.messages.length < 2) return;

    const lastUserMessage = [...currentChat.messages]
      .reverse()
      .find((m) => m.role === 'user');

    if (!lastUserMessage) return;

    const messagesWithoutLast = currentChat.messages.slice(0, -1);
    updateChat(currentChatId, { messages: messagesWithoutLast });

    await sendMessage(lastUserMessage.content);
  };

  return (
    <div className="h-screen flex flex-col bg-white dark:bg-black transition-colors duration-300">
      <Header
        currentModel={currentModel}
        onModelSelect={loadModel}
        theme={theme}
        onThemeToggle={toggleTheme}
        isLoading={isModelLoading}
      />

      <Settings
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        toolsEnabled={toolsEnabled}
        onToolsChange={(tools) => {
          setToolsEnabled(tools);
          localStorage.setItem('nova-tools', JSON.stringify(tools));
        }}
        debugLogs={debugLogs}
        onClearLogs={() => setDebugLogs([])}
      />

      <div className="flex-1 flex overflow-hidden">
        <ChatSidebar
          chats={chats}
          currentChatId={currentChatId}
          onSelectChat={setCurrentChatId}
          onNewChat={createNewChat}
          onDeleteChat={deleteChat}
          onSettingsClick={() => setIsSettingsOpen(true)}
        />

        <div className="flex-1 flex flex-col">
          {loadingError && (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center max-w-md">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
                  <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-black dark:text-white mb-2 tracking-tight">
                  Failed to Load Model
                </h2>
                <p className="text-sm text-black/60 dark:text-white/60 mb-6">
                  {loadingError}
                </p>
                <button
                  onClick={() => {
                    const model = MODELS.find(m => m.id === currentModel);
                    if (model) loadModel(model);
                  }}
                  className="px-6 py-3 rounded-full bg-black dark:bg-white text-white dark:text-black font-medium text-sm hover:bg-gray-800 dark:hover:bg-gray-100 transition-all duration-300 active:scale-95"
                >
                  Retry Loading Model
                </button>
              </div>
            </div>
          )}

          {isModelLoading && !loadingError && (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full border-2 border-gray-200 dark:border-gray-800 border-t-black dark:border-t-white animate-spin" />
                <p className="text-base font-medium text-black dark:text-white mb-3">
                  Loading Model
                </p>
                <div className="w-56 h-1.5 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-black dark:bg-white rounded-full transition-all duration-300"
                    style={{ width: `${loadingProgress}%` }}
                  />
                </div>
                <p className="text-sm text-black/50 dark:text-white/50 mt-2">
                  {Math.round(loadingProgress)}%
                </p>
              </div>
            </div>
          )}

          {!isModelLoading && !loadingError && (
            <>
              <div className="flex-1 overflow-y-auto">
                {currentChat && currentChat.messages.length > 0 ? (
                  <>
                    {currentChat.messages.map((message) => (
                      <ChatMessage
                        key={message.id}
                        message={message}
                        theme={theme}
                        onRegenerate={
                          message.id === currentChat.messages[currentChat.messages.length - 1]?.id
                            ? regenerateLastMessage
                            : undefined
                        }
                      />
                    ))}
                    <div ref={messagesEndRef} />
                  </>
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-black dark:bg-white flex items-center justify-center">
                        <span className="text-white dark:text-black text-2xl font-bold">N</span>
                      </div>
                      <h2 className="text-2xl font-semibold text-black dark:text-white mb-2 tracking-tight">
                        Start a conversation
                      </h2>
                      <p className="text-black/50 dark:text-white/50 text-sm">
                        Type a message below to begin chatting with Nova AI
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <ChatInput
                onSend={sendMessage}
                disabled={isGenerating}
                toolsEnabled={toolsEnabled}
                onToolsChange={(tools) => {
                  setToolsEnabled(tools);
                  localStorage.setItem('nova-tools', JSON.stringify(tools));
                }}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
