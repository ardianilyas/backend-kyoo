import { ForbiddenError, NotFoundError } from "../../utils/errors";
import logger from "../../utils/logger";
import { EventRepository } from "./event.repository";
import { CreateEventSchema, UpdateEventSchema } from "./event.schema";

export class EventService {
    constructor(private eventRepository = new EventRepository()) {}

    async createEvent(data: CreateEventSchema) {
        const event = await this.eventRepository.createEvent(data);
        logger.info({ data: event }, `A new event created by ${data.organizerId}`);
        return event;
    }

    async getEvents() {
        return this.eventRepository.getEvents();
    }

    async getEventById(id: string) {
        const event = await this.eventRepository.getEventById(id);

        if(!event) throw new NotFoundError("Event not found", { id });

        return event;
    }

    async updateEvent(id: string, data: UpdateEventSchema, userId: string) {
        const exists = await this.eventRepository.getEventById(id);

        if(!exists) throw new NotFoundError("Event not found", { id });

        if(exists.organizerId !== userId) throw new ForbiddenError("You are not allowed to update this event");

        const event = await this.eventRepository.updateEvent(id, data);
        logger.info({ data: event }, `Event updated by`);

        return event;
    }

    async deleteEvent(id: string, userId: string) {
        const exists = await this.eventRepository.getEventById(id);

        if(!exists) throw new NotFoundError("Event not found", { id });

        if(exists.organizerId !== userId) throw new ForbiddenError("You are not allowed to delete this event");

        const event = await this.eventRepository.deleteEvent(id);
        logger.info({ data: event }, `Event deleted successfully`);

        return event;
    }
}