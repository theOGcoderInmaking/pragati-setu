import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { query, queryOne } from '@/lib/db';

interface BlogPostRow {
    id: string;
    slug: string;
    title: string;
    excerpt: string | null;
    body: string;
    category: string;
    author: string;
    published: boolean;
    published_at: string | null;
    created_at: string;
    updated_at: string;
}

interface BlogPostInput {
    slug?: unknown;
    title?: unknown;
    excerpt?: unknown;
    body?: unknown;
    category?: unknown;
    author?: unknown;
    published?: unknown;
    published_at?: unknown;
}

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const includeDrafts = searchParams.get('includeDrafts') === 'true';
    const slug = searchParams.get('slug');

    if (includeDrafts) {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        if (session.user.role !== 'admin') {
            return NextResponse.json(
                { error: 'Forbidden' },
                { status: 403 }
            );
        }
    }

    if (slug) {
        const post = await queryOne<BlogPostRow>(
            `SELECT
                id,
                slug,
                title,
                excerpt,
                body,
                category,
                author,
                published,
                published_at,
                created_at,
                updated_at
             FROM blog_posts
             WHERE slug = $1
               ${includeDrafts ? '' : 'AND published = true'}
             LIMIT 1`,
            [slug]
        );

        if (!post) {
            return NextResponse.json(
                { error: 'Post not found.' },
                { status: 404 }
            );
        }

        return NextResponse.json({ data: post });
    }

    const posts = await query<BlogPostRow>(
        `SELECT
            id,
            slug,
            title,
            excerpt,
            body,
            category,
            author,
            published,
            published_at,
            created_at,
            updated_at
         FROM blog_posts
         ${includeDrafts ? '' : 'WHERE published = true'}
         ORDER BY
            COALESCE(published_at, created_at) DESC,
            created_at DESC`
    );

    return NextResponse.json({ data: posts });
}

export async function POST(req: NextRequest) {
    const session = await auth();

    if (!session?.user?.id) {
        return NextResponse.json(
            { error: 'Unauthorized' },
            { status: 401 }
        );
    }

    if (session.user.role !== 'admin') {
        return NextResponse.json(
            { error: 'Forbidden' },
            { status: 403 }
        );
    }

    let body: BlogPostInput;

    try {
        body = await req.json();
    } catch {
        return NextResponse.json(
            { error: 'Invalid request body.' },
            { status: 400 }
        );
    }

    const title = readRequiredString(body.title);
    const slug = readSlug(body.slug, title);
    const postBody = readRequiredString(body.body);
    const excerpt = readOptionalString(body.excerpt);
    const category = readOptionalString(body.category) ?? 'editorial';
    const author = readOptionalString(body.author) ?? 'Editorial Desk';
    const published = Boolean(body.published);
    const publishedAt = readPublishedAt(body.published_at, published);

    if (!title || !postBody) {
        return NextResponse.json(
            { error: 'Title and body are required.' },
            { status: 400 }
        );
    }

    const [created] = await query<BlogPostRow>(
        `INSERT INTO blog_posts (
            slug,
            title,
            excerpt,
            body,
            category,
            author,
            published,
            published_at
         ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING
            id,
            slug,
            title,
            excerpt,
            body,
            category,
            author,
            published,
            published_at,
            created_at,
            updated_at`,
        [
            slug,
            title,
            excerpt,
            postBody,
            category,
            author,
            published,
            publishedAt,
        ]
    );

    return NextResponse.json(
        { data: created },
        { status: 201 }
    );
}

