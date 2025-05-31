import { z } from "zod";
import { studentSchema } from "./student.schema";

const createSubmissionSchema = z.object({
  attachments: z
    .array(z.object({ name: z.string(), url: z.string() }))
    .default([])
    .optional(),
});

const updateSubmissionSchema = createSubmissionSchema.partial();

const submissionSchema = createSubmissionSchema.extend({
  id: z.number(),
  student: studentSchema.optional(),
});

type Submission = z.infer<typeof submissionSchema>;

export type { Submission };
export { createSubmissionSchema, updateSubmissionSchema, submissionSchema };
