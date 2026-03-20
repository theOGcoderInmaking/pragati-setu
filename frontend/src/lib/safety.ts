import { query } from "@/lib/db";

export type SafetyTier = "safe" | "caution" | "alert";

interface AlertSignalRow {
    city_name: string | null;
    country_name: string | null;
    title: string;
    description: string | null;
    severity: string;
    severity_val: number;
    alert_type: string;
    source: string;
    created_at: string;
    expires_at: string | null;
}

interface GuideSignalRow {
    city_name: string | null;
    country_name: string | null;
    verification_status: string;
    total_reviews: number;
    total_sessions: number;
    avg_rating: number;
    languages: string[] | null;
    specialties: string[] | null;
}

interface PassportSignalRow {
    destination_name: string;
    destination_country: string | null;
    created_at: string;
    safety_score: number | null;
    safety_label: string | null;
}

interface DestinationAccumulator {
    city: string;
    country: string;
    alerts: AlertSignalRow[];
    guides: GuideSignalRow[];
    passports: PassportSignalRow[];
}

export interface SafetyOverviewStat {
    label: string;
    value: string;
}

export interface SafetyRegionSummary {
    region: string;
    tier: SafetyTier;
    destinationCount: number;
    alertCount: number;
    guideCount: number;
    labels: string[];
}

export interface SafetyOverview {
    destinationCount: number;
    alertCount: number;
    guideBackedDestinationCount: number;
    scoredDestinationCount: number;
    regionCount: number;
    latestUpdateLabel: string;
    heroLine: string;
    stats: SafetyOverviewStat[];
}

export interface SafetyAlertSignal {
    title: string;
    description: string | null;
    severity: string;
    severityValue: number;
    createdAt: string;
    expiresAt: string | null;
    alertType: string;
    source: string;
}

export interface SafetyGuideSignal {
    verificationStatus: string;
    totalReviews: number;
    totalSessions: number;
    avgRating: number;
    languages: string[];
    specialties: string[];
}

export interface SafetyPassportSignal {
    destinationLabel: string;
    createdAt: string;
    safetyScore: number | null;
    safetyLabel: string | null;
}

export interface SafetyDestination {
    id: string;
    slug: string;
    city: string;
    country: string;
    label: string;
    flag: string;
    region: string;
    score: number;
    scoreDisplay: string;
    scoreMode: "stored" | "derived";
    tier: SafetyTier;
    badgeLabel: string;
    summary: string;
    tags: string[];
    alertCount: number;
    guideCount: number;
    verifiedGuideCount: number;
    passportCount: number;
    lastUpdatedLabel: string;
    latestSignalAt: string | null;
    alertHeadline: string | null;
}

export interface SafetyDestinationDetail extends SafetyDestination {
    alerts: SafetyAlertSignal[];
    guides: SafetyGuideSignal[];
    passports: SafetyPassportSignal[];
    scoreExplanation: string;
}

export async function getSafetyDestinations(): Promise<SafetyDestination[]> {
    const details = await getSafetyDestinationDetails();
    return details.map(stripDestinationDetail);
}

export async function getSafetyDestinationDetails(): Promise<
    SafetyDestinationDetail[]
> {
    return loadSafetyDestinationDetails();
}

export async function getSafetyDestinationBySlug(
    slug: string
): Promise<SafetyDestinationDetail | null> {
    const details = await getSafetyDestinationDetails();
    return details.find((destination) => destination.slug === slug) ?? null;
}

export async function getSafetyOverview(): Promise<{
    destinations: SafetyDestination[];
    regions: SafetyRegionSummary[];
    overview: SafetyOverview;
}> {
    const destinationDetails = await getSafetyDestinationDetails();
    const destinations = destinationDetails.map(stripDestinationDetail);
    const regions = buildRegionSummaries(destinations);
    const latestSignalAt = destinations
        .map((destination) => destination.latestSignalAt)
        .filter(Boolean)
        .sort()
        .at(-1) ?? null;
    const guideBackedDestinationCount = destinations.filter(
        (destination) => destination.guideCount > 0
    ).length;
    const scoredDestinationCount = destinations.filter(
        (destination) => destination.scoreMode === "stored"
    ).length;
    const alertCount = destinations.reduce(
        (total, destination) => total + destination.alertCount,
        0
    );

    return {
        destinations,
        regions,
        overview: {
            destinationCount: destinations.length,
            alertCount,
            guideBackedDestinationCount,
            scoredDestinationCount,
            regionCount: regions.length,
            latestUpdateLabel: latestSignalAt
                ? formatDateLabel(latestSignalAt)
                : "Awaiting signal history",
            heroLine: `${formatCount(destinations.length)} live destinations · ${formatCount(alertCount)} active alerts · ${formatCount(guideBackedDestinationCount)} guide-backed locations`,
            stats: [
                {
                    label: "LIVE DESTINATIONS",
                    value: formatCount(destinations.length),
                },
                {
                    label: "ACTIVE ALERTS",
                    value: formatCount(alertCount),
                },
                {
                    label: "GUIDE-BACKED",
                    value: formatCount(guideBackedDestinationCount),
                },
                {
                    label: "LATEST SIGNAL",
                    value: latestSignalAt
                        ? formatDateLabel(latestSignalAt)
                        : "No dated signals",
                },
            ],
        },
    };
}

