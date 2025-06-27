import { api } from "@/api";
import { toast } from "sonner";
import { deleteCookie } from "cookies-next";
import { redirect } from "next/navigation";

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
  const response = await api.post("auth/register", {
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
  const response = await api.post<LoginResponse>("auth/login", {
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
  try {
    const response = await api.post("auth/logout");
    toast.success("You have been signed out");
    return response;
  } catch (error) {
    console.log(error);
    toast.error("There is an error while signing you out: "); 
    throw error;  
  } finally {
    deleteCookie("token");
    return redirect("/signin");
  }
}

export { signUp, signIn, signOut };
