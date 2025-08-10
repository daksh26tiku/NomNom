"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "./ui/button";
import { Filter } from "lucide-react";

type Props = {
  keywords: string[];
};

export default function KeywordsFilter({ keywords }: Props) {
  const searchParams = useSearchParams();
  const currentPath = usePathname();
  const router = useRouter();
  const currentKeyword = searchParams.get("keyword") ?? undefined;

  const handleFilter = (filter: string) => {
    const params = new URLSearchParams(searchParams);
    params.delete("query");
    params.delete("category");

    params.set("keyword", filter);
    params.set("page", "1");
    router.push(currentPath + "?" + params.toString() + "#view-recipes", {
      scroll: false,
    });
  };

  return (
    <div className="flex flex-col xl:flex-row items-center gap-2 mt-8">
      <div className="text-md font-medium text-primary/75 flex gap-2 items-center">
        <Filter />
        <p>Popular Keywords</p>
      </div>

      <ul className="flex gap-3 flex-wrap justify-center md:justify-start">
        {keywords.map((keyword) => (
          <li key={keyword}>
            <Button
              variant={"outline"}
              className={`rounded-full cursor-pointer capitalize ${
                currentKeyword === keyword &&
                "bg-primary text-slate-50 hover:bg-primary hover:text-slate-50"
              }`}
              size={"sm"}
              onClick={() => handleFilter(keyword)}
            >
              {keyword}
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}
