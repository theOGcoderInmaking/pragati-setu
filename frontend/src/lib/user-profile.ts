import { query, queryOne } from '@/lib/db';
import type { UserProfile } from '@/types';

export interface UserAccountRecord {
    id: string;
    email: string;
    full_name: string | null;
    avatar_url: string | null;
    email_verified: boolean;
    created_at: string;
    last_login: string | null;
    is_active: boolean;
    role: string;
}

export interface UserProfileBundle {
    user: UserAccountRecord;
    profile: UserProfile;
}

export interface UserProfileUpdateInput {
    full_name?: unknown;
    avatar_url?: unknown;
    home_city?: unknown;
    nationality?: unknown;
    travel_frequency?: unknown;
    is_solo_traveler?: unknown;
    is_female_solo?: unknown;
    risk_comfort_level?: unknown;
    preferred_currency?: unknown;
    languages?: unknown;
    travel_styles?: unknown;
}

const DEFAULT_PROFILE_VALUES = {
    home_city: null as string | null,
    nationality: 'Indian',
    travel_frequency: null as string | null,
    is_solo_traveler: false,
    is_female_solo: false,
    risk_comfort_level: 3,
    preferred_currency: 'INR',
    languages: ['English'] as string[],
    travel_styles: [] as string[],
};

export async function getUserAccount(
    userId: string
): Promise<UserAccountRecord | null> {
    return queryOne<UserAccountRecord>(
        `SELECT
            id,
            email,
            full_name,
            avatar_url,
            email_verified,
            created_at,
            last_login,
            is_active,
            role
         FROM users
         WHERE id = $1`,
        [userId]
    );
}

export async function ensureUserProfile(
    userId: string
): Promise<UserProfile> {
    const existing = await queryOne<UserProfile>(
        'SELECT * FROM user_profiles WHERE user_id = $1',
        [userId]
    );

    if (existing) {
        return normalizeProfile(existing);
    }

    const [created] = await query<UserProfile>(
        `INSERT INTO user_profiles (
            user_id,
            home_city,
            nationality,
            travel_frequency,
            is_solo_traveler,
            is_female_solo,
            risk_comfort_level,
            preferred_currency,
            languages,
            travel_styles
         ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
         RETURNING *`,
        [
            userId,
            DEFAULT_PROFILE_VALUES.home_city,
            DEFAULT_PROFILE_VALUES.nationality,
            DEFAULT_PROFILE_VALUES.travel_frequency,
            DEFAULT_PROFILE_VALUES.is_solo_traveler,
            DEFAULT_PROFILE_VALUES.is_female_solo,
            DEFAULT_PROFILE_VALUES.risk_comfort_level,
            DEFAULT_PROFILE_VALUES.preferred_currency,
            DEFAULT_PROFILE_VALUES.languages,
            DEFAULT_PROFILE_VALUES.travel_styles,
        ]
    );

    return normalizeProfile(created);
}

export async function getUserProfileBundle(
    userId: string
): Promise<UserProfileBundle | null> {
    const user = await getUserAccount(userId);

    if (!user) {
        return null;
    }

    const profile = await ensureUserProfile(userId);

    return { user, profile };
}