async function loadSafetyDestinationDetails(): Promise<SafetyDestinationDetail[]> {
    const [alertRows, guideRows, passportRows] = await Promise.all([
        query<AlertSignalRow>(
            `SELECT
                city_name,
                country_name,
                title,
                description,
                severity,
                severity_val,
                alert_type,
                source,
                created_at,
                expires_at
             FROM safety_alerts
             WHERE is_active = true
             ORDER BY created_at DESC`,
            []
        ).catch(() => [] as AlertSignalRow[]),
        query<GuideSignalRow>(
            `SELECT
                city_name,
                country_name,
                verification_status,
                total_reviews,
                total_sessions,
                avg_rating,
                languages,
                specialties
             FROM guides
             WHERE is_active = true
             ORDER BY total_reviews DESC, total_sessions DESC`,
            []
        ).catch(() => [] as GuideSignalRow[]),
        query<PassportSignalRow>(
            `SELECT
                dp.destination_name,
                dp.destination_country,
                dp.created_at,
                cs.safety_score,
                cs.safety_label
             FROM decision_passports dp
             LEFT JOIN confidence_scores cs
               ON cs.passport_id = dp.id
             WHERE dp.is_active = true
             ORDER BY dp.created_at DESC`,
            []
        ).catch(() => [] as PassportSignalRow[]),
    ]);

    const destinations = new Map<string, DestinationAccumulator>();

    alertRows.forEach((alert) => {
        const city = cleanLocation(alert.city_name);
        const country = cleanLocation(alert.country_name);
        const accumulator = getOrCreateAccumulator(destinations, city, country);

        if (accumulator) {
            accumulator.alerts.push(alert);
        }
    });

    guideRows.forEach((guide) => {
        const city = cleanLocation(guide.city_name);
        const country = cleanLocation(guide.country_name);
        const accumulator = getOrCreateAccumulator(destinations, city, country);

        if (accumulator) {
            accumulator.guides.push(guide);
        }
    });

    passportRows.forEach((passport) => {
        const city = cleanLocation(extractDestinationCity(passport.destination_name));
        const country = cleanLocation(passport.destination_country);
        const accumulator = getOrCreateAccumulator(destinations, city, country);

        if (accumulator) {
            accumulator.passports.push(passport);
        }
    });

    return Array.from(destinations.values())
        .map(buildDestinationDetail)
        .sort((left, right) => {
            if (left.tier !== right.tier) {
                return tierWeight(right.tier) - tierWeight(left.tier);
            }

            if (left.alertCount !== right.alertCount) {
                return right.alertCount - left.alertCount;
            }

            if (left.guideCount !== right.guideCount) {
                return right.guideCount - left.guideCount;
            }

            if (left.passportCount !== right.passportCount) {
                return right.passportCount - left.passportCount;
            }

            return left.label.localeCompare(right.label);
        });
}

