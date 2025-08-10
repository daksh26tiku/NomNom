export type Recipe = {
  _id: string;
  name: string;
  category: string;
  keywords: string[];
  time: string;
  servings: number;
  difficulty: "Easy" | "Medium" | "Hard";
  imageUrl: string;
  likesCount: number;
  comments: Comment[];
  instructions: string[];
  ingredients: Ingredient[];
  createdBy: string;
  isPopular: boolean;
  likedUsers: string[];
};

export type Ingredient = {
  name?: string | undefined;
  quantity?: string | undefined;
};

export type UserSessionInfo = {
  id: string;
  role: "customer" | "admin";
  fullName: string;
  imageUrl: string;
};

export type UserAccountInfo = {
  fullName: string;
  imageUrl: string;
  bio: string;
  bookmarks: string[];
};

export type UserInfo = {
  _id: string;
  fullName: string;
  email: string;
  imageUrl: string;
  bio: string;
  role: string;
  bookmarks: string[];
  userLikeCount: number;
  creditPoints: number;
};

export type createdBy = {
  _id: string;
  fullName: string;
  imageUrl: string;
};

export type Comment = {
  commentedBy: createdBy;
  comment: string;
  _id: string;
  createdAt: string;
};

export type RecipePublicView = {
  _id: string;
  name: string;
  category: string;
  keywords: string[];
  time: string;
  servings: number;
  difficulty: "Easy" | "Medium" | "Hard";
  imageUrl: string;
  likesCount: number;
  comments: Comment[];
  instructions: string[];
  ingredients: Ingredient[];
  createdBy: createdBy;
  isPopular: boolean;
  likedUsers: string[];
};

export type Product = {
  _id: string;
  name: string;
  description: string;
  price: number;
  quantityInStock: number;
  category: string;
  imageUrl: string;
  unit: string;
};

type OrderItemWithProductDetails = {
  _id: string;
  productId: Product;
  quantity: number;
  currentUnitPrice: number;
};

export type Order = {
  _id: string;
  userId: string;
  phoneNumber: string;
  address: string;
  items: OrderItemWithProductDetails[];
  subtotal: number;
  deliveryCharge: number;
  totalAmount: number;
  paymentMethod: string;
  orderStatus: "Pending" | "Confirmed" | "Shipped" | "Delivered" | "Cancelled";
  createdAt: string | Date; // ISO string or Date object
  updatedAt: string | Date; // From your data
};

export type AdminOrder = {
  _id: string;
  userId: createdBy;
  phoneNumber: string;
  address: string;
  items: OrderItemWithProductDetails[];
  subtotal: number;
  deliveryCharge: number;
  totalAmount: number;
  paymentMethod: string;
  orderStatus: "Pending" | "Confirmed" | "Shipped" | "Delivered" | "Cancelled";
  createdAt: string | Date; // ISO string or Date object
  updatedAt: string | Date; // From your data
};

//for redux
export type CartItemType = Product & {
  quantity: number;
};

export type Cart = {
  items: CartItemType[];
  deliveryCharge: number;
};

export type CartInfoState = {
  cart: Cart;
};

export type GlobalStoreState = {
  cart: CartInfoState;
};
