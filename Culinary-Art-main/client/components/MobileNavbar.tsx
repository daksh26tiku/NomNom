import { useState } from "react";

import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { logout } from "@/lib/actions";
import { JWTPayload } from "jose";
import { ChefHat, Menu, Pencil, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";

export default function MobileNavbar({
  userInfo,
}: {
  userInfo: JWTPayload | null;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathName = usePathname();

  const handleNavigation = (link: string): void => {
    setIsOpen(false);
    router.push(link);
  };

  async function handleLogout() {
    await logout();
    setIsOpen(false);
    router.push("/");
  }

  return (
    <nav className="lg:hidden px-4 flex items-center justify-between">
      <Link
        className={`${
          pathName === "/login" || pathName === "/signup"
            ? "text-primary-foreground"
            : "text-primary"
        } text-primary flex gap-1 items-center hover:cursor-pointer`}
        href={pathName === "/" ? "#home" : "/"}
      >
        <ChefHat className="h-5 w-5" />
                    <p className="text-2xl font-semibold">NomNom</p>
      </Link>

      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <DrawerTrigger>
          <Menu className="h-6 w-6 text-primary" />
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle></DrawerTitle>

            <Button
              onClick={() =>
                handleNavigation(pathName === "/" ? "#recipes" : "/")
              }
              variant={"ghost"}
            >
              Recipes
            </Button>

            <Button onClick={() => handleNavigation("/shop")} variant={"ghost"}>
              Shop
            </Button>

            <Button
              onClick={() => handleNavigation("/about")}
              variant={"ghost"}
            >
              About Us
            </Button>
          </DrawerHeader>

          <Separator />

          <DrawerFooter>
            {userInfo ? (
              <>
                <div className="pt-3 pb-2 flex justify-center gap-2 items-center">
                  <Avatar>
                    <AvatarImage
                      src={
                        (userInfo?.imageUrl as string).startsWith("/")
                          ? `${process.env.NEXT_PUBLIC_API}${
                              userInfo?.imageUrl as string
                            }`
                          : (userInfo?.imageUrl as string)
                      }
                      alt="@shadcn"
                      className="object-cover"
                    />
                    <AvatarFallback>
                      {(userInfo?.fullName as string).split(" ")[0][0]}
                    </AvatarFallback>
                  </Avatar>

                  <p className="text-md font-medium">
                    {(userInfo?.fullName as string).split(" ")[0]}
                  </p>
                </div>

                {/* <Button
                  variant={"ghost"}
                  onClick={() => handleNavigation("/user/profile")}
                >
                  <User />
                  <span>Profile</span>
                </Button> */}

                <Button
                  variant={"ghost"}
                  onClick={() =>
                    handleNavigation(
                      userInfo.role === "customer"
                        ? "/user/profile"
                        : "/admin/orders"
                    )
                  }
                >
                  <Pencil />
                  <span>Dashboard</span>
                </Button>

                {userInfo.role === "customer" && (
                  <Button
                    variant={"ghost"}
                    onClick={() => handleNavigation("/user/settings")}
                  >
                    <Settings />
                    <span>Settings</span>
                  </Button>
                )}

                <Button variant={"destructive"} onClick={handleLogout}>
                  Log out
                </Button>
              </>
            ) : (
              <>
                <Button onClick={() => handleNavigation("/login")}>
                  Log in
                </Button>

                <Button
                  variant={"outline"}
                  onClick={() => handleNavigation("/signup")}
                >
                  Sign up
                </Button>
              </>
            )}
          </DrawerFooter>
          {/* <DrawerClose>
            <Button variant="outline">Cancel</Button>
          </DrawerClose> */}
        </DrawerContent>
      </Drawer>
    </nav>
  );
}
