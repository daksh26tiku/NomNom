"use client";
import { getSession } from "@/lib/actions";
import { JWTPayload } from "jose";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import DesktopNavbar from "./DesktopNavbar";
import MobileNavbar from "./MobileNavbar";
import Cookies from "js-cookie";

export default function Navbar({ userInfo }: { userInfo: JWTPayload | null }) {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    async function checkSession() {
      if ((await getSession()) === null) {
        const expiredToken = Cookies.get("session");

        if (expiredToken) Cookies.remove("session");

        router.refresh();
      }
    }
    checkSession();
  }, [pathname]);

  // useEffect(() => {
  //   router.prefetch("/login");
  //   router.prefetch("/signup");
  //   router.prefetch("/about");
  // }, [router]);

  if (pathname.startsWith("/admin") || pathname.startsWith("/user"))
    return null;
  return (
    <header className="backdrop-blur-lg w-full z-40 fixed py-4">
      <MobileNavbar userInfo={userInfo as JWTPayload} />
      <DesktopNavbar userInfo={userInfo as JWTPayload} />
    </header>
  );
}
