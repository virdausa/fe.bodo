import { z } from "zod";
import { studentSchema } from "./student.schema";
import { professorSchema } from "./professor.schema";
import { postSchema } from "./post.schema";
import { assignmentSchema } from "./assignment.schema";
import { presenceSchema } from "./presence.schema";

const createKelasSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters long")
    .max(50, "Name must not exceed 50 characters long"),
});

const updateKelasSchema = createKelasSchema.partial();

const kelasSchema = createKelasSchema.extend({
  id: z.number(),
  post: postSchema.array().optional(),
  assignment: assignmentSchema.array().optional(),
  student: studentSchema.array().optional(),
  presence: presenceSchema.array().optional(),
  professor: professorSchema.optional(),
});

const joinClassSchema = z.object({
  classId: z.string(),
});

type Kelas = z.infer<typeof kelasSchema>;

export type { Kelas };
export { kelasSchema, createKelasSchema, updateKelasSchema, joinClassSchema };
