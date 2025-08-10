"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Cookies from "js-cookie";
import { Loader2, Pencil } from "lucide-react";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { UserAccountInfo } from "@/lib/types";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { toast } from "sonner";
import { uploadUserImage } from "@/lib/actions";

const formSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  bio: z.string().optional(),
  image: z.any().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function UserEditInfoForm({
  initialData,
}: {
  initialData: UserAccountInfo;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: initialData.fullName,
      bio: initialData.bio,
    },
  });

  const onSubmit = async (data: FormValues) => {
    const file = data.image;
    const token = Cookies.get("session");
    if (!file) {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_PREFIX}/users/edit-user-info`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              ...data,
              imageUrl: initialData.imageUrl,
            }),
          }
        );

        const data2 = await res.json();

        if (data2.success) {
          Cookies.set("session", data2.token);
          toast.success("Success!", {
            description:
              "Your account information has been updated successfully",
          });
          router.push("/user/profile");
        } else {
          toast.error("Error", {
            description: data2.message,
          });
        }
      } catch (error) {
        console.error("Error:", error);
        toast.error("Error", {
          description: (error as Error).message,
        });
      }
    } else {
      // const formData = new FormData();
      // formData.append("image", file);

      try {
        // const res1 = await fetch(
        //   `${process.env.NEXT_PUBLIC_API_PREFIX}/users/upload-image`,
        //   {
        //     method: "POST",
        //     body: formData,
        //   }
        // );

        const data1 = await uploadUserImage(file);

        if (data1.success) {
          const res2 = await fetch(
            `${process.env.NEXT_PUBLIC_API_PREFIX}/users/edit-user-info`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                ...data,
                imageUrl: data1.imageUrl,
              }),
            }
          );

          const data2 = await res2.json();

          if (data2.success) {
            Cookies.set("session", data2.token);
            toast.success("Success!", {
              description:
                "Your account information has been updated successfully",
            });
            router.push("/user/profile");
          } else {
            toast.error("Error", {
              description: data2.message,
            });
          }
        } else {
          console.error("Upload failed:", data1.message);
          toast.error("Error", {
            description: data1.message,
          });
        }
      } catch (error) {
        console.error("Error:", error);
        toast.error("Error", {
          description: (error as Error).message,
        });
      }
    }
  };

  return (
    <Card className="max-w-3xl">
      <CardHeader className="pl-8">
        <CardTitle className="text-2xl">Edit Account Information</CardTitle>
        <CardDescription>
          Update the below details to update your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 px-2"
          >
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Tell us about yourself" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="image"
              render={({ field: { value, onChange, ...field } }) => (
                <FormItem>
                  <FormLabel>Image</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          onChange(file);
                        }
                      }}
                      {...field}
                      ref={fileInputRef}
                    />
                  </FormControl>
                  {value && value instanceof File ? (
                    <div className="mt-2">
                      <img
                        src={URL.createObjectURL(value)}
                        alt="Preview"
                        className="rounded-md object-cover"
                      />
                    </div>
                  ) : (
                    <div className="mt-2">
                      <img
                        src={
                          initialData.imageUrl.startsWith("/")
                            ? `${process.env.NEXT_PUBLIC_API}${initialData.imageUrl}`
                            : initialData.imageUrl
                        }
                        alt="Preview"
                        className="rounded-md object-cover"
                      />
                    </div>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? (
                <>
                  <span className="">Updating</span>
                  <span className="animate-spin">
                    <Loader2 className="h-4 w-4" />
                  </span>
                </>
              ) : (
                <>
                  <Pencil className="h-4 w-4" /> Update
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
