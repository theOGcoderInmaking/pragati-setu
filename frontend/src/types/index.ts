// USER TYPES
export interface User {
    id: string;
    email: string;
    full_name: string | null;
    avatar_url: string | null;
    password_hash?: string;
    email_verified: boolean;
    created_at: string;
    last_login: string | null;
    is_active: boolean;
    role: 'traveler' | 'guide' | 'admin';
}

export interface UserProfile {
    id: string;
    user_id: string;
    home_city: string | null;
    nationality: string;
    travel_frequency: string | null;
    is_solo_traveler: boolean;
    is_female_solo: boolean;
    risk_comfort_level: number;
    preferred_currency: string;
    languages: string[];
    travel_styles: string[];
    updated_at: string;
}

// PASSPORT TYPES
export interface DecisionPassport {
    id: string;
    user_id: string;
    destination_city_id: number | null;
    destination_name: string;
    destination_country: string | null;
    arrival_airport_id: number | null;
    travel_dates_start: string | null;
    travel_dates_end: string | null;
    duration_days: number | null;
    travel_party_size: number;
    package_type: PackageType | null;
    status: PassportStatus;
    composite_score: number | null;
    guarantee_amount_inr: number;
    order_id: string | null;
    is_active: boolean;
    expires_at: string | null;
    created_at: string;
    updated_at: string;
}

export type PassportStatus =
    | 'draft'
    | 'generating'
    | 'ready'
    | 'expired';

export type PackageType =
    | 'comfort'
    | 'experience'
    | 'balanced'
    | 'explorer'
    | 'immersion';

export interface ConfidenceScores {
    id: string;
    passport_id: string;
    weather_score: number;
    weather_label: string;
    weather_data: Record<string, unknown>;
    safety_score: number;
    safety_label: string;
    safety_data: Record<string, unknown>;
    scam_score: number;
    scam_label: string;
    scam_data: Record<string, unknown>;
    crowd_score: number;
    crowd_label: string;
    crowd_data: Record<string, unknown>;
    budget_score: number;
    budget_label: string;
    budget_data: Record<string, unknown>;
    composite_score: number;
    calculated_at: string;
}

export interface RiskRegisterItem {
    id: string;
    passport_id: string;
    risk_title: string;
    risk_description: string | null;
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    category: string;
    prevention_steps: string[];
    is_acknowledged: boolean;
    sort_order: number;
}

// ORDER TYPES
export interface Order {
    id: string;
    user_id: string;
    order_type: 'passport' | 'subscription' | 'guide_session';
    amount_inr: number;
    currency: string;
    status: 'pending' | 'paid' | 'failed' | 'refunded';
    payment_gateway: 'razorpay' | 'stripe' | null;
    gateway_order_id: string | null;
    gateway_payment_id: string | null;
    metadata: Record<string, unknown>;
    created_at: string;
    paid_at: string | null;
}

// GUIDE TYPES
export interface Guide {
    id: string;
    user_id: string;
    city_id: number | null;
    city_name: string | null;
    country_name: string | null;
    bio: string | null;
    languages: string[];
    specialties: string[];
    tier_chat: boolean;
    tier_video: boolean;
    tier_inperson: boolean;
    price_chat_inr: number;
    price_video_inr: number;
    price_inperson_inr: number;
    avg_rating: number;
    total_reviews: number;
    total_sessions: number;
    verification_status: 'pending' | 'verified' | 'rejected';
    verified_at: string | null;
    is_active: boolean;
}

export interface GuideSession {
    id: string;
    guide_id: string;
    user_id: string;
    passport_id: string | null;
    session_type: 'chat' | 'video' | 'in_person';
    status: 'scheduled' | 'active' | 'completed' | 'cancelled';
    scheduled_at: string;
    notes: string | null;
    created_at: string;
    // Joined fields
    guide_name?: string;
    guide_avatar?: string;
    city_name?: string;
    country_name?: string;
}

export interface GuideFieldReport {
    id: string;
    guide_id: string;
    city_id: number | null;
    city_name: string | null;
    report_type: 'scam' | 'safety' | 'tip' | 'alert';
    title: string;
    content: string;
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' | null;
    is_verified: boolean;
    is_active: boolean;
    created_at: string;
    expires_at: string | null;
}

// REVIEW TYPES
export interface Review {
    id: string;
    user_id: string;
    property_name: string | null;
    property_type: string | null;
    city_name: string | null;
    overall_rating: number;
    review_text: string | null;
    is_verified: boolean;
    trust_score: number | null;
    helpful_count: number;
    created_at: string;
}

export interface PassportItem {
    id: string;
    passport_id: string;
    item_type: 'flight' | 'hotel' | 'train' | 'ferry' | 'bus' | 'cab' | 'experience';
    provider_name: string;
    status: 'pending' | 'confirmed' | 'cancelled';
    booked_at: string | null;
    details: Record<string, unknown> | null;
    created_at: string;
}

export interface ReviewDimensions {
    cleanliness: number | null;
    noise: number | null;
    safety: number | null;
    staff: number | null;
    value: number | null;
    location: number | null;
    breakfast: number | null;
    description_accuracy: number | null;
}

// SAFETY TYPES
export interface SafetyAlert {
    id: string;
    city_name: string | null;
    country_name: string | null;
    alert_type: string;
    title: string;
    description: string | null;
    severity: string;
    severity_val: number;
    radius_km: number | null;
    source: string;
    is_active: boolean;
    created_at: string;
    expires_at: string | null;
}

// GEODATA TYPES (from Supabase)
export interface City {
    id: number;
    name: string;
    country_id: number;
    latitude?: number;
    longitude?: number;
}

export interface Airport {
    id: number;
    name: string;
    iata_code: string;
    city_id: number;
    country_id: number;
}

export interface CabApp {
    id: number;
    city_id: number;
    app_name: string;
    is_recommended: boolean;
    availability_status: string;
    price_range_local: string;
    price_range_inr: string;
    scam_risk: string;
    why_recommended: string | null;
    warning_note: string | null;
}

export interface Neighbourhood {
    id: number;
    city_id: number;
    name: string;
    safety_score: number;
    noise_level: string;
    walkability_score: number;
    solo_female_score: number | null;
    description: string | null;
    best_for: string[];
    price_level: string | null;
}

// API RESPONSE TYPES
export interface ApiResponse<T> {
    data: T | null;
    error: string | null;
    success: boolean;
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
}