function buildDestinationDetail(
    accumulator: DestinationAccumulator
): SafetyDestinationDetail {
    const scorePayload = deriveScore(accumulator);
    const alertCount = accumulator.alerts.length;
    const guideCount = accumulator.guides.length;
    const verifiedGuideCount = accumulator.guides.filter(
        (guide) => normalizeLocation(guide.verification_status) === "verified"
    ).length;
    const passportCount = accumulator.passports.length;
    const region = getRegionForCountry(accumulator.country);
    const slug = slugifyDestination(accumulator.city, accumulator.country);
    const label = accumulator.country
        ? `${accumulator.city}, ${accumulator.country}`
        : accumulator.city;
    const alerts = accumulator.alerts.map<SafetyAlertSignal>((alert) => ({
        title: alert.title,
        description: alert.description,
        severity: alert.severity,
        severityValue: Number(alert.severity_val ?? 0),
        createdAt: alert.created_at,
        expiresAt: alert.expires_at,
        alertType: alert.alert_type,
        source: alert.source,
    }));
    const guides = accumulator.guides.map<SafetyGuideSignal>((guide) => ({
        verificationStatus: guide.verification_status,
        totalReviews: Number(guide.total_reviews ?? 0),
        totalSessions: Number(guide.total_sessions ?? 0),
        avgRating: Number(guide.avg_rating ?? 0),
        languages: dedupeStrings(guide.languages ?? []),
        specialties: dedupeStrings(guide.specialties ?? []),
    }));
    const passports = accumulator.passports.map<SafetyPassportSignal>((passport) => ({
        destinationLabel: passport.destination_country
            ? `${extractDestinationCity(passport.destination_name)}, ${passport.destination_country}`
            : extractDestinationCity(passport.destination_name),
        createdAt: passport.created_at,
        safetyScore:
            passport.safety_score != null ? Number(passport.safety_score) : null,
        safetyLabel: passport.safety_label,
    }));
    const latestSignalAt = [
        ...accumulator.alerts.map((alert) => alert.created_at),
        ...accumulator.passports.map((passport) => passport.created_at),
    ]
        .filter(Boolean)
        .sort()
        .at(-1) ?? null;
    const alertHeadline = alerts[0]?.title ?? null;

    return {
        id: slug,
        slug,
        city: accumulator.city,
        country: accumulator.country,
        label,
        flag: getCountryFlag(accumulator.country),
        region,
        score: scorePayload.value,
        scoreDisplay: scorePayload.value.toFixed(1),
        scoreMode: scorePayload.mode,
        tier: deriveTier(accumulator, scorePayload.value),
        badgeLabel: getBadgeLabel(accumulator, scorePayload.value),
        summary: buildSummary(accumulator),
        tags: buildTags(accumulator),
        alertCount,
        guideCount,
        verifiedGuideCount,
        passportCount,
        lastUpdatedLabel: latestSignalAt
            ? formatDateLabel(latestSignalAt)
            : "Guide coverage live",
        latestSignalAt,
        alertHeadline,
        alerts,
        guides,
        passports,
        scoreExplanation: scorePayload.explanation,
    };
}

function stripDestinationDetail(
    destination: SafetyDestinationDetail
): SafetyDestination {
    return {
        id: destination.id,
        slug: destination.slug,
        city: destination.city,
        country: destination.country,
        label: destination.label,
        flag: destination.flag,
        region: destination.region,
        score: destination.score,
        scoreDisplay: destination.scoreDisplay,
        scoreMode: destination.scoreMode,
        tier: destination.tier,
        badgeLabel: destination.badgeLabel,
        summary: destination.summary,
        tags: destination.tags,
        alertCount: destination.alertCount,
        guideCount: destination.guideCount,
        verifiedGuideCount: destination.verifiedGuideCount,
        passportCount: destination.passportCount,
        lastUpdatedLabel: destination.lastUpdatedLabel,
        latestSignalAt: destination.latestSignalAt,
        alertHeadline: destination.alertHeadline,
    };
}

function getOrCreateAccumulator(
    destinations: Map<string, DestinationAccumulator>,
    city: string,
    country: string
): DestinationAccumulator | null {
    const primaryLabel = city || country;

    if (!primaryLabel) {
        return null;
    }

    const safeCity = city || country;
    const key = `${normalizeLocation(safeCity)}::${normalizeLocation(country)}`;
    const existing = destinations.get(key);

    if (existing) {
        return existing;
    }

    const created: DestinationAccumulator = {
        city: safeCity,
        country,
        alerts: [],
        guides: [],
        passports: [],
    };

    destinations.set(key, created);
    return created;
}

