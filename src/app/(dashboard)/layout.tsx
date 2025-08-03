import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { Header } from "@/components/layout/header";
import { SidebarProvider } from "@/components/ui/sidebar";
import { UserStoreProvider } from "@/providers/user.provider";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  const hasToken = cookieStore.get("token");
  if (!hasToken) {
    return redirect("/signin");
  }

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <UserStoreProvider>
        <AppSidebar />
        <div className="w-full">
          <Header />
          <main className="p-4 md:p-6 lg:p-8">{children}</main>
          <footer className="text-muted-foreground pb-10 text-center text-xs">
            © 2025 Bodo2™. All Rights Reserved
          </footer>
        </div>
      </UserStoreProvider>
    </SidebarProvider>
  );
}
