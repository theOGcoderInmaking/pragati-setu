
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Seed started...');

    // 1. Create Cities
    const cities = [
        { id: 101, name: 'Lisbon', country_id: 1, latitude: 38.7223, longitude: -9.1393 },
        { id: 102, name: 'Hội An', country_id: 2, latitude: 15.8801, longitude: 108.3380 },
        { id: 103, name: 'Marrakech', country_id: 3, latitude: 31.6295, longitude: -7.9811 },
        { id: 104, name: 'Tokyo', country_id: 4, latitude: 35.6762, longitude: 139.6503 },
        { id: 105, name: 'Paris', country_id: 5, latitude: 48.8566, longitude: 2.3522 },
    ];

    for (const city of cities) {
        await prisma.city.upsert({
            where: { id: city.id },
            update: {},
            create: city,
        });
    }
    console.log('Cities seeded.');

    // 2. Find a test user
    const user = await prisma.user.findFirst();

    if (user) {
        console.log(`Found user: ${user.email}. Seeding passports...`);

        // 3. Create a Decision Passport
        const passport = await prisma.decisionPassport.create({
            data: {
                user_id: user.id,
                destination_name: 'Bangkok',
                destination_country: 'Thailand',
                status: 'ready',
                travel_dates_start: new Date(),
                travel_dates_end: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // +7 days
            }
        });

        // 4. Create Confidence Scores
        await prisma.confidenceScores.create({
            data: {
                passport_id: passport.id,
                weather_score: 85,
                weather_label: 'Sunny',
                weather_data: {},
                safety_score: 90,
                safety_label: 'Safe',
                safety_data: {},
                scam_score: 75,
                scam_label: 'Moderate',
                scam_data: {},
                crowd_score: 60,
                crowd_label: 'Busy',
                crowd_data: {},
                budget_score: 80,
                budget_label: 'Affordable',
                budget_data: {},
                composite_score: 78,
            }
        });

        // 5. Create Passport Items (Schedule)
        const today = new Date();
        const items = [
            {
                item_type: 'hotel',
                provider_name: 'Lub d Bangkok',
                status: 'confirmed',
                booked_at: today,
            },
            {
                item_type: 'experience',
                provider_name: 'Chatuchak Weekend Market',
                status: 'pending',
                booked_at: today,
            },
            {
                item_type: 'cab',
                provider_name: 'Transfer to Suvarnabhumi',
                status: 'pending',
                booked_at: today,
            }
        ];

        for (const item of items) {
            await prisma.passportItem.create({
                data: {
                    passport_id: passport.id,
                    ...item
                }
            });
        }
        console.log('Passport and items seeded.');
    } else {
        console.log('No user found. Skipping passport seed.');
    }

    console.log('Seed finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
