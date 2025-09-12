import cron from "node-cron";
import prisma from "../config/prisma";
import { lt } from "zod";

export class DeleteRefreshTokenJob {
    start() {
        cron.schedule("* * * * *", async () => {
            console.log("Running delete refresh token job . . .");
            try {
                const result = await prisma.refreshToken.deleteMany({
                    where: {
                        OR: [
                            { revoked: true },
                            { expiresAt: { lt: new Date() } },
                        ],
                    },
                });
                if(result.count > 0) {
                    console.log(`${result.count} refresh tokens deleted successfully.`);
                } else {
                    console.log("No refresh tokens to delete.");
                }
            } catch (error) {
                console.log("Error deleting refresh tokens:", error);
            }
        })
    }
}