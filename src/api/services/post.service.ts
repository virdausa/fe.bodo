import { z } from "zod";
import {
  createPostSchema,
  Post,
  updatePostSchema,
} from "../schemas/post.schema";
import { api } from "..";

async function getPost(classId: number, postId: number) {
  const response = await api.get<Post>(`classes/${classId}/posts/${postId}`);
  return response;
}

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

async function updatePost(
  id: number,
  classId: number,
  body: z.infer<typeof updatePostSchema>,
) {
  const response = await api.patch<Post>(`classes/${classId}/posts/${id}`, {
    headers: {
      "content-type": "application/json",
    },
    json: body,
  });

  return response;
}

async function deletePost(id: number, classId: number) {
  const response = await api.delete<null>(`classes/${classId}/posts/${id}`);
  return response;
}

export { getPost, createPost, updatePost, deletePost };
