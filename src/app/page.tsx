import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Home() {
  const cookieStore = await cookies();
  const session = cookieStore.get("session");
  if (session) {
    return redirect("/dashboard");
  }
  return redirect("/signin");
}
