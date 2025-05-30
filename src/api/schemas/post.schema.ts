import { z } from "zod";

const createPostSchema = z.object({
  title: z.string({
    required_error: "Title is required",
    invalid_type_error: "Title must be a string",
  }),
  description: z.string({
    required_error: "Description is required",
    invalid_type_error: "Description must be a string",
  }),
  attachments: z
    .array(z.object({ name: z.string(), url: z.string() }))
    .default([])
    .optional(),
});

const updatePostSchema = createPostSchema.partial();

const postSchema = createPostSchema.extend({
  id: z.number(),
  date: z.coerce.date(),
});

type Post = z.infer<typeof postSchema>;

export type { Post };
export { postSchema, createPostSchema, updatePostSchema };
