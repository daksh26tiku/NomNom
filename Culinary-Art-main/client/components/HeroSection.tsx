"use client";

import { Button } from "@/components/ui/button";
import { ArrowDown, Pencil } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function HeroSection() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="relative overflow-hidden" id="home">
      {/* Background SVG that starts from the top */}
      <div className="absolute inset-0 -z-10 w-full overflow-hidden">
        <svg
          preserveAspectRatio="none"
          viewBox="0 0 960 540"
          width="100%"
          height="100%"
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          version="1.1"
          className="absolute top-0 left-0 right-0 w-full h-full"
        >
          <rect x="0" y="0" width="960" height="540" fill="#fdf2e9"></rect>
          <path
            d="M0 470L14.5 473.2C29 476.3 58 482.7 87.2 482.8C116.3 483 145.7 477 174.8 466.3C204 455.7 233 440.3 262 442.7C291 445 320 465 349 476.5C378 488 407 491 436.2 480.2C465.3 469.3 494.7 444.7 523.8 433.5C553 422.3 582 424.7 611 433.8C640 443 669 459 698 468.7C727 478.3 756 481.7 785.2 479C814.3 476.3 843.7 467.7 872.8 461.2C902 454.7 931 450.3 945.5 448.2L960 446L960 541L945.5 541C931 541 902 541 872.8 541C843.7 541 814.3 541 785.2 541C756 541 727 541 698 541C669 541 640 541 611 541C582 541 553 541 523.8 541C494.7 541 465.3 541 436.2 541C407 541 378 541 349 541C320 541 291 541 262 541C233 541 204 541 174.8 541C145.7 541 116.3 541 87.2 541C58 541 29 541 14.5 541L0 541Z"
            fill="#FFF"
            strokeLinecap="round"
            strokeLinejoin="miter"
          ></path>
        </svg>
      </div>

      <div className="max-w-7xl mx-auto py-28 lg:py-32">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 px-4">
          <div className="flex flex-col justify-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-center lg:text-left">
                Heaven to{" "}
                <span className="text-primary ">Culinary Masterpieces</span>
              </h1>
              <p className="text-lg text-muted-foreground text-center lg:text-left">
                Unleash your inner chef. Upload your favorite recipes, explore
                mouth-watering dishes, and connect with a community of food
                lovers. Rate, comment, and share your favorite meals with the
                world.
              </p>

              <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                <Button size={"lg"} asChild>
                  <Link href="/user/upload-recipe">
                    <>
                      <Pencil className="ml-2 h-5 w-5" />
                      Upload a recipe
                    </>
                  </Link>
                </Button>
                <Button variant={"outline"} size={"lg"} asChild>
                  <Link href="#recipes">
                    Explore recipes
                    <ArrowDown className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Creative Image Gallery */}
          <div className="mt-8 lg:mt-0">
            <div className="relative h-[450px] w-full">
              {/* Background elements */}
              <div className="absolute -right-10 top-20 h-[150px] w-[150px] rounded-full bg-primary/10 blur-xl"></div>
              <div className="absolute bottom-10 left-20 h-[100px] w-[100px] rounded-full bg-primary/15 blur-lg"></div>

              {/* Decorative lines */}
              <div className="absolute left-[5%] top-[30%] h-[1px] w-[60px] rotate-[30deg] bg-primary/30"></div>
              <div className="absolute right-[20%] top-[20%] h-[1px] w-[40px] -rotate-[20deg] bg-primary/30"></div>

              {/* Creative Image Layout */}
              <div className="relative h-full w-full">
                {/* Main large image - hexagon shape */}
                <div className="absolute left-[50%] top-[50%] z-10 h-[250px] w-[250px] -translate-x-1/2 -translate-y-1/2 overflow-hidden">
                  <div className="relative h-full w-full overflow-hidden">
                    <div className="absolute inset-0 z-10"></div>
                    <div className="clip-hexagon relative h-full w-full transform transition-transform duration-500 hover:scale-110">
                      <img
                        src="https://images.unsplash.com/photo-1579551562441-049906a6e231?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                        alt="Featured Recipe"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </div>
                </div>

                {/* Top left img - circle */}
                <div className="absolute left-[10%] top-[15%] z-20 h-[135px] w-[135px] overflow-hidden rounded-full border-4 border-background shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl">
                  <img
                    src="https://images.unsplash.com/photo-1482049016688-2d3e1b311543?q=80&w=1010&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt="Recipe 1"
                    className="h-full w-full object-cover"
                  />
                </div>

                {/* Top right img - rounded rectangle with rotation */}
                <div className="absolute right-[5%] top-[10%] z-20 h-[160px] w-[120px] rotate-6 overflow-hidden rounded-xl border-4 border-background shadow-lg transition-all duration-300 hover:-rotate-2 hover:scale-105">
                  <img
                    src="https://images.unsplash.com/photo-1569718212165-3a8278d5f624?q=80&w=1160&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt="Recipe 2"
                    className="h-full w-full object-cover"
                  />
                </div>

                {/* Bottom left img - rounded rectangle with negative rotation */}
                <div className="absolute bottom-[10%] left-[5%] z-20 h-[150px] w-[120px] -rotate-12 overflow-hidden rounded-xl border-4 border-background shadow-lg transition-all duration-300 hover:rotate-0 hover:scale-105">
                  <img
                    src="https://images.unsplash.com/photo-1559742811-822873691df8?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt="Recipe 3"
                    className="h-full w-full object-cover"
                  />
                </div>

                {/* Bottom right img - circle */}
                <div className="absolute bottom-[15%] right-[7%] z-20 h-[150px] w-[150px] overflow-hidden rounded-full border-4 border-background shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl">
                  <img
                    src="https://plus.unsplash.com/premium_photo-1669687759693-52ba5f9fa7a8?q=80&w=988&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt="Recipe 4"
                    className="h-full w-full object-cover"
                  />
                </div>

                {/* Middle right img - square with rounded corners */}
                <div className="absolute right-[25%] top-[80%] z-30 h-[140px] w-[110px] -rotate-6 overflow-hidden rounded-lg border-4 border-background shadow-lg transition-all duration-300 hover:rotate-0 hover:scale-110">
                  <img
                    src="https://images.unsplash.com/photo-1574484284002-952d92456975?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt="Recipe 5"
                    className="h-full w-full object-cover"
                  />
                </div>

                {/* Middle left img - vertical rectangle */}
                <div className="absolute left-[25%] top-[5%] z-30 h-[140px] w-[115px] rotate-12 overflow-hidden rounded-lg border-4 border-background shadow-lg transition-all duration-300 hover:rotate-0 hover:scale-110">
                  <img
                    src="https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt="Recipe 6"
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CSS for hexagon clip path */}
      <style jsx>{`
        .clip-hexagon {
          clip-path: polygon(
            50% 0%,
            100% 25%,
            100% 75%,
            50% 100%,
            0% 75%,
            0% 25%
          );
        }
      `}</style>
    </section>
  );
}
