'use client';

import { Chat } from '@/types';
import { formatTimestamp } from '@/lib/utils';

interface ChatSidebarProps {
  chats: Chat[];
  currentChatId: string;
  onSelectChat: (chatId: string) => void;
  onNewChat: () => void;
  onDeleteChat: (chatId: string) => void;
  onSettingsClick: () => void;
}

export function ChatSidebar({
  chats,
  currentChatId,
  onSelectChat,
  onNewChat,
  onDeleteChat,
  onSettingsClick,
}: ChatSidebarProps) {
  return (
    <div className="w-64 h-full bg-gray-50 dark:bg-[#0a0a0a] border-r border-gray-200 dark:border-gray-800 flex flex-col transition-colors duration-300">
      {/* New Chat Button */}
      <div className="p-4">
        <button
          onClick={onNewChat}
          className="w-full px-4 py-2.5 rounded-full bg-black dark:bg-white text-white dark:text-black font-medium text-sm transition-all duration-300 hover:bg-gray-800 dark:hover:bg-gray-100 active:scale-95 flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          New Chat
        </button>
      </div>

      {/* Chat History */}
      <div className="flex-1 overflow-y-auto px-2">
        {chats.map((chat) => (
          <div
            key={chat.id}
            className={`group relative px-3 py-2.5 mb-1 rounded-xl cursor-pointer transition-all duration-200 ${
              chat.id === currentChatId
                ? 'bg-black/5 dark:bg-white/10'
                : 'hover:bg-black/[0.03] dark:hover:bg-white/5'
            }`}
            onClick={() => onSelectChat(chat.id)}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-black dark:text-white truncate">
                  {chat.title}
                </div>
                <div className="text-xs text-black/40 dark:text-white/40 mt-0.5">
                  {formatTimestamp(chat.updatedAt)}
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteChat(chat.id);
                }}
                className="opacity-0 group-hover:opacity-100 p-1 rounded-lg hover:bg-red-500/10 text-red-500 transition-all duration-200"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Settings at Bottom */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-800">
        <button
          onClick={onSettingsClick}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-200"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Settings
        </button>
      </div>
    </div>
  );
}