export async function updateUserProfileBundle(
    userId: string,
    input: UserProfileUpdateInput
): Promise<UserProfileBundle | null> {
    const current = await getUserProfileBundle(userId);

    if (!current) {
        return null;
    }

    const source = toInputRecord(input);

    const nextUser = {
        full_name: readNullableString(
            source,
            'full_name',
            current.user.full_name
        ),
        avatar_url: readNullableString(
            source,
            'avatar_url',
            current.user.avatar_url
        ),
    };

    const nextProfile = {
        home_city: readNullableString(
            source,
            'home_city',
            current.profile.home_city
        ),
        nationality: readRequiredString(
            source,
            'nationality',
            current.profile.nationality || DEFAULT_PROFILE_VALUES.nationality
        ),
        travel_frequency: readNullableString(
            source,
            'travel_frequency',
            current.profile.travel_frequency
        ),
        is_solo_traveler: sanitizeBoolean(
            source.is_solo_traveler,
            current.profile.is_solo_traveler
        ),
        is_female_solo: sanitizeBoolean(
            source.is_female_solo,
            current.profile.is_female_solo
        ),
        risk_comfort_level: sanitizeRiskLevel(
            source.risk_comfort_level,
            current.profile.risk_comfort_level
        ),
        preferred_currency: readRequiredString(
            source,
            'preferred_currency',
            current.profile.preferred_currency || DEFAULT_PROFILE_VALUES.preferred_currency
        ).toUpperCase(),
        languages: sanitizeStringArray(
            source.languages,
            current.profile.languages?.length
                ? current.profile.languages
                : DEFAULT_PROFILE_VALUES.languages
        ),
        travel_styles: sanitizeStringArray(
            source.travel_styles,
            current.profile.travel_styles ?? DEFAULT_PROFILE_VALUES.travel_styles
        ),
    };

    const updatedUser = await queryOne<UserAccountRecord>(
        `UPDATE users
         SET
            full_name = $1,
            avatar_url = $2
         WHERE id = $3
         RETURNING
            id,
            email,
            full_name,
            avatar_url,
            email_verified,
            created_at,
            last_login,
            is_active,
            role`,
        [nextUser.full_name, nextUser.avatar_url, userId]
    );

    const [updatedProfile] = await query<UserProfile>(
        `INSERT INTO user_profiles (
            user_id,
            home_city,
            nationality,
            travel_frequency,
            is_solo_traveler,
            is_female_solo,
            risk_comfort_level,
            preferred_currency,
            languages,
            travel_styles
         ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
         ON CONFLICT (user_id) DO UPDATE SET
            home_city = EXCLUDED.home_city,
            nationality = EXCLUDED.nationality,
            travel_frequency = EXCLUDED.travel_frequency,
            is_solo_traveler = EXCLUDED.is_solo_traveler,
            is_female_solo = EXCLUDED.is_female_solo,
            risk_comfort_level = EXCLUDED.risk_comfort_level,
            preferred_currency = EXCLUDED.preferred_currency,
            languages = EXCLUDED.languages,
            travel_styles = EXCLUDED.travel_styles,
            updated_at = NOW()
         RETURNING *`,
        [
            userId,
            nextProfile.home_city,
            nextProfile.nationality,
            nextProfile.travel_frequency,
            nextProfile.is_solo_traveler,
            nextProfile.is_female_solo,
            nextProfile.risk_comfort_level,
            nextProfile.preferred_currency,
            nextProfile.languages,
            nextProfile.travel_styles,
        ]
    );

    return {
        user: updatedUser ?? current.user,
        profile: normalizeProfile(updatedProfile),
    };
}

function normalizeProfile(profile: UserProfile): UserProfile {
    return {
        ...profile,
        nationality: profile.nationality || DEFAULT_PROFILE_VALUES.nationality,
        risk_comfort_level:
            profile.risk_comfort_level || DEFAULT_PROFILE_VALUES.risk_comfort_level,
        preferred_currency:
            profile.preferred_currency || DEFAULT_PROFILE_VALUES.preferred_currency,
        languages:
            profile.languages?.length
                ? profile.languages
                : DEFAULT_PROFILE_VALUES.languages,
        travel_styles: profile.travel_styles ?? DEFAULT_PROFILE_VALUES.travel_styles,
    };
}

function sanitizeNullableString(value: unknown): string | null {
    if (typeof value !== 'string') {
        return null;
    }

    const normalized = value.trim();
    return normalized ? normalized : null;
}

function sanitizeRequiredString(
    value: unknown,
    fallback: string
): string {
    const normalized = sanitizeNullableString(value);
    return normalized ?? fallback;
}

function toInputRecord(
    value: UserProfileUpdateInput
): Record<string, unknown> {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
        return {};
    }

    return value as Record<string, unknown>;
}

function readNullableString(
    source: Record<string, unknown>,
    key: string,
    fallback: string | null
): string | null {
    if (!Object.prototype.hasOwnProperty.call(source, key)) {
        return fallback;
    }

    return sanitizeNullableString(source[key]);
}

function readRequiredString(
    source: Record<string, unknown>,
    key: string,
    fallback: string
): string {
    if (!Object.prototype.hasOwnProperty.call(source, key)) {
        return fallback;
    }

    return sanitizeRequiredString(source[key], fallback);
}

function sanitizeBoolean(
    value: unknown,
    fallback: boolean
): boolean {
    return typeof value === 'boolean' ? value : fallback;
}

function sanitizeRiskLevel(
    value: unknown,
    fallback: number
): number {
    const numeric = Number(value);

    if (!Number.isFinite(numeric)) {
        return fallback;
    }

    return Math.min(5, Math.max(1, Math.round(numeric)));
}

function sanitizeStringArray(
    value: unknown,
    fallback: string[]
): string[] {
    if (!Array.isArray(value)) {
        return fallback;
    }

    const normalized = Array.from(
        new Set(
            value
                .map((entry) => String(entry).trim())
                .filter(Boolean)
        )
    ).slice(0, 12);

    return normalized;
}
