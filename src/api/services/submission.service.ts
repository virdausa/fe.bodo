import { z } from "zod";
import {
  createSubmissionSchema,
  Submission,
} from "../schemas/submission.schema";
import { api } from "..";

async function createSubmission(
  classId: number,
  assignmentId: number,
  body: z.infer<typeof createSubmissionSchema>,
) {
  const response = await api.post<Submission>(
    `classes/${classId}/assignments/${assignmentId}/submissions`,
    {
      headers: {
        "content-type": "application/json",
      },
      json: body,
    },
  );

  return response;
}

export { createSubmission };
