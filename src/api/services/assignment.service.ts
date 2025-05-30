import { z } from "zod";
import {
  createAssignmentSchema,
  Assignment,
} from "../schemas/assignment.schema";
import { api } from "..";

async function createAssignment(
  classId: number,
  body: z.infer<typeof createAssignmentSchema>,
) {
  const response = await api.post<Assignment>(
    `classes/${classId}/assignments`,
    {
      headers: {
        "content-type": "application/json",
      },
      json: body,
    },
  );

  return response;
}

export { createAssignment };
