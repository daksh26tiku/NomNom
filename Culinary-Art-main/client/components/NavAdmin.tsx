"use client";

import { ChevronsUpDown, LogOut, Pencil } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { logout } from "@/lib/actions";
import { JWTPayload } from "jose";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

export function NavAdmin({ session }: { session: JWTPayload }) {
  const { isMobile } = useSidebar();
  const router = useRouter();

  async function handleNavigation(link: string) {
    router.push(link);
  }

  async function handleLogout() {
    await logout();
    router.push("/");
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage
                  src={
                    (session?.imageUrl as string).startsWith("/")
                      ? `${process.env.NEXT_PUBLIC_API}${
                          session?.imageUrl as string
                        }`
                      : (session?.imageUrl as string)
                  }
                  alt={(session as JWTPayload).fullName as string}
                  className="object-cover"
                />
                <AvatarFallback className="rounded-lg">
                  {((session as JWTPayload).fullName as string)[0]}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {((session as JWTPayload).fullName as string).split(" ")[0]}
                </span>
                <span className="truncate text-xs">
                  {(session as JWTPayload).email as string}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage
                    src={
                      (session?.imageUrl as string).startsWith("/")
                        ? `${process.env.NEXT_PUBLIC_API}${
                            session?.imageUrl as string
                          }`
                        : (session?.imageUrl as string)
                    }
                    alt={(session as JWTPayload).fullName as string}
                    className="object-cover"
                  />
                  <AvatarFallback className="rounded-lg">
                    {((session as JWTPayload).fullName as string)[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {((session as JWTPayload).fullName as string).split(" ")[0]}
                  </span>
                  <span className="truncate text-xs">
                    {(session as JWTPayload).email as string}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <DropdownMenuItem
                onClick={() => handleNavigation("/admin/orders")}
              >
                <Pencil />
                <span>Manage orders</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />

            <Button
              className="w-full"
              variant="destructive"
              onClick={handleLogout}
            >
              <LogOut /> Log out
            </Button>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
