import { api } from "..";

type UploadResponse = { downloadPage: string };

async function uploadFile(file: File) {
  const form = new FormData();
  form.append("file", file);

  const response = await api.post<UploadResponse>("upload", { body: form });

  return response;
}

export type { UploadResponse };
export { uploadFile };
