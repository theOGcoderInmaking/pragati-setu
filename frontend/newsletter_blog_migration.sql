-- Migration: Add newsletter_subscribers and blog_posts tables

CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email          TEXT UNIQUE NOT NULL,
  subscribed_at  TIMESTAMPTZ DEFAULT now(),
  is_active      BOOLEAN DEFAULT true,
  source         TEXT DEFAULT 'blog'
);

CREATE TABLE IF NOT EXISTS blog_posts (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug           TEXT UNIQUE NOT NULL,
  title          TEXT NOT NULL,
  excerpt        TEXT,
  body           TEXT NOT NULL,
  category       TEXT DEFAULT 'editorial',
  author         TEXT DEFAULT 'Editorial Desk',
  published      BOOLEAN DEFAULT false,
  published_at   TIMESTAMPTZ,
  created_at     TIMESTAMPTZ DEFAULT now(),
  updated_at     TIMESTAMPTZ DEFAULT now()
);
