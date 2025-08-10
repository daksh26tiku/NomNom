"use client";

import { Button } from "@/components/ui/button";
import Cookies from "js-cookie";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

// import { getSession, userLogin } from "@/lib/actions";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { Card } from "./ui/card";
import { getSession } from "@/lib/actions";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  const userForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onUserSubmit = async (formValues: LoginFormValues) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_PREFIX}/users/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formValues),
        }
      );

      const data = await response.json();

      if (data.success) {
        Cookies.set("session", data.token);

        const session = await getSession();

        if (session === null) throw new Error("Invalid Session");

        toast.success(`Welcome ${session.fullName}`, {
          description: data.message,
        });

        userForm.reset({
          email: "",
          password: "",
        });

        if (session.role === "admin") {
          router.push("/admin/orders");
        } else if (session.role === "customer") {
          router.push("/user/profile");
        }
      } else {
        toast.error("Error Occurred", {
          description: data.message,
        });
        return;
      }
    } catch (error) {
      toast.error("Error Occurred", {
        description: (error as Error).message,
      });
    } finally {
      userForm.reset({
        email: "",
        password: "",
      });
    }
  };
  return (
    <Card className="w-sm">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl md:text-3xl font-bold">
          Welcome back
        </CardTitle>
                  <CardDescription>Login with your NomNom account</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...userForm}>
          <form
            onSubmit={userForm.handleSubmit(onUserSubmit)}
            className="mt-2 space-y-6"
          >
            <FormField
              control={userForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      className="rounded-full"
                      placeholder="you@email.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={userForm.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="flex justify-between items-center">
                    <FormLabel>Password</FormLabel>
                    <Link
                      href="/forgot-password"
                      className="text-sm text-muted-foreground hover:underline"
                    >
                      Forgot your password?
                    </Link>
                  </div>
                  <FormControl>
                    <div className="relative">
                      <Input
                        className="rounded-full"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••••••••••"
                        {...field}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <Eye className="h-4 w-4" />
                        ) : (
                          <EyeOff className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full rounded-full"
              disabled={userForm.formState.isSubmitting}
            >
              {userForm.formState.isSubmitting ? (
                <>
                  <span className="">Signing in</span>
                  <span className="animate-spin">
                    <Loader2 className="h-4 w-4" />
                  </span>
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        </Form>

        <div className="mt-4 text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="underline underline-offset-4 hover:text-primary"
          >
            Sign up
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
