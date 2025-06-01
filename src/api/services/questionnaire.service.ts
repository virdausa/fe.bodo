import { z } from "zod";
import {
  createQuestionnaireSchema,
  Questionnaire,
} from "../schemas/questionnaire.schema";
import { api } from "..";

async function getQuestionnaire(
  classId: number,
  assignmentId: number,
  questionnaireId: number,
) {
  const response = await api.get<Questionnaire>(
    `classes/${classId}/assignments/${assignmentId}/questionnaires/${questionnaireId}`,
  );

  return response;
}

async function createQuestionnaire(
  classId: number,
  assignmentId: number,
  body: z.infer<typeof createQuestionnaireSchema>,
) {
  const response = await api.post<Questionnaire>(
    `classes/${classId}/assignments/${assignmentId}/questionnaires`,
    {
      headers: {
        "content-type": "application/json",
      },
      json: body,
    },
  );

  return response;
}

async function deleteQuestionnaire(
  classId: number,
  assignmentId: number,
  questionnaireId: number,
) {
  const response = await api.delete<null>(
    `classes/${classId}/assignments/${assignmentId}/questionnaires/${questionnaireId}`,
  );

  return response;
}

export { getQuestionnaire, createQuestionnaire, deleteQuestionnaire };
