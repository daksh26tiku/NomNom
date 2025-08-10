"use client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Eye, Loader2, Pencil, Trash } from "lucide-react";
import Link from "next/link";

import { Recipe } from "@/lib/types";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

type Props = {
  recipe: Recipe;
};

export default function RecipeActionCard({ recipe }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  async function handleDelete() {
    try {
      const token = Cookies.get("session");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_PREFIX}/recipes/delete-recipe/${recipe._id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (data.success) {
        router.refresh();
        toast.success("Success!", {
          description: "Your recipe has been deleted successfully",
        });
      } else {
        toast.error("Error!", {
          description: data.message,
        });
      }
    } catch (error) {
      toast.error("Error", {
        description: (error as Error).message,
      });
    }
  }

  return (
    <Card className="flex flex-col sm:flex-row items-start sm:space-y-0 sm:space-x-4 p-4 rounded-lg shadow-sm">
      <div className="w-full sm:w-28">
        <img
          src={
            recipe.imageUrl.startsWith("/")
              ? `${process.env.NEXT_PUBLIC_API}${recipe.imageUrl}`
              : recipe.imageUrl
          }
          alt={recipe.name}
          className={`rounded-md object-cover w-full sm:w-24 h-48 sm:h-24`}
        />
      </div>
      <div className="flex-grow w-full">
        <div className="flex justify-between items-center">
          <h3 className={"tracking-wide text-lg font-semibold"}>
            {recipe.name}
          </h3>
          <Badge className="uppercase" variant={"outline"}>
            {recipe.category}
          </Badge>
        </div>

        <div className="flex gap-2 mt-2">
          {recipe.keywords.map((keyword, index) => (
            <Badge key={index} className="capitalize" variant={"secondary"}>
              {keyword}
            </Badge>
          ))}
        </div>

        <div className="mt-6 sm:mt-2 flex justify-end sm:items-center space-y-2 sm:space-y-0 items-center">
          <div className="flex gap-2">
            <Button asChild variant={"outline"}>
              <Link href={`/view-recipe/${recipe._id}`}>
                <Eye className="w-4 h-4" /> View
              </Link>
            </Button>
            <Button asChild variant={"outline"}>
              <Link href={`/user/manage-recipes/edit/${recipe._id}`}>
                <Pencil className="w-4 h-4" /> Edit
              </Link>
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant={"destructive"}>
                  <Trash className="w-4 h-4" /> Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    this recipe.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>No</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-red-500 text-slate-100 hover:bg-red-400"
                    onClick={() => startTransition(handleDelete)}
                    disabled={isPending}
                  >
                    {isPending ? (
                      <>
                        <span>Deleting</span>
                        <span className="animate-spin">
                          <Loader2 className="h-4 w-4" />
                        </span>
                      </>
                    ) : (
                      "Yes"
                    )}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>
    </Card>
  );
}
