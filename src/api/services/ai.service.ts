import { z } from "zod";
import { api } from "..";
import { promptSchema } from "../schemas/ai.schema";

async function sendChat(body: z.infer<typeof promptSchema>) {
  const response = await api.post<{ response: string }>("ai/chat", {
    headers: {
      "content-type": "application/json",
    },
    json: body,
  });

  return response;
}

export { sendChat };
