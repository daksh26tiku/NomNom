import { Recipe } from "@/lib/types";
import { cookies } from "next/headers";
import RecipeActionCard from "./RecipeActionCard";

export default async function UserManageRecipes() {
  const token = (await cookies()).get("session")?.value;
  let recipes = null;
  if (token) {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_PREFIX}/recipes/user-recipes`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    recipes = (await res.json()).data;
  }

  if (recipes === null) return <p>Sorry, no recipes found</p>;
  return (
    <div className="mt-8">
      <div className="my-8 grid gap-y-3">
        {recipes.map((recipe: Recipe) => (
          <RecipeActionCard key={recipe._id} recipe={recipe} />
        ))}
      </div>
    </div>
  );
}
