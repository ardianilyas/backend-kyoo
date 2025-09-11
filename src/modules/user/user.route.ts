import { Router } from "express";
import { UserController } from "./user.controller";
import { requireAuth } from "../../middlewares/auth";
import { checkRole } from "../../middlewares/checkRole";

const router = Router();
const controller = new UserController();

router.use(requireAuth);

router.use(checkRole("USER"));
router.post("/request-organizer-role", controller.requestOrganizerRole);

export default router;