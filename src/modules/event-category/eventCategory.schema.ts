import z from "zod";

export const createEventCategorySchema = z.object({
    name: z.string().min(1),
    description: z.string().optional(),
    status: z.boolean().optional(),
});

export const updateEventCategorySchema = createEventCategorySchema.partial();

export type CreateEventCategorySchema = z.infer<typeof createEventCategorySchema>;
export type UpdateEventCategorySchema = z.infer<typeof updateEventCategorySchema>;