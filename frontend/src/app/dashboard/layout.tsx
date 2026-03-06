
import React from "react";
import PageWrapper from "@/components/PageWrapper";
import DashboardSidebar from "@/components/DashboardSidebar";
import styles from "./dashboard.module.css";
import { auth } from "@/lib/auth";
import { query } from "@/lib/db";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();
    const user = session?.user;
    const userId = user?.id;

    const displayName = user?.name || user?.email?.split('@')[0] || "Traveler";

    // Global dashboard stats for sidebar
    const [stats, counts] = await Promise.all([
        userId ? query<{ country_count: number; passport_count: number; review_count: number }>(
            `SELECT 
                (SELECT COUNT(DISTINCT destination_country) FROM decision_passports WHERE user_id = $1) as country_count,
                (SELECT COUNT(*) FROM decision_passports WHERE user_id = $1 AND is_active = true) as passport_count,
                (SELECT COUNT(*) FROM reviews WHERE user_id = $1) as review_count`,
            [userId]
        ) : Promise.resolve([{ country_count: 0, passport_count: 0, review_count: 0 }]),

        userId ? query<{ alerts: number; messages: number; reviews_due: number }>(
            `SELECT 
                (SELECT COUNT(*) FROM safety_alerts WHERE is_active = true) as alerts,
                (SELECT COUNT(*) FROM guide_sessions WHERE user_id = $1 AND status = 'scheduled') as messages,
                (SELECT COUNT(*) FROM passport_items pi 
                 JOIN decision_passports dp ON dp.id = pi.passport_id 
                 LEFT JOIN reviews r ON r.passport_item_id = pi.id 
                 WHERE dp.user_id = $1 AND pi.status = 'confirmed' AND r.id IS NULL) as reviews_due`,
            [userId]
        ) : Promise.resolve([{ alerts: 0, messages: 0, reviews_due: 0 }])
    ]);

    const sidebarStats = stats[0] || { country_count: 0, passport_count: 0, review_count: 0 };
    const badges = counts[0] || { alerts: 0, messages: 0, reviews_due: 0 };

    return (
        <PageWrapper>
            <div className={styles.dashboardLayout}>
                <div className={styles.sidebarArea}>
                    <DashboardSidebar
                        name={displayName}
                        stats={{
                            countries: sidebarStats.country_count,
                            passports: sidebarStats.passport_count,
                            reviews: sidebarStats.review_count
                        }}
                        badges={{
                            alerts: badges.alerts,
                            messages: badges.messages,
                            reviewsDue: badges.reviews_due,
                            passports: sidebarStats.passport_count
                        }}
                    />
                </div>
                <main className={styles.mainArea}>
                    {children}
                </main>
            </div>
        </PageWrapper>
    );
}
