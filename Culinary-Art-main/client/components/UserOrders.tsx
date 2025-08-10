import { cookies } from "next/headers";
import React from "react";
import UserOrderCard from "./UserOrderCard";
import { Order } from "@/lib/types";

export default async function UserOrders() {
  const token = (await cookies()).get("session")?.value;
  let orders = null;
  if (token) {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_PREFIX}/orders/user-orders`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    orders = (await res.json()).data;
  }

  if (orders === null) return <p>Sorry, no orders found</p>;

  return (
    <div className="mt-8">
      <div className="my-8 grid gap-y-3">
        {orders.map((order: Order) => (
          <UserOrderCard key={order._id} order={order} />
        ))}
      </div>
    </div>
  );
}
