import { Event } from "../../../prisma/generated/prisma";
import prisma from "../../config/prisma";
import { CreateEventSchema, UpdateEventSchema } from "./event.schema";

export class EventRepository {
    async createEvent(data: CreateEventSchema): Promise<Event> {
        return prisma.event.create({ data });
    }

    async getEvents(): Promise<Event[]> {
        return prisma.event.findMany();
    }

    async getEventById(id: string): Promise<Event | null> {
        return prisma.event.findUnique({ where: { id } });
    }

    async updateEvent(id: string, data: UpdateEventSchema): Promise<Event> {
        return prisma.event.update({ where: { id }, data });
    }

    async deleteEvent(id: string): Promise<Event> {
        return prisma.event.delete({ where: { id } });
    }
}