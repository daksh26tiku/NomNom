import EditRecipeForm from "@/components/EditRecipeForm";
import React from "react";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_PREFIX}/recipes/single-recipe/${id}`
  );
  const data = await res.json();

  if (!data.success)
    return <p>Sorry, couldn&apos;t find the recipe. Please try again</p>;

  return <EditRecipeForm recipe={data.data} />;
}
