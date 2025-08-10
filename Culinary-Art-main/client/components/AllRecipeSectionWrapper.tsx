import { Recipe } from "@/lib/types";
import AllRecipeSection from "./AllRecipeSection";
import Pagination from "./Pagination";

export default async function AllRecipeSectionWrapper({
  category,
  query,
  keyword,
  page,
}: {
  category: string;
  query: string | undefined;
  keyword: string | undefined;
  page: string | undefined;
}) {
  const currentCategory = category;
  let allRecipesData: {
    success: boolean;
    data: Recipe[];
    message: string;
    page: number;
    totalPages: number;
  } = {
    success: false,
    data: [],
    message: "",
    page: 1,
    totalPages: 1,
  };

  const params = new URLSearchParams();
  if (page !== undefined) params.set("page", page);

  if (query) {
    params.set("q", query);

    const allRecipesRes = await fetch(
      `${
        process.env.NEXT_PUBLIC_API_PREFIX
      }/recipes/search?${params.toString()}`
    );

    allRecipesData = await allRecipesRes.json();
  } else if (keyword) {
    const allRecipesRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_PREFIX}/recipes/keyword-recipes`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          keyword,
          page: 1,
        }),
      }
    );

    allRecipesData = await allRecipesRes.json();
  } else {
    if (currentCategory === "All" || currentCategory === "all") {
      const allRecipesRes = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_PREFIX
        }/recipes/all-recipes?${params.toString()}`
      );

      allRecipesData = await allRecipesRes.json();
    }

    if (currentCategory !== "All" && currentCategory !== "all") {
      params.set("category", category);

      const allRecipesRes = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_PREFIX
        }/recipes/categories?${params.toString()}`
      );

      allRecipesData = await allRecipesRes.json();
    }
  }

  if (!allRecipesData.success)
    return (
      <p className="my-8 text-destructive text-lg font-medium">
        {allRecipesData.message}
      </p>
    );

  if (allRecipesData.data.length === 0)
    return (
      <p className="my-8 text-lg font-medium">Sorry, no recipes found :(</p>
    );

  return (
    <>
      <AllRecipeSection recipes={allRecipesData.data} />

      <Pagination
        totalData={allRecipesData.data.length}
        totalPages={allRecipesData.totalPages}
        page={allRecipesData.page}
      />
    </>
  );
}
