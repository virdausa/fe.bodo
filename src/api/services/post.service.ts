import { z } from "zod";
import { createPostSchema, Post } from "../schemas/post.schema";
import { api } from "..";

async function createPost(
  classId: number,
  body: z.infer<typeof createPostSchema>,
) {
  const response = await api.post<Post>(`classes/${classId}/posts`, {
    headers: {
      "content-type": "application/json",
    },
    json: body,
  });

  return response;
}

export { createPost };
