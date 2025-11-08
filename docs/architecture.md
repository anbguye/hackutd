# Toyota Autoguide - Architecture

## Executive Summary

Toyota Autoguide is a web-based AI-powered Toyota shopping companion built on a **v0 Next.js starter** with **Supabase backend** and **NVIDIA Nemotron agent**. The architecture prioritizes guided discovery through agent-led conversation, seamless cost transparency (MSRP + insurance + finance), and mobile-first responsive design. All architectural decisions are designed to enable AI agents to implement features consistently across the 6 core epics.

## Project Initialization

First implementation story should initialize the v0 starter template:

```bash
npx create-next-app@latest hackutd-app --typescript --tailwind --app --no-eslint
```

This establishes the base architecture with:
- ✅ React 19 + TypeScript
- ✅ Next.js 14+ with App Router
- ✅ Tailwind CSS (styling)
- ✅ Vercel v0 components (pre-built UI components)
- ✅ Mobile-first responsive design

Then layer in:
- Supabase client (`npm install @supabase/supabase-js`)
- Jotai for state management (`npm install jotai`)
- Fetch or axios for API calls (included in Node.js)

## Decision Summary

| Category | Decision | Version | Affects Epics | Rationale |
| -------- | -------- | ------- | ------------- | --------- |
| Frontend Framework | Next.js 14+ (v0 starter) | Latest | All | Modern React, built-in API routes, perfect for AI integration |
| UI Components | Vercel v0 + Tailwind | Latest | All | Mobile-first, responsive, includes pre-built components |
| State Management | Jotai + useState | Latest | All (esp. chat, preferences, comparison) | Lightweight, solves prop drilling, easy integration |
| Authentication | Supabase Auth (Email + OAuth) | Latest | Sign-Up, Auth flow | Built-in, secure, handles Google OAuth |
| Database | Supabase PostgreSQL | Latest | All (data layer) | Fully managed, RLS support, real-time subscriptions available |
| Agent Integration | NVIDIA Nemotron (third-party hosted) | Via API | Agent-Led Discovery | Direct API calls, minimal integration overhead |
| Cost Calculations | Client-side (React) with Supabase data | N/A | Total Cost View | Fast, instant updates, formulas cached in client |
| API Structure | REST endpoints (/api/[resource]/[action]) | N/A | All (backend) | Standard Next.js pattern, straightforward routing |
| Error Handling | Try-catch + user-friendly messages | N/A | All | Graceful degradation, better UX |
| Inventory Updates | No real-time updates (synthetic data) | N/A | Car Search | Simple poll on demand, no subscription needed |

## Project Structure

```
hackutd-app/
├── app/                           # Next.js App Router
│   ├── layout.tsx                 # Root layout with providers
│   ├── page.tsx                   # Landing/home page
│   ├── (auth)/                    # Auth pages group
│   │   ├── sign-up/page.tsx
│   │   ├── sign-in/page.tsx
│   │   └── preference-quiz/page.tsx
│   ├── (app)/                     # Main app pages group
│   │   ├── chat/page.tsx          # Agent discovery chatbot
│   │   ├── compare/page.tsx       # Side-by-side comparison
│   │   ├── search/page.tsx        # Car search & filter
│   │   ├── bookings/page.tsx      # Test drive bookings
│   │   └── layout.tsx             # App layout (nav, etc)
│   ├── api/                       # API routes (backend)
│   │   ├── agent/
│   │   │   └── chat/route.ts      # POST /api/agent/chat
│   │   ├── cars/
│   │   │   ├── route.ts           # GET /api/cars (search/filter)
│   │   │   └── [id]/route.ts      # GET /api/cars/[id]
│   │   ├── bookings/
│   │   │   └── route.ts           # POST /api/bookings
│   │   ├── auth/
│   │   │   └── callback/route.ts
│   │   └── health/route.ts
│   └── globals.css
│
├── components/                    # Reusable React components
│   ├── auth/
│   │   ├── SignUpForm.tsx
│   │   ├── SignInForm.tsx
│   │   └── PreferenceQuiz.tsx
│   ├── chat/
│   │   ├── ChatInterface.tsx
│   │   ├── ChatMessage.tsx
│   │   └── ChatInput.tsx
│   ├── cars/
│   │   ├── CarCard.tsx
│   │   ├── CarComparison.tsx
│   │   ├── SearchFilter.tsx
│   │   └── CostBreakdown.tsx
│   ├── bookings/
│   │   ├── BookingForm.tsx
│   │   └── BookingConfirmation.tsx
│   └── common/
│       ├── Header.tsx
│       ├── LoadingSpinner.tsx
│       └── ErrorMessage.tsx
│
├── lib/                           # Utilities and helpers
│   ├── supabase/
│   │   ├── client.ts
│   │   ├── server.ts
│   │   └── types.ts
│   ├── agents/
│   │   └── nemotron.ts
│   ├── calculations/
│   │   ├── insurance.ts
│   │   └── finance.ts
│   ├── api-helpers.ts
│   └── constants.ts
│
├── atoms/                         # Jotai state management
│   ├── authAtom.ts
│   ├── preferencesAtom.ts
│   ├── carsAtom.ts
│   ├── chatAtom.ts
│   ├── comparisonAtom.ts
│   └── uiAtom.ts
│
├── public/
│   └── images/
│
├── .env.local
├── .env.example
├── tsconfig.json
├── next.config.js
├── tailwind.config.ts
├── package.json
└── README.md
```

