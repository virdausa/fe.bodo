import { z } from "zod";
import { studentSchema } from "../schemas/student.schema";
import { api } from "..";

type StudentResponse = z.infer<typeof studentSchema>;

async function createStudent(body: z.infer<typeof studentSchema>) {
  const response = await api.post<StudentResponse>("students", {
    headers: {
      "content-type": "application/json",
    },
    json: body,
  });
  return response;
}

export type { StudentResponse };
export { createStudent };
