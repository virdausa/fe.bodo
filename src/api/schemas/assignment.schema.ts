import { z } from "zod";
import { submissionSchema } from "./submission.schema";
import { questionnaireSchema } from "./questionnaire.schema";

const createAssignmentSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters long"),
  description: z
    .string()
    .min(2, "Description must be at least 2 characters long"),
  deadline: z.coerce.date(),
  attachments: z.array(z.object({ name: z.string(), url: z.string() })),
});

const updateAssignmentSchema = createAssignmentSchema.partial();

const assignmentSchema = createAssignmentSchema.extend({
  id: z.number(),
  date: z.coerce.date(),
  submission: submissionSchema.array().optional(),
  questionnaire: questionnaireSchema.optional().nullable(),
});

type Assignment = z.infer<typeof assignmentSchema>;

export type { Assignment };
export { assignmentSchema, createAssignmentSchema, updateAssignmentSchema };
