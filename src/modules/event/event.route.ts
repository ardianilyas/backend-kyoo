import { Router } from "express";
import { EventController } from "./event.controller";
import { requireAuth } from "../../middlewares/auth";
import { checkRole } from "../../middlewares/checkRole";

const router = Router();
const eventController = new EventController()

router.use(requireAuth);

router.post("/", eventController.createEvent);
router.get("/", eventController.getEvents);
router.get("/:id", eventController.getEventById);
router.put("/:id", eventController.updateEvent);
router.delete("/:id", eventController.deleteEvent);

export default router;