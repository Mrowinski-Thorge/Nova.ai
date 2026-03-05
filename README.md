# Nova AI

A modern AI chatbot website powered by Liquid AI models running directly in your browser using the wllama inference engine. Now with Supabase authentication and enhanced frosted glass design!

![Nova AI](https://img.shields.io/badge/AI-Powered-purple) ![Next.js](https://img.shields.io/badge/Next.js-16-black) ![React](https://img.shields.io/badge/React-19-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![Supabase](https://img.shields.io/badge/Supabase-Auth-green)

## Features

### 🔐 Authentication (NEW!)
- **Email/Password Authentication** via Supabase
- User account management
- Account settings page
- Account deletion with 7-day grace period
- Protected routes and user sessions
- Sign in/out functionality in header

### 🤖 AI Models
- **LFM2-350M Q4_K** - Fast and efficient 350M parameter model
- **LFM2-700M Q4_K** - Balanced performance and quality
- **LFM2-1.2B Q4_K** - Highest quality responses

All models run locally in your browser with:
- ✨ Dynamic model loading and switching
- 🚀 WebGPU acceleration
- 💾 Model caching after first load
- 🔄 Token streaming for real-time responses
- 📊 Context window management

### 💬 Chat Features
- Real-time streaming responses
- Markdown rendering with syntax highlighting
- Code blocks with copy functionality
- Regenerate response option
- Chat history management
- Clear chat functionality
- Multiple concurrent chats
- **Web Search Mode Toggle** (NEW!) - Off/Auto/Always On

### 🔧 External Tools
- **Wikipedia Search** - Get information from Wikipedia
- **Web Search** - Search the web using DuckDuckGo
- Automatic tool calling based on user queries
- Manual control via web search mode toggle

### 🎨 UI/UX
- **Enhanced Frosted Glass Design** (NEW!) - Beautiful glassmorphism throughout
- Google-inspired minimal design
- Soft gradients and blur backgrounds
- Dark/Light theme support
- Smooth animations with Framer Motion
- **Fully Responsive** - Optimized for mobile and desktop
- User-friendly account menus and dropdowns

## Technology Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Authentication**: Supabase (SSR-ready)
- **Styling**: TailwindCSS 4, Framer Motion
- **AI Inference**: wllama (WebAssembly + WebGPU)
- **Markdown**: react-markdown, react-syntax-highlighter
- **Models**: Liquid AI Models (GGUF Q4_K format)

## Getting Started

### Prerequisites

- Node.js 20 or higher
- npm, yarn, or pnpm
- Modern browser with WebGPU support (Chrome 113+, Edge 113+)
- Supabase account (for authentication features)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/Mrowinski-Thorge/Nova.ai.git
cd Nova.ai
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up Supabase** (Optional, for authentication)

See [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) for detailed setup instructions.

Quick setup:
- Create a Supabase project at https://supabase.com
- Copy `.env.example` to `.env.local`
- Add your Supabase URL and anon key to `.env.local`

```bash
cp .env.example .env.local
# Edit .env.local with your Supabase credentials
```

4. **Run the development server**
```bash
npm run dev
```

5. **Open your browser**

Navigate to [http://localhost:3000](http://localhost:3000)

### Building for Production

```bash
npm run build
npm start
```

## Project Structure

```
Nova.ai/
├── app/
│   ├── api/
│   │   └── tools/          # API routes for external tools
│   ├── auth/               # Authentication page (NEW!)
│   ├── acc/                # Account pages (NEW!)
│   │   ├── page.tsx        # Account welcome page
│   │   └── settings/       # Account settings
│   ├── chat/               # Chat page
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Landing page
│   └── globals.css         # Global styles
├── components/
│   ├── chat/               # Chat components
│   │   ├── ChatMessage.tsx
│   │   ├── ChatInput.tsx   # Enhanced with web search toggle
│   │   ├── ChatSidebar.tsx
│   │   └── Header.tsx      # Updated with auth buttons
│   └── ui/                 # UI components
│       ├── ThemeToggle.tsx
│       └── ModelSelector.tsx
├── lib/
│   ├── wllama/             # wllama integration
│   │   └── manager.ts
│   ├── tools/              # External tools
│   │   ├── wikipedia.ts
│   │   └── websearch.ts
│   ├── hooks/              # React hooks
│   │   └── useTheme.ts
│   ├── models.ts           # Model configurations
│   └── utils.ts            # Utility functions
├── utils/
│   └── supabase/           # Supabase utilities (NEW!)
│       ├── client.ts       # Browser client
│       ├── server.ts       # Server client
│       └── middleware.ts   # Middleware helper
├── types/
│   └── index.ts            # TypeScript types
├── middleware.ts           # Next.js middleware (NEW!)
└── SUPABASE_SETUP.md       # Supabase setup guide (NEW!)
```

## Usage

### Authentication

1. Click "Sign In" in the header
2. Create an account or sign in with existing credentials
3. Access your account page and settings
4. Manage your account, including deletion with 7-day grace period

### Starting a Chat

1. Visit the homepage at `http://localhost:3000`
2. Click on "Nova Chat" to start chatting
3. Select your preferred AI model from the dropdown
4. Wait for the model to load (first time only)
5. Start typing your message in the input box

### Using Web Search Modes

Click the icon on the left side of the chat input to toggle between:
- **Off** ⛔ - No web search
- **Auto** ⚡ - Automatically detect when to search
- **Always On** 🔍 - Search web for every query

### Using Tools

The AI automatically detects when to use tools (in Auto mode):

**Wikipedia Search**:
```
"Tell me about quantum physics from Wikipedia"
"Search Wikipedia for Albert Einstein"
```

**Web Search**:
```
"Search the web for latest AI news"
"Find information about climate change"
```

### Model Selection

Switch between models anytime:
- LFM2-350M: Best for quick responses
- LFM2-700M: Balanced quality and speed
- LFM2-1.2B: Highest quality, slower

### Theme Toggle

Click the sun/moon icon in the top right to switch between light and dark themes.

## Browser Compatibility

Nova AI requires a modern browser with WebGPU support:

- ✅ Chrome/Edge 113+
- ✅ Opera 99+
- ⚠️ Firefox (experimental, enable via flags)
- ❌ Safari (WebGPU not yet supported)

## Performance Tips

1. **First Load**: The first model load will download the GGUF file (200MB-500MB). Subsequent loads use browser cache.

2. **Memory**: Ensure your device has at least 4GB RAM available for the 1.2B model.

3. **WebGPU**: For best performance, ensure WebGPU is enabled in your browser.

## Mobile Support

Nova AI is fully responsive and optimized for mobile devices:
- Touch-friendly UI elements (44px minimum touch targets)
- Responsive layouts for phones and tablets
- Optimized text sizes to prevent zoom on iOS
- Proper viewport handling for all devices

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.

## Acknowledgments

- **Liquid AI** for the language models
- **wllama** for the WebAssembly inference engine
- **Supabase** for authentication infrastructure
- **Next.js** and **React** teams for the excellent framework
- **Vercel** for TailwindCSS and deployment platform

## Footer

**Nova AI**
Powered by Liquid AI Models
Inference engine powered by wllama

---

Built with ❤️ using Next.js, React, TailwindCSS, and Supabase


