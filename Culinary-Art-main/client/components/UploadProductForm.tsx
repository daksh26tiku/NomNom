"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Cookies from "js-cookie";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { productCategories } from "@/lib/info";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Textarea } from "./ui/textarea";
import { uploadProductImage } from "@/lib/actions";

// --- Zod Validation Schema ---
// Updated keywords to be an array of strings
const productFormSchema = z.object({
  name: z.string().min(3, {
    message: "Name must be at least 3 characters.",
  }),
  description: z.string().min(3, {
    message: "Description name must be at least 3 characters.",
  }),
  category: z.string({
    required_error: "Please select a category.",
  }),
  price: z.coerce
    .number({ invalid_type_error: "Price must be a number." })
    .positive({ message: "Price must be positive." })
    .optional(),
  quantityInStock: z.coerce
    .number({ invalid_type_error: "Quantity must be a number." })
    .positive({ message: "Quantity must be positive." })
    .optional(),
  unit: z.string().min(1, {
    message: "Unit must be at least 1 character.",
  }),
  image: z.any().optional(),
});

type ProductFormValues = z.infer<typeof productFormSchema>;

export default function UploadProductForm() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 1. Define your form.
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: "",
      category: undefined,
      description: "",
      price: 0,
      quantityInStock: 0,
      unit: "",
    },
  });

  async function onSubmit(data: ProductFormValues) {
    const file = data.image;
    if (!file) return;

    // const formData = new FormData();
    // formData.append("image", file);

    try {
      // const res1 = await fetch(
      //   `${process.env.NEXT_PUBLIC_API_PREFIX}/products/upload-image`,
      //   {
      //     method: "POST",
      //     body: formData,
      //   }
      // );

      const data1 = await uploadProductImage(file);

      if (data1.success) {
        const token = Cookies.get("session");

        const res2 = await fetch(
          `${process.env.NEXT_PUBLIC_API_PREFIX}/products/create-product`,
          {
            method: "POST",
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
          toast.success("Success!", {
            description: "Your product has been uploaded successfully",
          });

          form.reset({
            name: "",
            category: undefined,
            description: "",
            price: 0,
            unit: "",
          });
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
      console.error("Error uploading image:", error);
      toast.error("Error", {
        description: (error as Error).message,
      });
    }
  }

  return (
    <Card className="max-w-3xl">
      <CardHeader className="pl-8">
        <CardTitle className="text-2xl">Upload a New Product</CardTitle>
        <CardDescription>
          Fill up the below details to upload your new product
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 px-2"
          >
            {/* Recipe Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Chocolate Chip Cookies"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Write a brief description about the product"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid md:grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {productCategories.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="quantityInStock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Stock Amount</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="e.g., 40"
                        {...field}
                        onChange={(event) =>
                          field.onChange(+event.target.value)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="e.g., 4"
                        {...field}
                        onChange={(event) =>
                          field.onChange(+event.target.value)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="unit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Unit</FormLabel>

                    <FormControl>
                      <Input placeholder="e.g., gm or, kg" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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
                      className="focus:ring-2 focus:ring-offset-2 focus:ring-ring focus:ring-offset-background"
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
                  {value && (
                    <div className="mt-2">
                      <img
                        src={URL.createObjectURL(value)}
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
              disabled={form.formState.isSubmitting}
              className="w-full"
            >
              {form.formState.isSubmitting ? (
                <>
                  <span>Uploading</span>
                  <span className="animate-spin">
                    <Loader2 className="h-4 w-4" />
                  </span>
                </>
              ) : (
                "Upload product"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
