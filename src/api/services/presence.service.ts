import { z } from "zod";
import { api } from "..";
import {
  createPresenceSchema,
  Presence,
  updatePresenceSchema,
} from "../schemas/presence.schema";

/**
 * Gets all presence sessions for a specific class (Professor view).
 * @param classId The ID of the class.
 * @returns A promise that resolves to an array of presence sessions.
 */
async function getPresences(classId: number) {
  const response = await api.get<Presence[]>(`classes/${classId}/presences`);
  return response;
}

/**
 * Gets a single, detailed presence session, including attendees (Professor view).
 * @param classId The ID of the class.
 * @param presenceId The ID of the presence session.
 * @returns A promise that resolves to a single presence session with student details.
 */
async function getPresence(classId: number, presenceId: number) {
  const response = await api.get<Presence>(
    `classes/${classId}/presences/${presenceId}`,
  );
  return response;
}

/**
 * Creates a new presence session for a class (Professor action).
 * @param classId The ID of the class.
 * @param body The data for the new presence session, containing a deadline.
 * @returns A promise that resolves to the newly created presence session.
 */
async function createPresence(
  classId: number,
  body: z.infer<typeof createPresenceSchema>,
) {
  const response = await api.post<Presence>(`classes/${classId}/presences`, {
    headers: {
      "content-type": "application/json",
    },
    json: body,
  });

  return response;
}

/**
 * Updates an existing presence session (Professor action).
 * @param classId The ID of the class.
 * @param presenceId The ID of the presence session to update.
 * @param body The data to update.
 * @returns A promise that resolves to the updated presence session.
 */
async function updatePresence(
  classId: number,
  presenceId: number,
  body: z.infer<typeof updatePresenceSchema>,
) {
  const response = await api.patch<Presence>(
    `classes/${classId}/presences/${presenceId}`,
    {
      headers: {
        "content-type": "application/json",
      },
      json: body,
    },
  );

  return response;
}

/**
 * Deletes a presence session (Professor action).
 * @param classId The ID of the class.
 * @param presenceId The ID of the presence session to delete.
 * @returns A promise that resolves to a null response.
 */
async function deletePresence(classId: number, presenceId: number) {
  const response = await api.delete<null>(
    `classes/${classId}/presences/${presenceId}`,
  );
  return response;
}

/**
 * Marks the current user as present for a session (Student action).
 * @param classId The ID of the class.
 * @param presenceId The ID of the presence session to attend.
 * @returns A promise that resolves to a confirmation message and the updated presence object.
 */
async function attendPresence(classId: number, presenceId: number) {
  const response = await api.post<Presence>(
    `classes/${classId}/presences/${presenceId}/attend`,
  );
  return response;
}

export {
  getPresences,
  getPresence,
  createPresence,
  updatePresence,
  deletePresence,
  attendPresence,
};
