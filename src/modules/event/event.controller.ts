import { NextFunction, Request, Response } from "express";
import { EventService } from "./event.service";
import { validate } from "../../utils/validator";
import { createEventSchema, updateEventSchema } from "./event.schema";

export class EventController {
    constructor(private eventService = new EventService()) {
        this.createEvent = this.createEvent.bind(this);
        this.getEvents = this.getEvents.bind(this);
        this.getEventById = this.getEventById.bind(this);
        this.updateEvent = this.updateEvent.bind(this);
        this.deleteEvent = this.deleteEvent.bind(this);
    }

    async createEvent(req: Request, res: Response, next: NextFunction) {
        try {
            const validatedData = validate(createEventSchema, req.body);

            const userId = req.params.id as string;

            const data = { ...validatedData, organizerId: userId };

            const event = await this.eventService.createEvent(data);

            return res.status(201).json({ 
                message: "Event created successfully", 
                event 
            });
        } catch (error) {
            next(error);
        }
    }

    async getEvents(req: Request, res: Response, next: NextFunction) {
        try {
            const events = await this.eventService.getEvents();
            return res.status(200).json({ 
                message: "Events fetched successfully", 
                events 
            });
        } catch (error) {
            next(error);
        }
    }

    async getEventById(req: Request, res: Response, next: NextFunction) {
        try {
            const event = await this.eventService.getEventById(req.params.id);
            return res.status(200).json({ 
                message: "Event fetched successfully",
                event 
            });
        } catch (error) {
            next(error);
        }
    }

    async updateEvent(req: Request, res: Response, next: NextFunction) {
        try {
            const data = validate(updateEventSchema, req.body);

            const userId = req.user?.id as string;

            const event = await this.eventService.updateEvent(req.params.id, data, userId);

            return res.status(200).json({ 
                message: "Event updated successfully",
                event 
            });
        } catch (error) {
            next(error);
        }
    }

    async deleteEvent(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.id as string;
            const eventId = req.params.id as string;

            await this.eventService.deleteEvent(eventId, userId);
            
            return res.status(200).send({ 
                message: "Event deleted successfully" 
            });
        } catch (error) {
            next(error)
        }
    }
}