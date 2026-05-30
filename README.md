# Academic GPS

**AI-Powered Career Roadmap Generator** - A full-stack web application that generates personalized 8-semester academic roadmaps for students based on their career goals, current skills, GPA, and interests.

<p align="center">
  <img src="./demo_acd_gps.gif" alt="Academic GPS Demo" width="100%" />
</p>

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT (React)                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │ProfileForm  │──│  App.tsx    │──│ RoadmapTimeline/View    │  │
│  └─────────────┘  └──────┬──────┘  └─────────────────────────┘  │
│                          │                                       │
│                   SSE Stream Reader                              │
└──────────────────────────┼───────────────────────────────────────┘
                           │ POST /api/generate-roadmap
                           ▼
┌──────────────────────────────────────────────────────────────────┐
│                      SERVER (Express)                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │ Validation  │──│  Agent      │──│   LLM Router            │  │
│  │ (Zod+Utils) │  │  Pipeline   │  │ ┌─────┬─────┬────────┐ │  │
│  └─────────────┘  └──────┬──────┘  │ │OpenAI│Anthr│MiniMax │ │  │
│                          │          │ └─────┴─────┴────────┘ │  │
│                   ┌──────▼──────┐   └─────────────────────────┘  │
│                   │   Search    │                               │
│                   │  (Serper)   │                               │
│                   └─────────────┘                               │
└──────────────────────────────────────────────────────────────────┘
```

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 18, TypeScript, Vite |
| **Backend** | Express.js, TypeScript |
| **Validation** | Zod v4 |
| **LLM Providers** | OpenAI (GPT-4o-mini), Anthropic (Claude 3.5 Sonnet), MiniMax M2 |
| **Search** | Serper API (Google + YouTube) |
| **Styling** | Custom CSS (glassmorphism theme) |

---

## Project Structure

```
Ben_Kim_Stimulation/
├── client/                          # React frontend
│   ├── src/
│   │   ├── App.tsx                  # Main app (all UI components)
│   │   ├── main.tsx                 # React entry point
│   │   ├── types.ts                 # TypeScript interfaces
│   │   ├── index.css                # Global styles
│   │   └── components/
│   │       ├── ProfileForm.tsx      # User input form
│   │       ├── AngryPopup.tsx       # Validation error modal + validation logic
│   │       ├── Toast.tsx            # Error notification toast
│   │       ├── RoadmapTimeline.tsx  # Semester timeline display
│   │       ├── StatsPanel.tsx       # Skills/certs/internships panel
│   │       └── SuccessGauge.tsx     # Animated success probability gauge
│   └── vite.config.ts               # Vite + API proxy config
│
├── server/                          # Express backend
│   ├── src/
│   │   ├── index.ts                 # Server + API endpoints
│   │   ├── schema.ts               # Zod schemas + normalization
│   │   └── clients/
│   │       ├── llm.ts               # LLM router (polymorphic)
│   │       ├── openai.ts            # OpenAI GPT-4o-mini
│   │       ├── anthropic.ts         # Anthropic Claude 3.5
│   │       ├── minimax.ts           # MiniMax M2 (via OpenRouter)
│   │       ├── search.ts            # Serper web/YouTube search
│   │       └── utils.ts             # Validation helpers
│   └── .env                         # API keys
```

---

## API Reference

### `POST /api/generate-roadmap`

Generates a personalized career roadmap using AI agents.

**Request:**
```json
{
  "careerGoal": "Machine Learning Engineer",
  "currentSkills": "Python, Statistics, Linear Algebra",
  "gpa": 3.5,
  "interests": "AI Ethics, Distributed Systems",
  "provider": "openai"
}
```

**Parameters:**
| Field | Type | Description |
|-------|------|-------------|
| `careerGoal` | string | Target career (e.g., "Software Engineer") |
| `currentSkills` | string | Comma-separated skills |
| `gpa` | number | Current GPA (0.0 - 4.0) |
| `interests` | string | Comma-separated interests |
| `provider` | enum | LLM provider: `openai`, `anthropic`, or `minimax` |

**Response:** Server-Sent Events (SSE) stream

```typescript
// Step progress event
data: {"type": "step", "key": "courses", "label": "Course Agent", "icon": "📚", "subtext": "Finding optimal courses..."}

// Done event
data: {"type": "done", "data": { /* Roadmap object */ }}

// Error event
data: {"type": "error", "error": "Error message"}
```

---

## Data Models

### Roadmap Schema

```typescript
interface Roadmap {
  careerGoal: string;
  recommendedCourses: Course[];
  skillGaps: SkillGap[];
  certifications: Certification[];
  researchOpportunities: ResearchOpportunity[];
  internshipTargets: InternshipTarget[];
  semesterRoadmap: Semester[];
  successProbability: number; // 0-100
}

