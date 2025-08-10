"use client";

import { ChefHat } from "lucide-react";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useRouter } from "next/navigation";
import { JWTPayload } from "jose";

export function SidebarLogo({ session }: { session: JWTPayload }) {
  const router = useRouter();
  const { isMobile, toggleSidebar } = useSidebar();

  function handleClick(href: string) {
    router.push(href);
    if (isMobile) {
      toggleSidebar();
    }
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          onClick={() => handleClick("/")}
        >
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <ChefHat className="size-4" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">NomNom</span>
            <span className="truncate text-xs">
              {(session as JWTPayload).role === "customer"
                ? "User account"
                : "Admin account"}
            </span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