## Epic to Architecture Mapping

| Epic | Route/Component | Jotai Atoms | API Endpoints | Database Tables |
|------|---|---|---|---|
| Sign-Up & Preference Quiz | `app/(auth)/sign-up`, `app/(auth)/preference-quiz` | `authAtom`, `preferencesAtom` | POST `/api/auth/sign-up`, GET `/api/preferences` | users, user_preferences |
| Agent-Led Discovery Chatbot | `app/(app)/chat`, ChatInterface.tsx | `chatAtom`, `preferencesAtom`, `carsAtom` | POST `/api/agent/chat`, GET `/api/cars` | None (reads from cars table) |
| Car Search & Filter | `app/(app)/search`, SearchFilter.tsx, CarCard.tsx | `carsAtom` | GET `/api/cars?filters=...` | cars |
| Side-by-Side Comparison | `app/(app)/compare`, CarComparison.tsx | `comparisonAtom`, `carsAtom` | GET `/api/cars/[id]` | cars |
| Total Cost View | CostBreakdown.tsx (used across app) | `preferencesAtom`, `carsAtom` | GET `/api/cars/[id]` (for car data) | cars |
| Test Drive Scheduling | `app/(app)/bookings`, BookingForm.tsx | `preferencesAtom`, `carsAtom` | POST `/api/bookings` | test_drive_bookings |

## Technology Stack Details

### Core Technologies

**Frontend:**
- **React 19** - UI framework
- **Next.js 14+** - Framework with App Router, built-in API routes
- **TypeScript** - Type safety across codebase
- **Tailwind CSS** - Utility-first CSS framework
- **Vercel v0** - Pre-built React components for rapid development

**State Management:**
- **Jotai** - Lightweight atom-based state management
- **React useState** - Local component state

**Backend:**
- **Next.js API Routes** - Serverless functions for backend logic
- **Supabase** - PostgreSQL database + authentication

**External Services:**
- **NVIDIA Nemotron** - AI agent for guided discovery (third-party hosted API)
- **Google OAuth** - For social login via Supabase Auth

### Integration Points

```
User Browser
    ↓
Next.js Frontend (React Components)
    ↓
Jotai Atoms (Shared State)
    ↓
Next.js API Routes (/api/*)
    ↓
┌─────────────────────────────────────┐
│ • Supabase (Database + Auth)        │
│ • NVIDIA Nemotron API (Agent)       │
│ • Google OAuth (Authentication)     │
└─────────────────────────────────────┘
```

**Supabase Integration:**
- `lib/supabase/client.ts` - Frontend client for browser context
- `lib/supabase/server.ts` - Backend client for server-side queries
- All car data and user profiles fetched from Supabase

**Nemotron Integration:**
- Called via Next.js API route `/api/agent/chat`
- Sends user preferences + chat history as context
- Parses agent suggestions and renders in ChatInterface

**Authentication Flow:**
- Supabase Auth handles email/password and Google OAuth
- Session token stored in Supabase session storage
- User data persisted to `users` table

## Novel Pattern Designs

### Agent-Led Discovery Flow

**Challenge:** Traditional e-commerce is reactive (user searches → results). This app requires **proactive guidance** where the agent drives the conversation based on user preferences, without sending large car inventory payloads over the network.

**Solution Components:**

