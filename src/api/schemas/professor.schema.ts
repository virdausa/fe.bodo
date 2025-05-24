import { z } from "zod";

const professorSchema = z.object({
  number: z
    .string()
    .min(2, "number must be at least 2 characters long")
    .max(50, "number must not exceed 50 characters long"),

  major: z
    .string()
    .min(2, "major must be at least 2 characters long")
    .max(50, "major must not exceed 50 characters long"),
});

const partialProfessorSchema = professorSchema.partial();

export { professorSchema, partialProfessorSchema };
