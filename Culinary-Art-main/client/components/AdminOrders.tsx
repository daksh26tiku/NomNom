import { AdminOrder } from "@/lib/types";
import { cookies } from "next/headers";
import AdminOrderCard from "./AdminOrderCard";

export default async function AdminOrders() {
  const token = (await cookies()).get("session")?.value;
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_PREFIX}/orders/all-orders`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await res.json();
  const orders = data.data;

  if (orders === null) return <p>Sorry, no orders found</p>;
  return (
    <div className="mt-8">
      <div className="my-8 grid gap-y-3">
        {orders.map((order: AdminOrder) => (
          <AdminOrderCard key={order._id} order={order} />
        ))}
      </div>
    </div>
  );
}
