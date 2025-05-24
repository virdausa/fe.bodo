import { z } from "zod";

const studentSchema = z.object({
  number: z.string({
    required_error: "Student number is required",
    invalid_type_error: "Student number must be a string",
  }),
  major: z.string({
    required_error: "Major is required",
    invalid_type_error: "Major must be a string",
  }),
  class: z.string({
    required_error: "Class is required",
    invalid_type_error: "Class must be a string",
  }),
});

const partialStudentSchema = studentSchema.partial();

export { studentSchema, partialStudentSchema };
