import PageWrapper from "@/components/PageWrapper";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SafetyPageClient from "./SafetyPageClient";
import { getSafetyOverview } from "@/lib/safety";

export const revalidate = 300;

export default async function SafetyPage({
    searchParams,
}: {
    searchParams?: { q?: string | string[] };
}) {
    const { destinations, overview, regions } = await getSafetyOverview();
    const initialQuery = Array.isArray(searchParams?.q)
        ? searchParams.q[0] ?? ""
        : searchParams?.q ?? "";

    return (
        <PageWrapper>
            <Navbar />
            <SafetyPageClient
                destinations={destinations}
                initialQuery={initialQuery}
                overview={overview}
                regions={regions}
            />
            <Footer />
        </PageWrapper>
    );
}
