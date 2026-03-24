export type HomeHeroCardTone = "high" | "mid" | "low";

export interface HomeHeroCard {
    id: string;
    city: string;
    country: string;
    flag: string;
    score: number;
    href: string;
    label: string;
    tone: HomeHeroCardTone;
}

export type HomeStatFormat = "integer" | "currency_inr_compact";

export interface HomeStat {
    id: string;
    label: string;
    value: number;
    format: HomeStatFormat;
}

export interface HomePageData {
    countriesCovered: number;
    heroCards: HomeHeroCard[];
    heroStats: HomeStat[];
}
