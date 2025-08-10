import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import UserSidebarWrapper from "@/components/UserSidebarWrapper";
import { ChefHat } from "lucide-react";
import Link from "next/link";

export default function RestaurantDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <UserSidebarWrapper />

      <SidebarInset>
        <div className="fixed md:relative md:z-0 z-40 bg-background md:bg-transparent w-full flex justify-between items-center md:justify-start md:border-b-0 border-b p-2">
          <Link
            href="/"
            className="md:hidden flex justify-center gap-2 text-primary items-center"
          >
            <ChefHat className="h-5 w-5" />
            <p className="text-2xl font-semibold">NomNom</p>
          </Link>
          <SidebarTrigger className="[&_svg]:!size-6 size-10" />
        </div>

        <main className="flex-1 py-16 px-3">
          <div className="max-w-7xl mx-auto mt-4 md:mt-0">{children}</div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
