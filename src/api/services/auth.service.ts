import { api } from "@/api";

// Define a type for the possible user statuses
type UserStatus = "active" | "inactive" | "pending" | "banned";

// Interface for the nested 'user' object
interface UserProfile {
  id: number;
  username: string;
  name: string;
  email: string;
  email_verified_at: string;
  birth_date: string;
  left_date: string | null;
  sex: "male" | "female" | null;
  id_card_number: string | null;
  address: string;
  phone_number: string;
  status: UserStatus;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  role_id: number;
  player_id: number;
}

interface LoginResponse {
  token: string;
  user: UserProfile;
}

interface ISignUpBody {
  email: string;
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
  email: string;
  password: string;
}

async function signIn(body: ISignInBody) {
  const response = await api.post<LoginResponse>("login", {
    headers: {
      "content-type": "application/json",
    },
    json: body,
  });

  console.log(response);

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return response;
}

async function signOut() {
  const response = await api.post("logout");
  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return response;
}

export { signUp, signIn, signOut };
