import { faker } from "@faker-js/faker";
import prisma from "../config/prisma";

export async function eventCategorySeeder() {
    console.log("Seeding event categories...");
    
    const result = await prisma.eventCategory.createMany({
        data: Array.from({ length: 20 }).map(() => ({
            name: faker.commerce.department(),
            description: faker.lorem.sentence(),
            status: true,
        })),
        skipDuplicates: true
    });

    console.log(`${result.count} Event categories seeded successfully.`);
}