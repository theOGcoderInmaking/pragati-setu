# ✦ Pragati Setu — Decision Intelligence for Indian Travelers

> **प्रगति सेतु** — *The bridge to progress.*
> A luxury travel intelligence platform that gives Indian travelers a verified Decision Passport before every trip.

---

## 🚀 Getting Started

```bash
npm run dev      # Development server (http://localhost:3000)
npm run build    # Production build
npm run lint     # Lint check
```

---

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| State Management | Zustand |
| Authentication | NextAuth (Next-Auth v5 Beta) |
| Styling | Tailwind CSS + Custom CSS Vars |
| Animations | Framer Motion |
| 3D Graphics | Three.js |
| Icons | Phosphor Icons |
| Fonts | Cormorant Garamond · JetBrains Mono · Sora |

---

## 🎨 Design System — "Luxury Atlas"

### Color Palette
| Token | Value | Usage |
|---|---|---|
| `--bg-void` | `#060A12` | Primary background |
| `--saffron` | `#D4590A` | Primary accent, CTAs |
| `--saffron-bright` | `#F07030` | Hover states |
| `--teal` | `#0B6E72` | Secondary accent |
| `--gold` | `#B8922A` | Tertiary accent |
| `--text-primary` | `#F2EDE4` | Body text |
| `--text-secondary` | `#A0AEC0` | Supporting text |
| `--score-high` | `#48BB78` | High confidence scores |
| `--score-mid` | `#ECC94B` | Medium confidence scores |
| `--score-low` | `#F56565` | Low confidence scores |

### Typography
- **Display / Serif:** Cormorant Garamond — headlines, large callouts
- **Mono:** JetBrains Mono — data labels, tags, status indicators
- **Sans / UI:** Sora — body copy, UI labels

### Components
- **`glass-card`** — glassmorphism card with `backdrop-blur-xl`, `bg-white/[0.03]`, border `white/[0.08]`
- **`shimmer-btn`** — Animated primary button with gradient shimmer effect

---

## 📄 Project Structure

```
src/
├── app/
│   ├── booking/              # Multi-tier booking modules
│   │   ├── flights/          # Flight discovery & tracking
│   │   ├── hotels/           # Premium stay discovery
│   │   ├── cabs/             # Local transportation
│   │   ├── buses/            # Luxury coaches
│   │   ├── trains/           # Heritage rail
│   │   └── ferries/          # Island transit
│   ├── dashboard/            # User Hub
│   │   ├── active-trip/      # Real-time traveler tracking
│   │   ├── bookings/         # Reservation archives
│   │   └── passports/        # Decision Passport collection
│   ├── register/             # 3-step immersive onboarding flow
│   ├── login/                # Immersive 3D-tilt login page
│   ├── guides/               # Local guide directories
│   ├── reviews/              # Traveler reviews and testimonials
│   ├── safety/               # Global safety data and map
│   ├── layout.tsx            # Root layout + Fonts + Context
│   └── page.tsx              # Homepage (Awareness + Feature + Conversion)
│
├── components/
│   ├── hero/                 # Hero & 3D Globe components
│   ├── layout/               # Navbar, Footer
│   ├── ui/                   # Shared UI (GlassCard, DecisionPassport)
│   └── sections/             # Modular Homepage Sections
│       ├── awareness/        # Problem, How It Works
│       ├── conversion/       # Pricing, Blog, Final CTA, Philosophy
│       ├── features/         # 3D Passport, Confidence Scores, Map, Booking Grid
│       └── trust/            # Guarantee, Guides, Social Proof
```

---

## 📄 Pages & Routes

### Core Pages
| Route | Description | Status |
|---|---|---|
| `/` | Homepage — Comprehensive awareness to conversion funnel | Production-ready |
| `/login` | Immersive auth entry with 3D tilt effects | Production-ready |
| `/register` | 3-step onboarding (Profile, Style, Safety) | Production-ready |
| `/safety` | Global safety intelligence map | Interactive UI |

### ✈️ Booking Hub (`/booking`)
The booking hub provides tailored interfaces for 6 distinct travel categories, each designed with bespoke luxury aesthetics.

| Sub-Route | Feature | Status |
|---|---|---|
| `/booking/flights` | Accountable flight vetting & carbon tracking | UI Prototype |
| `/booking/hotels` | Premium stay discovery with safety audits | UI Prototype |
| `/booking/cabs` | Verified local transportation booking | UI Prototype |
| `/booking/buses` | Inter-city luxury coach reservations | UI Prototype |
| `/booking/trains` | Heritage & Express rail booking interface | UI Prototype |
| `/booking/ferries` | Coastal and island transit coordination | UI Prototype |

### 🛠️ User Dashboard (`/dashboard`)
A centralized hub for the modern traveler to manage their "Decision Passports" and active itineraries.

| Sub-Route | Description | Status |
|---|---|---|
| `/dashboard` | Hub overview & quick stats | Production-ready (Dynamic) |
| `/dashboard/active-trip` | Real-time tracking of the current journey | Production-ready |
| `/dashboard/bookings` | Historical and upcoming reservation ledger | Production-ready |
| `/dashboard/passports` | Collection of verified Decision Passports | Production-ready |
| `/dashboard/profile` | User profile management | Core UI Ready |
| `/dashboard/settings` | App and security settings | Core UI Ready |

---

## 🪪 Homepage Sections

| Category | Section | Key Features |
|---|---|---|---|
| **Awareness** | Hero | 3D Space-grade Globe, Floating confidence metrics |
| | Problem | Word-by-word scroll-reveal narrative |
| | How It Works | Vertical gradient timeline with step mockups |
| **Features** | Planning Modes | Interactive split-screen, fanning package cards |
| | 3D Passport | Three.js interactive booklet, circular gauges |
| | Confidence Scores | Arc depth layout, 3D tilt cards, counting scores |
| | Booking Universe | Honeycomb glass grid, icon glow effects |
| | Safety Map | SVG world map, pulsing city dots, hover tooltips |
| **Trust** | The Guarantee | CSS wireframe shield, animated stat counters |
| | Local Guides | Horizontal drag-scroll guides, field report alerts |
| | Social Proof | CSS masonry, shared passport cards |
| **Conversion**| Philosophy | Staggered cards, budget allocation bars |
| | Pricing Teaser | 3 floating glass tiers with animated price points |
| | Blog Preview | Editorial grid layout |
| | Final CTA | Saffron full-viewport, देवनागरी watermark |

---

## ✅ Build Status

Current status: **Ready for Integration**
- **UI Architecture**: Stable (Tailwind + CSS Variables)
- **Animations**: Verified (Framer Motion)
- **3D Layer**: Optimized (Three.js)

---

## 📦 Key Dependencies

```json
{
  "next": "14.2.14",
  "next-auth": "5.0.0-beta.30",
  "zustand": "5.0.11",
  "framer-motion": "11.18.2",
  "three": "0.183.1",
  "@phosphor-icons/react": "2.1.10"
}
```

---

## 🗺️ Roadmap

- [x] Immersive 3D Landing Page
- [x] Reorganized Component Architecture
- [x] Multi-step Registration Flow
- [x] User Dashboard Core
- [x] Booking Hub Infrastructure
- [x] Real Auth Integration (Supabase/NextAuth Backend)
- [x] Dynamic Field Report Data
- [ ] Personalized Passport Detail Pages
- [ ] Mobile-first Responsive Pass
- [ ] Real-time Weather Integration
- [ ] External Booking Provider Integration
