import 'server-only';

import { cache } from 'react';
import { query } from '@/lib/db';
import { getSafetyDestinations, type SafetyDestination } from '@/lib/safety';

export type BlogCategoryKey =
    | 'safety-alerts'
    | 'scam-watch'
    | 'destination-guides'
    | 'field-reports'
    | 'platform-signals'
    | 'editorial';

export type BlogCategoryTone =
    | 'safety'
    | 'scam'
    | 'guide'
    | 'field'
    | 'signal'
    | 'editorial';

export interface BlogArticleStat {
    label: string;
    value: string;
}

export interface BlogArticleSection {
    heading: string;
    body: string;
}

export interface BlogArticle {
    id: string;
    slug: string;
    categoryKey: BlogCategoryKey;
    categoryLabel: string;
    badgeLabel: string;
    categoryTone: BlogCategoryTone;
    title: string;
    excerpt: string;
    author: string;
    source: string;
    locationLabel: string;
    publishedAt: string;
    publishedLabel: string;
    readTime: string;
    stats: BlogArticleStat[];
    sections: BlogArticleSection[];
    actionItems: string[];
}

interface AlertRow {
    id: string;
    city_name: string | null;
    country_name: string | null;
    alert_type: string;
    title: string;
    description: string | null;
    severity: string;
    severity_val: number;
    source: string | null;
    created_at: string;
    expires_at: string | null;
}

interface GuideRow {
    id: string;
    city_name: string | null;
    country_name: string | null;
    languages: string[] | null;
    specialties: string[] | null;
    avg_rating: number | null;
    total_reviews: number | null;
    total_sessions: number | null;
    verification_status: string;
    verified_at: string | null;
    full_name: string | null;
}

interface BlogPostRow {
    id: string;
    slug: string;
    title: string;
    excerpt: string | null;
    body: string;
    category: string;
    author: string;
    published_at: string | null;
    created_at: string;
}

interface NetworkCountsRow {
    active_alerts: number;
    active_guides: number;
    guide_cities: number;
    active_passports: number;
    reviews: number;
}

export const getBlogArticles = cache(async (): Promise<BlogArticle[]> => {
    try {
        const [alerts, guides, safetyDestinations, countsRows, blogPosts] = await Promise.all([
            query<AlertRow>(
                `SELECT
                    id,
                    city_name,
                    country_name,
                    alert_type,
                    title,
                    description,
                    severity,
                    severity_val,
                    source,
                    created_at,
                    expires_at
                 FROM safety_alerts
                 WHERE is_active = true
                 ORDER BY severity_val DESC, created_at DESC
                 LIMIT 6`
            ),
            query<GuideRow>(
                `SELECT
                    g.id,
                    g.city_name,
                    g.country_name,
                    g.languages,
                    g.specialties,
                    g.avg_rating,
                    g.total_reviews,
                    g.total_sessions,
                    g.verification_status,
                    g.verified_at,
                    u.full_name
                 FROM guides g
                 JOIN users u
                   ON u.id = g.user_id
                 WHERE g.is_active = true
                 ORDER BY
                    COALESCE(g.total_reviews, 0) DESC,
                    COALESCE(g.total_sessions, 0) DESC,
                    COALESCE(g.verified_at, u.created_at) DESC
                 LIMIT 6`
            ),
            getSafetyDestinations(),
            query<NetworkCountsRow>(
                `SELECT
                    (SELECT COUNT(*)::int
                     FROM safety_alerts
                     WHERE is_active = true) AS active_alerts,
                    (SELECT COUNT(*)::int
                     FROM guides
                     WHERE is_active = true) AS active_guides,
                    (SELECT COUNT(DISTINCT LOWER(TRIM(city_name)))::int
                     FROM guides
                     WHERE is_active = true
                       AND city_name IS NOT NULL
                       AND TRIM(city_name) <> '') AS guide_cities,
                    (SELECT COUNT(*)::int
                     FROM decision_passports
                     WHERE is_active = true) AS active_passports,
                    (SELECT COUNT(*)::int
                     FROM reviews) AS reviews`
            ),
            query<BlogPostRow>(
                `SELECT
                    id,
                    slug,
                    title,
                    excerpt,
                    body,
                    category,
                    author,
                    published_at,
                    created_at
                 FROM blog_posts
                 WHERE published = true
                 ORDER BY published_at DESC, created_at DESC`
            ),
        ]);

        const counts = countsRows[0] ?? {
            active_alerts: 0,
            active_guides: 0,
            guide_cities: 0,
            active_passports: 0,
            reviews: 0,
        };

        const alertArticles = alerts.map((alert) => buildAlertArticle(alert));
        const destinationArticles = safetyDestinations.map((destination) =>
            buildDestinationArticle(destination)
        );
        const guideArticles = guides.map((guide) => buildGuideArticle(guide));
        const networkArticle = buildNetworkArticle(counts);
        const editorialArticles = (blogPosts ?? []).map((post) => buildEditorialArticle(post));

        const articles = [
            ...alertArticles,
            ...destinationArticles,
            ...guideArticles,
            ...editorialArticles,
            networkArticle,
        ]
            .filter((article, index, current) =>
                current.findIndex(
                    (candidate) => candidate.slug === article.slug
                ) === index
            )
            .sort((left, right) => {
                const priorityDiff =
                    getArticlePriority(right) - getArticlePriority(left);

                if (priorityDiff !== 0) {
                    return priorityDiff;
                }

                return (
                    new Date(right.publishedAt).getTime() -
                    new Date(left.publishedAt).getTime()
                );
            });

        return articles.length > 0 ? articles : [buildWarmupArticle()];
    } catch (error) {
        console.error('Failed to build blog articles:', error);
        return [buildWarmupArticle()];
    }
});

