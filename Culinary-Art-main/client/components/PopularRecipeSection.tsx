"use client";

import React from "react";
import RecipeCard from "./RecipeCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { Recipe } from "@/lib/types";

export default function PopularRecipeSection({
  recipes,
}: {
  recipes: Recipe[];
}) {
  return (
    <section className="max-w-7xl px-4 mx-auto py-10">
      <h2 className="text-primary text-4xl font-semibold">Most Popular</h2>

      <Carousel
        plugins={[
          Autoplay({
            delay: 2000,
            stopOnInteraction: false,
            stopOnMouseEnter: true,
          }) as any,
        ]}
        className="max-w-[280px] md:max-w-2xl lg:max-w-4xl xl:max-w-6xl mx-auto my-8"
      >
        <CarouselContent className="-ml-1">
          {recipes.map((recipe: Recipe) => (
            <CarouselItem
              key={recipe._id}
              className="pl-1 md:basis-1/2 lg:basis-1/2 xl:basis-1/3"
            >
              <div className="p-2">
                <RecipeCard recipe={recipe} />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious variant={"default"} />
        <CarouselNext variant={"default"} />
      </Carousel>
    </section>
  );
}
