import { Router } from "express";
import authRoute from "../modules/auth/auth.route";
import eventCategoriesRoute from "../modules/event-category/eventCategory.route";

const router = Router();

const apiRouter = Router();

apiRouter.use("/auth", authRoute);
apiRouter.use("/event-categories", eventCategoriesRoute);

router.use("/api", apiRouter);

export default router;