function buildEditorialArticle(post: BlogPostRow): BlogArticle {
    const publishedAt = post.published_at || post.created_at;
    const bodySections: BlogArticleSection[] = [
        {
            heading: 'Report',
            body: post.body,
        },
    ];

    return {
        id: post.id,
        slug: post.slug,
        categoryKey: 'editorial',
        categoryLabel: post.category || 'Editorial',
        badgeLabel: (post.category || 'EDITORIAL').toUpperCase(),
        categoryTone: 'editorial',
        title: post.title,
        excerpt: post.excerpt || post.body.substring(0, 160) + '...',
        author: post.author,
        source: 'Editorial Desk',
        locationLabel: 'Intelligence Brief',
        publishedAt: publishedAt,
        publishedLabel: formatRelativeTime(publishedAt),
        readTime: estimateReadTime([post.body]),
        stats: [],
        sections: bodySections,
        actionItems: [],
    };
}

export async function getBlogArticleBySlug(
    slug: string
): Promise<BlogArticle | null> {
    const articles = await getBlogArticles();
    return articles.find((article) => article.slug === slug) ?? null;
}

function buildAlertArticle(alert: AlertRow): BlogArticle {
    const categoryKey = isScamAlert(alert)
        ? 'scam-watch'
        : 'safety-alerts';
    const categoryLabel = categoryKey === 'scam-watch'
        ? 'Scam Watch'
        : 'Safety Alerts';
    const badgeLabel = categoryKey === 'scam-watch'
        ? 'SCAM WATCH'
        : 'SAFETY ALERT';
    const categoryTone = categoryKey === 'scam-watch'
        ? 'scam'
        : 'safety';
    const locationLabel = formatLocation(
        alert.city_name,
        alert.country_name
    );
    const severityLabel = formatSeverity(alert.severity);
    const description = normalizeSentence(
        alert.description,
        `An active ${formatAlertType(alert.alert_type).toLowerCase()} signal has been logged for ${locationLabel}.`
    );
    const expiryLabel = alert.expires_at
        ? formatAbsoluteDate(alert.expires_at)
        : 'Open';
    const sourceLabel = String(alert.source ?? 'network').trim().toUpperCase();
    const sections: BlogArticleSection[] = [
        {
            heading: 'What changed',
            body: description,
        },
        {
            heading: 'Why this matters',
            body:
                `${locationLabel} currently has an active ${severityLabel.toLowerCase()} ` +
                `${formatAlertType(alert.alert_type).toLowerCase()} signal. ` +
                (alert.expires_at
                    ? `The alert is currently scheduled to expire on ${formatAbsoluteDate(alert.expires_at)}.`
                    : 'No expiry window has been recorded yet, so travelers should assume conditions can change quickly.'),
        },
        {
            heading: 'Immediate traveler response',
            body:
                `Use this as a movement-planning signal rather than background noise. ` +
                `Check arrival timing, transfer plans, and same-day activities before you commit to them in ${locationLabel}.`,
        },
    ];

    return {
        id: `alert-${alert.id}`,
        slug: `${slugify(alert.title)}-${alert.id.slice(0, 8)}`,
        categoryKey,
        categoryLabel,
        badgeLabel,
        categoryTone,
        title: alert.title,
        excerpt: description,
        author: 'Safety Desk',
        source: sourceLabel,
        locationLabel,
        publishedAt: alert.created_at,
        publishedLabel: formatRelativeTime(alert.created_at),
        readTime: estimateReadTime([description, ...sections.map((section) => section.body)]),
        stats: [
            { label: 'Severity', value: severityLabel },
            { label: 'Type', value: formatAlertType(alert.alert_type) },
            { label: 'Window', value: expiryLabel },
        ],
        sections,
        actionItems: buildAlertActions(alert, locationLabel),
    };
}

