import { DeleteRefreshTokenJob } from "./deleteRefreshToken.job";

console.log("Job worker started . . .");

new DeleteRefreshTokenJob().start();

process.on("SIGINT", () => {
    console.log("Job worker stopped");
    process.exit(0);
});