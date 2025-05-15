import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Home() {
  const cookieStore = await cookies();
  const hasSession = cookieStore.get("loggedIn");
  if (hasSession) {
    return redirect("/dashboard");
  }
  return redirect("/signin");
}
