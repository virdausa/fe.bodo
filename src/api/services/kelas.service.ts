import { z } from "zod";
import {
  Kelas,
  kelasSchema,
  partialKelasSchema,
} from "../schemas/kelas.schema";
import { api } from "..";

async function getAllClass(as: string = "student") {
  const response = await api.get<Kelas[]>("classes", {
    searchParams: { as },
  });
  return response;
}

async function createClass(body: z.infer<typeof kelasSchema>) {
  const response = await api.post<Kelas>("classes", {
    headers: {
      "content-type": "application/json",
    },
    json: body,
  });
  return response;
}

async function updateClass(
  id: number,
  body: z.infer<typeof partialKelasSchema>,
) {
  const response = await api.patch<Kelas>(`classes/${id}`, {
    headers: {
      "content-type": "application/json",
    },
    json: body,
  });
  return response;
}

async function deleteClass(id: number) {
  const response = await api.delete(`classes/${id}`);
  return response;
}

export { getAllClass, createClass, updateClass, deleteClass };
