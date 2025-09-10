import { NotFoundError } from "../../utils/errors";
import logger from "../../utils/logger";
import { EventCategoryRepository } from "./eventCategory.repository";
import { CreateEventCategorySchema, UpdateEventCategorySchema } from "./eventCategory.schema";

export class EventCategroyService {
    constructor(private repo = new EventCategoryRepository()) {}

    async createEventCategory(data: CreateEventCategorySchema) {
        const exists = await this.repo.findByName(data.name);

        if(exists) throw new Error("Event Category already exists");

        const eventCategory = await this.repo.create(data);

        logger.info({ data: eventCategory }, "A new event category created");

        return eventCategory;
    }

    async getEventCategories() {
        return this.repo.findAll();
    }

    async getEventCategory(id: string) {
        const category = await this.repo.findById(id);

        if(!category) throw new NotFoundError("Event Category not found", { id });

        return category;
    }

    async updateEventCategory(id: string, data: UpdateEventCategorySchema) {
        const eventCategory = await this.repo.findById(id);

        if(!eventCategory) throw new NotFoundError("Event Category not found", { id });

        const updatedEventCategory = await this.repo.update(id, data);
        
        logger.info({ data: updatedEventCategory }, "Event Category updated");

        return updatedEventCategory;
    }

    async deleteEventCategory(id: string) {
        const eventCategory = await this.repo.findById(id);

        if(!eventCategory) throw new NotFoundError("Event Category not found", { id });

        const deletedEventCategory = await this.repo.delete(id);

        logger.info({ data: deletedEventCategory }, "Event Category deleted");

        return;
    }
}