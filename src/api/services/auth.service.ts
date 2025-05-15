import { api } from "@/api";

interface ISignUpBody {
  username: string;
  password: string;
}

async function signUp(body: ISignUpBody) {
  const response = await api.post("auth/signup", {
    headers: {
      "content-type": "application/json",
    },
    json: body,
  });

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return response;
}

interface ISignInBody {
  username: string;
  password: string;
}

async function signIn(body: ISignInBody) {
  const response = await api.post("auth/signin", {
    headers: {
      "content-type": "application/json",
    },
    json: body,
  });

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return response;
}

async function signOut() {
  const response = await api.delete("auth/signout");
  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return response;
}

export { signUp, signIn, signOut };
