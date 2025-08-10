// components/OrderCard.tsx
"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

// Assuming your Order type is defined here
import { Order } from "@/lib/types";
import {
  CalendarDays,
  Eye, // Will be removed from button, but kept for reference
  Hash,
  ImageIcon,
  Package,
  Truck,
} from "lucide-react";
import OrderDetail from "./OrderDetail";
// useRouter is no longer needed for navigation here
// import { useRouter } from "next/navigation";

const getStatusBadgeVariant = (
  status: Order["orderStatus"]
): "default" | "secondary" | "destructive" | "outline" => {
  switch (status) {
    case "Pending":
      return "default";
    case "Confirmed":
      return "secondary";
    case "Shipped":
      return "outline";
    case "Delivered":
      // If you add a "success" variant to your badge.tsx, use it here
      // return "success";
      return "default"; // Default often themed as primary, can look like success
    case "Cancelled":
      return "destructive";
    default:
      return "secondary";
  }
};

export default function UserOrderCard({ order }: { order: Order }) {
  const {
    _id,
    userId, // Consider populating this to get user's name for the modal
    phoneNumber,
    address,
    items,
    subtotal,
    deliveryCharge,
    totalAmount,
    paymentMethod,
    orderStatus,
    createdAt,
    // updatedAt, // Not used in this card or modal example, but available
  } = order;

  // const router = useRouter(); // No longer needed for navigation to details page

  const orderDate = new Date(createdAt);
  const formattedDate = orderDate.toLocaleDateString("en-GB", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
  const formattedTime = orderDate.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  const totalUniqueItems = items.length;
  const totalQuantityOfItems = items.reduce(
    (sum, item) => sum + item.quantity,
    0
  );
  const firstFewItemsForImagePreview = items.slice(0, 3);
  const firstFewItemsForTextPreview = items.slice(0, 2);

  return (
    <Card className="overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-200 w-full border border-border/60">
      <CardHeader className="border-b border-border/60">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
          <div>
            <CardTitle className="text-base sm:text-lg flex items-center">
              <Hash className="h-5 w-5 mr-1.5 text-primary flex-shrink-0" />
              Order ID:{" "}
              <span className="font-mono text-sm sm:text-base ml-1 tracking-tight truncate">
                {_id.slice(-10)}
              </span>
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm mt-1 flex items-center">
              <CalendarDays className="h-4 w-4 mr-1.5 text-muted-foreground flex-shrink-0" />
              {formattedDate}, {formattedTime}
            </CardDescription>
          </div>
          <Badge
            variant={getStatusBadgeVariant(orderStatus)}
            className="py-1.5 px-3 text-xs sm:text-sm w-fit sm:w-auto self-start sm:self-center capitalize"
          >
            {orderStatus === "Shipped" || orderStatus === "Delivered" ? (
              <Truck className="h-3.5 w-3.5 mr-1.5" />
            ) : orderStatus === "Pending" || orderStatus === "Confirmed" ? (
              <Package className="h-3.5 w-3.5 mr-1.5" />
            ) : null}
            {orderStatus}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-4 space-y-3">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div className="mb-3 sm:mb-0">
            <h4 className="text-sm font-medium text-muted-foreground flex items-center">
              {totalUniqueItems} product{totalUniqueItems > 1 ? "s" : ""}
            </h4>
            {items.length > 0 && (
              <div className="flex -space-x-3 overflow-hidden mt-2 items-center">
                {firstFewItemsForImagePreview.map((item) => (
                  <div
                    key={item._id}
                    className="inline-block h-10 w-10 sm:h-12 sm:w-12 ring-2 ring-background rounded-full overflow-hidden bg-muted border border-border/50"
                  >
                    {item.productId && item.productId.imageUrl ? (
                      <img
                        src={
                          item.productId.imageUrl.startsWith("/")
                            ? `${process.env.NEXT_PUBLIC_API}${item.productId.imageUrl}`
                            : item.productId.imageUrl
                        }
                        alt={item.productId.name || "Product image"}
                        width={48}
                        height={48}
                        className="object-cover h-full w-full"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-muted-foreground">
                        <ImageIcon size={18} />
                      </div>
                    )}
                  </div>
                ))}
                {items.length > firstFewItemsForImagePreview.length && (
                  <div className="flex items-center justify-center h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-muted/70 text-foreground text-xs sm:text-sm font-medium ring-2 ring-background border border-border/50 ml-1">
                    +{items.length - firstFewItemsForImagePreview.length}
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="text-left sm:text-right w-full sm:w-auto mt-3 sm:mt-0">
            <p className="text-xs text-muted-foreground">Total Amount</p>
            <p className="text-xl lg:text-2xl font-semibold text-primary">
              ₹ {totalAmount.toLocaleString()}
            </p>
          </div>
        </div>

        {firstFewItemsForTextPreview.length > 0 && (
          <>
            <Separator className="my-3 bg-border/60" />
            <div className="space-y-1.5">
              {firstFewItemsForTextPreview.map((item) => (
                <div
                  key={item._id}
                  className="text-sm text-foreground flex justify-between items-center"
                >
                  <span className="truncate max-w-[calc(100%-100px)]">
                    {item.productId.name || "Product details unavailable"}
                    <span className="text-muted-foreground text-xs">
                      {" "}
                      (Qty: {item.quantity} {item.productId.unit})
                    </span>
                  </span>
                  <span className="text-muted-foreground font-medium">
                    Tk{" "}
                    {(item.currentUnitPrice * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
              {items.length > firstFewItemsForTextPreview.length && (
                <p className="text-xs text-muted-foreground italic text-right">
                  & {items.length - firstFewItemsForTextPreview.length} more
                  item
                  {items.length - firstFewItemsForTextPreview.length > 1
                    ? "s"
                    : ""}
                  ...
                </p>
              )}
            </div>
          </>
        )}
      </CardContent>

      <CardFooter className="border-t border-border/60 flex justify-end">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="w-full sm:w-auto">
              <Eye className="h-4 w-4 mr-2" />
              View Order Details
              {/* <ChevronRight className="h-4 w-4 ml-1" /> // Optional: Keep if you like the style */}
            </Button>
          </DialogTrigger>
          <OrderDetail order={order} />
        </Dialog>
      </CardFooter>
    </Card>
  );
}
