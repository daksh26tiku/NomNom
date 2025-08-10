"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Cookies from "js-cookie";
import { KeyboardEvent, useRef, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import * as z from "zod";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
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

import { formCategories } from "@/lib/info";
import { Loader2, Plus, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { uploadRecipeImage } from "@/lib/actions";

// --- Zod Validation Schema ---
// Updated keywords to be an array of strings
const recipeFormSchema = z.object({
  name: z.string().min(3, {
    message: "Recipe name must be at least 3 characters.",
  }),
  category: z.string({
    required_error: "Please select a category.",
  }),
  instructions: z
    .array(z.string().min(5, { message: "Instruction too short." }))
    .min(1, { message: "At least one instruction is required." }),
  // --- Updated keywords schema ---
  keywords: z.array(z.string()).optional(), // Now expects an array of strings
  ingredients: z
    .array(
      z.object({
        name: z.string().min(1, { message: "Ingredient name required." }),
        quantity: z.string().min(1, { message: "Quantity required." }),
      })
    )
    .min(1, { message: "At least one ingredient is required." }),
  time: z.string().min(5, {
    message: "Please provide an estimated time",
  }),
  servings: z.coerce
    .number({ invalid_type_error: "Servings must be a number." })
    .positive({ message: "Servings must be positive." })
    .optional(),
  difficulty: z.enum(["Easy", "Medium", "Hard"], {
    required_error: "Please select a difficulty level.",
  }),
  image: z.any().optional(),
});

type RecipeFormValues = z.infer<typeof recipeFormSchema>;

export default function RecipeForm() {
  // State for the current keyword input value
  const [currentKeyword, setCurrentKeyword] = useState("");
  const keywordInputRef = useRef<HTMLInputElement>(null); // Ref to focus input
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 1. Define your form.
  const form = useForm<RecipeFormValues>({
    resolver: zodResolver(recipeFormSchema),
    defaultValues: {
      name: "",
      category: undefined,
      instructions: [],
      keywords: [], // Default keywords to an empty array
      ingredients: [{ name: "", quantity: "" }],
      time: "",
      servings: 0,
      difficulty: undefined,
    },
  });

  // Field Arrays for dynamic lists (Instructions and Ingredients remain the same)
  const {
    fields: instructionFields,
    append: appendInstruction,
    remove: removeInstruction,
  } = useFieldArray({
    control: form.control,
    name: "instructions",
  });

  const {
    fields: ingredientFields,
    append: appendIngredient,
    remove: removeIngredient,
  } = useFieldArray({
    control: form.control,
    name: "ingredients",
  });

  // --- Keyword Handling Logic ---
  const handleKeywordKeyDown = (
    event: KeyboardEvent<HTMLInputElement>,
    field: any // Type from RHF ControllerRenderProps['field']
  ) => {
    if (event.key === "Tab" || event.key === "Enter") {
      event.preventDefault(); // Prevent default Tab behavior/form submission
      const newKeyword = currentKeyword.trim();

      if (newKeyword && !field.value.includes(newKeyword)) {
        // Add the new keyword to the form state array
        field.onChange([...field.value, newKeyword]);
        // Clear the input field
        setCurrentKeyword("");
      } else if (!newKeyword) {
        // If Tab/Enter is pressed on empty input, maybe move focus or do nothing
        // For now, we just prevent default and don't add empty/duplicate
      }
    } else if (
      event.key === "Backspace" &&
      currentKeyword === "" &&
      field.value.length > 0
    ) {
      // If backspace is pressed on an empty input, remove the last keyword
      event.preventDefault();
      const updatedKeywords = [...field.value];
      updatedKeywords.pop(); // Remove the last element
      field.onChange(updatedKeywords);
    }
  };

  const removeKeyword = (keywordToRemove: string, field: any) => {
    const updatedKeywords = field.value.filter(
      (keyword: string) => keyword !== keywordToRemove
    );
    field.onChange(updatedKeywords);
  };

  async function onSubmit(data: RecipeFormValues) {
    const file = data.image;
    if (!file) return;

    // const formData = new FormData();
    // formData.append("image", file);

    try {
      // const res1 = await fetch(
      //   `${process.env.NEXT_PUBLIC_API_PREFIX}/recipes/upload-image`,
      //   {
      //     method: "POST",
      //     body: formData,
      //   }
      // );

      const data1 = await uploadRecipeImage(file);

      if (data1.success) {
        const token = Cookies.get("session");
        const res2 = await fetch(
          `${process.env.NEXT_PUBLIC_API_PREFIX}/recipes/create`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              ...data,
              image: data1.imageUrl,
            }),
          }
        );

        const data2 = await res2.json();

        if (data2.success) {
          toast.success("Success!", {
            description: "Your recipe has been uploaded successfully",
          });

          form.reset({
            name: "",
            category: undefined,
            instructions: [""],
            keywords: [],
            ingredients: [{ name: "", quantity: "" }],
            time: "",
            servings: 0,
            difficulty: undefined,
          });
          setCurrentKeyword("");
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
        <CardTitle className="text-2xl">Upload a New Recipe</CardTitle>
        <CardDescription>
          Fill up the below details to upload your new recipe
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

            <div className="grid md:grid-cols-2 gap-3">
              {/* Category */}
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
                        {formCategories.map((cat) => (
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

              {/* Difficulty */}
              <FormField
                control={form.control}
                name="difficulty"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Difficulty</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select difficulty level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Easy">Easy</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Hard">Hard</SelectItem>
                      </SelectContent>
                    </Select>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-3">
              {/* Time */}
              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preparation & Cooking Time</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 45 minutes" {...field} />
                    </FormControl>
                    <FormDescription>
                      Total time required (prep + cook).
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Servings */}
              <FormField
                control={form.control}
                name="servings"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Servings</FormLabel>
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
                    <FormDescription>
                      How many people does this recipe serve?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Keywords (Badge Input) */}
            <FormField
              control={form.control}
              name="keywords"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Keywords</FormLabel>
                  <FormControl>
                    {/* Container for badges and input */}
                    <div
                      className="flex flex-wrap gap-2 p-2 border rounded-md min-h-[40px] items-center cursor-text"
                      onClick={() => keywordInputRef.current?.focus()} // Focus input when clicking the container
                    >
                      {/* Render existing keyword badges */}
                      {field.value?.map((keyword: string) => (
                        <Badge
                          key={keyword}
                          variant="secondary"
                          className="flex items-center gap-1"
                        >
                          {keyword}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent container click focus
                              removeKeyword(keyword, field);
                            }}
                            className="rounded-full hover:bg-destructive/20 p-0.5"
                            aria-label={`Remove ${keyword}`}
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                      {/* Input for new keyword */}
                      <Input
                        ref={keywordInputRef}
                        placeholder="Add keywords..."
                        value={currentKeyword}
                        onChange={(e) => setCurrentKeyword(e.target.value)}
                        onKeyDown={(e) => handleKeywordKeyDown(e, field)}
                        className="flex-1 h-auto p-0 border-none shadow-none focus-visible:ring-0 min-w-[100px] bg-transparent" // Make input blend in
                      />
                    </div>
                  </FormControl>
                  <FormDescription>
                    Type a keyword and press Tab or Enter to add it. Press
                    Backspace on empty input to remove last.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Image Upload */}
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

            {/* Ingredients (Dynamic Array) */}
            <div>
              <FormLabel>Ingredients</FormLabel>
              <FormDescription>
                List all ingredients and their quantities.
              </FormDescription>
              <div className="space-y-4 mt-2">
                {ingredientFields.map((field, index) => (
                  <div
                    key={field.id}
                    className="flex flex-col space-x-2 p-3 border rounded-md"
                  >
                    <div className="grid md:grid-cols-2 gap-2 items-start">
                      <FormField
                        control={form.control}
                        name={`ingredients.${index}.name`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Ingredient Name</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="e.g., All-purpose Flour"
                                {...field}
                              />
                            </FormControl>

                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`ingredients.${index}.quantity`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Quantity</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., 2 cups" {...field} />
                            </FormControl>

                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* <FormDescription className="col-span-full">
                        For fraction ingredient quantity like e.g., 1/2 tsp use
                        decimal like 0.5 tsp
                      </FormDescription> */}

                      <Button
                        type="button"
                        variant="destructive"
                        onClick={() => removeIngredient(index)}
                        disabled={ingredientFields.length <= 1}
                        className="col-span-full"
                      >
                        <Trash2 />
                        <span>Remove</span>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => appendIngredient({ name: "", quantity: "" })}
              >
                <Plus className="h-4 w-4" /> Add Ingredient
              </Button>
              <FormMessage>
                {form.formState.errors.ingredients?.message}
              </FormMessage>
            </div>

            {/* Instructions (Dynamic Array) */}
            <div>
              <FormLabel>Instructions</FormLabel>
              <FormDescription>
                Provide step-by-step instructions.
              </FormDescription>
              <FormMessage />
              <div className="space-y-4 mt-2">
                {instructionFields.map((field, index) => (
                  <div
                    key={field.id}
                    className="flex flex-col space-x-2 p-3 border rounded-md"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4 items-end">
                      <FormField
                        control={form.control}
                        name={`instructions.${index}`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormLabel>Step {index + 1}</FormLabel>
                            <FormControl>
                              <Input
                                placeholder={`Step ${index + 1}...`}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        onClick={() => removeInstruction(index)}
                        disabled={instructionFields.length <= 1}
                        className="mt-1"
                      >
                        <Trash2 />
                        <span>Remove</span>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => appendInstruction("")}
              >
                <Plus className="h-4 w-4" /> Add Instruction Step
              </Button>
              <FormMessage>
                {form.formState.errors.instructions?.message}
              </FormMessage>
            </div>

            {/* Submit Button */}
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
                "Upload recipe"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