1. **Preference Loader** - Extract user quiz answers and store in `preferencesAtom`
2. **Agent Orchestrator** - Send user preferences + chat context to Nemotron
3. **Tool-Based Car Retrieval** - Nemotron uses tool calls to request filtered cars from backend
4. **Backend Car Search** - Backend queries Supabase based on tool parameters
5. **UI Renderer** - Display agent suggestions as interactive car cards with "why" explanation

**Data Flow:**

```
User takes preference quiz
    ↓
Store in preferencesAtom
    ↓
User enters chat
    ↓
Send to POST /api/agent/chat with:
  - User message
  - User preferences (from atom)
  - Chat history (from atom)
  - NO full car inventory (fetched via tool calls instead)
    ↓
Nemotron processes message
    ↓
Nemotron calls search_cars tool with:
  - Budget range
  - Car type preferences
  - Seat count
  - MPG priority
  - Other filter criteria
    ↓
Backend receives tool call request
    ↓
Query Supabase cars table with filter parameters
    ↓
Return filtered car results to Nemotron
    ↓
Nemotron formats response with suggestions + reasoning
    ↓
Return ChatMessage with:
  - Agent's explanation
  - CarSuggestion cards (3-5 options)
  - "Why this car matches you" reasoning
    ↓
User can refine preferences or book test drive
```

**Implementation Guardrails for AI Agents:**

- DO NOT pre-send full car inventory to Nemotron API
- Nemotron makes tool calls to request car data from backend
- Backend `/api/agent/chat` must implement tool call handling
- Implement backend `search_cars` tool that queries Supabase with:
  - Budget filters (budget_min, budget_max)
  - Car type filter (car_types array)
  - Seat count filter
  - MPG priority filter
  - Custom preference-based criteria
- Cache chat history in `chatAtom` to avoid duplicate API calls
- Parse tool responses and integrate into agent context
- Agent responses must always include reasoning for suggestions

## Implementation Patterns

These patterns ensure consistent implementation across all AI agents:

### Naming Conventions

**API Routes:**
- Pattern: `/api/[resource]/[action]`
- Examples: `/api/cars/search`, `/api/bookings/create`, `/api/agent/chat`
- Methods: GET (read), POST (create/update), DELETE (remove)

**Database Tables & Columns:**
- Table names: lowercase, plural (cars, users, test_drive_bookings)
- Column names: lowercase, snake_case (user_id, created_at, msrp_price)
- Primary keys: id (UUID)
- Foreign keys: {table}_id (e.g., user_id, car_id)

**React Components:**
- Component names: PascalCase (CarCard, ChatInterface, PreferenceQuiz)
- Component files: Match component name (CarCard.tsx)
- Hooks: useCustomName (usePreferences, useChat, useCars)
- Utility functions: camelCase (formatCurrency, calculateTotalCost)

**Jotai Atoms:**
- Pattern: `{featureName}Atom`
- Examples: `userPreferencesAtom`, `chatHistoryAtom`, `selectedCarsAtom`
- Export as const from atoms/ directory

### Code Organization

**Component Structure:**
- Group components by feature: `auth/`, `cars/`, `chat/`, `bookings/`, `common/`
- One component per file
- Styles co-located with component (Tailwind className in JSX)

**API Routes:**
- `/api/[resource]/[action]` structure
- Related routes grouped in folders
- One handler function per file

**Test Organization:**
- Co-locate tests: `Component.test.tsx` alongside `Component.tsx`
- Or group in `__tests__/` at feature level

**Utilities:**
- Feature-specific: `lib/[feature]/` (e.g., lib/calculations/, lib/agents/)
- Shared utilities: `lib/` root level (lib/api-helpers.ts, lib/constants.ts)

### Error Handling

**Consistent try-catch pattern:**

```typescript
try {
  // Perform action (API call, Supabase query, etc.)
  const data = await fetchData();
  // Update state
  setData(data);
} catch (error) {
  // Log error for debugging
  console.error('Failed to fetch:', error);
  // Show user-friendly message
  setError('Unable to load data. Please try again.');
  // Optionally show retry button
}
```

**User-Friendly Error Messages:**
- Never show raw error objects to users
- Generic message: "Something went wrong. Please try again."
- Specific context when helpful: "Failed to search cars. Check your internet connection."
- Always provide a retry action

**Error Boundaries:**
- Wrap major features in React error boundaries
- Catch rendering errors, show fallback UI
- Log errors for debugging in development

