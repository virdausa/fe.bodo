import { z } from "zod";

const fullNameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ]+([ '-][A-Za-zÀ-ÖØ-öø-ÿ]+)+$/;

const profileSchema = z.object({
  name: z
    .string({
      required_error: "Name is required",
      invalid_type_error: "Name must be a string",
    })
    .regex(fullNameRegex, {
      message: "Please enter your full name (at least two words, letters only)",
    }),
});

const partialProfileSchema = profileSchema.partial();

export { profileSchema, partialProfileSchema };
