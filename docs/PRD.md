# Toyota Autoguide - Product Requirements Document

**Authors:** Anthony Nguyen, Brice Duke, David Santos, Tuan Dihn
**Date:** 2025-11-08
**Version:** 1.0

---

## Executive Summary

Toyota Autoguide is an intelligent car shopping companion that guides users through Toyota discovery with agent-led conversation. Users enter with preferences, the agent narrows options efficiently, and they find their perfect Toyota quickly while understanding total cost of ownership.

### What Makes This Special

**Guided Discovery:** An intelligent Toyota shopping companion that proactively leads users through preference discovery to find their dream Toyota—across any channel they prefer (web, phone, SMS). The agent doesn't just answer questions; it guides users through a discovery journey with total cost transparency and frictionless test drive booking.

---

## Project Classification

**Technical Type:** Web App + AI Agent (Multi-channel)
**Domain:** General (Consumer e-commerce/automotive)
**Complexity:** Medium

---

## Success Criteria

Users find their perfect Toyota quickly through guided agent discovery. The agent efficiently narrows options based on preferences and presents the best matches with confidence.

---

## Product Scope

### MVP - Minimum Viable Product (Hackathon - 24 hours)

**Core Agent & Discovery Flow:**
- Preference quiz at sign-up (simple, focused questions to establish user intent)
- Agent-led chatbot conversation (guides discovery, doesn't wait for user questions)
- Toyota-specialist agent personality (approachable + knowledgeable)
- Search/filter by core criteria (price, seats, type, MPG)
- Side-by-side car comparison (find perfect match)
- Total cost view (MSRP + insurance + finance breakdown)
- Test drive scheduling with preferred location
- Supabase integration for car data and user profiles

**User Experience:**
- Mobile-friendly responsive design (modern browsers only)
- Email/Password + Google Login authentication
- Smooth chatbot interaction (can handle delayed responses)
- Clear cost transparency across all cars

**Technical Foundation:**
- NVIDIA Nemotron-hosted AI agent
- Supabase PostgreSQL backend (car data + user profiles)
- Toyota model database (all available models with specs)
- Support for ~1000 concurrent users

### Growth Features (Post-Hackathon)

- 📱 Phone/SMS agent channels (extend beyond web)
- 📅 Calendar integration for test drive scheduling
- 📧 SMS/Email confirmations + reminders
- ⭐ User reviews and ratings for cars
- 🤖 Collaborative filtering recommendations ("Users who liked X also liked Y")
- 💾 Resume shopping (save user preferences and browsing history)
- Multi-sort options (by MPG, reliability score, total cost)

### Vision (Future - Post-Hackathon Scaling)

- 🚀 B2B dealership platform (dealerships use agent for lead qualification)
- 📱 Native mobile app (iOS/Android)
- 🔄 Real-time inventory sync with dealerships
- 🎨 AR showroom visualization (future enhancement)

---

## Web App Specific Requirements

### Browser & Accessibility
- **Browser Support:** Modern browsers only (Chrome, Safari, Firefox)
- **Mobile Responsive:** Must be fully functional on mobile devices (critical UX requirement)
- **Performance:** Agent responses can have slight delay (not real-time critical)

### User Authentication
- Email/Password login
- Google OAuth integration
- User profile storage in Supabase

### Responsive Design Requirements
- Desktop-first design with mobile optimization
- Touch-friendly interface for mobile users
- Optimized chatbot interface for small screens

---

## AI Agent Specific Requirements

### Agent Architecture
- **Platform:** NVIDIA Nemotron (hosted agent)
- **Personality:** Approachable + knowledgeable Toyota specialist
- **Knowledge Base:** All Toyota models and specifications from Supabase
- **Context Window:** Complete access to all Toyota inventory and user preferences

### Agent Capabilities
1. **Guided Discovery:** Proactively ask preference questions in conversational flow
2. **Car Matching:** Match user preferences to Toyota inventory with reasoning
3. **Cost Calculation:** Calculate total cost of ownership (purchase + insurance + finance)
4. **Comparison Explanation:** Explain why certain cars match user needs better than others
5. **Test Drive Scheduling:** Guide users to book test drives with preferred location

### Agent Personality Guidelines
- Friendly and approachable (not robotic or corporate)
- Expert knowledge about Toyota specifications and comparisons
- Educational (explain why features matter to users)
- Action-oriented (push toward test drive booking, not endless browsing)

---

## Database & Data Architecture

### Supabase Tables

#### Cars Table
```json
{
  "id": "rav4-hybrid-2025",
  "name": "RAV4 Hybrid",
  "year": 2025,
  "type": "SUV",
  "seats": 5,
  "powertrain": "Hybrid",
  "msrp": 36000,
  "mpg_city": 41,
  "mpg_hwy": 38,
  "drive": "AWD",
  "tags": ["family", "commute", "eco", "weekend"]
}
```

**Core Fields:** id, name, year, type, seats, powertrain, msrp, mpg_city, mpg_hwy, drive, tags
**Additional Fields (derived/calculated):** insurance_quote, finance_options, reliability_score

#### Users Table
- user_id (UUID)
- user_role (user, admin)
- email
- password_hash
- google_oauth_id
- preferences (JSON: budget, car_type, seat_count, use_case, etc.)
- saved_cars (array of car IDs)
- test_drive_bookings (array with location preferences)
- created_at, updated_at

#### Test Drive Bookings Table
- booking_id
- user_id
- car_id
- preferred_location (dealership)
- booking_date
- status (pending, confirmed, completed)

---

## Functional Requirements

### Feature 1: Sign-Up & Preference Quiz
- Users create account with email/password or Google login
- Immediate preference quiz after sign-up (simple, focused questions)
- Questions cover: budget, car type, passenger needs, use case, mpg priority
- Store preferences in user profile for agent context

**Acceptance Criteria:**
- Quiz completes in <2 minutes
- All preferences saved to Supabase
- User can skip questions (agent fills in gaps)

### Feature 2: Agent-Led Discovery Chatbot
- Chatbot interface on web app
- Agent initiates conversation based on user preferences
- Agent asks clarifying questions to narrow options
- Agent suggests top 3-5 matching Toyotas with reasoning
- User can ask follow-up questions or request comparisons

**Acceptance Criteria:**
- Agent response time: <5 seconds (can be delayed)
- Agent provides 3+ alternative suggestions
- Agent explains "why" each car matches preferences
- Mobile-friendly chat interface

### Feature 3: Car Search & Filter
- Search by price range, car type, seats, MPG, drive type
- Multi-filter capability (combine multiple criteria simultaneously)
- Price range slider for easy budget filtering
- Results show quick specs cards (compact visual summary)

**Acceptance Criteria:**
- Filters work independently and together
- Results update in real-time
- Mobile-responsive filter UI

### Feature 4: Side-by-Side Comparison
- Compare up to 3 Toyota models simultaneously
- Display all key specs side-by-side
- Highlight differences in cost, efficiency, features
- Show insurance estimate for each car
- Show finance payment breakdown for each car

**Acceptance Criteria:**
- Comparison view loads quickly
- All specs clearly formatted and scannable
- Insurance/finance breakdowns visible

### Feature 5: Total Cost View (Price + Insurance + Finance)
- Show MSRP price
- Show estimated insurance quote (synthetic insurer)
- Show finance breakdown (payment options for different terms)
- Optional checkbox: "Include insurance in total cost"
- Display total monthly payment if financed

**Acceptance Criteria:**
- Total cost calculation is accurate
- Insurance quote integrates seamlessly
- Finance options show 24/36/60/72 month terms
- Display updates when user adjusts preferences

### Feature 6: Insurance Quote Integration
- Synthetic insurance calculator (pre-calculated/cached)
- Driver profile factors (age, location, driving record if available)
- Quote varies by car (some cars cheaper to insure)
- Educational explanation of pricing factors
- Shows impact of car choice on insurance cost

**Acceptance Criteria:**
- Quotes generated instantly (cached/pre-calculated)
- Quotes vary by car model
- Driver profile factors affect quote
- Can compare insurance across different cars

### Feature 7: Finance/Lease Options
- Show payment estimates for different loan terms
- Support buy vs. lease comparison
- Break down total cost (principal + interest)
- Show monthly payment clearly

**Acceptance Criteria:**
- Calculations accurate for different terms
- Clear monthly payment display
- Lease vs. buy options visible

### Feature 8: Test Drive Scheduling
- Calendar showing available dealership time slots
- One-click booking without leaving agent
- User specifies preferred dealership location
- Booking confirmation + reminders (email)
- Store booking in Supabase

**Acceptance Criteria:**
- Real-time availability display
- One-click booking works
- Confirmation email sent
- Booking stored in database

### Feature 9: Supabase Integration
- All car data fetched from Supabase
- User profiles and preferences stored in Supabase
- Test drive bookings saved to Supabase
- Real-time sync between agent and database

**Acceptance Criteria:**
- Agent can access all Toyota data
- User profiles persist across sessions
- Bookings stored reliably

### Feature 10: Multi-Channel Foundation (Web MVP)
- Web app is fully functional MVP
- Architecture supports future phone/SMS/email channels
- Agent accessible via web chatbot interface

**Acceptance Criteria:**
- Web chat interface works smoothly
- Agent accessible to ~1000 concurrent users
- Architecture documented for future channel expansion

---

## Non-Functional Requirements

### Performance
- Chat response time: <5 seconds acceptable (can be delayed)
- Page load time: <3 seconds on mobile 3G
- Database queries: <500ms
- Agent knowledge base: fully loaded on startup

### Security
- Passwords hashed (bcrypt or similar)
- Google OAuth properly configured
- User data isolated (no cross-user data leakage)
- Supabase RLS (Row Level Security) enforced

### Scalability
- Support ~1000 concurrent users during hackathon
- Supabase auto-scaling for peak loads
- Agent API calls queued if needed (acceptable delays)

### Accessibility
- Mobile-friendly responsive design
- Touch-friendly buttons and inputs
- Readable font sizes on small screens
- High contrast for readability (modern accessibility standards)

---

## Implementation Planning

### Epic Breakdown Required

Requirements must be decomposed into implementable epics and stories.

**Next Step:** Run `workflow create-epics-and-stories` to create the implementation breakdown.

---

## References

No prior documents (Product Brief, research, etc.)

---

## Next Steps

1. **Epic & Story Breakdown** - Convert requirements into bite-sized stories for implementation
2. **Architecture Planning** - Design technical architecture and integration points
3. **Development** - Begin hackathon implementation following epics

---

_This PRD captures the essence of Toyota Autoguide - Guided Discovery through an intelligent Toyota shopping companion that helps users find their perfect car quickly and understand total cost of ownership._

_Created through collaborative discovery between BMad and AI facilitator._
