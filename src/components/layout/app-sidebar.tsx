"use client";

import Link from "next/link";
import {
  ChevronRight,
  LucideProps,
  Home,
  ArrowLeft,
  Bot,
  User,
  Grid2x2,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { signOut } from "@/api/services/auth.service";

import { useUserStore } from "@/providers/user.provider";



interface INavItem {
  title: string;
  url: string;
}

interface IMainNav {
  title: string;
  icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref">>;
  items: INavItem[];
}

const items: IMainNav[] = [
  {
    title: "Lahan",
    icon: Grid2x2,
    items: [{ title: "Lahan", url: "/space/spaces" }],
  },

  {
    title: "Persediaan",
    icon: Grid2x2,
    items: [
      { title: "Daftar Barang", url: "/inventory/items" },
      { title: "Daftar Akun Persediaan", url: "/inventory/supplies" },
      { title: "Mutasi Stok", url: "/transaction/journal_supplies" },
      { title: "Rangkuman Stok", url: "/inventory/supplies/summaries?summary_type=stockflow" },
    ],
  },

  {
    title: "Akuntansi",
    icon: Grid2x2,
    items: [
      { title: "Accounts", url: "/inventory/accounts" },
    ],
  },

  {
    title: "Transaksi",
    icon: Grid2x2,
    items: [
      { title: "Penjualan", url: "/transaction/trades?tr_type=sale" },
      { title: "Pembelian", url: "/transaction/trades?tr_type=purchase" },
      { title: "Jurnal Umum", url: "/transaction/journal_accounts" },
    ],
  },
  {
    title: "Pemain",
    icon: Grid2x2,
    items: [{ title: "Kontak", url: "/player/contacts" }],
  },
  {
    title: "Laporan",
    icon: Grid2x2,
    items: [
      { title: "Neraca", url: "/inventory/accounts/summaries?summary_type=balance_sheet" },
      { title: "Laba Rugi", url: "/inventory/accounts/summaries?summary_type=profit_loss" },
    ],
  },
  // {
  //   title: "Akses",
  //   icon: ArrowLeft,
  //   items: [{ title: "Kode", url: "/access/variables" }],
  // },
  {
    title: "Chatbot",
    icon: Bot,
    items: [{ title: "Chatbot", url: "/dashboard/chatbot" }],
  },
  {
    title: "Profile",
    icon: User,
    items: [{ title: "Profile", url: "/user/profiles" }],
  },
];

function AppSidebar() {
  const { user } = useUserStore((state) => state);

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="mt-3 flex flex-col px-2">
          <Avatar className="mb-1 size-14">
            <AvatarImage className="size-14" src="/svg/hehe.svg" />
            <AvatarFallback className="size-14">JD</AvatarFallback>
          </Avatar>
          <span className="font-semibold">{user.name}</span>
          <span className="text-muted-foreground text-xs">as {user.email}</span>
        </div>
      </SidebarHeader>
      <Separator />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Home" asChild>
                <Link href="/dashboard">
                  <Home />
                  <span className="font-semibold">Home</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            {items.map((item) => (
              <Collapsible
                key={item.title}
                asChild
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      tooltip={item.title}
                      className="cursor-pointer"
                    >
                      {item.icon && <item.icon />}
                      <span className="font-semibold">{item.title}</span>
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down overflow-hidden">
                    <SidebarMenuSub>
                      {item.items?.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton asChild>
                            <Link href={subItem.url}>
                              <span>{subItem.title}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            ))}
            <SidebarMenuItem>
              <AlertDialog>
                <SidebarMenuButton
                  tooltip="Exit"
                  asChild
                  className="cursor-pointer"
                >
                  <AlertDialogTrigger>
                    <ArrowLeft />
                    <span className="font-semibold">Signout</span>
                  </AlertDialogTrigger>
                </SidebarMenuButton>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you sure you want to signout?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action will sign you out from current session. You
                      will have to sign in again.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={signOut}>
                      Signout
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

export { AppSidebar };
