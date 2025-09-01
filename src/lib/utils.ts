import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number, currencyCode: string = 'USD') {
  // Handle very long currency codes
  const displayCode = currencyCode.length > 4 ? currencyCode.substring(0, 3) : currencyCode;

  // Format large prices with K suffix for better UX
  let displayPrice: string;
  if (price >= 1000) {
    const kValue = (price / 1000).toFixed(1);
    // Remove .0 if it's a whole number
    displayPrice = kValue.endsWith('.0') ? kValue.slice(0, -2) + 'K' : kValue + 'K';
  } else {
    displayPrice = price.toLocaleString();
  }

  return `${displayCode} ${displayPrice}`;
}
