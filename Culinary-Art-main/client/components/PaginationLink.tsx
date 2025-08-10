"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "./ui/button";

interface PaginationLinkProps extends React.HTMLAttributes<HTMLAnchorElement> {
  page: number | null;
  isActive?: boolean;
}
export default function PaginationLink({
  page,
  isActive,
  children,
}: PaginationLinkProps) {
  const searchParams = useSearchParams();
  const currentPath = usePathname();
  const router = useRouter();

  const handleGoToPage = () => {
    const params = new URLSearchParams(searchParams);
    params.set("page", `${page}`);
    router.push(currentPath + "?" + params.toString(), { scroll: false });
  };

  if (!page) {
    return (
      <Button variant="outline" size="icon" disabled className="w-9 h-9">
        {children}
      </Button>
    );
  }

  return (
    <Button
      variant={isActive ? "default" : "outline"}
      size="icon"
      className="w-9 h-9 cursor-pointer"
      onClick={handleGoToPage}
    >
      {children}
    </Button>
  );
}