function buildGuideArticle(guide: GuideRow): BlogArticle {
    const locationLabel = formatLocation(
        guide.city_name,
        guide.country_name
    );
    const languages = sanitizeStringArray(guide.languages);
    const specialties = sanitizeStringArray(guide.specialties);
    const verificationLabel = formatVerificationStatus(
        guide.verification_status
    );
    const guideName = guide.full_name?.trim() || 'Local guide';
    const coverageLine = languages.length > 0
        ? `Languages currently listed: ${languages.join(', ')}.`
        : 'Languages have not been filled in on this guide profile yet.';
    const specialtyLine = specialties.length > 0
        ? `Specialties currently listed: ${specialties.join(', ')}.`
        : 'Specialties have not been filled in on this guide profile yet.';
    const sections: BlogArticleSection[] = [
        {
            heading: 'Coverage snapshot',
            body:
                `${guideName} is the current live guide profile attached to ${locationLabel}. ` +
                `${coverageLine} ${specialtyLine}`,
        },
        {
            heading: 'Quality signals',
            body:
                `${locationLabel} currently shows ${verificationLabel.toLowerCase()} status for this profile, ` +
                `${formatCount(guide.total_sessions, 'session')} logged, and ` +
                `${formatCount(guide.total_reviews, 'review')} recorded so far.`,
        },
        {
            heading: 'How to read this signal',
            body:
                `Guide coverage matters because the platform can only surface local context where guide supply actually exists. ` +
                `This report tells you how ready the network currently is for ${locationLabel}, not what a brochure claims.`,
        },
    ];

    return {
        id: `guide-${guide.id}`,
        slug: `${slugify(`${locationLabel} guide coverage snapshot`)}-${guide.id.slice(0, 8)}`,
        categoryKey: 'destination-guides',
        categoryLabel: 'Destination Guides',
        badgeLabel: 'DESTINATION GUIDE',
        categoryTone: 'guide',
        title: `${locationLabel}: guide coverage snapshot`,
        excerpt:
            `${guideName} is the current live guide profile connected to ${locationLabel}. ` +
            `${verificationLabel} status, ${formatCount(guide.total_sessions, 'session')}, and ` +
            `${formatCount(guide.total_reviews, 'review')} are recorded right now.`,
        author: guideName,
        source: `${locationLabel.toUpperCase()} GUIDE NETWORK`,
        locationLabel,
        publishedAt: guide.verified_at ?? new Date().toISOString(),
        publishedLabel: guide.verified_at
            ? formatRelativeTime(guide.verified_at)
            : 'Live now',
        readTime: estimateReadTime([
            coverageLine,
            specialtyLine,
            ...sections.map((section) => section.body),
        ]),
        stats: [
            { label: 'Verification', value: verificationLabel },
            { label: 'Rating', value: formatRating(guide.avg_rating) },
            { label: 'Sessions', value: String(guide.total_sessions ?? 0) },
        ],
        sections,
        actionItems: [
            'Treat this as supply visibility: it shows whether the guide network is actually present in the destination.',
            'If the profile is still pending verification, do not market the destination as fully guide-covered yet.',
            'Update the guide record with languages and specialties before using it as a trust signal elsewhere.',
        ],
    };
}

