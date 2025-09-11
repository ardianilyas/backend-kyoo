import prisma from "../config/prisma";
import { eventCategorySeeder } from "./eventCategorySeeder";
import { userSeeder } from "./userSeeder";


async function main() {
    console.log("Running seeder . . .");

    await userSeeder();
    await eventCategorySeeder();

    console.log("Seeding completed.");
}

main().catch((err) => {
    console.error("Seeding error: ", err);
    process.exit(1);
}).finally(async () => {
    await prisma.$disconnect();
});