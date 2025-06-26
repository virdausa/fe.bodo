"use client";

import Link from "next/link";
import { redirect } from "next/navigation";
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
import { useUserStore } from "@/providers/user.provider";
import { signOut } from "@/api/services/auth.service";

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
    title: "Chatbot",
    icon: Bot,
    items: [{ title: "Chatbot", url: "/dashboard/chatbot" }],
  },
  {
    title: "Inventory",
    icon: Grid2x2,
    items: [{ title: "Accounts", url: "/inventory/accounts" }, { title: "Items", url: "/inventory/items" }],
  },
  {
    title: "Akses",
    icon: ArrowLeft,
    items: [{ title: "Kode", url: "/access/variables" }],
  },
  {
    title: "Profile",
    icon: User,
    items: [{ title: "Profile", url: "/dashboard/profile" }],
  },
];

function AppSidebar() {
  const { user, profile } = useUserStore((state) => state);

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="mt-3 flex flex-col px-2">
          <Avatar className="mb-1 size-14">
            <AvatarImage className="size-14" src="/svg/hehe.svg" />
            <AvatarFallback className="size-14">JD</AvatarFallback>
          </Avatar>
          {/* <span className="font-semibold">{}</span> */}
          <span className="text-muted-foreground text-xs">@{}</span>
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
