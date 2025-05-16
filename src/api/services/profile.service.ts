import { z } from "zod";
import { api } from "@/api";
import {
  partialProfileSchema,
  Profile,
  profileSchema,
} from "../schemas/profile.schema";
import { User } from "../schemas/auth.schema";

type ProfileResponse = z.infer<typeof profileSchema>;
type ProfileWithUserResponse = { profile: Profile; user: User };

async function getMe() {
  const response = await api.get<ProfileWithUserResponse>("profiles/me");
  return response;
}

async function getProfile(id: number) {
  const response = await api.get<ProfileResponse>(`profiles/${id}`);
  return response;
}

async function createProfile(body: z.infer<typeof profileSchema>) {
  const response = await api.post<ProfileResponse>("profiles", {
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
  const response = await api.patch<ProfileResponse>(`profiles/${id}`, {
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

export type { ProfileResponse, ProfileWithUserResponse };
export { getMe, getProfile, createProfile, updateProfile, deleteProfiles };
