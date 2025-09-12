import z from "zod";

export const createEventSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    location: z.string().min(1, "Location is required"),
    date: z.coerce.date().refine((d) => !isNaN(d.getTime()), {
        message: "Date must be a valid date",
    }),
    capacity: z.number().int().positive("Capacity must greater than 0"),
    categoryId: z.uuid("Category Id is must be a valid uuid"),
});

export const updateEventSchema = createEventSchema.partial()

export type CreateEventSchema = z.infer<typeof createEventSchema> & { organizerId: string };
export type UpdateEventSchema = z.infer<typeof updateEventSchema>;