### Logging Strategy

**Log What:**
- Nemotron agent requests/responses (debugging agent behavior)
- Supabase query failures (database issues)
- User authentication events (login, logout, signup)
- Failed API calls with status code and error message

**How to Log:**
```typescript
// Development: console.log
console.log('[AGENT] Sending preferences:', preferences);
console.error('[ERROR] Failed to fetch cars:', error);

// Production: Send to service (e.g., Sentry, LogRocket)
// Implementation: Add later as needed
```

**What NOT to log:**
- Sensitive user data (passwords, OAuth tokens)
- Full request/response bodies if very large
- Debug-only information in production

## Data Architecture

### Database Schema

**Cars Table**
```sql
CREATE TABLE cars (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  year INTEGER NOT NULL,
  type VARCHAR(50), -- 'SUV', 'Sedan', 'Truck', etc.
  seats INTEGER,
  powertrain VARCHAR(50), -- 'Hybrid', 'Gas', 'Electric', etc.
  msrp BIGINT, -- in cents (e.g., 3600000 = $36,000)
  mpg_city DECIMAL,
  mpg_hwy DECIMAL,
  drive VARCHAR(10), -- 'AWD', 'FWD', 'RWD'
  tags TEXT[], -- ['family', 'commute', 'eco', 'weekend']
  reliability_score DECIMAL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

**Users Table**
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email VARCHAR(255) UNIQUE NOT NULL,
  user_role VARCHAR(20) DEFAULT 'user', -- 'user' or 'admin'
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

**User Preferences Table**
```sql
CREATE TABLE user_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  budget_min BIGINT, -- in cents
  budget_max BIGINT,
  car_types TEXT[], -- ['SUV', 'Sedan', ...]
  seats INTEGER,
  mpg_priority VARCHAR(20), -- 'high', 'medium', 'low'
  use_case VARCHAR(100), -- 'commute', 'family', 'weekend', ...
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

**Test Drive Bookings Table**
```sql
CREATE TABLE test_drive_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  car_id UUID NOT NULL REFERENCES cars(id),
  preferred_location VARCHAR(255),
  booking_date TIMESTAMP,
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'confirmed', 'completed'
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### TypeScript Types

```typescript
// lib/supabase/types.ts
export interface Car {
  id: string;
  name: string;
  year: number;
  type: string;
  seats: number;
  powertrain: string;
  msrp: number; // in cents
  mpg_city: number;
  mpg_hwy: number;
  drive: string;
  tags: string[];
  reliability_score?: number;
}

export interface UserPreferences {
  id: string;
  user_id: string;
  budget_min: number; // in cents
  budget_max: number;
  car_types: string[];
  seats: number;
  mpg_priority: 'high' | 'medium' | 'low';
  use_case: string;
}

export interface TestDriveBooking {
  id: string;
  user_id: string;
  car_id: string;
  preferred_location: string;
  booking_date: string; // ISO 8601
  status: 'pending' | 'confirmed' | 'completed';
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  suggestions?: CarSuggestion[];
}

export interface CarSuggestion {
  carId: string;
  name: string;
  reasoning: string;
  matchScore?: number;
}
```

## API Contracts

### GET /api/cars
**Search and filter cars by preferences**

Request:
```typescript
// Query parameters
?type=SUV&seats=5&budget_min=30000&budget_max=50000&mpg_priority=high
```

Response:
```typescript
[
  {
    id: "rav4-2025",
    name: "RAV4",
    year: 2025,
    type: "SUV",
    seats: 5,
    msrp: 3600000, // $36,000 in cents
    mpg_city: 28,
    mpg_hwy: 35,
    drive: "AWD",
    tags: ["family", "commute", "eco"],
    reliability_score: 4.5
  }
]
```

### POST /api/agent/chat
**Send message to Nemotron agent with user context**

Request:
```typescript
{
  userMessage: string;
  preferences: UserPreferences;
  chatHistory: ChatMessage[];
  availableCars: Car[];
}
```

Response:
```typescript
{
  message: string; // Agent's response text
  suggestions: CarSuggestion[]; // 3-5 car suggestions with reasoning
  timestamp: string; // ISO 8601
}
```

### POST /api/bookings
**Create test drive booking**

Request:
```typescript
{
  carId: string;
  preferredLocation: string;
  bookingDate: string; // ISO 8601
}
```

Response:
```typescript
{
  id: string;
  carId: string;
  status: 'pending' | 'confirmed';
  confirmationEmail: string;
  timestamp: string;
}
```

## Consistency Rules

### Data Format Consistency
- **Dates:** ISO 8601 strings in database and API (e.g., `2025-11-08T19:55:28Z`)
- **Currency:** Store as integers in cents (e.g., `3600000` = $36,000), format for display
- **Decimal Numbers:** Use DECIMAL type in PostgreSQL, not FLOAT
- **Booleans:** Store as BOOLEAN in database, not strings

### Component API Consistency
- All components accept props with TypeScript interfaces
- Event handlers follow pattern: `on{EventName}` (e.g., `onSelectCar`, `onSendMessage`)
- All async operations show loading state + error state

### Store Updates (Jotai)
```typescript
import { useAtom } from 'jotai';

