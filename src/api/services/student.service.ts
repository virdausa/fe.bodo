import { z } from "zod";
import { createStudentSchema, Student } from "../schemas/student.schema";
import { api } from "..";

async function createStudent(body: z.infer<typeof createStudentSchema>) {
  const response = await api.post<Student>("students", {
    headers: {
      "content-type": "application/json",
    },
    json: body,
  });
  return response;
}

export { createStudent };
