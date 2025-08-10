import Spinner from "@/components/Spinner";
import UserBookmarkedRecipes from "@/components/UserBookmarkedRecipes";
import { Suspense } from "react";

function Page() {
  return (
    <div className="max-w-6xl">
      <h2 className="text-4xl font-semibold text-primary mb-6">
        Your Bookmarks
      </h2>

      <Suspense fallback={<Spinner />}>
        <UserBookmarkedRecipes />
      </Suspense>
    </div>
  );
}

export default Page;
