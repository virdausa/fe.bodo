import { z } from "zod";
import { api } from "..";
import { Professor, createProfessorSchema } from "../schemas/professor.schema";

async function createProfessor(body: z.infer<typeof createProfessorSchema>) {
  const response = await api.post<Professor>("professors", {
    headers: {
      "content-type": "application/json",
    },
    json: body,
  });
  return response;
}

export { createProfessor };
