import { z } from "zod";
import { Answer, createAnswerSchema } from "../schemas/answer.schema";
import { api } from "..";

async function createAnswer(
  classId: number,
  assignmentId: number,
  questionnaireId: number,
  body: z.infer<typeof createAnswerSchema>,
) {
  const response = await api.post<Answer>(
    `classes/${classId}/assignments/${assignmentId}/questionnaires/${questionnaireId}/answers`,
    {
      headers: {
        "content-type": "application/json",
      },
      json: body,
    },
  );

  return response;
}

export { createAnswer };
