import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number, currencyCode: string = 'USD') {
  console.log('formatPrice called with:', { price, currencyCode });
  
  // Handle null/undefined values
  if (price === null || price === undefined || isNaN(price)) {
    return `${currencyCode || 'USD'} 0`;
  }

  // Handle very long currency codes
  const displayCode = currencyCode && currencyCode.length > 4 ? currencyCode.substring(0, 3) : (currencyCode || 'USD');

  // Always show full price without abbreviation
  const displayPrice = price.toLocaleString();

  const result = `${displayCode} ${displayPrice}`;
  console.log('formatPrice result:', result);
  return result;
}
