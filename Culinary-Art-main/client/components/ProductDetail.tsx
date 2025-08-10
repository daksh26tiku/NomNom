"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { Product } from "@/lib/types";
import {
  addItem,
  decreaseItemQuantity,
  deleteItem,
  getCartItemIds,
  getCurrentQuantityById,
  increaseItemQuantity,
} from "@/reducers/cart/cartSlice";
import { ChevronLeft, Minus, Plus, ShoppingCart, Trash } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default function ProductDetail({ product }: { product: Product }) {
  const currentCartItemIds = useAppSelector(getCartItemIds);
  const dispatch = useAppDispatch();
  const currentQuantity = useAppSelector(getCurrentQuantityById(product._id));

  const handleAddToCart = () => {
    const curProduct = {
      ...product,
      quantity: 1,
    };

    dispatch(addItem(curProduct));

    // Simulate adding to cart
  };

  if (!product) {
    return notFound();
  }

  return (
    <div className="w-full">
      <Link
        href="/shop"
        className="inline-flex items-center text-sm text-muted-foreground mb-8 hover:underline"
      >
        <ChevronLeft className="h-4 w-4 mr-1" />
        Back to shop
      </Link>

      <div className="grid md:grid-cols-2 gap-8 ">
        <img
          src={
            product.imageUrl.startsWith("/")
              ? `${process.env.NEXT_PUBLIC_API}${product.imageUrl}`
              : product.imageUrl
          }
          alt={product.name}
          className="object-cover h-96 w-full rounded-lg border"
        />

        <div className="space-y-6">
          <div>
            <Badge variant="secondary" className="mb-2">
              {product.category}
            </Badge>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <div className="mt-2 text-2xl font-semibold">
              ₹ {product.price.toLocaleString("en-IN")}
              <span className="text-sm text-muted-foreground ml-1">
                / {product.unit}
              </span>
            </div>
          </div>

          <Separator />

          <div>
            <h2 className="text-lg font-medium mb-2">Description</h2>
            <p className="text-muted-foreground">{product.description}</p>
          </div>

          <div>
            <h2 className="text-lg font-medium mb-2">Availability</h2>
            <p className="text-muted-foreground">
              {product.quantityInStock > 0
                ? `${product.quantityInStock} ${product.unit} in stock`
                : "Out of stock"}
            </p>
          </div>

          {product.quantityInStock > 0 &&
            (currentCartItemIds.includes(product._id) ? (
              <div className="flex items-center gap-4">
                <Button
                  variant={"destructive"}
                  onClick={() => dispatch(deleteItem(product._id))}
                >
                  <Trash className="h-4 w-4" />
                  Delete
                </Button>
                <div className="flex items-center gap-2 rounded-md">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => dispatch(decreaseItemQuantity(product._id))}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span>{currentQuantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => dispatch(increaseItemQuantity(product._id))}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Button
                  onClick={handleAddToCart}
                  disabled={product.quantityInStock <= 0}
                  className="w-full"
                >
                  <ShoppingCart className="h-4 w-4" />
                  <span>Add to cart</span>
                </Button>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
