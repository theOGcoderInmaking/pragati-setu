# Project Status Audit Report — Pragati Setu

This report outlines the current status of the project, identifying hardcoded data, non-functional UI elements, and broken links as of March 20, 2026.

## 1. Non-Functional / Broken Elements
Items that are clickable but do not lead to functional pages or trigger the expected actions.

### Navbar & Navigation
- **[BROKEN] Category Dropdowns**: The following links lead to 404 pages as no underlying routes or files exist:
  - `Booking > Homestays` (`/booking/homestays`)
  - `Booking > Hostels` (`/booking/hostels`)
  - `Booking > Events` (`/booking/events`)
  - `Booking > Workshops` (`/booking/workshops`)
  - `Booking > Guided Tours` (`/booking/tours`)

### Interaction Logic
- **[INCOMPLETE] "Add to Passport" Buttons**: Present in **Cabs** and **Trains** search results.
  - Currently redirect to `/decision-passport` or perform no action.
  - Do not persist the selected transport option to the user's active passport database.
- **[MOCKUP] Plan Your Trip Page**:
  - "Start Planning Free" and "Let Us Plan" buttons are static `<button>` elements with no hooked-up logic or navigation.
  - The "Match Indicator" (Your match ★★★★☆) is a hardcoded string.

### Footer
- **[BROKEN] Social Links**: All icons (Twitter, Instagram, GitHub, LinkedIn) point to `#`.
- **[BROKEN] Legal Links**: Privacy Policy, Terms, etc., all point to `#`.

---

## 2. Hardcoded Data Centers
Major components currently relying on static arrays/objects that should eventually be driven by the database or external APIs.

### Home Page (`app/page.tsx`)
- **Featured Destinations**: Tokyo, Bangkok, and Dubai cards are hardcoded.
- **Confidence Scores Section**: The animated statistics (e.g., Safety 94/100) are hardcoded in the component.

### Planning Page (`app/plan/page.tsx`)
- **Destinations & Philosophies**: The entire logic for "Comfort Seeker", "Explorer", etc., is stored in a static constant.
- **Visual Mockups**: The Day 1/2/3 timeline and "Museum closed Mondays" warning are static UI demonstrations.

### Booking Hubs
- **Cabs (`app/booking/cabs/page.tsx`)**: Contains a massive directory (200+ lines) of city-specific app recommendations and local operators (e.g., "Rajesh Reliable Cabs").
- **Trains (`app/booking/trains/page.tsx`)**: Example results like "High-Speed Rail (Flexible)" are static placeholders shown before/alongside search results.

### Reviews & Pricing
- **Reviews (`app/reviews/page.tsx`)**: All 287k reported reviews are represented by a hardcoded array of ~10 static examples.
- **Pricing (`app/pricing/page.tsx`)**: All tier details, guarantee stats ("47 claims resolved"), and FAQs are hardcoded.

---

## 3. Data-Driven Components (The "Grip")
Areas where the project is successfully pulling from live signals.

- **Guides Hub**: Dynamically fetches local experts and their verification status from the `guides` table.
- **About Page**: Successfully reports live platform counts (subscribers, active passports, alerts) via SQL queries.
- **Blog / Dashboard**: Fully integrated with live safety signals, weather API, and user passport data.
- **Flight/Hotel Search**: Successfully generates functional deep links to live booking platforms.

## Next Steps Recommended
1. **Redirect or Remove** broken Navbar categories until pages are built.
2. **Implement Persistence** for the "Add to Passport" action to bridge the gap between search and planning.
3. **Migrate Review Collage** to a database-backed system to reflect real user feedback.
4. **Wire up Footer links** to valid legal/social destinations.
