import HomePageClient from "@/components/home/HomePageClient";
import { getHomePageData } from "@/lib/home";

export const revalidate = 300;

export default async function HomePage() {
    const homePageData = await getHomePageData();

    return <HomePageClient {...homePageData} />;
}
