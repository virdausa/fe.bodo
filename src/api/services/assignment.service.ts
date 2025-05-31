import { z } from "zod";
import {
  createAssignmentSchema,
  Assignment,
  updateAssignmentSchema,
} from "../schemas/assignment.schema";
import { api } from "..";

async function getAssignment(classId: number, assignmentId: number) {
  const response = await api.get<Assignment>(
    `classes/${classId}/assignments/${assignmentId}`,
  );
  return response;
}

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

async function updateAssignment(
  id: number,
  classId: number,
  body: z.infer<typeof updateAssignmentSchema>,
) {
  const response = await api.patch<Assignment>(
    `classes/${classId}/assignments/${id}`,
    {
      headers: {
        "content-type": "application/json",
      },
      json: body,
    },
  );

  return response;
}

async function deleteAssignment(id: number, classId: number) {
  const response = await api.delete<null>(
    `classes/${classId}/assignments/${id}`,
  );
  return response;
}

export { getAssignment, createAssignment, updateAssignment, deleteAssignment };
