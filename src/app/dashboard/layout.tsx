import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { Header } from "@/components/layout/header";
import { SidebarProvider } from "@/components/ui/sidebar";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const session = cookieStore.get("session");
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  if (!session) {
    return redirect("/signin");
  }

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar />
      <div className="w-full">
        <Header />
        <main className="p-4 md:p-6 lg:p-8">{children}</main>
        <footer className="text-muted-foreground pb-10 text-center text-xs">
          © 2025 Cognito™. All Rights Reserved
        </footer>
      </div>
    </SidebarProvider>
  );
}
