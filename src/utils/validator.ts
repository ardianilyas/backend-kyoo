import z, { ZodObject } from "zod";
import { AppError } from "./errors";
import { formatZodError } from "./validationError";

export function validate<T extends ZodObject<any>>(
  schema: T,
  data: unknown
): z.infer<T> {
  const result = schema.safeParse(data);

  if (!result.success) {
    const errors = formatZodError(result.error);
    throw new AppError("Validation failed", 400, errors);
  }

  return result.data;
}
