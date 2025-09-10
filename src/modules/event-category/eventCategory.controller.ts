import { NextFunction, Request, Response } from "express";
import { EventCategroyService } from "./eventCategory.service";
import { validate } from "../../utils/validator";
import { createEventCategorySchema, updateEventCategorySchema } from "./eventCategory.schema";

const service = new EventCategroyService();

export class EventCategoryController {
    constructor() {
        this.createEventCategory = this.createEventCategory.bind(this);
        this.getAllEventCategories = this.getAllEventCategories.bind(this);
        this.getEventCategory = this.getEventCategory.bind(this);
        this.updateEventCategory = this.updateEventCategory.bind(this);
        this.deleteEventCategory = this.deleteEventCategory.bind(this);
    }

    async createEventCategory(req: Request, res: Response, next: NextFunction) {
        try {
            const data = validate(createEventCategorySchema, req.body);
            const eventCategory = await service.createEventCategory(data);
            return res.status(201).json({ eventCategory });
        } catch (error) {
            next(error);           
        }
    }

    async getAllEventCategories(req: Request, res: Response, next: NextFunction) {
        try {
            const eventCategories = await service.getEventCategories();
            return res.json({ eventCategories });
        } catch (error) {
            next(error);
        }
    }

    async getEventCategory(req: Request, res: Response, next: NextFunction) {
        try {
            const eventCategory = await service.getEventCategory(req.params.id);
            return res.json({ eventCategory });
        } catch (error) {
            next(error);
        }
    }

    async updateEventCategory(req: Request, res: Response, next: NextFunction) {
        try {
            const data = validate(updateEventCategorySchema, req.body);
            const eventCategory = await service.updateEventCategory(req.params.id, data);
            return res.json({ eventCategory });
        } catch (error) {
            next(error);
        }
    }

    async deleteEventCategory(req: Request, res: Response, next: NextFunction) {
        try {
            await service.deleteEventCategory(req.params.id);
            return res.status(204).send({ message: "Event category deleted" });
        } catch (error) {
            next(error)
        }
    }
}