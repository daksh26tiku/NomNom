"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { categories } from "@/lib/info";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function CategorySelector() {
  const searchParams = useSearchParams();
  const currentPath = usePathname();
  const router = useRouter();
  const currentCategory = searchParams.get("category") ?? "";

  const handleFilter = (filter: string) => {
    const params = new URLSearchParams(searchParams);
    params.delete("query");
    params.delete("keyword");
    params.set("category", filter);
    params.set("page", "1");
    router.push(currentPath + "?" + params.toString() + "#view-recipes", {
      scroll: false,
    });
  };
  return (
    <div>
      <Select
        onValueChange={(val) => handleFilter(val)}
        value={currentCategory}
      >
        <SelectTrigger className="w-full md:w-[180px] border border-primary">
          <SelectValue placeholder="Select a category" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Categories</SelectLabel>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
