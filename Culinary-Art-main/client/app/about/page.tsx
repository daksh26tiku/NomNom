// app/about-us/page.tsx
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button"; // Shadcn Button
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // Shadcn Card
import {
  ChefHat,
  HeartHandshake,
  LayoutDashboard,
  Rocket,
  ShoppingCart,
  Users,
} from "lucide-react"; // Icons for feature cards
import Link from "next/link"; // For the CTA button

export default function AboutUsPage() {
  const websiteName = "NomNom";

  return (
    <div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <section className="my-12 sm:my-16 text-center">
          <h2 className="text-3xl sm:text-4xl font-semibold text-gray-800 dark:text-white mb-4 sm:mb-6">
            Our Culinary Mission
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Our mission is simple: to be your ultimate companion in the kitchen.
            We started {websiteName} with the idea of creating a vibrant space
            where food lovers can discover a world of delicious recipes, create
            and share their own culinary masterpieces, connect with a
            like-minded community, and even shop for ingredients seamlessly.
          </p>
        </section>

        {/* What We Offer Section - Using Shadcn Cards */}
        <section className="my-12 sm:my-16">
          <h2 className="text-3xl sm:text-4xl font-semibold text-gray-800 dark:text-white mb-8 sm:mb-12 text-center">
            What You&apos;ll Find Inside {websiteName}
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="shadow-sm dark:bg-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center text-xl font-semibold text-gray-700 dark:text-gray-100">
                  <ChefHat className="h-6 w-6 mr-3 text-primary" />A Universe of
                  Recipes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">
                  Dive into our extensive collection! Search, filter, and
                  explore detailed recipes, from quick dinners to festive
                  feasts.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-sm dark:bg-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center text-xl font-semibold text-gray-700 dark:text-gray-100">
                  <Users className="h-6 w-6 mr-3 text-primary" />
                  Connect & Share
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">
                  Join our food family! Like, comment, bookmark, and visit user
                  profiles to discover unique recipe collections.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-sm dark:bg-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center text-xl font-semibold text-gray-700 dark:text-gray-100">
                  <ShoppingCart className="h-6 w-6 mr-3 text-primary" />
                  Ingredients at Your Fingertips
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">
                  Love a recipe? Order fresh ingredients directly through our
                  site. Simple Browse and cash-on-delivery.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-sm dark:bg-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center text-xl font-semibold text-gray-700 dark:text-gray-100">
                  <LayoutDashboard className="h-6 w-6 mr-3 text-primary" />
                  Your Personalized Kitchen Hub
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">
                  Manage your recipes, track favorites, view order history, and
                  update your profile all in one place.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Our Commitment Section - Simplified */}
        <section className="my-12 sm:my-16 text-center">
          <h2 className="text-3xl sm:text-4xl font-semibold text-gray-800 dark:text-white mb-4 sm:mb-6 flex items-center justify-center">
            <HeartHandshake className="h-8 w-8 mr-3 text-primary" />
            More Than Just Recipes
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            {websiteName} is a community built on the shared love for food. We
            are committed to providing a safe, inspiring, and user-friendly
            environment for all our culinary adventurers.
          </p>
        </section>

        {/* Call to Action Section - Simplified with Shadcn Button */}
        <section className="mt-12 sm:my-16 text-center pt-10 border-t  dark:border-gray-700">
          <h2 className="text-3xl sm:text-4xl font-semibold text-gray-800 dark:text-white mb-4 sm:mb-6 flex items-center justify-center">
            <Rocket className="h-8 w-8 mr-3 text-primary" />
            Ready to Stir Things Up?
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-6 sm:mb-8 leading-relaxed">
            Join the {websiteName} family today! Sign up to start exploring,
            sharing your culinary creations, and connecting with fellow food
            enthusiasts.
          </p>
          <Button asChild size="lg" className="font-semibold text-lg">
            <Link href="/signup">Sign Up Now</Link>
          </Button>
          <p className="mt-8 text-gray-700 dark:text-gray-200 font-medium">
            Happy Cooking!
          </p>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            The Team at {websiteName}
          </p>
        </section>
      </div>

      <Footer />
    </div>
  );
}
