import NavWrapper from "@/components/NavWrapper";
import { Toaster } from "@/components/ui/sonner";
import type { Metadata } from "next";
import { Bricolage_Grotesque } from "next/font/google";
import "./globals.css";
import ReduxProvider from "./ReduxProvider";
import Cart from "@/components/Cart";
import { Analytics } from "@vercel/analytics/next";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Culinary Art",
  description:
    "Unleash your inner chef. Upload your favorite recipes, explore mouth-watering dishes, and connect with a community of food lovers. Rate, comment, and share your favorite meals with the world.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${bricolage.className}  antialiased`}>
        <ReduxProvider>
          <NavWrapper />
          <main>{children}</main>
          <Toaster theme="light" />
          <Cart />
          <Analytics />
        </ReduxProvider>
      </body>
    </html>
  );
}
