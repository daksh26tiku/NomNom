import PopularRecipeSection from "./PopularRecipeSection";

export default async function PopularRecipeSectionWrapper() {
  const allRecipesRes = await fetch(
    `${process.env.NEXT_PUBLIC_API_PREFIX}/recipes/popular-recipes`
  );

  if (!allRecipesRes.ok) {
    const text = await allRecipesRes.text(); // fallback when not JSON
    throw new Error(`API Error: ${allRecipesRes.status} ${text}`);
  }

  const allRecipesData = await allRecipesRes.json();

  if (!allRecipesData.success) return <p>An error occurred</p>;

  return <PopularRecipeSection recipes={allRecipesData.data} />;
}
