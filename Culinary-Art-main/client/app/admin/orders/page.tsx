import AdminOrders from "@/components/AdminOrders";
import Spinner from "@/components/Spinner";
import React, { Suspense } from "react";

export default async function Page() {
  return (
    <div className="max-w-7xl">
      <h2 className="text-4xl font-semibold text-primary mb-6">All orders</h2>

      <Suspense fallback={<Spinner />}>
        <AdminOrders />
      </Suspense>
    </div>
  );
}
