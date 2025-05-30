import { z } from "zod";
import { profileSchema } from "./profile.schema";

const createProfessorSchema = z.object({
  number: z
    .string()
    .min(2, "number must be at least 2 characters long")
    .max(50, "number must not exceed 50 characters long"),
  major: z
    .string()
    .min(2, "major must be at least 2 characters long")
    .max(50, "major must not exceed 50 characters long"),
});

const updateProfessorSchema = createProfessorSchema.partial();

const professorSchema = createProfessorSchema.extend({
  id: z.number(),
  profile: profileSchema.optional(),
});

type Professor = z.infer<typeof professorSchema>;

export type { Professor };
export { professorSchema, createProfessorSchema, updateProfessorSchema };
