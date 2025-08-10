"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Comment, RecipePublicView, UserInfo } from "@/lib/types";
import { formatRelative, parseISO } from "date-fns"; // Import date-fns functions
import Cookies from "js-cookie";
import {
  Bookmark,
  Check,
  Clock,
  ForkKnifeCrossed,
  Heart,
  Loader2,
  MessageSquare,
  Send,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Progress } from "./ui/progress";

type Props = {
  recipe: RecipePublicView;
  user: UserInfo | null;
};

export default function RecipeDetails({ recipe, user }: Props) {
  const router = useRouter();

  const [comment, setComment] = useState("");
  const [isLikeSubmitting, startLikeTransition] = useTransition();
  const [isCommentSubmitting, startCommentTransition] = useTransition();
  const [isBookmarkSubmitting, startBookmarkTransition] = useTransition();

  const handleLike = async () => {
    const token = Cookies.get("session");
    if (!token) {
      toast("Failed", {
        description: "Please sign in to like this recipe",
      });

      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_PREFIX}/recipes/like-recipe`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            recipeId: recipe._id,
          }),
        }
      );
      const data = await res.json();
      if (data.success) router.refresh();
      else {
        toast.error("Error", {
          description: data.message,
        });
      }
    } catch (error) {
      toast.error("Error", {
        description: "Failed to like recipe",
      });
    }
  };

  const handleComment = async () => {
    const token = Cookies.get("session");
    if (!token) {
      toast("Failed", {
        description: "Please sign in to comment on this recipe",
      });

      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_PREFIX}/recipes/comment-recipe`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            recipeId: recipe._id,
            comment,
          }),
        }
      );
      const data = await res.json();
      if (data.success) {
        setComment("");
        router.refresh();
      } else {
        toast.error("Error", {
          description: data.message,
        });
      }
    } catch (error) {
      toast.error("Error", {
        description: "Failed to comment on this recipe",
      });
    } finally {
      setComment("");
    }
  };

  const handleBookmark = async () => {
    const token = Cookies.get("session");
    if (!token) {
      toast("Failed", {
        description: "Please sign in to bookmark this recipe",
      });

      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_PREFIX}/recipes/bookmark-recipe`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            recipeId: recipe._id,
          }),
        }
      );
      const data = await res.json();
      if (data.success) {
        router.refresh();
      } else {
        toast.error("Error", {
          description: data.message,
        });
      }
    } catch (error) {
      toast.error("Error", {
        description: "Failed to bookmark the recipe",
      });
    }
  };

  if (!recipe) {
    return <div className="text-center py-12">Recipe not found</div>;
  }

  const isLiked =
    user === null ? false : recipe.likedUsers.includes(user._id as string);

  const isBookmarked =
    user === null ? false : user.bookmarks.includes(recipe._id);

  return (
    <div className="space-y-6 mb-16">
      {/* Hero Section */}
      <div className="relative rounded-xl overflow-hidden">
        <img
          src={
            recipe.imageUrl.startsWith("/")
              ? `${process.env.NEXT_PUBLIC_API}${recipe.imageUrl}`
              : recipe.imageUrl
          }
          alt={recipe.name}
          className="object-cover w-full h-[400px]"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6">
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              {recipe.name}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-white/90 justify-between">
              <div className="flex gap-4">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{recipe.time}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{recipe.servings} servings</span>
                </div>
              </div>

              <Badge
                variant={"secondary"}
                className="px-4 h-6 uppercase font-semibold"
              >
                {recipe.category}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-center">
        <Link
          href={
            user !== null && user._id === recipe.createdBy._id
              ? `/user/profile`
              : `/public-profile/${recipe.createdBy._id}`
          }
          className="flex items-center gap-2 group"
        >
          <Avatar className="h-10 w-10">
            <AvatarImage
              src={
                recipe.createdBy.imageUrl.startsWith("/")
                  ? `${process.env.NEXT_PUBLIC_API}${recipe.createdBy.imageUrl}`
                  : recipe.createdBy.imageUrl
              }
              alt={recipe.createdBy.fullName}
              className="object-cover"
            />
            <AvatarFallback>{recipe.createdBy.fullName[0]}</AvatarFallback>
          </Avatar>

          <div>
            <p className="text-sm text-muted-foreground">Posted by</p>
            <p className="text-sm font-medium group-hover:text-primary/75 transition-colors">
              {recipe.createdBy.fullName}
            </p>
          </div>
        </Link>
        <div className="flex gap-2">
          <Button
            variant={"outline"}
            size={"lg"}
            className={isLiked ? "text-red-500" : ""}
            onClick={() => startLikeTransition(handleLike)}
            disabled={isLikeSubmitting}
          >
            <Heart className={`w-4 h-4 ${isLiked ? "fill-red-500" : ""}`} />
            {recipe.likedUsers.length}
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() => startBookmarkTransition(handleBookmark)}
            disabled={isBookmarkSubmitting}
          >
            {isBookmarked ? (
              <>
                <Bookmark className="w-4 h-4 fill-primary" />
                Saved
              </>
            ) : (
              <>
                <Bookmark className="w-4 h-4" />
                Save
              </>
            )}
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="#comments">
              <MessageSquare className="w-4 h-4" />
              {recipe.comments.length} Comments
            </Link>
          </Button>
        </div>
      </div>

      {/* Category and Keywords */}
      <div>
        <div className="flex items-center gap-2">
          {recipe.keywords.map((keyword: string) => (
            <Badge key={keyword} className="capitalize">
              {keyword}
            </Badge>
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm font-medium">Difficulty</p>
        <div className="flex gap-1 items-center max-w-2xl">
          {recipe.difficulty === "Easy" && <Progress value={33} />}
          {recipe.difficulty === "Medium" && <Progress value={66} />}
          {recipe.difficulty === "Hard" && <Progress value={100} />}
          <p className="text-sm text-muted-foreground">{recipe.difficulty}</p>
        </div>
      </div>

      {/* Recipe Content */}
      <div className="grid gap-16">
        {/* Instructions */}
        <div>
          <h2 className="text-2xl font-semibold mb-4 text-primary/85">
            Steps on how to cook
          </h2>
          <div className="space-y-4">
            {recipe.instructions.map((instruction: string, index: number) => (
              <div
                key={index}
                className="grid grid-cols-[16px_1fr] gap-4 items-start"
              >
                <ForkKnifeCrossed className="h-4 w-4 text-primary mt-1" />
                <p className="font-medium">{instruction}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Ingredients */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-primary/85">
              Ingredients
            </CardTitle>
            <CardDescription>
              Check the ingredients and quantities you&apos;ll need.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center font-semibold mb-4 text-lg">
              <p>Name</p>
              <div className="flex items-center gap-2">
                For {recipe.servings} persons
              </div>
            </div>
            <ul className="space-y-3">
              {recipe.ingredients.map((ingredient: any, index: number) => (
                <li key={index} className="flex justify-between capitalize">
                  <div className="font-normal flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />{" "}
                    <span>{ingredient.name}</span>
                  </div>
                  <span className="text-muted-foreground">
                    {ingredient.quantity}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <Separator className="my-8" />

      {/* Comments Section */}
      <div id="comments" className="scroll-mt-16">
        <h2 className="text-2xl font-semibold mb-4 text-primary/85 flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          Comments ({recipe.comments.length})
        </h2>

        {/* Add Comment */}
        {user === null ? (
          <p className="text-muted-foreground text-sm mb-6">
            Please sign in to post your thoughts
          </p>
        ) : (
          <div className="flex gap-4 mb-6">
            <Avatar className="h-10 w-10">
              <AvatarImage
                src={
                  (user.imageUrl as string).startsWith("/")
                    ? `${process.env.NEXT_PUBLIC_API}/${user.imageUrl}`
                    : user.imageUrl
                }
                alt={user.fullName}
                className="object-cover"
              />
              <AvatarFallback>You</AvatarFallback>
            </Avatar>
            <div className="relative w-full">
              <Textarea
                placeholder="Share your thoughts or tips about this recipe..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="pb-12 resize-none h-28"
              />
              <Button
                className="absolute bottom-2 right-2"
                onClick={() => startCommentTransition(handleComment)}
                disabled={!comment.trim() || isCommentSubmitting}
              >
                {isCommentSubmitting ? (
                  <>
                    <span className="animate-spin">
                      <Loader2 className="h-4 w-4" />
                    </span>
                    <span>Posting</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Post
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        {/* Comments List */}
        <div className="space-y-5">
          {" "}
          {/* Slightly increased spacing */}
          {recipe.comments.length > 0 ? (
            recipe.comments.map((comment: Comment) => {
              // Parse the ISO string date from the comment
              const commentDate = parseISO(comment.createdAt);
              const now = new Date();
              // Format the date relative to the current time
              // You can add { locale: yourLocale } as a third argument if needed
              const relativeTime = formatRelative(commentDate, now);
              // Capitalize the first letter of relativeTime for better display
              const displayTime =
                relativeTime.charAt(0).toUpperCase() + relativeTime.slice(1);

              return (
                <div
                  key={comment._id}
                  className="flex items-start gap-3 sm:gap-4"
                >
                  {" "}
                  {/* Use items-start, adjust gap */}
                  {/* Avatar */}
                  <Link
                    href={
                      user !== null && user._id === comment.commentedBy._id
                        ? `/user/profile`
                        : `/public-profile/${comment.commentedBy._id}`
                    }
                  >
                    <Avatar className="h-9 w-9 sm:h-10 sm:w-10 border">
                      {" "}
                      {/* Slightly smaller on mobile, added border */}
                      <AvatarImage
                        src={
                          comment.commentedBy.imageUrl.startsWith("/")
                            ? `${process.env.NEXT_PUBLIC_API}${comment.commentedBy.imageUrl}`
                            : comment.commentedBy.imageUrl
                        }
                        alt={comment.commentedBy.fullName}
                        className="object-cover"
                      />
                      <AvatarFallback className="text-sm">
                        {" "}
                        {/* Slightly smaller fallback text */}
                        {comment.commentedBy.fullName.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Link>
                  {/* Comment Content */}
                  <div className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-lg px-3 py-2 shadow-sm">
                    {" "}
                    {/* Changed background, padding, added subtle shadow */}
                    <Link
                      href={
                        user !== null && user._id === comment.commentedBy._id
                          ? `/user/profile`
                          : `/public-profile/${comment.commentedBy._id}`
                      }
                      className="flex items-center gap-2 mb-1 group"
                    >
                      <p className="font-semibold text-sm text-gray-800 dark:text-gray-200 group-hover:text-primary/60 transition-colors">
                        {" "}
                        {/* Bolder name */}
                        {comment.commentedBy.fullName}
                      </p>
                      <p
                        className="text-xs text-gray-500 dark:text-gray-400"
                        title={comment.createdAt}
                      >
                        {" "}
                        {/* Tooltip with exact time */}
                        {displayTime} {/* Display formatted relative time */}
                      </p>
                    </Link>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {comment.comment}
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400">
              No comments yet
            </p> // Handle empty state
          )}
        </div>
      </div>
    </div>
  );
}
