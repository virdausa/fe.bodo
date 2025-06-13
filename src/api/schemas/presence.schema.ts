// --- START OF FILE schemas/presence.schema.ts ---

import { z } from "zod";
import { studentSchema } from "./student.schema";

const createPresenceSchema = z.object({
  deadline: z
    .string({
      required_error: "Deadline is required",
    })
    .datetime({
      message: "Invalid datetime string. Must be in ISO 8601 format.",
    }),
});

const updatePresenceSchema = createPresenceSchema.partial();

const presenceSchema = createPresenceSchema.extend({
  id: z.number(),
  student: studentSchema.array().optional(),
});

type Presence = z.infer<typeof presenceSchema>;

export type { Presence };
export { createPresenceSchema, updatePresenceSchema, presenceSchema };
