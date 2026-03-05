'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Header } from '@/components/chat/Header';
import { ChatSidebar } from '@/components/chat/ChatSidebar';
import { ChatMessage } from '@/components/chat/ChatMessage';
import { ChatInput } from '@/components/chat/ChatInput';
import { useTheme } from '@/lib/hooks/useTheme';
import { getWllamaManager } from '@/lib/wllama/manager';
import { MODELS, DEFAULT_MODEL } from '@/lib/models';
import { Chat, Message, ModelConfig } from '@/types';
import { generateId } from '@/lib/utils';

export default function ChatPage() {
  const { theme, toggleTheme } = useTheme();
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string>('');
  const [currentModel, setCurrentModel] = useState(DEFAULT_MODEL.id);
  const [isModelLoading, setIsModelLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const wllamaManager = useRef(getWllamaManager());

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
  }, []);

  const loadModel = async (model: ModelConfig) => {
    setIsModelLoading(true);
    setLoadingProgress(0);

    try {
      await wllamaManager.current.loadModel(model, (progress) => {
        setLoadingProgress(progress * 100);
      });
      setCurrentModel(model.id);
    } catch (error) {
      console.error('Failed to load model:', error);
      alert('Failed to load model. Please try again.');
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

  const detectToolUsage = (userMessage: string): { shouldUseTool: boolean; toolName?: string; query?: string } => {
    const lowerMessage = userMessage.toLowerCase();

    // Wikipedia detection
    if (lowerMessage.includes('wikipedia') || lowerMessage.includes('wiki')) {
      const query = userMessage.replace(/wikipedia|wiki|search|for|about|on/gi, '').trim();
      return { shouldUseTool: true, toolName: 'wikipedia', query };
    }

    // Web search detection
    if (lowerMessage.includes('search') || lowerMessage.includes('find') || lowerMessage.includes('look up')) {
      return { shouldUseTool: true, toolName: 'websearch', query: userMessage };
    }

    return { shouldUseTool: false };
  };

  const callTool = async (toolName: string, query: string): Promise<string> => {
    try {
      const response = await fetch(`/api/tools/${toolName}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });

      const data = await response.json();

      if (toolName === 'wikipedia') {
        return `[Wikipedia Result]\nTitle: ${data.title}\nSummary: ${data.summary}\nLink: ${data.link}`;
      } else if (toolName === 'websearch') {
        const results = data.results.map((r: any) =>
          `- ${r.title}\n  ${r.snippet}\n  ${r.link}`
        ).join('\n\n');
        return `[Web Search Results]\n${results}`;
      }

      return '';
    } catch (error) {
      return `[Tool Error] Failed to execute ${toolName}`;
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

      if (toolCheck.shouldUseTool && toolCheck.toolName && toolCheck.query) {
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
    } catch (error) {
      console.error('Generation error:', error);
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

    // Remove last assistant message
    const messagesWithoutLast = currentChat.messages.slice(0, -1);
    updateChat(currentChatId, { messages: messagesWithoutLast });

    // Regenerate
    await sendMessage(lastUserMessage.content);
  };

  const clearChat = () => {
    if (currentChat) {
      updateChat(currentChatId, { messages: [] });
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-gray-900">
      <Header
        currentModel={currentModel}
        onModelSelect={loadModel}
        theme={theme}
        onThemeToggle={toggleTheme}
        isLoading={isModelLoading}
      />

      <div className="flex-1 flex overflow-hidden">
        <ChatSidebar
          chats={chats}
          currentChatId={currentChatId}
          onSelectChat={setCurrentChatId}
          onNewChat={createNewChat}
          onDeleteChat={deleteChat}
        />

        <div className="flex-1 flex flex-col">
          {isModelLoading && (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <motion.div
                  className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-500 to-pink-500"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                />
                <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Loading Model
                </p>
                <div className="w-64 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${loadingProgress}%` }}
                  />
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  {Math.round(loadingProgress)}%
                </p>
              </div>
            </div>
          )}

          {!isModelLoading && (
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
                      <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center"
                      >
                        <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                          <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
                        </svg>
                      </motion.div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        Start a conversation
                      </h2>
                      <p className="text-gray-500 dark:text-gray-400">
                        Type a message below to begin chatting with Nova AI
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <ChatInput onSend={sendMessage} disabled={isGenerating} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
