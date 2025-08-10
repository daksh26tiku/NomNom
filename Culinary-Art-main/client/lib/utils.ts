import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, parseISO } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function formatDate(dateString: string | Date): string {
  const date =
    typeof dateString === "string" ? parseISO(dateString) : dateString;
  return format(date, "dd MMM yyyy, HH:mm");
}
