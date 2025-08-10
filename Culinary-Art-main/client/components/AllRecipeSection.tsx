import { Recipe } from "@/lib/types";
import RecipeCard from "./RecipeCard";

export default function AllRecipeSection({ recipes }: { recipes: Recipe[] }) {
  return (
    <div className="my-8 grid md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-8 lg:gap-x-10">
      {recipes.map((recipe: Recipe) => (
        <RecipeCard key={recipe._id} recipe={recipe} />
      ))}
    </div>
  );
}
