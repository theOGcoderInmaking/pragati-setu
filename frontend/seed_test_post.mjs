import { query } from './src/lib/db';

async function seedTestPost() {
    try {
        console.log('Seeding test blog post...');
        await query(
            `INSERT INTO blog_posts (
                title, slug, body, excerpt, category, author, published, published_at
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            ON CONFLICT (slug) DO NOTHING`,
            [
                'Welcome to the Intelligence Brief',
                'welcome-intelligence-brief',
                'This is our first editorial post from the new CMS. It coexists with our automated safety signals.',
                'A warm welcome to our new data-driven editorial platform.',
                'Editorial',
                'Admin',
                true,
                new Date().toISOString()
            ]
        );
        console.log('Test post seeded successfully (or already exists).');
    } catch (error) {
        console.error('Failed to seed test post:', error);
    }
}

seedTestPost();
