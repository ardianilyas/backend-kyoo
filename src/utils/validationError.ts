import { ZodError } from "zod";

export function formatZodError(error: ZodError) {
    const errors: Record<string, string> = {};
    error.issues.forEach((err) => {
        const path = err.path.join(".");
        errors[path] = err.message;
    });
    return errors;
}