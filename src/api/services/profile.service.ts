import { z } from "zod";
import { api } from "@/api";
import {
  Profile,
  createProfileSchema,
  updateProfileSchema,
} from "../schemas/profile.schema";
import { User } from "../schemas/auth.schema";

type ProfileWithUserResponse = { profile: Profile; user: User };

async function getMe() {
  const response = await api.get<ProfileWithUserResponse>("profiles/me");
  return response;
}

async function getProfile(id: number) {
  const response = await api.get<Profile>(`profiles/${id}`);
  return response;
}

async function createProfile(body: z.infer<typeof createProfileSchema>) {
  const response = await api.post<Profile>("profiles", {
    headers: {
      "content-type": "application/json",
    },
    json: body,
  });
  return response;
}

async function updateProfile(
  id: number,
  body: z.infer<typeof updateProfileSchema>,
) {
  const response = await api.patch<Profile>(`profiles/${id}`, {
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

export type { ProfileWithUserResponse };
export { getMe, getProfile, createProfile, updateProfile, deleteProfiles };