function buildDestinationArticle(
    destination: SafetyDestination
): BlogArticle {
    const locationLabel = destination.label;
    const scoreModeLabel = formatSafetyScoreMode(destination.scoreMode);
    const safetyScoreLabel = `Safety score · ${scoreModeLabel}`;
    const publishedAt = destination.latestSignalAt ?? new Date().toISOString();
    const sections: BlogArticleSection[] = [
        {
            heading: 'Destination signal',
            body:
                `${locationLabel} is currently live in the safety destination feed with a ${destination.scoreDisplay}/10 safety score. ` +
                `That score is running in ${scoreModeLabel.toLowerCase()} mode and is backed by ${formatCount(destination.passportCount, 'active passport')}, ` +
                `${formatCount(destination.guideCount, 'active guide')}, and ${formatCount(destination.alertCount, 'active alert')} in the current dataset.`,
        },
        {
            heading: 'How the score is being read',
            body:
                destination.scoreMode === 'stored'
                    ? `${locationLabel} already has stored passport confidence rows, so the published safety score is coming directly from live confidence_scores data rather than a coverage estimate.`
                    : `${locationLabel} does not have a stored passport confidence row yet, so the published safety score is being derived from live alert severity, guide coverage, and passport activity instead.`,
        },
        {
            heading: 'Operational context',
            body:
                `${destination.summary}. ` +
                `${destination.alertHeadline
                    ? `The current lead alert tied to this destination is "${destination.alertHeadline}".`
                    : 'There is no active alert headline tied to this destination right now.'} ` +
                `The latest destination-linked signal was recorded ${destination.lastUpdatedLabel}.`,
        },
    ];

    return {
        id: `destination-${destination.slug}`,
        slug: `${destination.slug}-safety-signal`,
        categoryKey: 'field-reports',
        categoryLabel: 'Field Reports',
        badgeLabel: 'FIELD REPORT',
        categoryTone: 'field',
        title: `${locationLabel}: safety destination signal is live`,
        excerpt:
            `${destination.summary}. ` +
            `${safetyScoreLabel} is ${destination.scoreDisplay}/10.`,
        author: 'Platform Desk',
        source: destination.scoreMode === 'stored'
            ? 'STORED SAFETY SCORES'
            : 'DERIVED SAFETY SIGNALS',
        locationLabel,
        publishedAt,
        publishedLabel: destination.latestSignalAt
            ? formatRelativeTime(destination.latestSignalAt)
            : 'Live now',
        readTime: estimateReadTime(sections.map((section) => section.body)),
        stats: [
            { label: safetyScoreLabel, value: destination.scoreDisplay },
            { label: 'Passports', value: String(destination.passportCount) },
            { label: 'Guides', value: String(destination.guideCount) },
            { label: 'Alerts', value: String(destination.alertCount) },
        ],
        sections,
        actionItems: [
            destination.scoreMode === 'stored'
                ? 'Refresh the stored confidence score whenever conditions shift so the published score does not lag the live destination state.'
                : 'Seed or calculate a confidence_scores row for this destination if you want the article to switch from derived mode to stored mode.',
            'Use destination signal reports to decide where guide and alert coverage needs to deepen next.',
            'If alert volume spikes for the same city, let alert articles outrank the broader destination signal in the feed.',
        ],
    };
}