export async function PATCH(req: NextRequest) {
    const session = await auth();

    if (!session?.user?.id) {
        return NextResponse.json(
            { error: 'Unauthorized' },
            { status: 401 }
        );
    }

    if (session.user.role !== 'admin') {
        return NextResponse.json(
            { error: 'Forbidden' },
            { status: 403 }
        );
    }

    let body: BlogPostInput & { id?: unknown };

    try {
        body = await req.json();
    } catch {
        return NextResponse.json(
            { error: 'Invalid request body.' },
            { status: 400 }
        );
    }

    const id = readRequiredString(body.id);

    if (!id) {
        return NextResponse.json(
            { error: 'Post id is required.' },
            { status: 400 }
        );
    }

    const existing = await queryOne<BlogPostRow>(
        `SELECT
            id,
            slug,
            title,
            excerpt,
            body,
            category,
            author,
            published,
            published_at,
            created_at,
            updated_at
         FROM blog_posts
         WHERE id = $1`,
        [id]
    );

    if (!existing) {
        return NextResponse.json(
            { error: 'Post not found.' },
            { status: 404 }
        );
    }

    const title = readOptionalString(body.title) ?? existing.title;
    const slug = readSlug(body.slug, title) || existing.slug;
    const postBody = readOptionalString(body.body) ?? existing.body;
    const excerpt = body.excerpt === null
        ? null
        : readOptionalString(body.excerpt) ?? existing.excerpt;
    const category = readOptionalString(body.category) ?? existing.category;
    const author = readOptionalString(body.author) ?? existing.author;
    const published = typeof body.published === 'boolean'
        ? body.published
        : existing.published;
    const publishedAt = readPublishedAt(
        body.published_at,
        published,
        existing.published_at
    );

    const [updated] = await query<BlogPostRow>(
        `UPDATE blog_posts
         SET
            slug = $1,
            title = $2,
            excerpt = $3,
            body = $4,
            category = $5,
            author = $6,
            published = $7,
            published_at = $8,
            updated_at = NOW()
         WHERE id = $9
         RETURNING
            id,
            slug,
            title,
            excerpt,
            body,
            category,
            author,
            published,
            published_at,
            created_at,
            updated_at`,
        [
            slug,
            title,
            excerpt,
            postBody,
            category,
            author,
            published,
            publishedAt,
            id,
        ]
    );

    return NextResponse.json({ data: updated });
}

export async function DELETE(req: NextRequest) {
    const session = await auth();

    if (!session?.user?.id) {
        return NextResponse.json(
            { error: 'Unauthorized' },
            { status: 401 }
        );
    }

    if (session.user.role !== 'admin') {
        return NextResponse.json(
            { error: 'Forbidden' },
            { status: 403 }
        );
    }

    const { searchParams } = new URL(req.url);
    const id = readRequiredString(searchParams.get('id'));
    const slug = readRequiredString(searchParams.get('slug'));

    if (!id && !slug) {
        return NextResponse.json(
            { error: 'Provide an id or slug.' },
            { status: 400 }
        );
    }

    const deleted = await query<Pick<BlogPostRow, 'id' | 'slug'>>(
        `DELETE FROM blog_posts
         WHERE ($1 <> '' AND id = $1)
            OR ($2 <> '' AND slug = $2)
         RETURNING id, slug`,
        [id, slug]
    );

    if (deleted.length === 0) {
        return NextResponse.json(
            { error: 'Post not found.' },
            { status: 404 }
        );
    }

    return NextResponse.json({ data: deleted[0] });
}

function readRequiredString(value: unknown): string {
    if (typeof value !== 'string') {
        return '';
    }

    return value.trim();
}

function readOptionalString(value: unknown): string | null {
    if (typeof value !== 'string') {
        return null;
    }

    const normalized = value.trim();
    return normalized ? normalized : null;
}

function readSlug(value: unknown, fallback: string): string {
    const source = readOptionalString(value) ?? fallback;

    return source
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 120);
}

function readPublishedAt(
    value: unknown,
    published: boolean,
    fallback?: string | null
): string | null {
    if (typeof value === 'string' && value.trim()) {
        const date = new Date(value);
        return Number.isNaN(date.getTime())
            ? fallback ?? null
            : date.toISOString();
    }

    if (published) {
        return fallback ?? new Date().toISOString();
    }

    return null;
}
