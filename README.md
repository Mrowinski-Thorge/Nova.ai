# Nova AI

A modern AI chatbot website powered by Liquid AI models running directly in your browser using the wllama inference engine.

![Nova AI](https://img.shields.io/badge/AI-Powered-purple) ![Next.js](https://img.shields.io/badge/Next.js-16-black) ![React](https://img.shields.io/badge/React-19-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)

## Features

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

### 🔧 External Tools
- **Wikipedia Search** - Get information from Wikipedia
- **Web Search** - Search the web using DuckDuckGo
- Automatic tool calling based on user queries

### 🎨 UI/UX
- Google-inspired minimal design
- Glassmorphism with frosted glass panels
- Soft gradients and blur backgrounds
- Dark/Light theme support
- Smooth animations with Framer Motion
- Responsive design for all screen sizes

## Technology Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: TailwindCSS 4, Framer Motion
- **AI Inference**: wllama (WebAssembly + WebGPU)
- **Markdown**: react-markdown, react-syntax-highlighter
- **Models**: Liquid AI Models (GGUF Q4_K format)

## Getting Started

### Prerequisites

- Node.js 20 or higher
- npm, yarn, or pnpm
- Modern browser with WebGPU support (Chrome 113+, Edge 113+)

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

3. **Run the development server**
```bash
npm run dev
```

4. **Open your browser**

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
│   ├── chat/               # Chat page
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Landing page
│   └── globals.css         # Global styles
├── components/
│   ├── chat/               # Chat components
│   │   ├── ChatMessage.tsx
│   │   ├── ChatInput.tsx
│   │   ├── ChatSidebar.tsx
│   │   └── Header.tsx
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
└── types/
    └── index.ts            # TypeScript types
```

## Usage

### Starting a Chat

1. Visit the homepage at `http://localhost:3000`
2. Click on "Nova Chat" to start chatting
3. Select your preferred AI model from the dropdown
4. Wait for the model to load (first time only)
5. Start typing your message in the input box

### Using Tools

The AI automatically detects when to use tools:

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

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.

## Acknowledgments

- **Liquid AI** for the language models
- **wllama** for the WebAssembly inference engine
- **Next.js** and **React** teams for the excellent framework
- **Vercel** for TailwindCSS and deployment platform

## Footer

**Nova AI**
Powered by Liquid AI Models
Inference engine powered by wllama

---

Built with ❤️ using Next.js, React, and TailwindCSS

