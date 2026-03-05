'use client';

import Link from 'next/link';
import { useTheme } from '@/lib/hooks/useTheme';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

export default function HomePage() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-white dark:bg-black transition-colors duration-300">
      {/* Navbar - Pathly Floating Glass */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 w-[90%] max-w-4xl z-50">
        <div className="bg-white/80 dark:bg-[#111]/80 backdrop-blur-2xl rounded-[24px] px-8 py-4 shadow-[0_8px_32px_0_rgba(0,0,0,0.08)] dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] border border-gray-200 dark:border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <svg className="w-7 h-7 text-black dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <circle cx="12" cy="12" r="10" />
                <path d="M12 8v8M8 12h8" />
              </svg>
              <span className="text-black dark:text-white font-semibold text-xl tracking-tight">Nova AI</span>
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle theme={theme} onToggle={toggleTheme} />
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="min-h-screen flex items-center justify-center px-4 pt-20">
        <div className="text-center max-w-4xl">
          <h1 className="text-black dark:text-white text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-light tracking-tighter leading-none mb-8">
            Nova AI
          </h1>

          <p className="text-black/70 dark:text-white/90 text-xl sm:text-2xl md:text-3xl font-extralight tracking-wide mb-12">
            AI-powered conversations in your browser
          </p>

          <Link href="/chat">
            <button className="bg-black dark:bg-white text-white dark:text-black px-12 py-5 rounded-full text-lg font-medium hover:bg-gray-900 dark:hover:bg-gray-100 transition-all duration-300 hover:scale-105 active:scale-95 shadow-2xl mb-16">
              Start chatting
            </button>
          </Link>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto mt-8">
            {[
              { icon: '🔒', title: 'Private', desc: 'Runs entirely in your browser' },
              { icon: '⚡', title: 'Fast', desc: 'Liquid AI models with wllama' },
              { icon: '🔍', title: 'Tools', desc: 'Web Search & Wikipedia' },
              { icon: '🌙', title: 'Modern', desc: 'Dark & Light mode' },
            ].map((feature) => (
              <div
                key={feature.title}
                className="p-6 rounded-3xl bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 hover:border-gray-400 dark:hover:border-gray-600 transition-all duration-300 hover:-translate-y-1 text-left"
              >
                <div className="text-2xl mb-3">{feature.icon}</div>
                <h3 className="text-base font-semibold text-black dark:text-white mb-1">{feature.title}</h3>
                <p className="text-sm text-black/60 dark:text-white/60 font-light">{feature.desc}</p>
              </div>
            ))}
          </div>

          {/* Tech Stack */}
          <div className="mt-20 flex flex-wrap justify-center gap-3">
            {['Liquid AI', 'wllama', 'Next.js', 'React', 'TailwindCSS'].map((tech) => (
              <span
                key={tech}
                className="px-4 py-2 rounded-full text-sm font-medium text-black/60 dark:text-white/60 bg-black/[0.03] dark:bg-white/5 border border-gray-200 dark:border-gray-800"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-12 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-black/40 dark:text-white/40 text-sm">
            Nova AI · Powered by Liquid AI Models
          </p>
        </div>
      </footer>
    </div>
  );
}
