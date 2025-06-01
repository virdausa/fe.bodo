import { z } from "zod";

const promptSchema = z.object({
  prompt: z.string(),
  newChat: z.boolean().optional(),
  asProfessor: z.boolean().optional(),
});

export { promptSchema };
