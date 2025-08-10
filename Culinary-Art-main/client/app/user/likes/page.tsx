import Spinner from "@/components/Spinner";
import UserLikedRecipes from "@/components/UserLikedRecipes";
import { Suspense } from "react";

function Page() {
  return (
    <div className="max-w-6xl">
      <h2 className="text-4xl font-semibold text-primary mb-6">
        Your Liked Recipes
      </h2>

      <Suspense fallback={<Spinner />}>
        <UserLikedRecipes />
      </Suspense>
    </div>
  );
}

export default Page;
