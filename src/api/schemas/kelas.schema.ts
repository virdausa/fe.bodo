import { z } from "zod";

const kelasSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters long")
    .max(50, "Name must not exceed 50 characters long"),
});

const partialKelasSchema = kelasSchema.partial();

type Kelas = z.infer<typeof kelasSchema> & { id: number };

export type { Kelas };
export { kelasSchema, partialKelasSchema };