interface Course {
  code: string;
  name: string;
  semester: number;
  credits: number;
  rationale: string;
  links: SearchResult[];
  videos: YouTubeResult[];
}

interface SkillGap {
  skill: string;
  currentLevel: string;
  targetLevel: string;
  coursesToFill: string[];
  links: SearchResult[];
  videos: YouTubeResult[];
}

interface Certification {
  name: string;
  provider: string;
  timeline: string;
  priority: number;
  links: SearchResult[];
  videos: YouTubeResult[];
}

interface ResearchOpportunity {
  title: string;
  professor: string;
  institution: string;
  timeline: string;
  relevance: string;
  links: SearchResult[];
  videos: YouTubeResult[];
}

interface InternshipTarget {
  company: string;
  role: string;
  timeline: string;
  requirements: string[];
  links: SearchResult[];
  videos: YouTubeResult[];
}

interface Semester {
  semester: number;
  courses: string[];
  activities: string[];
  milestones: string[];
}

interface SearchResult {
  title: string;
  url: string;
  snippet: string;
}

interface YouTubeResult {
  title: string;
  videoId: string;
  thumbnail: string;
  channel: string;
  duration: string;
  url: string;
}
```

---

## Agent Pipeline

The roadmap generation uses a **sequential agent pipeline** with 5 specialized agents:

```
User Input
    │
    ▼
┌────────────────────┐
│   Analyzing Agent  │  ── Prepares context
└────────────────────┘
    │
    ▼
┌────────────────────┐
│   Course Agent     │  ── Recommends 8-12 courses per semester
└────────────────────┘
    │
    ▼
┌────────────────────┐
│   Skill Agent      │  ── Identifies 5-7 skill gaps
└────────────────────┘
    │
    ▼
┌────────────────────┐
│   Cert Agent       │  ── Recommends 3-5 certifications
└────────────────────┘
    │
    ▼
┌────────────────────┐
│ Research Agent     │  ── Finds 2-4 research opportunities
└────────────────────┘
    │
    ▼
┌────────────────────┐
│ Internship Agent   │  ── Targets 3-5 companies
└────────────────────┘
    │
    ▼
┌────────────────────┐
│ Synthesis Agent    │  ── Builds final roadmap + success %
└────────────────────┘
    │
    ▼
   Roadmap
```

Each agent:
1. Calls its LLM prompt to generate structured recommendations
2. Enriches results with web search (Serper) for links
3. Enriches results with YouTube search for video resources

---

## LLM Providers

| Provider | Model | Notes |
|----------|-------|-------|
| **OpenAI** | `gpt-4o-mini` | JSON object mode, fastest |
| **Anthropic** | `claude-3-5-sonnet-latest` | 4096 max tokens output |
| **MiniMax** | `minimax/minimax-m2.7` | Via OpenRouter, handles reasoning field |

---

## Validation

### Client-Side (AngryPopup.tsx)
- Fake data detection (asdf, qwerty, test test, etc.)
- Career validation against REAL_CAREERS list
- Skills validation against REAL_SKILLS list
- GPA range validation (0.0 - 4.0)

### Server-Side (utils.ts)
- `validateCareerGoal()` - Gibberish + fake pattern detection
- `validateSkills()` - Meaningful words validation
- `validateInterests()` - At least 2 words, 2+ chars each
- `validateGPA()` - Range + rejects GPA of 0
- `isHebrewDominant()` - Rejects Hebrew input (>40% Hebrew chars)
- Hebrew rejection on server for English-language optimization

---

## Success Probability Calculation

```typescript
function calculateSuccess(results: AgentResults, careerGoal: string): number {
  let score = 50;  // base

  // Skill coverage bonus (max +30)
  score += Math.min(30, results.skills.length * 5);

  // Certification bonus (max +10)
  score += Math.min(10, results.certs.length * 2);

  // Research opportunity bonus (+5)
  if (results.research.length > 0) score += 5;

  // Internship targeting bonus (+5)
  if (results.internships.length > 0) score += 5;

  // Career-specific bonuses
  const goal = careerGoal.toLowerCase();
  if (goal.includes("engineer")) score += 10;
  if (goal.includes("data")) score += 8;
  if (goal.includes("software")) score += 10;

  return Math.min(95, score);
}
```

---

## Environment Variables

Create a `.env` file in the `server/` directory:

```env
OPENAI_API_KEY=sk-...           # OpenAI API key
ANTHROPIC_API_KEY=sk-ant-...     # Anthropic API key
OPENROUTER_API_KEY=...          # OpenRouter API key (for MiniMax)
SERPER_API_KEY=...               # Serper API key (serper.dev)
PORT=3001                        # Server port
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- API keys for at least one LLM provider

### Installation

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### Running Development Servers

