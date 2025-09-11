import bcrypt from "bcryptjs";
import prisma from "../config/prisma";
import { faker } from "@faker-js/faker";

export async function userSeeder() {
    console.log("Seeding users...");

    const password = await bcrypt.hash("password", 10);
    const devPassword = await bcrypt.hash("developer", 10);

    await prisma.user.create({
        data: {
            name: "ardianilyas",
            password: devPassword,
            email: "ardian@developer.com",
            role: "ADMIN"
        }
    });

    console.log("Dev seeded successfully.");

    const result = await prisma.user.createMany({
        data: Array.from({ length: 20 }).map(() => ({
            name: faker.person.fullName(),
            email: faker.internet.email(),
            password: password,
            role: "USER"
        })),
    });

    console.log(`${result.count} Users seeded successfully.`);
}