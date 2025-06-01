import { z } from "zod";
import { studentSchema } from "./student.schema";

const createAnswerSchema = z.object({
  answers: z.array(
    z.object({
      questionId: z.number(),
      answer: z.number(),
    }),
  ),
});

const updateAnswerSchema = createAnswerSchema.partial();

const answerSchema = createAnswerSchema.extend({
  id: z.number(),
  student: studentSchema.optional().nullable(),
});

type Answer = z.infer<typeof answerSchema>;

export type { Answer };

export { answerSchema, createAnswerSchema, updateAnswerSchema };
