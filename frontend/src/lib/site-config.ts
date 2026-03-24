export interface SiteSocialLink {
    id: "x" | "instagram" | "linkedin";
    href: string;
    label: string;
}

const GENERIC_SOCIAL_ROOTS = new Set([
    "x.com",
    "www.x.com",
    "twitter.com",
    "www.twitter.com",
    "instagram.com",
    "www.instagram.com",
    "linkedin.com",
    "www.linkedin.com",
]);

export function getProjectSocialLinks(): SiteSocialLink[] {
    const links = [
        {
            id: "x" as const,
            label: "X",
            href: sanitizeProfileUrl(process.env.NEXT_PUBLIC_SOCIAL_X_URL),
        },
        {
            id: "instagram" as const,
            label: "Instagram",
            href: sanitizeProfileUrl(process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM_URL),
        },
        {
            id: "linkedin" as const,
            label: "LinkedIn",
            href: sanitizeProfileUrl(process.env.NEXT_PUBLIC_SOCIAL_LINKEDIN_URL),
        },
    ];

    return links.filter(
        (link): link is SiteSocialLink => Boolean(link.href)
    );
}

function sanitizeProfileUrl(value: string | undefined): string | null {
    const trimmed = String(value ?? "").trim();

    if (!trimmed) {
        return null;
    }

    try {
        const url = new URL(trimmed);
        const hostname = url.hostname.toLowerCase();
        const pathname = url.pathname.replace(/\/+$/g, "");

        if (GENERIC_SOCIAL_ROOTS.has(hostname) && (!pathname || pathname === "/")) {
            return null;
        }

        return url.toString();
    } catch {
        return null;
    }
}
