import Spinner from "@/components/Spinner";
import UserOrders from "@/components/UserOrders";
import { Suspense } from "react";

async function Page() {
  return (
    <div className="max-w-3xl">
      <h2 className="text-4xl font-semibold text-primary mb-6">Your orders</h2>

      <Suspense fallback={<Spinner />}>
        <UserOrders />
      </Suspense>
    </div>
  );
}

export default Page;
