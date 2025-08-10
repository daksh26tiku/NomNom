"use client";
import {
  BookMarked,
  Edit,
  Heart,
  Home,
  ListCheckIcon,
  Settings,
  ShoppingBag,
  Upload,
  Users,
  Utensils,
} from "lucide-react";

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
    title: "Profile",
    url: "/user/profile",
    icon: Utensils,
  },
  {
    title: "Upload recipe",
    url: "/user/upload-recipe",
    icon: Upload,
  },
  {
    title: "Manage recipes",
    url: "/user/manage-recipes",
    icon: Edit,
  },
  {
    title: "Order history",
    url: "/user/order-history",
    icon: ListCheckIcon,
  },
  {
    title: "Bookmarks",
    url: "/user/bookmarks",
    icon: BookMarked,
  },
  {
    title: "Liked recipes",
    url: "/user/likes",
    icon: Heart,
  },
  {
    title: "Settings",
    url: "/user/settings",
    icon: Settings,
  },
  {
    title: "About Us",
    url: "/about",
    icon: Users,
  },
];

export default function UserSidebarContent() {
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
