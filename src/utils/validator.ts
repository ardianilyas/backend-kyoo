import { ZodObject, ZodError, z } from "zod";
import { formatZodError } from "./validationError";

export function validate<T extends ZodObject<any>>(
  schema: T,
  data: unknown
): z.infer<T> {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof ZodError) {
      const errors = formatZodError(error);
      const e: any = new Error("Validation failed");
      e.status = 400;
      e.errors = errors;
      throw e;
    }
    throw error;
  }
}