import { Recipe } from "@/lib/types";
import { cookies } from "next/headers";
import RecipeCard from "./RecipeCard";

export default async function UserBookmarkedRecipes() {
  const token = (await cookies()).get("session")?.value;
  let recipes = null;
  if (token) {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_PREFIX}/recipes/user-bookmarked-recipes`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    recipes = (await res.json()).data.bookmarks;
  }

  if (recipes === null) return <p>Sorry, no recipes found</p>;
  return (
    <>
      {recipes === null && (
        <p className="text-muted-foreground text-center my-8">
          An error occurred. Recipes couldn&apos;t be found
        </p>
      )}

      {recipes.length === 0 && (
        <p className="text-muted-foreground text-center my-8">
          You haven&apos;t bookmarked any recipes yet
        </p>
      )}

      <div className="my-8 grid md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-8">
        {recipes.map((recipe: Recipe) => (
          <RecipeCard key={recipe._id} recipe={recipe} />
        ))}
      </div>
    </>
  );
}
