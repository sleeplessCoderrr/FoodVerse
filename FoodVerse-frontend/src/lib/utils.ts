import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format number as Indonesian Rupiah (IDR), always in thousands if value is small
export function formatIDR(amount: number) {
  // If the amount is less than 1000 and not 0, treat it as thousands (e.g. 15 => 15,000)
  let normalized = amount;
  if (amount > 0 && amount < 1000) {
    normalized = amount * 1000;
  }
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(normalized);
}