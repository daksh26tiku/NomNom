"use client";
import { Edit, Home, ShoppingBag, Upload, Users, Utensils } from "lucide-react";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useRouter } from "next/navigation";

// Menu items.
const items = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Shop",
    url: "/shop",
    icon: ShoppingBag,
  },
  {
    title: "Manage Orders",
    url: "/admin/orders",
    icon: Utensils,
  },
  {
    title: "Upload Product",
    url: "/admin/upload-product",
    icon: Upload,
  },
  {
    title: "Edit Product",
    url: "/admin/edit-product",
    icon: Edit,
  },
  {
    title: "About Us",
    url: "/about",
    icon: Users,
  },
];

export default function AdminSidebarContent() {
  const router = useRouter();
  const { isMobile, toggleSidebar } = useSidebar();

  function handleClick(href: string) {
    router.push(href);
    if (isMobile) {
      toggleSidebar();
    }
  }
  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                onClick={() => handleClick(item.url)}
                className={
                  "flex items-center w-full space-x-2 pl-4 py-2 rounded-lg mb-1 transition-colors text-sm font-medium"
                }
                tooltip={item.title}
              >
                <item.icon />
                <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
