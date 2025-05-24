import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

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

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <div className="flex flex-col gap-6">
          <Card className="overflow-hidden py-0">
            <CardContent className="grid p-0 md:grid-cols-2">
              {children}
              <div className="bg-muted relative hidden md:block">
                <Image
                  src="/images/college.webp"
                  alt="Image"
                  width={2400}
                  height={1600}
                  className="absolute inset-0 h-full w-full object-cover brightness-75"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