function buildNetworkArticle(counts: NetworkCountsRow): BlogArticle {
    const now = new Date().toISOString();
    const sections: BlogArticleSection[] = [
        {
            heading: 'Current network footprint',
            body:
                `Right now the platform shows ${formatCount(counts.active_alerts, 'active alert')}, ` +
                `${formatCount(counts.active_guides, 'active guide')}, ` +
                `${formatCount(counts.guide_cities, 'guide city')}, and ` +
                `${formatCount(counts.active_passports, 'active passport')}.`,
        },
        {
            heading: 'What this feed is built from',
            body:
                `This blog is generated from live platform records rather than a static marketing list. ` +
                `Safety alerts, guide profiles, and destination demand are turned into reports only when those records actually exist.`,
        },
        {
            heading: 'What happens next',
            body:
                `${counts.reviews > 0
                    ? `${formatCount(counts.reviews, 'review')} is already available and can be folded into future trust and quality reports.`
                    : 'Review volume is still at zero, so traveler quality reports are not being published yet.'} ` +
                `As more alerts, guides, and trips land, the feed will widen on its own without hardcoded filler.`,
        },
    ];

    return {
        id: 'network-pulse',
        slug: 'network-pulse-live-platform-signals',
        categoryKey: 'platform-signals',
        categoryLabel: 'Platform Signals',
        badgeLabel: 'PLATFORM SIGNAL',
        categoryTone: 'signal',
        title: 'Network pulse: what the platform is actually seeing right now',
        excerpt:
            `This report replaces fake editorial volume with a transparent snapshot of the current signal base: ` +
            `${formatCount(counts.active_alerts, 'alert')}, ${formatCount(counts.active_guides, 'guide')}, ` +
            `and ${formatCount(counts.active_passports, 'active passport')}.`,
        author: 'Platform Desk',
        source: 'LIVE NETWORK COUNTS',
        locationLabel: 'Network wide',
        publishedAt: now,
        publishedLabel: 'Live now',
        readTime: estimateReadTime(sections.map((section) => section.body)),
        stats: [
            { label: 'Alerts', value: String(counts.active_alerts) },
            { label: 'Guides', value: String(counts.active_guides) },
            { label: 'Passports', value: String(counts.active_passports) },
        ],
        sections,
        actionItems: [
            'Keep the blog feed honest by deriving it from actual data tables rather than fixed demo copy.',
            'Add richer article types only when the underlying source table exists and contains enough signal.',
            'Use this pulse report as the fallback featured card when the alert feed is thin.',
        ],
    };
}

function buildWarmupArticle(): BlogArticle {
    const now = new Date().toISOString();
    const sections: BlogArticleSection[] = [
        {
            heading: 'Why the feed is thin',
            body:
                'The intelligence blog is now wired to live platform tables. If those tables are empty or unavailable, the page stays honest about that instead of showing a fake editorial archive.',
        },
        {
            heading: 'What will populate it',
            body:
                'Active safety alerts, guide coverage, passport demand, and future review signals will generate reports automatically as records appear in the database.',
        },
        {
            heading: 'What changed in this implementation',
            body:
                'Cards are now navigable, search and filters work against real article records, and the page no longer depends on a fabricated nine-card list to look complete.',
        },
    ];

    return {
        id: 'feed-warmup',
        slug: 'intelligence-feed-warming-up',
        categoryKey: 'platform-signals',
        categoryLabel: 'Platform Signals',
        badgeLabel: 'PLATFORM SIGNAL',
        categoryTone: 'signal',
        title: 'The intelligence feed is warming up',
        excerpt:
            'This page is now connected to live platform data. When alerts, guide coverage, and demand rows accumulate, they will appear here automatically.',
        author: 'Platform Desk',
        source: 'LIVE NETWORK COUNTS',
        locationLabel: 'Network wide',
        publishedAt: now,
        publishedLabel: 'Live now',
        readTime: estimateReadTime(sections.map((section) => section.body)),
        stats: [
            { label: 'Alerts', value: '0' },
            { label: 'Guides', value: '0' },
            { label: 'Passports', value: '0' },
        ],
        sections,
        actionItems: [
            'Seed the safety alerts table to unlock live alert reporting.',
            'Complete guide profiles to surface destination guide coverage reports.',
            'Let passport demand accumulate before adding more opinionated editorial framing.',
        ],
    };
}

function buildAlertActions(
    alert: AlertRow,
    locationLabel: string
): string[] {
    const type = normalizeLocation(alert.alert_type);

    if (type.includes('weather')) {
        return [
            `Check same-day transit and airport transfer timing before moving through ${locationLabel}.`,
            'Keep low-lying neighborhoods and outdoor plans flexible until conditions settle.',
            'Reconfirm hotel access, station approach, and transfer buffers instead of assuming the default route still works.',
        ];
    }

    if (isScamAlert(alert)) {
        return [
            `Treat unsolicited help, "special access," and pressure to pay in cash around ${locationLabel} as a risk signal.`,
            'Verify transport, exchange, and booking steps inside trusted apps before you commit money.',
            'If the story changes mid-transaction, step out immediately and rebook from a verified channel.',
        ];
    }

    return [
        `Review movement timing in ${locationLabel} before locking in the next leg of the trip.`,
        'Keep arrival, transfer, and accommodation plans flexible until the alert clears.',
        'Use current local signals rather than older itinerary assumptions.',
    ];
}

