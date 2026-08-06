<div align="center">

# Limen

### **Preflight for web launches**

Limen helps teams decide whether a landing page is actually ready for launch-day or paid traffic — before weak messaging, low trust, or poor CTA clarity waste the moment.

<p>
  <a href="#quickstart">Quickstart</a> ·
  <a href="#what-limen-does">What it does</a> ·
  <a href="#how-it-works">How it works</a> ·
  <a href="#current-capabilities">Capabilities</a> ·
  <a href="#local-development">Local development</a>
</p>

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Postgres](https://img.shields.io/badge/Postgres-Database-336791?style=flat-square&logo=postgresql)](https://www.postgresql.org/)
[![Redis](https://img.shields.io/badge/Redis-Queue-red?style=flat-square&logo=redis)](https://redis.io/)
[![Playwright](https://img.shields.io/badge/Playwright-Rendered%20Evidence-2EAD33?style=flat-square&logo=playwright)](https://playwright.dev/)
[![Status](https://img.shields.io/badge/Status-Active%20Build-7c3aed?style=flat-square)](#current-capabilities)

</div>

---

## The idea in one line

> **Should this page launch for this audience and this traffic source right now?**

That is the entire reason Limen exists.

---

## Why Limen exists

A landing page can **look polished** and still fail the moment real traffic hits it.

Typical launch mistakes are simple, expensive, and easy to miss:
- the headline is too vague for cold traffic
- the CTA asks for commitment too early
- trust proof appears too late
- metadata is weak or missing
- the page is parseable, but not persuasive

Most tools catch isolated issues.

**Limen is built to make a launch decision.**

---

## What Limen does

Limen takes a **launch brief** and a **public landing page URL**, then produces a launch-oriented review based on captured evidence.

### Launch brief
- target audience
- traffic channel
- desired action
- offer
- objections
- competitors
- brand voice

### Evidence captured
- HTML snapshot
- rendered screenshot via Playwright
- page title and metadata
- hero and heading structure
- CTA-like actions
- trust-related signals
- viewport and page capture metadata

### Outputs
- launch verdict
- confidence level
- launch summary
- top reasons
- top fixes
- evidence-linked findings
- persona replay
- rewrite suggestions
- extracted signals explorer
- screenshot and HTML artifact previews

---

## How it works

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

### Product rhythm

```text
Brief → Evidence → Findings → Verdict → Persona view → Rewrites
```

Limen is intentionally built as a **decision pipeline**, not a generic scanner.

---

## What the report feels like

### Launch board
- **Verdict** — should this page launch?
- **Confidence** — how strong is the current evidence?
- **Top reasons** — why Limen reached the verdict
- **Top fixes** — what to change first

### Evidence layer
- HTML snapshot
- rendered screenshot
- extracted signals
- evidence-linked findings

### Operator layer
- persona replay
- rewrite suggestions

---

## Current capabilities

| Area | Current state | Notes |
|---|---|---|
| Launch brief intake | ✅ Working | Audience, channel, offer, objections, and more |
| Queue-backed execution | ✅ Working | BullMQ + Redis |
| HTML fetch | ✅ Working | URL normalization + fetch pipeline |
| Screenshot capture | ✅ Working | Playwright rendered evidence |
| Artifact persistence | ✅ Working | HTML + screenshot artifacts |
| Extracted signals | ✅ Working | H1, metadata, CTA candidates, trust signals, hero density |
| Findings generation | ✅ Working | Rule-based heuristics with evidence refs |
| Verdict generation | ✅ Working | Current verdict logic is rule-based and evolving |
| Launch summary | ✅ Working | Summary, top reasons, top fixes |
| Persona replay | ✅ Working | Primary + skeptical cold visitor |
| Rewrite suggestions | ✅ Working | Hero, support line, CTA, trust section |
| Artifact previews | ✅ Working | Screenshot + HTML snapshot in UI |
| Extracted signals UI | ✅ Working | Transparent evidence explorer |
| Ranking quality | 🚧 Improving | Needs better launch-readiness weighting |
| Telemetry vs findings separation | 🚧 Improving | Some internal pipeline events still need cleanup |
| Screenshot-aware reasoning depth | 🚧 Improving | Evidence exists; deeper interpretation still evolving |

---

## Screens

### Landing page
Limen is presented as a launch-decision product, not just a diagnostics dashboard.

### New run page
Collects the launch brief before the analysis starts.

### Run page
Shows:
- launch board summary
- verdict
- pipeline progress
- top findings
- screenshot + HTML evidence
- persona replay
- rewrite suggestions
- extracted signals

---

## Architecture

```text
apps/
  web/        -> Next.js control plane and UI
  worker/     -> queue consumers, capture, extraction, synthesis
packages/
  shared/     -> schemas, constants, shared contracts
  db/         -> Prisma schema and DB client
  ui/         -> shared UI package placeholder
```

### System roles

#### Web app
- launch brief intake
- run creation
- run detail rendering
- artifact serving

#### Worker
- consuming queued runs
- fetching page data
- rendering screenshots
- extracting signals
- creating findings
- generating summaries, persona outputs, and rewrites

#### Database
- audit runs
- page captures
- artifacts
- extracted signals
- findings
- persona replays
- rewrite suggestions
- analyzer outputs

#### Redis / queue
- background execution for launch runs

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

## Quickstart

### Prerequisites
- Node.js 20+
- pnpm
- Docker

### 1) Install dependencies
```bash
pnpm install
```

### 2) Start Postgres
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

### 3) Start Redis
```bash
docker run --name limen-redis -p 6379:6379 -d redis:7
```

If already created:
```bash
docker start limen-redis
```

### 4) Create local env
```bash
cp .env.example .env
```

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/limen"
REDIS_URL="redis://localhost:6379"
```

### 5) Run Prisma migrations
```bash
DATABASE_URL='postgresql://postgres:postgres@localhost:5432/limen' \
  pnpm --filter @limen/db prisma:migrate --name init
```

### 6) Install Playwright browser
```bash
pnpm --filter worker exec playwright install chromium
```

### 7) Start the web app
```bash
DATABASE_URL='postgresql://postgres:postgres@localhost:5432/limen' \
REDIS_URL='redis://localhost:6379' \
pnpm --filter web dev
```

### 8) Start the worker
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

## Example flow

### Step 1
Create a launch run.

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

## Final note

Limen already runs a real end-to-end launch review pipeline.

The next stage is making that intelligence:
- sharper
- more trusted
- more product-ready

> **Don’t ask whether the page exists. Ask whether it’s ready.**
