import { EventCategory } from "../../../prisma/generated/prisma";
import prisma from "../../config/prisma";
import { CreateEventCategorySchema, UpdateEventCategorySchema } from "./eventCategory.schema";

export class EventCategoryRepository {
    async create(data: CreateEventCategorySchema): Promise<EventCategory> {
        return prisma.eventCategory.create({ data });
    }

    async findAll(): Promise<EventCategory[]> {
        return prisma.eventCategory.findMany();
    }

    async findById(id: string): Promise<EventCategory | null> {
        return prisma.eventCategory.findUnique({ where: { id } });
    }

    async findByName(name: string): Promise<EventCategory | null> {
        return prisma.eventCategory.findUnique({ where: { name } });
    }

    async update(id: string, data: UpdateEventCategorySchema): Promise<EventCategory> {
        return prisma.eventCategory.update({
            where: { id },
            data
        });
    }

    async delete(id: string): Promise<EventCategory> {
        return prisma.eventCategory.delete({ where: { id } });
    }
}