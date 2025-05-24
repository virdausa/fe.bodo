import { z } from "zod";
import { api } from "..";
import { professorSchema } from "../schemas/professor.schema";

type ProfessorResponse = z.infer<typeof professorSchema>;

async function createProfessor(body: z.infer<typeof professorSchema>) {
  const response = await api.post<ProfessorResponse>("professors", {
    headers: {
      "content-type": "application/json",
    },
    json: body,
  });
  return response;
}

export type { ProfessorResponse };
export { createProfessor };
