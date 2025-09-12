import cron from "node-cron";
import prisma from "../config/prisma";
import logger from "../utils/logger";

export class DeleteRefreshTokenJob {
    start() {
        cron.schedule("* * * * *", async () => {
            logger.job.info("Deleting revoked and expired refresh tokens...");
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
                    logger.job.info({ data: result }, `${result.count} refresh tokens deleted successfully`);
                } else {
                    logger.job.info("No refresh tokens to delete");
                }
            } catch (error) {
                logger.job.error({ error }, "Error deleting refresh tokens");
            }
        })
    }
}