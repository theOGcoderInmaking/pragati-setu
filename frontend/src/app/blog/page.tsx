import React from "react";
import PageWrapper from "@/components/PageWrapper";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getBlogArticles } from "@/lib/blog";
import BlogPageClient from "./BlogPageClient";

export const revalidate = 300;

export default async function BlogPage({
    searchParams,
}: {
    searchParams?: { q?: string | string[] };
}) {
    const articles = await getBlogArticles();
    const initialQuery = Array.isArray(searchParams?.q)
        ? searchParams?.q[0] ?? ""
        : searchParams?.q ?? "";

    return (
        <PageWrapper>
            <Navbar />
            <BlogPageClient
                articles={articles}
                initialQuery={initialQuery}
            />
            <Footer />
        </PageWrapper>
    );
}
