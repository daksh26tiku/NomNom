import Checkout from "@/components/Checkout";
import { cookies } from "next/headers";

export default async function Page() {
  const token = (await cookies()).get("session")?.value;
  let user = null;

  if (token) {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_PREFIX}/users/user-info`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await res.json();
    if (data.success) {
      user = data.data;
    }
  }

  if (user === null) return <h1>User not found :(</h1>;
  return (
    <section className="bg-primary/5">
      <Checkout user={user} />
    </section>
  );
}
