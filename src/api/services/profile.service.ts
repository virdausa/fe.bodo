import { z } from "zod";
import { api } from "@/api";
import { partialProfileSchema, profileSchema } from "../schemas/profile.schema";

type profileResponse = z.infer<typeof profileSchema>;
type profileWithUsernameResponse = z.infer<typeof profileSchema> & {
  username: string;
};

async function getMe() {
  const response = await api.get<profileWithUsernameResponse>("profiles/me");
  return response;
}

async function getProfile(id: number) {
  const response = await api.get<profileResponse>(`profiles/${id}`);
  return response;
}

async function createProfile(body: z.infer<typeof profileSchema>) {
  const response = await api.post<profileResponse>("profiles", {
    headers: {
      "content-type": "application/json",
    },
    json: body,
  });
  return response;
}

async function updateProfile(
  id: number,
  body: z.infer<typeof partialProfileSchema>,
) {
  const response = await api.patch<profileResponse>(`profiles/${id}`, {
    headers: {
      "content-type": "application/json",
    },
    json: body,
  });
  return response;
}

async function deleteProfiles(id: number) {
  const response = await api.delete<null>(`profiles/${id}`);
  return response;
}

export type { profileResponse, profileWithUsernameResponse };
export { getMe, getProfile, createProfile, updateProfile, deleteProfiles };
