# ✦ Pragati Setu — Decision Intelligence for Indian Travelers

> **प्रगति सेतु** — *The bridge to progress.*
> A luxury travel intelligence platform that gives Indian travelers a verified Decision Passport before every trip.

---

## 🚀 Getting Started

```bash
npm run dev      # Development server (http://localhost:3002)
npm run build    # Production build
npm run lint     # Lint check
```

> **Note:** Port 3000 may conflict with other services. The dev server runs on **http://localhost:3002** by default.

---

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
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
| `--bg-elevated` | `#0D1520` | Sections, cards |
| `--bg-deeper` | `#04070D` | Guarantee section |
| `--saffron` | `#D4590A` | Primary accent, CTAs |
| `--teal-light` | `#12A8AE` | Secondary accent |
| `--gold` | `#B8922A` | Tertiary accent |
| `--text-primary` | `rgba(255,255,255,0.95)` | Body text |
| `--text-secondary` | `rgba(255,255,255,0.55)` | Supporting text |
| `--score-high` | `#2EC97A` | High confidence scores |

### Typography
- **Display / Serif:** Cormorant Garamond — headlines, large callouts
- **Mono:** JetBrains Mono — data labels, tags, status indicators
- **Sans:** Sora — body copy, UI labels

### Components
- **`glass-card`** — glassmorphism card with `backdrop-filter: blur(12px)`, `bg-white/5`, border `white/10`

---

## 📄 Project Structure

```
src/
├── app/
│   ├── page.tsx              # Homepage (all 15 sections)
│   ├── login/
│   │   └── page.tsx          # Auth: Login page (no nav)
│   ├── layout.tsx            # Root layout + fonts
│   └── globals.css           # Design tokens, base styles
│
├── components/
│   ├── hero/
│   │   └── Hero.tsx          # Section 1: Atmospheric hero
│   │
│   ├── sections/
│   │   ├── ProblemSection.tsx          # §2  Word-reveal scroll animation
│   │   ├── PlanningModesSection.tsx    # §3  Split-screen mode selector
│   │   ├── PassportPreviewSection.tsx  # §4  Three.js passport + gauges
│   │   ├── ConfidenceScoresSection.tsx # §5  Arc layout, 3D tilt cards
│   │   ├── BookingUniverseSection.tsx  # §6  Honeycomb booking grid
│   │   ├── GuaranteeSection.tsx        # §7  Shield, counters, guarantee
│   │   ├── SafetyMapSection.tsx        # §8  SVG world map, city dots
│   │   ├── LocalGuidesSection.tsx      # §9  Horizontal drag-scroll guides
│   │   ├── HowItWorksSection.tsx       # §10 Animated vertical timeline
│   │   ├── PackagePhilosophySection.tsx# §11 5-card staggered package selector
│   │   ├── SocialProofSection.tsx      # §12 CSS masonry social cards
│   │   ├── PricingTeaserSection.tsx    # §13 3-tier pricing cards
│   │   ├── BlogPreviewSection.tsx      # §14 Editorial grid blog preview
│   │   └── FinalCTASection.tsx         # §15 Full-viewport saffron CTA
│   │
│   └── ui/
│       ├── Navbar.tsx        # Scroll-aware glass nav + mega dropdown
│       └── GlassCard.tsx     # Reusable glassmorphism card
```

---

## 📄 Pages

| Route | File | Description |
|---|---|---|
| `/` | `app/page.tsx` | Homepage — 15 sections |
| `/login` | `app/login/page.tsx` | Auth login — no nav, immersive bg, 3D tilt card |

---

## 🪪 Homepage Sections

| # | Section | Key Features |
|---|---|---|
| 1 | **Hero** | Particle field, Three.js globe, floating confidence cards |
| 2 | **Problem Statement** | Word-by-word scroll reveal animation |
| 3 | **Two Planning Modes** | Interactive split-screen, fanning package cards |
| 4 | **Decision Passport Preview** | Three.js 3D booklet, animated circular gauges |
| 5 | **Five Confidence Scores** | Arc depth layout, 3D cursor-tilt, counting scores |
| 6 | **Booking Universe** | Honeycomb grid, icon glow effects |
| 7 | **The Guarantee** | CSS wireframe shield, animated stat counters |
| 8 | **Safety Map** | SVG world map, pulsing city dots, hover tooltips |
| 9 | **Local Guides Strip** | Drag-to-scroll, field report alerts, star ratings |
| 10 | **How It Works** | Scroll-driven gradient timeline, step mockups |
| 11 | **Package Philosophy** | 5 staggered cards, budget allocation bars |
| 12 | **Social Proof** | CSS masonry, rotated "shared passport" cards |
| 13 | **Pricing Teaser** | 3 floating glass tiers (₹149 / ₹999 / ₹4,999/yr) |
| 14 | **Blog Preview** | Editorial 2⁄3 + 1⁄3 grid layout |
| 15 | **Final CTA** | Full-viewport saffron, देवनागरी watermark, grain overlay |

---

## ✅ Build Status

Last verified build: **`npm run build` → Exit code 0** — zero lint errors, zero type errors.
Routes: `/` (179 kB) · `/login` (17.8 kB)

---

## 📦 Key Dependencies

```json
{
  "next": "14.2.14",
  "react": "^18",
  "framer-motion": "^11",
  "three": "^0.162",
  "@phosphor-icons/react": "^2.1",
  "typescript": "^5"
}
```

---

## 🗺️ Roadmap

- [ ] Explore / Destinations page
- [ ] Decision Passport detail page
- [ ] Authentication (Supabase)
- [ ] Guide profile pages
- [ ] Booking flow integration
- [ ] Mobile responsive polish pass
