// components/OrderCard.tsx
"use client";

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
import { AdminOrder, Order } from "@/lib/types";
import Cookies from "js-cookie";
import {
  CalendarDays,
  Eye, // Will be removed from button, but kept for reference
  Hash,
  ImageIcon,
  Package,
  Printer,
  Truck,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import OrderDetail from "./OrderDetail";
// import {
//   Printer as ThermalPrinter,
//   Text,
//   Row,
//   render,
// } from "react-thermal-printer";
// import { saveAs } from "file-saver";
import jsPDF from "jspdf";
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

export default function AdminOrderCard({ order }: { order: AdminOrder }) {
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
  const [isLoading, setIsLoading] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);

  // const handlePrintBill = async () => {
  //   try {
  //     setIsPrinting(true);

  //     const receiptData = (
  //       <ThermalPrinter type="epson" width={48}>
  //         {/* Header */}
  //         <Text size={{ width: 2, height: 2 }} align="center" bold>
  //           CULINARY ART
  //         </Text>
  //         <Text align="center">Order Receipt</Text>
  //         <Text>--------------------------------</Text>

  //         {/* Order Info */}
  //         <Row left={`Order ID`} right={`${_id.slice(-10)}`} />
  //         <Row left={`Date`} right={`${formattedDate}`} />
  //         <Row left={`Time`} right={`${formattedTime}`} />
  //         <Row left={`Status`} right={`${orderStatus}`} />
  //         <Text>--------------------------------</Text>

  //         {/* Customer Info */}
  //         <Text bold>Customer Details:</Text>
  //         <Row left={`Phone number`} right={`${phoneNumber}`} />
  //         <Text>{`Address: ${address}`}</Text>
  //         <Text>--------------------------------</Text>

  //         {/* Items */}
  //         <Text bold>Order Items:</Text>
  //         {items.map((item, index) => (
  //           <div key={item._id}>
  //             <Row
  //               left={`${index + 1}. ${item.productId.name || "Product"}`}
  //               right={""}
  //             />
  //             <Row
  //               left={`   Qty: ${item.quantity} ${item.productId.unit}`}
  //               right={`Tk ${(
  //                 item.currentUnitPrice * item.quantity
  //               ).toLocaleString()}`}
  //             />
  //           </div>
  //         ))}
  //         <Text>--------------------------------</Text>

  //         {/* Totals */}
  //         <Row left="Subtotal:" right={`Tk ${subtotal.toLocaleString()}`} />
  //         <Row
  //           left="Delivery:"
  //           right={`Tk ${deliveryCharge.toLocaleString()}`}
  //         />
  //         <Text>--------------------------------</Text>
  //         <Row
  //           left={<Text bold>TOTAL</Text>}
  //           right={<Text bold>Tk {totalAmount.toLocaleString()}</Text>}
  //         />
  //         <Text>--------------------------------</Text>

  //         {/* Payment Method */}
  //         <Row
  //           left={`Payment type`}
  //           right={<Text bold>{paymentMethod}</Text>}
  //         />
  //         <Text>--------------------------------</Text>

  //         {/* Footer */}
  //         <Text align="center">Thank you for your order!</Text>
  //         <Text align="center">Visit again soon</Text>
  //         <Text></Text>
  //         <Text></Text>
  //       </ThermalPrinter>
  //     );

  //     // Generate the buffer
  //     const buffer = await render(receiptData);

  //     // Create blob and download
  //     const blob = new Blob([buffer], { type: "application/octet-stream" });
  //     saveAs(blob, `order-${_id.slice(-10)}.bin`);

  //     toast.success("Success", {
  //       description: "Receipt generated successfully!",
  //     });
  //   } catch (error) {
  //     console.error("Print error:", error);
  //     toast.error("Error", {
  //       description: "Failed to generate receipt",
  //     });
  //   } finally {
  //     setIsPrinting(false);
  //   }
  // };

  // Replace the handlePrintBill function
  const handlePrintBill = async () => {
    try {
      setIsPrinting(true);

      // Create PDF with thermal receipt dimensions (4 inches wide)
      // 1 inch = 72 points, so 4 inches = 288 points
      const doc = new jsPDF({
        unit: "pt",
        format: [288, 600], // 4 inches wide, 8.33 inches tall (will auto-extend)
        orientation: "portrait",
      });

      // Use monospace font for receipt look
      doc.setFont("courier", "normal");

      let yPos = 30;
      const pageWidth = 288;
      const margin = 20;
      const contentWidth = pageWidth - margin * 2;

      // Helper function to center text
      const centerText = (text: string, y: number, size = 10) => {
        doc.setFontSize(size);
        const textWidth = doc.getTextWidth(text);
        const x = (pageWidth - textWidth) / 2;
        doc.text(text, x, y);
      };

      // Helper function for receipt line
      const addLine = (y: number, char = "-") => {
        const lineText = char.repeat(52);
        doc.setFontSize(8);
        doc.text(lineText, margin, y);
        return y + 12;
      };

      // Header
      doc.setFont("courier", "bold");
      centerText("CULINARY ART", yPos, 14);
      yPos += 20;

      doc.setFont("courier", "normal");
      centerText("Order Receipt", yPos, 10);
      yPos += 15;

      yPos = addLine(yPos);

      // Order Information
      doc.setFontSize(8);
      doc.text(`Order ID: ${_id.slice(-10)}`, margin, yPos);
      yPos += 12;

      doc.text(`Date: ${formattedDate}`, margin, yPos);
      yPos += 12;

      doc.text(`Time: ${formattedTime}`, margin, yPos);
      yPos += 12;

      doc.text(`Status: ${orderStatus}`, margin, yPos);
      yPos += 15;

      yPos = addLine(yPos);

      // Customer Details
      doc.setFont("courier", "bold");
      doc.text("Customer Details:", margin, yPos);
      yPos += 12;

      doc.setFont("courier", "normal");
      doc.text(`Phone: ${phoneNumber}`, margin, yPos);
      yPos += 12;

      // Handle long addresses by wrapping
      const maxCharsPerLine = 28;
      const addressText = `Address: ${address}`;
      if (addressText.length > maxCharsPerLine) {
        const words = addressText.split(" ");
        let currentLine = "";
        const lines = [];

        words.forEach((word) => {
          if ((currentLine + word).length <= maxCharsPerLine) {
            currentLine += (currentLine ? " " : "") + word;
          } else {
            if (currentLine) lines.push(currentLine);
            currentLine = word;
          }
        });
        if (currentLine) lines.push(currentLine);

        lines.forEach((line) => {
          doc.text(line, margin, yPos);
          yPos += 12;
        });
      } else {
        doc.text(addressText, margin, yPos);
        yPos += 12;
      }

      yPos += 5;
      yPos = addLine(yPos);

      // Items Header
      doc.setFont("courier", "bold");
      doc.text("Order Items:", margin, yPos);
      yPos += 15;

      // Items
      doc.setFont("courier", "normal");
      items.forEach((item, index) => {
        // Check if we need more space
        if (yPos > 550) {
          doc.addPage();
          yPos = 30;
        }

        // Item name (truncate if too long)
        const itemName = item.productId.name || "Product";
        const truncatedName =
          itemName.length > 26 ? itemName.substring(0, 23) + "..." : itemName;

        doc.text(`${index + 1}. ${truncatedName}`, margin, yPos);
        yPos += 12;

        // Quantity and price on same line
        const qtyText = `   ${item.quantity} ${item.productId.unit}`;
        const priceText = `Tk ${(
          item.currentUnitPrice * item.quantity
        ).toLocaleString()}`;

        doc.text(qtyText, margin, yPos);

        // Right align price
        const priceWidth = doc.getTextWidth(priceText);
        doc.text(priceText, pageWidth - margin - priceWidth, yPos);
        yPos += 15;
      });

      yPos = addLine(yPos);

      // Totals
      const addTotal = (label: string, amount: number, bold = false) => {
        if (bold) doc.setFont("courier", "bold");
        else doc.setFont("courier", "normal");

        const labelText = label;
        const amountText = `Tk ${amount.toLocaleString()}`;

        doc.text(labelText, margin, yPos);
        const amountWidth = doc.getTextWidth(amountText);
        doc.text(amountText, pageWidth - margin - amountWidth, yPos);
        yPos += 12;
      };

      addTotal("Subtotal:", subtotal);
      addTotal("Delivery:", deliveryCharge);

      yPos = addLine(yPos, "=");

      addTotal("TOTAL:", totalAmount, true);

      yPos = addLine(yPos, "=");

      // Payment Method
      doc.setFont("courier", "normal");
      doc.text(`Payment: ${paymentMethod}`, margin, yPos);
      yPos += 15;

      yPos = addLine(yPos);

      // Footer
      yPos += 10;
      centerText("Thank you for your order!", yPos, 9);
      yPos += 15;
      centerText("Visit again soon!", yPos, 9);
      yPos += 20;

      // Add some bottom spacing
      yPos += 30;

      // Instead of saving, open print dialog
      const pdfBlob = doc.output("blob");
      const pdfUrl = URL.createObjectURL(pdfBlob);

      // Create a new window with the PDF
      const printWindow = window.open(pdfUrl, "_blank");

      if (printWindow) {
        printWindow.onload = () => {
          // Trigger print dialog after PDF loads
          printWindow.print();

          // Clean up the URL after a delay
          setTimeout(() => {
            URL.revokeObjectURL(pdfUrl);
          }, 1000);
        };
      } else {
        // Fallback: download the PDF if popup is blocked
        const link = document.createElement("a");
        link.href = pdfUrl;
        link.download = `receipt-${_id.slice(-10)}.pdf`;
        link.click();
        URL.revokeObjectURL(pdfUrl);
      }

      toast.success("Success", {
        description: "Receipt ready for printing!",
      });
    } catch (error) {
      console.error("Print error:", error);
      toast.error("Error", {
        description: "Failed to generate receipt PDF",
      });
    } finally {
      setIsPrinting(false);
    }
  };

  const router = useRouter();
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

  const handleUpdateOrder = async (status: Order["orderStatus"]) => {
    const token = Cookies.get("session");
    if (!token) {
      toast("Failed", {
        description: "Please sign in to like this recipe",
      });

      return;
    }

    try {
      setIsLoading(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_PREFIX}/orders/update-order`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            orderId: order._id,
            status: status,
          }),
        }
      );
      const data = await res.json();
      if (data.success) router.refresh();
      else {
        toast.error("Error", {
          description: data.message,
        });
      }
    } catch (error) {
      toast.error("Error", {
        description: (error as Error).message,
      });
    } finally {
      setIsLoading(false);
    }
  };

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
                        src={item.productId.imageUrl}
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
              Tk {totalAmount.toLocaleString()}
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

      <CardFooter className="items-stretch border-t border-border/60 flex flex-col gap-2 lg:flex-row lg:justify-between">
        <div className="flex flex-col lg:flex-row gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Eye className="h-4 w-4 mr-1" />
                View Order Details
                {/* <ChevronRight className="h-4 w-4 ml-1" />  */}
              </Button>
            </DialogTrigger>

            <OrderDetail order={order} />
          </Dialog>

          <Button disabled={isPrinting} onClick={handlePrintBill}>
            <Printer className="h-4 w-4 mr-1" />
            Print bill
          </Button>
        </div>

        {order.orderStatus === "Pending" && (
          <div className="grid grid-cols-2 gap-2">
            <Button
              disabled={isLoading}
              onClick={() => handleUpdateOrder("Confirmed")}
            >
              Confirm
            </Button>
            <Button
              variant={"destructive"}
              disabled={isLoading}
              onClick={() => handleUpdateOrder("Cancelled")}
            >
              Cancel
            </Button>
          </div>
        )}

        {order.orderStatus === "Confirmed" && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline">Update Status</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will update the order
                  status to <span className="text-primary">Shipped</span>.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={isLoading}>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  disabled={isLoading}
                  onClick={() => handleUpdateOrder("Shipped")}
                >
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}

        {order.orderStatus === "Shipped" && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline">Update Status</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will update the order
                  status to <span className="text-primary">Delivered</span>.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={isLoading}>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  disabled={isLoading}
                  onClick={() => handleUpdateOrder("Delivered")}
                >
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </CardFooter>
    </Card>
  );
}
