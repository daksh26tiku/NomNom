import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Recipe } from "@/lib/types";
import { Clock, Eye, Heart, MessageCircle, Users } from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import Link from "next/link";

export default function RecipeCard({ recipe }: { recipe: Recipe }) {
  return (
    <Card className="flex flex-col gap-1">
      <CardHeader className="relative">
        <Badge
          className="absolute top-2 right-8 uppercase"
          variant={"secondary"}
        >
          {recipe.category}
        </Badge>

        <img
          src={
            recipe.imageUrl.startsWith("/")
              ? `${process.env.NEXT_PUBLIC_API}${recipe.imageUrl}`
              : recipe.imageUrl
          }
          alt="food"
          className="object-cover w-full h-56 rounded-lg"
        />
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex flex-wrap gap-2">
          {recipe.keywords.map((keyword, index) => (
            <Badge key={index} className="capitalize">
              {keyword}
            </Badge>
          ))}
        </div>
        <h3 className="font-semibold text-lg mt-2 capitalize">{recipe.name}</h3>

        <div className="flex gap-4 items-center">
          <div className="flex items-center gap-1">
            <Heart className="h-6 w-6 text-primary/75" />
            <p className="text-lg font-normal text-primary/75">
              {recipe.likedUsers.length}
              {/* <span className="text-xs text-muted-foreground font-normal ml-1">
              / 5
            </span> */}
            </p>
          </div>

          <div className="flex items-center gap-1">
            <MessageCircle className="h-6 w-6 text-primary/75" />
            <p className="text-lg font-normal text-primary/75">
              {recipe.comments?.length ?? 0}
              {/* <span className="text-xs text-muted-foreground font-normal ml-1">
              / 5
            </span> */}
            </p>
          </div>
        </div>

        <div className="flex gap-1 items-center">
          {recipe.difficulty === "Easy" && <Progress value={33} />}
          {recipe.difficulty === "Medium" && <Progress value={66} />}
          {recipe.difficulty === "Hard" && <Progress value={100} />}
          <p className="text-sm text-muted-foreground">{recipe.difficulty}</p>
        </div>

        <div className="flex justify-between mt-4">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" />
            <p className="text-muted-foreground text-sm">{recipe.time}</p>
          </div>

          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" />
            <p className="text-muted-foreground text-sm">{recipe.servings}</p>
          </div>
        </div>
      </CardContent>

      <CardFooter className="mt-4">
        <Button variant={"secondary"} className="w-full" asChild>
          <Link href={`/view-recipe/${recipe._id}`}>
            <Eye className="h-3 w-3" />
            <span>View</span>
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