function deriveScore(accumulator: DestinationAccumulator): {
    value: number;
    mode: "stored" | "derived";
    explanation: string;
} {
    const storedScores = accumulator.passports
        .map((passport) =>
            passport.safety_score != null ? Number(passport.safety_score) : null
        )
        .filter((score): score is number => score !== null);

    if (storedScores.length > 0) {
        const averageScore =
            storedScores.reduce((total, value) => total + value, 0) /
            storedScores.length;

        return {
            value: clamp(roundToOneDecimal(averageScore / 10), 0, 10),
            mode: "stored",
            explanation:
                "This score comes directly from stored passport confidence scores averaged across active trips for this destination.",
        };
    }

    const alertPenalty = getAlertPenalty(accumulator.alerts);
    const verifiedGuideCount = accumulator.guides.filter(
        (guide) => normalizeLocation(guide.verification_status) === "verified"
    ).length;
    const guideBoost = accumulator.guides.length > 0
        ? Math.min(1.2, 0.4 + verifiedGuideCount * 0.35)
        : 0;
    const passportBoost = accumulator.passports.length > 0
        ? Math.min(1.0, 0.35 + accumulator.passports.length * 0.15)
        : 0;
    const quietBoost = accumulator.alerts.length === 0 ? 0.55 : 0;
    const baseScore = 6.2 + guideBoost + passportBoost + quietBoost - alertPenalty;

    return {
        value: clamp(roundToOneDecimal(baseScore), 0, 10),
        mode: "derived",
        explanation:
            "No stored passport score exists yet, so this signal score is derived from active alert severity plus live guide and passport coverage for the destination.",
    };
}

function deriveTier(
    accumulator: DestinationAccumulator,
    score: number
): SafetyTier {
    const highestSeverity = Math.max(
        ...accumulator.alerts.map((alert) => getSeverityWeight(alert)),
        0
    );

    if (highestSeverity >= 80 || score < 4.5) {
        return "alert";
    }

    if (accumulator.alerts.length > 0 || highestSeverity >= 35 || score < 7.5) {
        return "caution";
    }

    return "safe";
}

function getBadgeLabel(
    accumulator: DestinationAccumulator,
    score: number
): string {
    const tier = deriveTier(accumulator, score);

    if (tier === "alert") {
        return "ACTIVE ALERT";
    }

    if (tier === "caution") {
        return accumulator.alerts.length > 0 ? "MONITOR" : "PARTIAL COVERAGE";
    }

    return "CLEAR";
}

function buildSummary(accumulator: DestinationAccumulator): string {
    const parts: string[] = [];

    if (accumulator.alerts.length > 0) {
        parts.push(
            `${formatCount(accumulator.alerts.length)} active alert${accumulator.alerts.length === 1 ? "" : "s"}`
        );
    } else {
        parts.push("No active alerts on record");
    }

    if (accumulator.guides.length > 0) {
        parts.push(
            `${formatCount(accumulator.guides.length)} guide${accumulator.guides.length === 1 ? "" : "s"} covering the destination`
        );
    }

    if (accumulator.passports.length > 0) {
        parts.push(
            `${formatCount(accumulator.passports.length)} active passport${accumulator.passports.length === 1 ? "" : "s"} referencing it`
        );
    }

    return parts.join(" · ");
}

function buildTags(accumulator: DestinationAccumulator): string[] {
    const tags = new Set<string>();

    accumulator.alerts.forEach((alert) => {
        if (alert.alert_type) {
            tags.add(toTitleCase(alert.alert_type.replace(/_/g, " ")));
        }
    });

    accumulator.guides.forEach((guide) => {
        if (normalizeLocation(guide.verification_status) === "verified") {
            tags.add("Verified guide");
        } else if (guide.verification_status) {
            tags.add(`${toTitleCase(guide.verification_status)} guide`);
        }

        dedupeStrings(guide.specialties ?? [])
            .slice(0, 2)
            .forEach((specialty) => tags.add(specialty));
    });

    if (accumulator.passports.length > 0) {
        tags.add("Passport activity");
    }

    if (tags.size === 0) {
        tags.add("Live coverage");
    }

    return Array.from(tags).slice(0, 4);
}

function buildRegionSummaries(
    destinations: SafetyDestination[]
): SafetyRegionSummary[] {
    const regions = new Map<
        string,
        {
            region: string;
            tier: SafetyTier;
            destinationCount: number;
            alertCount: number;
            guideCount: number;
            labels: string[];
        }
    >();

    destinations.forEach((destination) => {
        const current = regions.get(destination.region);

        if (current) {
            current.destinationCount += 1;
            current.alertCount += destination.alertCount;
            current.guideCount += destination.guideCount;
            current.labels.push(destination.city);

            if (tierWeight(destination.tier) > tierWeight(current.tier)) {
                current.tier = destination.tier;
            }

            return;
        }

        regions.set(destination.region, {
            region: destination.region,
            tier: destination.tier,
            destinationCount: 1,
            alertCount: destination.alertCount,
            guideCount: destination.guideCount,
            labels: [destination.city],
        });
    });

    return Array.from(regions.values()).sort((left, right) => {
        if (left.tier !== right.tier) {
            return tierWeight(right.tier) - tierWeight(left.tier);
        }

        if (left.destinationCount !== right.destinationCount) {
            return right.destinationCount - left.destinationCount;
        }

        return left.region.localeCompare(right.region);
    });
}

