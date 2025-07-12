import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Home() {
  const cookieStore = await cookies();
  const hasToken = cookieStore.get("token");
  if (hasToken) {
    return redirect("/dashboard");
  }
  return redirect("/signin");
}
