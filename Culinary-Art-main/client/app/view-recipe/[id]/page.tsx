import OtherRecipeSection from "@/components/OtherRecipeSection";
import RecipeDetails from "@/components/RecipeDetails";
import Spinner from "@/components/Spinner";
import { cookies } from "next/headers";
import { Suspense } from "react";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const token = (await cookies()).get("session")?.value;
  let user = null;
  if (token) {
    const userRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_PREFIX}/users/user-info`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const userData = await userRes.json();
    if (userData.success) {
      user = userData.data;
      user.totalRecipes = userData.userRecipes.length;
      user.userLikeCount = userData.totalLikesReceived;
    }
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_PREFIX}/recipes/single-recipe/${id}`
  );
  const data = await res.json();

  if (!data.success)
    return (
      <p className="pt-24 text-center">
        Sorry, couldn&apos;t find the recipe. Please try again
      </p>
    );
  return (
    <div className="max-w-7xl mx-auto px-4 py-24 grid xl:grid-cols-[1fr_380px] md:gap-8 xl:gap-8">
      <RecipeDetails recipe={data.data} user={user} />
      <div>
        <h2 className="text-3xl text-primary font-semibold mb-4">
          Other Recipes
        </h2>
        <Suspense fallback={<Spinner />}>
          <OtherRecipeSection id={id} />
        </Suspense>
      </div>
    </div>
  );
}
