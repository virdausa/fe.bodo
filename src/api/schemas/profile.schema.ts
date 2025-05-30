import { z } from "zod";

const fullNameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ]+([ '-][A-Za-zÀ-ÖØ-öø-ÿ]+)+$/;

const professor = z.object({
  id: z.number(),
  number: z.string(),
  major: z.string(),
});

const student = z.object({
  id: z.number(),
  number: z.string(),
  major: z.string(),
  class: z.string(),
});

const createProfileSchema = z.object({
  name: z
    .string({
      required_error: "Name is required",
      invalid_type_error: "Name must be a string",
    })
    .regex(fullNameRegex, {
      message: "Please enter your full name (at least two words, letters only)",
    }),
  isProfessor: z.boolean().default(false).optional(),
});

const updateProfileSchema = createProfileSchema.partial();

const profileSchema = createProfileSchema.extend({
  id: z.number(),
  student: student.optional(),
  professor: professor.optional(),
});

type Profile = z.infer<typeof profileSchema>;

export type { Profile };
export { profileSchema, createProfileSchema, updateProfileSchema };
