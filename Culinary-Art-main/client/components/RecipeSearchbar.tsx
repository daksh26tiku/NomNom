"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Input } from "./ui/input";
import { Search, X } from "lucide-react";
import { Button } from "./ui/button";

export default function RecipeSearchbar() {
  const searchParams = useSearchParams();
  const currentPath = usePathname();
  const router = useRouter();
  const [query, setQuery] = useState(() => searchParams.get("query") ?? "");
  const params = new URLSearchParams(searchParams);

  const handleQuery = (Query: string) => {
    if (query !== "") {
      params.delete("category");
      params.delete("keyword");
      params.set("query", Query);
      params.set("page", "1");

      router.push(currentPath + "?" + params.toString() + "#view-recipes", {
        scroll: false,
      });
    }
  };

  const clearQuery = () => {
    setQuery("");

    router.push(currentPath, { scroll: false });
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleQuery(query);
      }}
      className="w-full flex"
    >
      <div className="relative w-full">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary h-4 w-4" />
        <Input
          type="text"
          value={query}
          placeholder="Search for a recipe by name or keyword"
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10 border border-primary rounded-l-full rounded-br-none rounded-tr-none"
        />
        {query.length > 0 && (
          <Button
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-destructive h-4 w-4"
            size={"icon"}
            variant={"ghost"}
            onClick={clearQuery}
          >
            <X />
          </Button>
        )}
      </div>

      <Button
        className="w-16 rounded-r-full rounded-bl-none rounded-tl-none"
        size={"icon"}
      >
        <Search />
      </Button>
    </form>
  );
}
