# AI-Powered Premium Portfolio Generator

> An AI-native platform that transforms a user's resume, verified professional identity, and natural-language intent into a bespoke, production-grade portfolio website.

---

## 🏛 Architecture Overview

Built following the [PRD.md](file:///c:/Users/Pranav/Desktop/Portfolio-Generator/PRD.md) and [TRD.md](file:///c:/Users/Pranav/Desktop/Portfolio-Generator/TRD.md) specifications:

```text
PDF Resume
   ↓ (Text Extraction & Fact Grounding)
Canonical Professional Profile (JSON)
   ↓ (Creative Direction & Positioning)
Enhanced Prompt Spec
   ↓ (Design Intelligence)
Design DNA & Pattern Selection
   ↓ (Deterministic Composition)
Portfolio Schema / Intermediate Representation
   ↓ (React Component Primitives)
Interactive Live Portfolio (Studio & Public CDN)
```

---

## 📦 Monorepo Structure

```text
portfolio-generator/
├── apps/
│   ├── web/                     # Next.js 15+ App Router Studio, Dashboard & Public Viewer
│   └── api/                     # NestJS Core API (REST, Auth, AI Orchestration, File Uploads)
├── packages/
│   ├── types/                   # Shared TypeScript domain types
│   ├── schemas/                 # Strict Zod schemas for Portfolio, Profile, DesignDNA & QA
│   ├── database/                # PostgreSQL + Drizzle ORM schema & migrations
│   ├── ai/                      # Multi-tier AI abstraction (Gemini, OpenAI, Anthropic, Mock)
│   └── portfolio-ui/            # Curated React design primitives & deterministic renderer
├── docs/                        # Architecture, AI pipeline, database, and dev guides
└── tests/                       # Unit and integration test suites
```

---

## 🚀 Quick Start

### 1. Prerequisites
- Node.js `v20+` or `v24+`
- npm `v10+` or `v11+`
- PostgreSQL database (optional for local mock mode)

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

### 4. Build All Packages & Applications
```bash
npm run build
```

### 5. Run Automated Tests
```bash
npm test
```

### 6. Start Development Servers
```bash
npm run dev
```

- **Web Studio & Public Viewer**: `http://localhost:3000`
- **NestJS Core API**: `http://localhost:4000/api/v1`
- **API Health Check**: `http://localhost:4000/api/v1/health`

---

## 🛡 Features & Capabilities

- **Factual Grounding**: 1-click PDF resume parsing into structured claims without AI hallucination.
- **Design DNA Engine**: Dynamic synthesis of tailored color palettes, typography hierarchies, and motion tokens.
- **Deterministic IR Renderer**: Safely renders structured JSON into accessible (WCAG 2.2 AA) React components.
- **Studio Visual Editor**: Split-screen canvas with desktop, tablet, and mobile viewports.
- **Natural Language AI Patcher**: Real-time schema operations from plain English instructions.
- **Telemetry & Cost Tracking**: Detailed token tracking and cost calculation across AI providers.
