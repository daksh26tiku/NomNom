"use server";

import { cookies } from "next/headers";
import { decrypt, deleteSession } from "./session";
import { supabase } from "./supabase";

export async function getSession() {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;
  if (!session) return null;
  
  return await decrypt(session);
}

export async function logout() {
  await deleteSession();
}

// Function to get filter data (categories and price range)
export async function getFilterData() {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_PREFIX}/products/filter-data`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch filter data");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching filter data:", error);
    // Return default values if API fails
    return {
      categories: [],
      priceRange: { min: 0, max: 1000 },
    };
  }
}

// Function to get filtered products
export async function getFilteredProducts(
  searchParams: Record<string, string | undefined>
) {
  try {
    // Build query string from search params
    const params = new URLSearchParams();

    Object.entries(searchParams).forEach(([key, value]) => {
      if (value) {
        params.append(key, value);
      }
    });

    // Set default page if not provided
    if (!searchParams.page) {
      params.set("page", "1");
    }

    // Set default limit
    params.set("limit", "12");

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_PREFIX}/products?${params.toString()}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }

    const data = await response.json();

    return {
      products: data.products,
      pagination: {
        totalData: data.total,
        page: data.page,
        totalPages: data.totalPages,
      },
    };
  } catch (error) {
    console.error("Error fetching products:", error);
    // Return empty data if API fails
    return {
      products: [],
      pagination: {
        totalData: 0,
        page: 1,
        totalPages: 0,
      },
    };
  }
}

// upload image for the recipes

export async function uploadRecipeImage(file: File) {
  try {
    const recipeImgName = `${Math.random()}-${file.name}`.replaceAll("/", "");

    const recipeImgUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/nomnom/recipes/${recipeImgName}`;

    const { error: uploadError } = await supabase.storage
      .from("nomnom")
      .upload(`recipes/${recipeImgName}`, file);

    if (uploadError) throw uploadError;

    return { success: true, imageUrl: recipeImgUrl };
  } catch (error) {
    console.error("Error uploading image:", error);
    return { success: false, message: (error as Error).message };
  }
}

// upload image for the recipes

export async function uploadProductImage(file: File) {
  try {
    const productImgName = `${Math.random()}-${file.name}`.replaceAll("/", "");

    const productImgUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/nomnom/products/${productImgName}`;

    const { error: uploadError } = await supabase.storage
      .from("nomnom")
      .upload(`products/${productImgName}`, file);

    if (uploadError) throw uploadError;

    return { success: true, imageUrl: productImgUrl };
  } catch (error) {
    console.error("Error uploading image:", error);
    return { success: false, message: (error as Error).message };
  }
}

// upload image for the recipes

export async function uploadUserImage(file: File) {
  try {
    const UserImgName = `${Math.random()}-${file.name}`.replaceAll("/", "");

    const userImgUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/nomnom/users/${UserImgName}`;

    const { error: uploadError } = await supabase.storage
      .from("nomnom")
      .upload(`users/${UserImgName}`, file);

    if (uploadError) throw uploadError;

    return { success: true, imageUrl: userImgUrl };
  } catch (error) {
    console.error("Error uploading image:", error);
    return { success: false, message: (error as Error).message };
  }
}
