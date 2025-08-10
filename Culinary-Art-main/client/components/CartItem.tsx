// components/CartItem.tsx

import { Button } from "@/components/ui/button";
import {
  decreaseItemQuantity,
  deleteItem,
  increaseItemQuantity,
} from "@/reducers/cart/cartSlice";

import { CartItemType } from "@/lib/types";
import { Minus, Plus, Trash2 } from "lucide-react";
import React from "react";
import { useAppDispatch } from "@/lib/hooks";

type CartItemProps = {
  item: CartItemType;
};

const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const dispatch = useAppDispatch();

  return (
    <div className="grid grid-cols-[auto_1fr] py-4 border-b gap-4 last:border-b-0">
      {/* <div className="w-16 h-16 relative">
        <Image
          src={item.image}
          alt={item.name}
          fill
          className="object-cover rounded-md"
        />
      </div> */}

      <img
        src={item.imageUrl}
        alt={item.name}
        className="object-cover rounded-md w-16 h-16"
      />

      <div>
        <h3 className="font-semibold">{item.name}</h3>
        <p className="text-sm text-gray-500">
          ₹ {item.price} x {item.quantity}
        </p>
      </div>

      <div></div>

      <div className="flex items-center gap-2 ml-auto">
        <Button
          variant="outline"
          size="icon"
          onClick={() => dispatch(decreaseItemQuantity(item._id))}
        >
          <Minus className="h-4 w-4" />
        </Button>
        <span>{item.quantity}</span>
        <Button
          variant="outline"
          size="icon"
          onClick={() => dispatch(increaseItemQuantity(item._id))}
        >
          <Plus className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => dispatch(deleteItem(item._id))}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default CartItem;
