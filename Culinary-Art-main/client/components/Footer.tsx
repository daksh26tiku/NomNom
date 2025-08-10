import { ChefHat } from "lucide-react";
import Link from "next/link";

import { getSession } from "@/lib/actions";
import { JWTPayload } from "jose";
import FooterClientNav from "./FooterClientNav";

export default async function Footer() {
  const session = await getSession();
  return (
    <section className="py-10 border-t border-primary/30">
      <footer className="max-w-7xl mx-auto px-4">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand section */}
          <div className="space-y-4">
            <Link href="/" className="text-primary flex gap-1 items-center">
              <ChefHat className="h-5 w-5" />
              <p className="text-2xl font-semibold">Culinary Art</p>
            </Link>

            <p className="text-muted-foreground">
              Discover, share, and celebrate culinary creativity from around the
              world.
            </p>
          </div>

          {/* Quick links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Explore</h3>
            <ul className="space-y-2">
              <FooterClientNav />

              <li>
                <Link
                  href="/user/upload-recipe"
                  className="text-muted-foreground hover:text-primary"
                >
                  Upload Recipe
                </Link>
              </li>

              <li>
                <Link
                  href="/shop"
                  className="text-muted-foreground hover:text-primary"
                >
                  Shop
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Account</h3>
            {session !== null ? (
              <ul className="space-y-2">
                <li>
                  <Link
                    href={
                      (session as JWTPayload).role === "admin"
                        ? "/admin/orders"
                        : "/user/profile"
                    }
                    className="text-muted-foreground hover:text-primary"
                  >
                    Dashboard
                  </Link>
                </li>
              </ul>
            ) : (
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/login"
                    className="text-muted-foreground hover:text-primary"
                  >
                    Log in
                  </Link>
                </li>

                <li>
                  <Link
                    href="/signup"
                    className="text-muted-foreground hover:text-primary"
                  >
                    Sign up
                  </Link>
                </li>
              </ul>
            )}
          </div>

          {/* Company links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/about"
                  className="text-muted-foreground hover:text-primary"
                >
                  About Us
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t pt-8">
          <div className="flex flex-col items-center justify-center gap-4 md:flex-row">
            <p className="text-center text-sm text-muted-foreground">
              © {new Date().getFullYear()} Culinary Art. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </section>
  );
}