```bash
# Terminal 1: Start server
cd server
npm run dev

# Terminal 2: Start client
cd client
npm run dev
```

The client runs on `http://localhost:5173` and proxies `/api` requests to `http://localhost:3001`.

---

## UI Components

| Component | Description |
|-----------|-------------|
| **ProfileForm** | Input form for career goal, skills, GPA, interests, provider selection |
| **AngryPopup** | Modal displayed when validation fails (😠 theme) |
| **Toast** | Top-right notification for server errors (auto-dismiss 5s) |
| **RoadmapTimeline** | 8-semester grid view with courses, activities, milestones |
| **StatsPanel** | Tabbed view for skills, certs, research, internships |
| **SuccessGauge** | Animated circular progress indicator |
| **YouTubeModal** | Full-screen video player modal |
| **VideoCard** | Inline video thumbnail with click-to-play |
| **CourseCard** | Expandable course details with links & videos |

---

## Features

- **Multi-Provider Support**: Switch between OpenAI, Anthropic, or MiniMax LLMs
- **Real-Time Streaming**: SSE-based progress updates during generation
- **Web Enrichment**: Each recommendation includes relevant links and YouTube videos
- **Comprehensive Validation**: Client and server-side input validation
- **Animated UI**: Smooth animations, particle background, shake effects
- **Cancellable Requests**: AbortController support for cancelling generation
- **Timeout Protection**: 120-second request timeout
- **Success Probability**: AI-calculated probability based on profile completeness

---

## Deployment (Free Hosting)

### Recommended: Vercel (Frontend) + Render (Backend)

---

### Step 1: Deploy Backend to Render

1. Push your repo to GitHub

2. Go to [render.com](https://render.com) → **New** → **Web Service**

3. Connect your GitHub repo

4. Configure:
   | Field | Value |
   |-------|-------|
   | **Name** | `academic-gps-api` |
   | **Root Directory** | `server` |
   | **Runtime** | `Node` |
   | **Build Command** | `npm install && npm run build` |
   | **Start Command** | `npm start` |
   | **Port** | `3001` |

5. Add **Environment Variables**:
   ```
   OPENAI_API_KEY=sk-...
   ANTHROPIC_API_KEY=sk-ant-...
   OPENROUTER_API_KEY=...
   SERPER_API_KEY=...
   NODE_ENV=production
   ```

6. Click **Create Web Service** — your backend will be live at `https://your-app.onrender.com`

---

### Step 2: Deploy Frontend to Vercel

1. Go to [vercel.com](https://vercel.com) → **New Project**

2. Import your GitHub repo

3. Configure:
   | Field | Value |
   |-------|-------|
   | **Framework** | `Vite` |
   | **Root Directory** | `client` |
   | **Build Command** | `npm run build` |
   | **Output Directory** | `dist` |

4. Add **Environment Variable**:
   ```
   VITE_API_URL=https://your-app.onrender.com
   ```

5. Update `client/vite.config.ts` to use the env variable for the proxy:
   ```typescript
   export default defineConfig({
     plugins: [react()],
     server: {
       proxy: {
         "/api": {
           target: process.env.VITE_API_URL || "http://localhost:3001",
           changeOrigin: true,
         },
       },
     },
   });
   ```

6. Click **Deploy** — your frontend will be live at `https://your-app.vercel.app`

---

### Step 3: Update API Base URL (Production)

In `client/src/App.tsx`, update the fetch URL to use the env variable:

```typescript
const API_BASE = import.meta.env.VITE_API_URL || "";
const response = await fetch(`${API_BASE}/api/generate-roadmap", { ... });
```

---

### Alternative: Single Platform (Railway)

If you want both frontend + backend on one platform:

1. Go to [railway.com](https://railway.com) → **New Project** → **Deploy from GitHub**

2. Add two services:
   - **Service 1**: Root dir `server` — Build: `npm install && npm run build`, Start: `npm start`
   - **Service 2**: Root dir `client` — Build: `npm install && npm run build`, Start: `npx serve dist`

3. Set environment variables in the Railway dashboard

4. Railway assigns a public URL automatically

---

### Other Free Options

| Platform | Frontend | Backend | SSE Support | Cold Start |
|----------|----------|---------|-------------|------------|
| **Vercel + Render** | ✅ | ✅ | ✅ | ~15min idle |
| **Railway** | ✅ | ✅ | ✅ | No |
| **Fly.io** | ✅ | ✅ | ✅ | ~5min idle |
| **Netlify + Cyclic** | ✅ | ✅ | ✅ | ~5min idle |
| **Glitch** | ✅ | ✅ | ✅ | ~5min idle |

> **Note**: Free tiers have resource limits. For production use, consider upgrading to a paid plan.

---

<p align="center">
  <b>Built with ❤️ by ote22</b>
</p>
