"use client";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Cookies from "js-cookie";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

import { UserInfo } from "@/lib/types";
import {
  clearCart,
  getCartItems,
  getCurrentDeliveryCharge,
  getSubtotalCartPrice,
  getTotalCartPrice,
  getTotalOrderPrice,
} from "@/reducers/cart/cartSlice";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertCircle,
  CreditCard,
  Home,
  Loader2,
  Mail,
  Phone,
  ShoppingBag,
  UserCircle,
} from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";

// Zod schema for form validation
const checkoutFormSchema = z.object({
  phoneNumber: z
    .string()
    .min(10, { message: "Phone number must be at least 10 digits." })
    .regex(/^(?:\+?88)?01[3-9]\d{8}$/, {
      message: "Please enter a valid Bangladeshi phone number.",
    }),
  address: z
    .string()
    .min(10, { message: "Address must be at least 10 characters long." })
    .max(200, { message: "Address cannot exceed 200 characters." }),
});

type CheckoutFormValues = z.infer<typeof checkoutFormSchema>;

export default function Checkout({ user }: { user: UserInfo }) {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector(getCartItems);
  const subtotal = useAppSelector(getSubtotalCartPrice);
  const deliveryCharge = useAppSelector(getCurrentDeliveryCharge);
  const totalPrice = useAppSelector(getTotalOrderPrice);
  const router = useRouter();

  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      phoneNumber: "",
      address: "",
    },
  });

  const handlePlaceOrder = async (data: CheckoutFormValues) => {
    const orderDetails = {
      phoneNumber: data.phoneNumber,
      address: data.address,
      items: cartItems.map((item) => ({
        productId: item._id,
        quantity: item.quantity,
        currentUnitPrice: item.price,
      })),
      subtotal,
      deliveryCharge,
      totalAmount: totalPrice,
      paymentMethod: "Cash on Delivery",
      orderStatus: "Pending",
    };

    try {
      setIsPlacingOrder(true);
      const token = Cookies.get("session");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_PREFIX}/orders/create-order`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...orderDetails,
          }),
        }
      );

      const data = await res.json();
      if (data.success) {
        setIsPlacingOrder(false);
        toast.success("Success", {
          description: "Order is placed successfully",
        });

        dispatch(clearCart());
        router.push("/user/order-history");
      } else {
        toast.error("Error", {
          description: data.message,
        });
        return;
      }
    } catch (error) {
      toast.error("Error", {
        description: (error as Error).message,
      });
      setOrderError(
        (error as Error).message ||
          "An unexpected error occurred while placing your order."
      );
    } finally {
      setIsPlacingOrder(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen text-center">
        <ShoppingBag className="h-16 w-16 text-muted-foreground mb-6" />
        <h1 className="text-2xl font-semibold mb-2">Your Cart is Empty</h1>
        <p className="text-muted-foreground mb-6">
          Add some products to your cart before proceeding to checkout.
        </p>
        <Button onClick={() => router.push("/shop")}>Continue Shopping</Button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-28">
      <Card className="shadow-lg border-border/60">
        <CardHeader className="border-b border-border/60">
          <CardTitle className="text-2xl md:text-3xl font-semibold tracking-tight">
            Checkout
          </CardTitle>
          <CardDescription>
            Please review your order and provide your delivery information.
          </CardDescription>
        </CardHeader>

        <Form {...form}>
          {" "}
          {/* Form provider from react-hook-form */}
          <form onSubmit={form.handleSubmit(handlePlaceOrder)}>
            <CardContent>
              <div className="grid md:grid-cols-5 gap-6 lg:gap-8">
                {/* Left Column: User Info, Shipping, Payment */}
                <div className="md:col-span-3 space-y-6">
                  <Card className="border-border/60">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center">
                        <UserCircle className="mr-2 h-5 w-5 text-primary" />
                        Your Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      <div className="flex items-center">
                        <UserCircle className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">Name:</span>
                        <span className="ml-2">{user.fullName}</span>
                      </div>
                      <div className="flex items-center">
                        <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">Email:</span>
                        <span className="ml-2">{user.email}</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-border/60">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center">
                        <Home className="mr-2 h-5 w-5 text-primary" />
                        Delivery Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <FormField
                        control={form.control}
                        name="phoneNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center text-sm">
                              <Phone className="mr-2 h-4 w-4" /> Phone Number
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="e.g., 01XXXXXXXXX"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center text-sm">
                              <Home className="mr-2 h-4 w-4" /> Full Delivery
                              Address
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="e.g., House 123, Road 4, Block B, Bashundhara R/A, Dhaka"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>

                  <Card className="border-border/60">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center">
                        <CreditCard className="mr-2 h-5 w-5 text-primary" />
                        Payment Method
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="font-semibold">Cash on Delivery</p>
                      <p className="text-sm text-muted-foreground">
                        Pay with cash upon receiving your order.
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Right Column: Order Summary */}
                <div className="md:col-span-2 space-y-6">
                  <Card className="sticky top-24 border-border/60 shadow-md">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-lg flex items-center">
                        <ShoppingBag className="mr-2 h-5 w-5 text-primary" />
                        Order Summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <ScrollArea className="h-72 pr-3 -mr-3 mb-2">
                        {cartItems.map((item) => (
                          <div
                            key={item._id}
                            className="flex items-start justify-between py-2.5 border-b border-border/40 last:border-b-0"
                          >
                            <div className="flex items-start space-x-3">
                              {item.imageUrl ? (
                                <img
                                  src={item.imageUrl}
                                  alt={item.name}
                                  width={48}
                                  height={48}
                                  className="rounded-md object-cover aspect-square border border-border/40"
                                />
                              ) : (
                                <div className="w-12 h-12 bg-muted rounded-md flex items-center justify-center text-muted-foreground">
                                  <ShoppingBag size={20} />
                                </div>
                              )}
                              <div>
                                <p className="font-medium text-sm leading-tight">
                                  {item.name}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  Qty: {`${item.quantity} x ${item.unit}`}
                                </p>
                              </div>
                            </div>
                            <p className="font-medium text-sm whitespace-nowrap place-self-end">
                              ₹ {(item.price * item.quantity).toLocaleString()}
                            </p>
                          </div>
                        ))}
                      </ScrollArea>
                      <Separator className="my-3 bg-border/60" />
                      <div className="space-y-1.5 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Subtotal:
                          </span>
                          <span>₹ {subtotal.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Delivery:
                          </span>
                          <span>₹ {deliveryCharge.toLocaleString()}</span>
                        </div>
                        <Separator className="my-2 bg-border/60" />
                        <div className="flex justify-between font-semibold text-base">
                          <span>Total Amount:</span>
                          <span>₹ {totalPrice.toLocaleString()}</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="mt-4">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            type="button" // Important: type="button" to prevent form submission here
                            className="w-full"
                            size={"lg"}
                            disabled={
                              isPlacingOrder ||
                              !form.formState.isValid ||
                              cartItems.length === 0
                            }
                          >
                            {isPlacingOrder ? (
                              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            ) : (
                              <CreditCard className="mr-2 h-5 w-5" />
                            )}
                            {isPlacingOrder
                              ? "Processing..."
                              : "Confirm & Place Order"}
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Confirm Your Order
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              You are about to place an order with Cash on
                              Delivery. <br />
                              Total amount due:{" "}
                              <span className="font-bold">
                                ₹ {totalPrice.toLocaleString()}
                              </span>
                              . <br />
                              Please ensure your address and phone number are
                              correct.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel disabled={isPlacingOrder}>
                              Review Order
                            </AlertDialogCancel>

                            <Button
                              type="submit"
                              disabled={isPlacingOrder}
                              onClick={() => {
                                form.trigger();
                              }}
                              asChild
                            >
                              <AlertDialogAction
                                disabled={isPlacingOrder}
                                onClick={form.handleSubmit(handlePlaceOrder)}
                              >
                                {isPlacingOrder && (
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                )}
                                Yes, Place Order
                              </AlertDialogAction>
                            </Button>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </CardFooter>
                    {orderError && (
                      <Alert variant="destructive" className="mt-4 mx-6 mb-2">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Order Error</AlertTitle>
                        <AlertDescription>{orderError}</AlertDescription>
                      </Alert>
                    )}
                  </Card>
                </div>
              </div>
            </CardContent>
          </form>
        </Form>
      </Card>
    </div>
  );
}
