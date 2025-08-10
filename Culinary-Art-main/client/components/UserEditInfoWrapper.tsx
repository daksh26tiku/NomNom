import { cookies } from "next/headers";
import UserEditInfoForm from "./UserEditInfoForm";

export default async function UserEditInfoWrapper() {
  const token = (await cookies()).get("session")?.value;
  let user = null;
  if (token) {
    const res1 = await fetch(
      `${process.env.NEXT_PUBLIC_API_PREFIX}/users/user-info`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await res1.json();
    if (data.success) {
      user = data.data;
      user.totalRecipes = data.userRecipes.length;
    }
  }

  if (user === null) return <h1>User not found :(</h1>;
  return <UserEditInfoForm initialData={user} />;
}
