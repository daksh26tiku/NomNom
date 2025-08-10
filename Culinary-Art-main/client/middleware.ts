import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { decrypt } from "./lib/session";

export async function middleware(request: NextRequest) {
  const cookie = (await cookies()).get("session")?.value;
  const session = await decrypt(cookie);

  if (!session?.id) {
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.headers.set("x-middleware-cache", "no-cache");
    response.cookies.delete("session");
    return response;
  }

  const pathname = request.nextUrl.pathname;

  if (pathname.startsWith("/user") || pathname.startsWith("/purchase")) {
    if (session.role !== "customer") {
      // If not a restaurant user, rewrite to home
      return NextResponse.rewrite(new URL("/", request.url));
    }
  }

  if (pathname.startsWith("/admin")) {
    if (session.role !== "admin") {
      // If not an admin user, rewrite to home
      return NextResponse.rewrite(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/user/:path*", "/admin/:path*"],
};