const [preferences, setPreferences] = useAtom(preferencesAtom);

// Update entire object
setPreferences({ ...preferences, budget_max: 50000 });

// Or use useAtomValue for read-only access
const cars = useAtomValue(carsAtom);
```

## Security Architecture

**Authentication:**
- Supabase Auth handles credential security (bcrypt hashing)
- Google OAuth via Supabase (OAuth 2.0 standard)
- JWT tokens stored in secure HTTP-only cookies (Supabase default)

**Data Isolation:**
- Supabase Row-Level Security (RLS) enforced on all tables
- Users can only access their own preferences and bookings
- Use server-side Supabase client for admin operations

**Password Security:**
- Passwords hashed with bcrypt (handled by Supabase)
- No plain-text passwords stored
- Password reset via secure email link

**API Security:**
- All API routes should validate user authentication
- Check `Authorization` header or session cookie
- Only return user's own data (no cross-user access)

## Performance Considerations

**From NFRs:**
- Chat response time: <5 seconds acceptable (Nemotron API delay)
- Page load: <3 seconds on mobile 3G
- Database queries: <500ms
- Support ~1000 concurrent users

**Optimization Strategies:**

**Frontend:**
- Cache car data in `carsAtom` after first fetch
- Lazy load car images with Next.js Image component
- Debounce search filter input (wait 300ms after typing stops)
- Use React.memo for expensive components (CarCard)

**Backend:**
- Index database columns: `type`, `user_id`, `car_id` for fast queries
- Cache Supabase client instance (don't recreate per request)
- Batch Supabase queries when possible

**Network:**
- Gzip compression enabled by default in Next.js
- Image optimization via Next.js Image
- Minify CSS/JS at build time

## Deployment Architecture

**Hosting:**
- Deploy Next.js app to **Vercel** (recommended for v0 starter)
- Supabase hosted PostgreSQL (no deployment needed)
- Nemotron runs on NVIDIA platform (no deployment needed)

**Environment Variables:**
```bash
# .env.local (frontend and backend use these)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key # Server-side only
NEMOTRON_API_KEY=your_nemotron_api_key
NEMOTRON_API_URL=https://api.nemotron.nvidia.com/v1/chat
GOOGLE_OAUTH_CLIENT_ID=your_google_client_id
```

**Build & Deployment:**
- Next.js build: `npm run build`
- Start production: `npm start`
- Vercel deployment: Connect GitHub repo, auto-deploy on push

**Database Migrations:**
- Use Supabase Migration Tool or SQL directly
- Keep migration scripts in repo for version control
- Test migrations in staging before production

## Development Environment

### Prerequisites
- Node.js 18+ (for Next.js 14)
- npm or yarn
- Supabase account (already set up)
- NVIDIA Nemotron API key
- Google OAuth credentials

### Setup Commands

```bash
# Clone repository
git clone <repo-url>
cd hackutd-app

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Add your secrets to .env.local:
# NEXT_PUBLIC_SUPABASE_URL
# NEXT_PUBLIC_SUPABASE_ANON_KEY
# SUPABASE_SERVICE_ROLE_KEY
# NEMOTRON_API_KEY
# NEMOTRON_API_URL
# GOOGLE_OAUTH_CLIENT_ID

# Run development server
npm run dev

