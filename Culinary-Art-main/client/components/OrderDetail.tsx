import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

// Assuming your Order type is defined here
import { AdminOrder, Order } from "@/lib/types";
import {
  ClipboardList, // Using HomeIcon for address
  CreditCard,
  DollarSign,
  HomeIcon,
  ImageIcon,
  Package,
  Phone,
  ShoppingCart,
  Truck,
} from "lucide-react";

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

export default function OrderDetail({ order }: { order: Order | AdminOrder }) {
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
    <DialogContent className="sm:max-w-2xl md:max-w-3xl max-h-[90vh] flex flex-col">
      <DialogHeader className="border-b pb-4">
        <DialogTitle className="text-xl flex items-center">
          <ClipboardList className="h-6 w-6 mr-2 text-primary" />
          Order Details
        </DialogTitle>
        <DialogDescription>
          Order ID: {_id} <br />
          Placed on: {formattedDate} at {formattedTime}
        </DialogDescription>
      </DialogHeader>

      <ScrollArea className="flex-grow overflow-y-auto pr-2 -mr-2">
        {" "}
        {/* Added padding for scrollbar */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 py-4 text-sm">
          {/* Shipping Details */}
          <div className="space-y-3 p-3 rounded-md border bg-muted/20">
            <h3 className="font-semibold text-md flex items-center mb-2">
              <Truck className="h-5 w-5 mr-2 text-primary" />
              Shipping Information
            </h3>
            {/* Optional: Display User Name if available via populated userId */}
            {/* {order.user && order.user.name && (
                    <div className="flex">
                        <User className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground"/>
                        <div>
                            <p className="text-muted-foreground text-xs">Name</p>
                            <p>{order.user.name}</p>
                        </div>
                    </div>
                  )} */}
            <div className="flex">
              <Phone className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
              <div>
                <p className="text-muted-foreground text-xs">Phone Number</p>
                <p>{phoneNumber}</p>
              </div>
            </div>
            <div className="flex">
              <HomeIcon className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
              <div>
                <p className="text-muted-foreground text-xs">
                  Delivery Address
                </p>
                <p className="break-words">{address}</p>
              </div>
            </div>
          </div>

          {/* Payment Details */}
          <div className="space-y-3 p-3 rounded-md border bg-muted/20">
            <h3 className="font-semibold text-md flex items-center mb-2">
              <CreditCard className="h-5 w-5 mr-2 text-primary" />
              Payment Information
            </h3>
            <div className="flex">
              <DollarSign className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
              <div>
                <p className="text-muted-foreground text-xs">Payment Method</p>
                <p>{paymentMethod}</p>
              </div>
            </div>
            <div className="flex">
              <Package className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
              <div>
                <p className="text-muted-foreground text-xs">Order Status</p>
                <Badge
                  variant={getStatusBadgeVariant(orderStatus)}
                  className="capitalize"
                >
                  {orderStatus}
                </Badge>
              </div>
            </div>
          </div>
        </div>
        {/* Itemized List */}
        <div className="mt-2">
          <h3 className="font-semibold text-md flex items-center mb-2">
            <ShoppingCart className="h-5 w-5 mr-2 text-primary" />
            Items Ordered ({totalQuantityOfItems})
          </h3>
          <div className="space-y-3 border rounded-md">
            {items.map((item, index) => (
              <div
                key={item._id}
                className={`flex items-center gap-3 p-3 ${
                  index < items.length - 1 ? "border-b" : ""
                }`}
              >
                <div className="w-16 h-16 rounded-md overflow-hidden bg-muted flex-shrink-0 border">
                  {item.productId && item.productId.imageUrl ? (
                    <img
                      src={
                        item.productId.imageUrl.startsWith("/")
                          ? `${process.env.NEXT_PUBLIC_API}${item.productId.imageUrl}`
                          : item.productId.imageUrl
                      }
                      alt={item.productId.name}
                      width={64}
                      height={64}
                      className="object-cover h-full w-full"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-muted-foreground">
                      <ImageIcon size={24} />
                    </div>
                  )}
                </div>
                <div className="flex-grow">
                  <p className="font-medium text-sm leading-tight">
                    {item.productId.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Price/{item.productId.unit}: Tk{" "}
                    {item.currentUnitPrice.toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Quantity: {item.quantity} {item.productId.unit}
                  </p>
                </div>
                <div className="text-sm font-medium text-right whitespace-nowrap">
                  Tk {(item.currentUnitPrice * item.quantity).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Order Summary in Modal */}
        <div className="mt-6 pt-4 border-t">
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal:</span>
              <span>Tk {subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Delivery Charge:</span>
              <span>Tk {deliveryCharge.toLocaleString()}</span>
            </div>
            <Separator className="my-1.5" />
            <div className="flex justify-between font-semibold text-base">
              <span>Total Amount:</span>
              <span className="text-primary">
                Tk {totalAmount.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </ScrollArea>

      <DialogFooter className="pt-4 border-t mt-auto">
        <DialogClose asChild>
          <Button variant="outline">Close</Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  );
}
