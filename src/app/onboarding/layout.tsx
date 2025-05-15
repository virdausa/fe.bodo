import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function OnboardingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const hasSession = cookieStore.get("loggedIn");
  if (!hasSession) {
    return redirect("/signin");
  }

  return <>{children}</>;
}