function getAlertPenalty(alerts: AlertSignalRow[]): number {
    if (alerts.length === 0) {
        return 0;
    }

    const highestSeverity = Math.max(
        ...alerts.map((alert) => getSeverityWeight(alert)),
        0
    );

    if (highestSeverity >= 80) {
        return 3.1;
    }

    if (highestSeverity >= 55) {
        return 2.2;
    }

    if (highestSeverity >= 25) {
        return 1.3;
    }

    return 0.8;
}

function getSeverityWeight(alert: AlertSignalRow): number {
    const numericSeverity = Number(alert.severity_val ?? 0);

    if (numericSeverity > 0) {
        return numericSeverity;
    }

    const normalizedSeverity = normalizeLocation(alert.severity);

    if (normalizedSeverity.includes("high")) {
        return 85;
    }

    if (normalizedSeverity.includes("medium")) {
        return 60;
    }

    if (normalizedSeverity.includes("low")) {
        return 30;
    }

    return 15;
}

function cleanLocation(value: string | null | undefined): string {
    return String(value ?? "")
        .trim()
        .replace(/\s+/g, " ");
}

function normalizeLocation(value: string | null | undefined): string {
    return cleanLocation(value).toLowerCase();
}

function extractDestinationCity(value: string): string {
    return String(value ?? "")
        .split(",")[0]
        .trim();
}

function slugifyDestination(city: string, country: string): string {
    return `${city}-${country || "global"}`
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

function getCountryFlag(country: string): string {
    const flags: Record<string, string> = {
        australia: "🇦🇺",
        brazil: "🇧🇷",
        canada: "🇨🇦",
        colombia: "🇨🇴",
        denmark: "🇩🇰",
        egypt: "🇪🇬",
        france: "🇫🇷",
        germany: "🇩🇪",
        greece: "🇬🇷",
        india: "🇮🇳",
        indonesia: "🇮🇩",
        italy: "🇮🇹",
        japan: "🇯🇵",
        morocco: "🇲🇦",
        portugal: "🇵🇹",
        singapore: "🇸🇬",
        spain: "🇪🇸",
        thailand: "🇹🇭",
        "united arab emirates": "🇦🇪",
        uae: "🇦🇪",
        uk: "🇬🇧",
        "united kingdom": "🇬🇧",
        usa: "🇺🇸",
        "united states": "🇺🇸",
        venezuela: "🇻🇪",
        vietnam: "🇻🇳",
    };

    return flags[normalizeLocation(country)] ?? "🌍";
}

function getRegionForCountry(country: string): string {
    const regions: Record<string, string> = {
        australia: "Oceania",
        brazil: "Latin America",
        canada: "North America",
        colombia: "Latin America",
        denmark: "Europe",
        egypt: "Middle East & Africa",
        france: "Europe",
        germany: "Europe",
        greece: "Europe",
        india: "South Asia",
        indonesia: "Southeast Asia",
        italy: "Europe",
        japan: "East Asia",
        morocco: "Middle East & Africa",
        portugal: "Europe",
        singapore: "Southeast Asia",
        spain: "Europe",
        thailand: "Southeast Asia",
        "united arab emirates": "Middle East & Africa",
        uae: "Middle East & Africa",
        uk: "Europe",
        "united kingdom": "Europe",
        usa: "North America",
        "united states": "North America",
        venezuela: "Latin America",
        vietnam: "Southeast Asia",
    };

    return regions[normalizeLocation(country)] ?? "Cross-border coverage";
}

function dedupeStrings(values: string[]): string[] {
    return Array.from(
        new Set(
            values
                .map((value) => cleanLocation(value))
                .filter(Boolean)
        )
    );
}

function formatCount(value: number): string {
    return value.toLocaleString("en-IN");
}

function formatDateLabel(value: string): string {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "Undated";
    }

    return date.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

function roundToOneDecimal(value: number): number {
    return Math.round(value * 10) / 10;
}

function clamp(value: number, min: number, max: number): number {
    return Math.min(max, Math.max(min, value));
}

function tierWeight(tier: SafetyTier): number {
    if (tier === "alert") {
        return 3;
    }

    if (tier === "caution") {
        return 2;
    }

    return 1;
}

function toTitleCase(value: string): string {
    return value
        .split(" ")
        .filter(Boolean)
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
        .join(" ");
}
