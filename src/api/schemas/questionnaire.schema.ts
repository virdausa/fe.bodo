import { z } from "zod";
import { answerSchema } from "./answer.schema";

const createQuestionnaireSchema = z.object({
  questions: z.array(
    z.object({
      id: z.number(),
      question: z
        .string()
        .min(2, "Question must be at least 2 characters long")
        .max(100, "Question must not exceed 100 characters long"),
      options: z.array(z.string()),
      correct: z.number(),
    }),
  ),
});

const updateQuestionnaireSchema = createQuestionnaireSchema.partial();

const questionnaireSchema = createQuestionnaireSchema.extend({
  id: z.number(),
  answers: answerSchema.array().optional(),
});

type Questionnaire = z.infer<typeof questionnaireSchema>;

export type { Questionnaire };

export {
  questionnaireSchema,
  createQuestionnaireSchema,
  updateQuestionnaireSchema,
};
