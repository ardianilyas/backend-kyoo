import { Router } from "express";
import authRoute from "../modules/auth/auth.route";
import eventCategoriesRoute from "../modules/event-category/eventCategory.route";
import userRoute from "../modules/user/user.route";
import eventRoute from "../modules/event/event.route";

const router = Router();

const apiRouter = Router();

apiRouter.use("/auth", authRoute);
apiRouter.use("/event-categories", eventCategoriesRoute);
apiRouter.use("/users", userRoute);
apiRouter.use("/events", eventRoute);

router.use("/api", apiRouter);

export default router;