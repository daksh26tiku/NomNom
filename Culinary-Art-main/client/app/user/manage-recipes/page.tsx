import Spinner from "@/components/Spinner";
import UserManageRecipes from "@/components/UserManageRecipes";
import React, { Suspense } from "react";

export default async function Page() {
  return (
    <div className="max-w-3xl">
      <h2 className="text-4xl font-semibold text-primary mb-6">
        Manage Your Recipes
      </h2>

      <Suspense fallback={<Spinner />}>
        <UserManageRecipes />
      </Suspense>
    </div>
  );
}