function isScamAlert(alert: Pick<AlertRow, 'alert_type' | 'title'>): boolean {
    const haystack =
        `${alert.alert_type} ${alert.title}`.toLowerCase();
    return haystack.includes('scam') || haystack.includes('fraud');
}

function formatAlertType(value: string): string {
    const normalized = normalizeLocation(value);
    if (!normalized) {
        return 'Alert';
    }

    return normalized
        .split(/[_\s-]+/)
        .filter(Boolean)
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ');
}

function formatSeverity(value: string): string {
    const normalized = normalizeLocation(value);
    if (!normalized) {
        return 'Unknown';
    }

    return normalized.charAt(0).toUpperCase() + normalized.slice(1);
}

function formatVerificationStatus(value: string): string {
    const normalized = normalizeLocation(value);
    switch (normalized) {
        case 'verified':
            return 'Verified';
        case 'rejected':
            return 'Rejected';
        default:
            return 'Pending';
    }
}

function formatRating(value: number | null): string {
    if (!value || value <= 0) {
        return 'No rating';
    }

    return `${value.toFixed(1)} / 5`;
}

function formatLocation(
    city: string | null | undefined,
    country: string | null | undefined
): string {
    const cityPart = String(city ?? '').trim();
    const countryPart = String(country ?? '').trim();

    if (cityPart && countryPart) {
        return `${cityPart}, ${countryPart}`;
    }

    return cityPart || countryPart || 'Network wide';
}

function formatCount(value: number | null | undefined, noun: string): string {
    const safeValue = Number.isFinite(value) ? Number(value) : 0;
    const suffix = safeValue === 1 ? noun : `${noun}s`;
    return `${safeValue} ${suffix}`;
}

function sanitizeStringArray(value: string[] | null | undefined): string[] {
    if (!Array.isArray(value)) {
        return [];
    }

    return value
        .map((entry) => String(entry).trim())
        .filter(Boolean);
}

function normalizeSentence(
    value: string | null | undefined,
    fallback: string
): string {
    const normalized = String(value ?? '').trim();
    if (!normalized) {
        return fallback;
    }

    return normalized.endsWith('.')
        ? normalized
        : `${normalized}.`;
}

function normalizeLocation(value: string | null | undefined): string {
    return String(value ?? '').trim().toLowerCase();
}

function formatSafetyScoreMode(value: SafetyDestination['scoreMode']): string {
    return value === 'stored'
        ? 'Stored'
        : 'Derived';
}

function slugify(value: string): string {
    return value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 80);
}

function estimateReadTime(parts: string[]): string {
    const words = parts
        .join(' ')
        .trim()
        .split(/\s+/)
        .filter(Boolean).length;
    const minutes = Math.max(3, Math.ceil(words / 140));
    return `${minutes} min read`;
}

function formatRelativeTime(value: string): string {
    const timestamp = new Date(value).getTime();

    if (Number.isNaN(timestamp)) {
        return 'Recently';
    }

    const diffMs = Date.now() - timestamp;
    const diffDays = Math.floor(diffMs / 86400000);
    const diffHours = Math.floor(diffMs / 3600000);

    if (diffDays > 1) {
        return `${diffDays} days ago`;
    }

    if (diffDays === 1) {
        return '1 day ago';
    }

    if (diffHours > 1) {
        return `${diffHours} hours ago`;
    }

    if (diffHours === 1) {
        return '1 hour ago';
    }

    return 'Just now';
}

function formatAbsoluteDate(value: string): string {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return 'Unknown';
    }

    return date.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
}

function getArticlePriority(article: BlogArticle): number {
    switch (article.categoryKey) {
        case 'safety-alerts':
        case 'scam-watch':
            return 40;
        case 'editorial':
            return 35;
        case 'field-reports':
            return 30;
        case 'destination-guides':
            return 20;
        case 'platform-signals':
            return 10;
        default:
            return 0;
    }
}
