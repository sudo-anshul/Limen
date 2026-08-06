# Limen

<div align="center">

## **Preflight for web launches**

Limen is a launch assurance product for landing pages.
It helps teams decide whether a page is actually ready for launch-day or paid traffic — before weak messaging, low trust, or poor CTA clarity waste the moment.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Postgres](https://img.shields.io/badge/Postgres-Database-336791?style=for-the-badge&logo=postgresql)](https://www.postgresql.org/)
[![Redis](https://img.shields.io/badge/Redis-Queue-red?style=for-the-badge&logo=redis)](https://redis.io/)
[![Playwright](https://img.shields.io/badge/Playwright-Rendered%20Evidence-2EAD33?style=for-the-badge&logo=playwright)](https://playwright.dev/)

**Core question:**

> **Should this page launch for this audience and this traffic source right now?**

</div>

---

## Table of contents

- [Why Limen exists](#why-limen-exists)
- [What Limen does](#what-limen-does)
- [How the product works](#how-the-product-works)
- [Current feature set](#current-feature-set)
- [Architecture](#architecture)
- [Tech stack](#tech-stack)
- [Database model overview](#database-model-overview)
- [Local development](#local-development)
- [Useful commands](#useful-commands)
- [Current project status](#current-project-status)
- [Design principles](#design-principles)
- [Roadmap direction](#roadmap-direction)
- [Repo structure](#repo-structure)
- [Vision](#vision)

---

## Why Limen exists

A landing page can **look** polished and still fail the moment real traffic hits it.

Teams often launch pages with hidden weaknesses:
- the headline is too vague for cold traffic
- the CTA asks for commitment too early
- trust proof appears too late
- metadata is weak or missing
- the page is parseable, but not persuasive

Most tools catch isolated issues.

**Limen is built to answer a harder question:**

> **Is this page ready to launch for the audience and traffic you are about to send?**

That is the product.

---

## What Limen does

Limen takes a **launch brief** and a **public landing page URL**, then produces a launch-oriented review based on captured evidence.

### Launch brief inputs
- target audience
- traffic channel
- desired action
- offer
- objections
- competitors
- brand voice

### Evidence Limen captures
- HTML snapshot
- rendered screenshot via Playwright
- page title and metadata
- hero and heading structure
- CTA-like actions
- trust-related signals
- viewport and page capture metadata

### Product outputs
- launch verdict
- confidence level
- launch summary
- top reasons
- top fixes
- evidence-linked findings
- persona replay
- rewrite suggestions
- extracted signals view
- screenshot and HTML artifact previews

---

## How the product works

```mermaid
flowchart TD
    A[Create launch run] --> B[Submit launch brief]
    B --> C[Persist AuditRun]
    C --> D[Queue worker job]
    D --> E[Validate and normalize URL]
    E --> F[Fetch HTML]
    F --> G[Capture screenshot]
    G --> H[Persist artifacts]
    H --> I[Extract signals]
    I --> J[Generate findings]
    J --> K[Generate verdict]
    K --> L[Generate persona replay]
    L --> M[Generate rewrite suggestions]
    M --> N[Synthesize launch board]
    N --> O[Render run results UI]
```

### In one sentence
Limen converts a URL and launch brief into a structured launch decision backed by persisted evidence.

---

## Current feature set

### 1. Launch brief intake
The web app captures context before analysis begins.

This is critical because Limen is meant to judge readiness in context, not in isolation.

### 2. Evidence capture pipeline
The worker currently performs:
- URL normalization
- public URL validation
- HTML fetch
- rendered screenshot capture
- artifact persistence
- page capture persistence

### 3. Extracted signal model
Limen stores structured signals such as:
- title
- meta description
- hero H1
- headings
- CTA candidates
- trust signals
- hero density
- visual evidence markers

### 4. Heuristic finding generation
The current rule layer can identify issues like:
- missing H1
- missing meta description
- no clear CTA
- no obvious trust signals
- dense hero copy
- CTA potentially outpacing trust

### 5. Launch board synthesis
Limen currently synthesizes:
- summary
- top reasons
- top fixes

### 6. Persona replay
Limen can simulate how two visitors may perceive the page:
- primary target visitor
- skeptical cold visitor

### 7. Rewrite suggestions
The system generates structured copy guidance for:
- hero headline
- hero subhead
- primary CTA
- trust section

### 8. Results UI
The current UI includes:
- launch verdict card
- summary and metrics
- findings with evidence refs
- artifact preview
- evidence summary
- extracted signals explorer
- persona replay
- rewrite suggestions

---

## Product experience

### Landing page
Introduces Limen as a launch-decision product.

### New run page
Creates a run from a launch brief.

### Run page
Shows:
- run health
- pipeline progress
- launch board summary
- verdict
- findings
- evidence artifacts
- persona replay
- rewrite suggestions
- extracted signals

---

## Architecture

### High-level design

```text
apps/
  web/        -> Next.js control plane and UI
  worker/     -> queue consumers, capture, extraction, synthesis
packages/
  shared/     -> schemas, constants, shared contracts
  db/         -> Prisma schema and DB client
  ui/         -> shared UI package placeholder
```

### Main subsystems

#### Web app
Responsible for:
- user interface
- launch brief intake
- run creation
- run detail rendering
- artifact serving

#### Worker
Responsible for:
- consuming queued runs
- fetching page data
- rendering screenshots
- extracting signals
- creating findings
- generating summaries and persona outputs
- generating rewrite suggestions

#### Database
Stores:
- audit runs
- page captures
- artifacts
- extracted signals
- findings
- persona replays
- rewrite suggestions
- analyzer outputs

#### Redis / queue
Used for background run execution.

---

## Tech stack

### Frontend
- **Next.js 16**
- **React 19**
- **TypeScript**
- **Tailwind CSS**
- **React Hook Form**
- **Zod**

### Backend / worker
- **Node.js**
- **TypeScript**
- **BullMQ**
- **Redis**
- **Playwright**

### Data layer
- **Postgres**
- **Prisma**

---

## Database model overview

### Key entities
- `AuditRun`
- `PageCapture`
- `Artifact`
- `ExtractedSignal`
- `Finding`
- `PersonaReplay`
- `RewriteSuggestion`
- `AnalyzerExecution`

### Why this matters
Limen is intentionally built around persisted evidence and structured outputs, so the product can evolve from a prototype into a more trustworthy launch-review system.

---

## Local development

### Prerequisites
- Node.js 20+
- pnpm
- Docker

### 1. Install dependencies
```bash
pnpm install
```

### 2. Start Postgres
```bash
docker run --name limen-postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=limen \
  -p 5432:5432 \
  -d postgres:16
```

If already created:
```bash
docker start limen-postgres
```

### 3. Start Redis
```bash
docker run --name limen-redis -p 6379:6379 -d redis:7
```

If already created:
```bash
docker start limen-redis
```

### 4. Create local env
```bash
cp .env.example .env
```

`.env`
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/limen"
REDIS_URL="redis://localhost:6379"
```

### 5. Run Prisma migrations
```bash
DATABASE_URL='postgresql://postgres:postgres@localhost:5432/limen' \
  pnpm --filter @limen/db prisma:migrate --name init
```

### 6. Install Playwright browser
```bash
pnpm --filter worker exec playwright install chromium
```

### 7. Start the web app
```bash
DATABASE_URL='postgresql://postgres:postgres@localhost:5432/limen' \
REDIS_URL='redis://localhost:6379' \
pnpm --filter web dev
```

### 8. Start the worker
In another terminal:
```bash
DATABASE_URL='postgresql://postgres:postgres@localhost:5432/limen' \
REDIS_URL='redis://localhost:6379' \
pnpm --filter worker dev
```

---

## Useful commands

### Typecheck
```bash
pnpm --filter web typecheck
pnpm --filter worker typecheck
pnpm --filter @limen/db typecheck
pnpm --filter @limen/shared typecheck
```

### Build worker
```bash
pnpm --filter worker build
```

### Generate Prisma client
```bash
pnpm --filter @limen/db prisma:generate
```

### Create a migration
```bash
DATABASE_URL='postgresql://postgres:postgres@localhost:5432/limen' \
  pnpm --filter @limen/db prisma:migrate --name <migration-name>
```

---

## Current project status

### Working today
- launch run creation
- queue-backed worker execution
- HTML fetch
- Playwright screenshot capture
- artifact persistence
- extracted signal persistence
- finding generation
- verdict generation
- launch summary
- persona replay
- rewrite suggestions
- artifact preview UI
- extracted signals UI

### Still evolving
- issue prioritization quality
- stronger launch-board scoring/rubric
- more grounded persona replay
- more concrete copy rewrites
- clearer distinction between telemetry and user-facing issues
- deeper screenshot-aware analysis
- final UI polish for launch-grade presentation

---

## Example product flow

### Step 1
Open Limen and create a launch run.

### Step 2
Enter:
- page URL
- target audience
- channel (for example `cold_paid`)
- desired action
- offer
- objections
- brand voice

### Step 3
Limen will:
- validate the URL
- capture page HTML
- render a screenshot
- extract structure and trust signals
- generate findings
- produce a verdict
- explain likely visitor reactions
- propose copy improvements

### Step 4
Review:
- summary
- top reasons
- top fixes
- findings
- evidence
- persona replay
- rewrite suggestions

---

## Design principles

Limen is being built around these ideas:

### Evidence before confidence
Findings should be backed by captured artifacts and structured signals.

### Launch context matters
A page should not be judged without its audience and channel.

### Decision support beats generic diagnostics
The product should answer:
- should I launch?
- why not?
- what do I fix first?

### Operator-facing outputs matter
Findings alone are not enough. Teams need summaries, personas, and actionable rewrites.

---

## Roadmap direction

Potential next improvements:
- cleaner separation between telemetry and user-facing findings
- stronger ranking model for blockers vs opportunities
- better verdict logic tied to launch readiness dimensions
- more concrete rewrite outputs
- more evidence-linked persona replay
- screenshot-region-specific analysis
- side-by-side before/after comparisons
- preview URL support
- launch history and regressions

---

## Repo structure

```text
apps/
  web/
  worker/
packages/
  db/
  shared/
  ui/
```

### Notes
This repository intentionally focuses on the **product code**. Internal planning, local research, and non-essential local files are excluded from GitHub.

---

## Vision

Limen is not trying to become another generic audit dashboard.

The long-term goal is to become the layer teams run before launch to answer:

> **Is this landing page ready for the traffic we’re about to send?**

That means Limen should eventually become:
- more context-aware
- more evidence-backed
- more trustworthy
- more decisive
- more useful in real launch workflows

---

## Contributing

This project is under active development.

If you explore or extend it, the most valuable contributions are usually around:
- better extraction quality
- better launch-readiness heuristics
- more grounded summaries
- UI clarity
- developer experience

---

## Final note

Limen already runs a real end-to-end launch review pipeline.

The next stage is making that intelligence:
- sharper
- more trusted
- more product-ready

If you’re reading this from the repository, you’re looking at a product being built around a simple but powerful question:

> **Don’t ask whether the page exists. Ask whether it’s ready.**
