# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Socratone AI Toolkit is a full-stack AI application with:
- **Frontend**: Next.js 16 with React 19 (`apps/web`)
- **Backend**: Flask API for PDF extraction, YouTube transcription, and LLM integration (`apps/server`)
- **Monorepo**: Managed with pnpm workspaces and Turbo

Primary language for UI/comments is Korean.

## Commands

```bash
# Development
pnpm dev              # Start Next.js dev server with Turbo (http://localhost:4000)
pnpm start            # Start full stack with Docker (Flask on port 5001)
pnpm stop             # Stop Docker services

# Build & Lint
pnpm build            # Production build
pnpm lint             # ESLint (Flat Config format)
pnpm start:web        # Production Next.js server on port 4000

# Flask backend (in apps/server)
docker-compose up     # Start Flask API
```

## Architecture

### Monorepo Structure
```
apps/
├── web/              # Next.js frontend
│   └── src/
│       ├── app/      # App Router pages & API routes
│       ├── components/  # Shared React components
│       ├── hooks/    # Custom hooks (useScreenSize, etc.)
│       └── utils/    # Utilities (cn.ts for classnames)
└── server/           # Flask backend
    ├── routes/       # API blueprints (chat_gpt, pdf, youtube)
    └── utils/
```

### Key Frontend Patterns

**State Management**: Zustand with localStorage persistence. See `apps/web/src/app/chat/hooks/useSavedMessages.ts` for the pattern combining Zustand store with localStorage sync.

**Streaming Chat**: All AI responses use Server-Sent Events (SSE). The flow is:
- `postChatGptStream()` in `ChatBox/utils.ts` → POST `/api/chat`
- Route handler in `app/api/chat/route.ts` routes to appropriate model handler
- Streaming utilities in `app/api/chat/utils.ts` handle each provider's SSE format

**Multi-Model Support**: Routes to different backends based on model selection:
- OpenAI: gpt-5.1, gpt-5-mini, gpt-4o, gpt-4.1
- Anthropic: claude-sonnet-4
- Ollama (localhost:11434): deepseek-r1:7b, exaone3.5:latest
- Hybrid: deepseek-to-exaone (combines DeepSeek reasoning with ExaOne generation)

**Resizable Sidebar**: ChatBox component (lines 289-345) implements drag-to-resize with mouse events, clamped 300-600px, persisted to localStorage.

### API Routes

- `POST /api/chat` - Streaming chat with model routing
- Flask endpoints via Docker on port 5001:
  - PDF extraction
  - YouTube transcription

### Type Definitions

Key types in `apps/web/src/types/types.ts`:
- `AiModel` - Union of all supported model identifiers
- `Message` - Chat message with role and content
- `MessagesByDateTime` - Record keyed by timestamp for chat history

## Configuration

- **TypeScript**: Strict mode, path alias `@/*` → `./src/*`
- **ESLint**: Flat Config format in `eslint.config.mjs`
- **Tailwind**: Standard setup with CSS variable theming
- **Next.js**: SVGR webpack loader for SVG as React components, production source maps enabled

## Environment Variables

Required in `.env`:
```
OPENAI_API_KEY=
ANTHROPIC_API_KEY=
```

For local models, Ollama must be running on localhost:11434.
