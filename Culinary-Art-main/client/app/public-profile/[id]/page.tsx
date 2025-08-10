import Footer from "@/components/Footer";
import RecipeCard from "@/components/RecipeCard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Recipe } from "@/lib/types";
import { Bookmark, ChefHat, Heart, Shapes } from "lucide-react";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let user = null;
  let recipes = null;
  if (id) {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_PREFIX}/users/user-public-info/${id}`
    );

    const data = await res.json();
    if (data.success) {
      user = data.data;
      user.totalRecipes = data.userRecipes.length;

      recipes = data.userRecipes;
    }
  }

  if (user === null) return <h1>User not found :(</h1>;

  return (
    <div>
      <div className="max-w-6xl mx-auto pt-28 pb-10 px-2">
        <div>
          <div className="flex flex-col md:flex-row items-start md:items-center gap-8 mb-6">
            <div className="flex gap-4 items-center">
              <Avatar className="size-28 md:size-36 lg:size-44 border-2 border-primary">
                <AvatarImage
                  src={
                    user.imageUrl?.startsWith("/")
                      ? `${process.env.NEXT_PUBLIC_API}${user.imageUrl}`
                      : user.imageUrl
                  }
                  alt={`${user.fullName}`}
                  className="object-cover"
                />
                <AvatarFallback>
                  {(user?.fullName as string)?.split(" ")[0][0]}
                </AvatarFallback>
              </Avatar>

              <h3 className="text-2xl font-semibold md:hidden">
                {user.fullName}
              </h3>
            </div>

            <div className="space-y-4 w-full">
              <div className="space-y-2">
                <h3 className="hidden text-2xl font-semibold md:block">
                  {user.fullName}
                </h3>
                <p className="text-muted-foreground">{user.bio}</p>
              </div>
            </div>
          </div>

          <Card>
            <CardContent className="flex flex-col gap-6 sm:flex-row sm:justify-around">
              <div className="flex gap-2 items-center">
                <ChefHat className="h-10 w-10 text-primary" />
                <div className="text-3xl md:text-4xl lg:text-5xl">
                  {user.totalRecipes}
                  <span className="text-sm text-muted-foreground">Recipes</span>
                </div>
              </div>

              <div className="flex gap-2 items-center">
                <Heart className="h-10 w-10 text-primary" />
                <div className="text-3xl md:text-4xl lg:text-5xl">
                  {user.userLikeCount}
                  <span className="text-sm text-muted-foreground">Likes</span>
                </div>
              </div>

              <div className="flex gap-2 items-center">
                <Bookmark className="h-10 w-10 text-primary" />
                <div className="text-3xl md:text-4xl lg:text-5xl">
                  {user.bookmarks.length}
                  <span className="text-sm text-muted-foreground">
                    Bookmarks
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12">
          <h3 className="text-xl flex justify-center gap-2 items-center font-semibold text-primary mb-2">
            <Shapes className="h-4 w-4 text-primary" />
            <p>{`${user.fullName.split(" ")[0]}'s`} Recipes</p>
          </h3>

          <Separator />

          {recipes === null && (
            <p className="text-muted-foreground text-center my-8">
              An error occurred. Recipes couldn&apos;t be found
            </p>
          )}

          {recipes.length === 0 && (
            <p className="text-muted-foreground text-center my-8">
              No posts yet
            </p>
          )}

          <div className="my-8 grid md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-8">
            {recipes.map((recipe: Recipe) => (
              <RecipeCard key={recipe._id} recipe={recipe} />
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