# Open http://localhost:3000 in browser
```

### Development Tips
- **Hot reload:** Changes to files auto-reload in browser
- **Debugging:** Use browser DevTools (F12) to inspect React components
- **API debugging:** Check Network tab in DevTools for API calls
- **Database:** Use Supabase dashboard to view/edit data directly
- **Testing:** Run `npm test` (configure Jest when ready)

## Architecture Decision Records (ADRs)

### ADR 1: Why v0 Starter + Next.js
**Decision:** Use v0 starter template with Next.js 14 App Router
**Status:** Approved

**Rationale:**
- v0 starter pre-builds responsive UI components (saves time in hackathon)
- Next.js has built-in API routes (no separate backend needed)
- Perfect for AI integration with Vercel AI SDK
- Mobile-first design requirement matches v0 output

**Alternatives Considered:**
- Vite + React (lighter but no API routes, need separate backend)
- Full-stack frameworks like Remix (overkill for this scope)

**Implications:**
- First story is v0 initialization command
- All backend logic runs in `/api` routes
- UI components leverage v0's shadcn/ui components

---

### ADR 2: Why Jotai + useState for State Management
**Decision:** Use Jotai atoms for shared state, useState for local component state
**Status:** Approved

**Rationale:**
- Jotai solves prop drilling for chat history, preferences, selected cars
- Lightweight compared to Redux or Zustand
- Easy to integrate with async operations
- useState sufficient for form inputs and UI toggles

**Alternatives Considered:**
- Redux (too complex for hackathon scope)
- MobX (good but heavier)
- Just props (causes prop drilling in deep component trees)

**Implications:**
- Must create atoms for: preferences, chat, cars, comparison, auth
- Components use `useAtom` hook to read/write shared state
- Atoms persist to localStorage only if explicitly coded

---

### ADR 3: Why Cost Calculations Stay Client-Side
**Decision:** Calculate insurance and finance estimates in React (client-side)
**Status:** Approved

**Rationale:**
- Insurance and finance are deterministic formulas (no secrets)
- Instant updates when user adjusts budget or loan term
- Reduces server load during ~1000 concurrent users
- Data is synthetic/cached, not calling real insurers

**Alternatives Considered:**
- Server-side calculation (slower, more API calls)
- Hybrid with server cache (overkill for synthetic data)

**Implications:**
- Formula logic lives in `lib/calculations/insurance.ts` and `finance.ts`
- Must be simple deterministic functions, not external API calls
- Keep calculations consistent across all components

---

### ADR 4: Why NVIDIA Nemotron API (Not Embedded)
**Decision:** Call Nemotron API directly, don't embed agent in app
**Status:** Approved

**Rationale:**
- Nemotron is third-party hosted service (minimal integration)
- Keeps app focused on UI/UX, agent handles intelligence
- Scales better (agent load not on your servers)
- Easy to swap agents later if needed

**Alternatives Considered:**
- Embed agent model locally (heavy, slow, large bundle)
- Use Vercel AI SDK with local model (complex setup)

**Implications:**
- Next.js `/api/agent/chat` route forwards requests to Nemotron
- Nemotron API key stored in server env var
- Agent responses must be parsed for car suggestions

---

### ADR 5: Why Supabase (Not DynamoDB/Firebase/Other)
**Decision:** Use Supabase PostgreSQL for all data storage
**Status:** Approved

**Rationale:**
- Already set up (no migration effort)
- PostgreSQL more powerful than NoSQL for relational data (cars ↔ users ↔ bookings)
- Supabase Auth integrates perfectly
- Row-Level Security (RLS) for user data isolation

**Alternatives Considered:**
- Firebase (simpler API but less flexible queries)
- DynamoDB (overkill complexity)
- Prisma ORM (unnecessary abstraction for simple CRUD)

**Implications:**
- All queries through Supabase client
- Use server-side client for admin operations
- RLS rules must be configured for security

---

## Validation Checklist

- ✅ Decision table includes Version column with specific technologies
- ✅ Every epic mapped to architecture components
- ✅ Source tree structure complete, no placeholders
- ✅ All FRs from PRD have architectural support (quiz → chat → search → compare → cost → booking)
- ✅ All NFRs from PRD addressed (performance <3s, <5s agent response, ~1000 users, mobile-responsive)
- ✅ Implementation patterns cover all potential conflicts (naming, structure, formats, communication)
- ✅ Novel pattern (Agent-Led Discovery) fully documented
- ✅ Database schema defined
- ✅ API contracts specified
- ✅ Security approach documented
- ✅ Deployment instructions included
- ✅ Development environment setup instructions included

---

_Generated by BMAD Decision Architecture Workflow v1.3.2_
_Date: 2025-11-08_
_For: BMad (Toyota Autoguide Project)_
