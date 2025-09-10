import { Router } from "express";
import { EventCategoryController } from "./eventCategory.controller";
import { checkRole } from "../../middlewares/checkRole";
import { requireAuth } from "../../middlewares/auth";

const router = Router();
const controller = new EventCategoryController();

router.use(requireAuth);

router.get("/", controller.getAllEventCategories);
router.get("/:id", controller.getEventCategory);

router.use(checkRole("ADMIN"));

router.post("/", controller.createEventCategory);
router.put("/:id", controller.updateEventCategory);
router.delete("/:id", controller.deleteEventCategory);

export default router;