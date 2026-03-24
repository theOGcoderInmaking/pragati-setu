import "server-only";

import { cache } from "react";
import { query } from "@/lib/db";
import { getSafetyDestinations, type SafetyDestination } from "@/lib/safety";
import type { HomeHeroCard, HomePageData, HomeHeroCardTone } from "@/lib/home-data";

interface HomeStatsRow {
    countries_covered: number;
    verified_guides: number;
    active_passports: number;
    paid_order_volume_inr: number;
}

const EMPTY_STATS: HomeStatsRow = {
    countries_covered: 0,
    verified_guides: 0,
    active_passports: 0,
    paid_order_volume_inr: 0,
};

export const getHomePageData = cache(async (): Promise<HomePageData> => {
    const [statsRows, destinations] = await Promise.all([
        query<HomeStatsRow>(
            `WITH covered_countries AS (
                SELECT TRIM(country_name) AS country
                FROM guides
                WHERE is_active = true
                  AND country_name IS NOT NULL
                  AND TRIM(country_name) <> ''

                UNION

                SELECT TRIM(country_name) AS country
                FROM safety_alerts
                WHERE is_active = true
                  AND country_name IS NOT NULL
                  AND TRIM(country_name) <> ''

                UNION

                SELECT TRIM(destination_country) AS country
                FROM decision_passports
                WHERE is_active = true
                  AND destination_country IS NOT NULL
                  AND TRIM(destination_country) <> ''
            )
            SELECT
                (SELECT COUNT(*)::int FROM covered_countries) AS countries_covered,
                (SELECT COUNT(*)::int
                 FROM guides
                 WHERE is_active = true
                   AND LOWER(COALESCE(verification_status, '')) = 'verified') AS verified_guides,
                (SELECT COUNT(*)::int
                 FROM decision_passports
                 WHERE is_active = true) AS active_passports,
                (SELECT COALESCE(SUM(amount_inr), 0)::float
                 FROM orders
                 WHERE LOWER(COALESCE(status, '')) = 'paid') AS paid_order_volume_inr`
        ).catch((error) => {
            console.error("Failed to load homepage stats:", error);
            return [] as HomeStatsRow[];
        }),
        getSafetyDestinations().catch((error) => {
            console.error("Failed to load homepage destinations:", error);
            return [] as SafetyDestination[];
        }),
    ]);

    const stats = statsRows[0] ?? EMPTY_STATS;
    const heroCards = destinations
        .slice()
        .sort((left, right) => {
            if (right.score !== left.score) {
                return right.score - left.score;
            }

            if (right.verifiedGuideCount !== left.verifiedGuideCount) {
                return right.verifiedGuideCount - left.verifiedGuideCount;
            }

            if (right.passportCount !== left.passportCount) {
                return right.passportCount - left.passportCount;
            }

            return left.label.localeCompare(right.label);
        })
        .slice(0, 3)
        .map(mapDestinationToHeroCard);

    return {
        countriesCovered: Number(stats.countries_covered ?? 0),
        heroCards,
        heroStats: [
            {
                id: "countries-covered",
                label: "Countries Covered",
                value: Number(stats.countries_covered ?? 0),
                format: "integer",
            },
            {
                id: "verified-guides",
                label: "Verified Guides",
                value: Number(stats.verified_guides ?? 0),
                format: "integer",
            },
            {
                id: "active-passports",
                label: "Active Passports",
                value: Number(stats.active_passports ?? 0),
                format: "integer",
            },
            {
                id: "paid-order-volume",
                label: "Paid Order Volume",
                value: Number(stats.paid_order_volume_inr ?? 0),
                format: "currency_inr_compact",
            },
        ],
    };
});

function mapDestinationToHeroCard(destination: SafetyDestination): HomeHeroCard {
    return {
        id: destination.slug,
        city: destination.city,
        country: destination.country,
        flag: destination.flag,
        score: Math.round(destination.score * 10),
        href: `/safety/${destination.slug}`,
        label: destination.scoreMode === "stored" ? "Confidence Score" : "Live Signal",
        tone: getCardTone(destination.score),
    };
}

function getCardTone(score: number): HomeHeroCardTone {
    if (score >= 8) {
        return "high";
    }

    if (score >= 6) {
        return "mid";
    }

    return "low";
}
