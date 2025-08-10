"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

export default function FooterClientNav() {
  const pathname = usePathname();
  return (
    <>
      <li>
        <Link
          href={pathname === "/" ? "#popular-recipes" : "/#popular-recipes"}
          className="text-muted-foreground hover:text-primary"
        >
          Popular Recipes
        </Link>
      </li>
      <li>
        <Link
          href={pathname === "/" ? "#recipes" : "/#recipes"}
          className="text-muted-foreground hover:text-primary"
        >
          All Recipes
        </Link>
      </li>
    </>
  );
}
