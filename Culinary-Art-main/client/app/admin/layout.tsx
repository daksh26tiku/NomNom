import AdminSidebarWrapper from "@/components/AdminSidebarWrapper";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export default function RestaurantDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AdminSidebarWrapper />

      <SidebarInset>
        <div className="flex justify-end md:justify-start mt-1">
          <SidebarTrigger className="[&_svg]:!size-6 size-10" />
        </div>

        <main className="flex-1 py-16 px-3">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
