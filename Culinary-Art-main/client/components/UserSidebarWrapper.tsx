import { getSession } from "@/lib/actions";
import { JWTPayload } from "jose";

import { NavUser } from "./NavUser";
import { SidebarLogo } from "./SidebarLogo";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "./ui/sidebar";
import UserSidebarContent from "./UserSidebarContent";

export default async function UserSidebarWrapper() {
  const session = await getSession();

  if (!session) return null;
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="flex gap-3 mb-10">
        {/* <Link
          href="/"
          className="flex justify-center gap-2 text-primary items-center mt-4"
        >
          <ChefHat className="h-5 w-5" />
          <p className="text-2xl font-semibold">Culinary Art</p>
        </Link> */}
        <SidebarLogo session={session as JWTPayload} />
      </SidebarHeader>

      <SidebarContent>
        <UserSidebarContent />
      </SidebarContent>

      <SidebarFooter>
        <NavUser session={session as JWTPayload} />
      </SidebarFooter>
    </Sidebar>
  );
}
