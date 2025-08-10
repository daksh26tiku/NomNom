import { Recipe } from "@/lib/types";
import React from "react";
import OtherRecipeCard from "./OtherRecipeCard";
import { Button } from "./ui/button";
import Link from "next/link";

export default async function OtherRecipeSection({ id }: { id: string }) {
  const allRecipesRes = await fetch(
    `${process.env.NEXT_PUBLIC_API_PREFIX}/recipes/other-recipes/${id}`
  );

  const recipes = (await allRecipesRes.json()).data;
  return (
    <div className="space-y-4">
      {recipes.map((recipe: Recipe) => (
        <OtherRecipeCard key={recipe._id} recipe={recipe} />
      ))}

      <Button className="w-full" variant={"outline"} asChild>
        <Link href="/">Find more</Link>
      </Button>
    </div>
  );
}
