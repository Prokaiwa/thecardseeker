import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility function to merge Tailwind CSS classes with proper precedence
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format price for display
 */
export function formatPrice(price: number | null | undefined): string {
  if (price === null || price === undefined) return 'N/A';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
}

/**
 * Format date for display
 */
export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date));
}

/**
 * Debounce function for search inputs
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Capitalize first letter of each word
 */
export function titleCase(str: string): string {
  return str
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Get energy type color class
 */
export function getEnergyColorClass(type: string): string {
  const typeMap: Record<string, string> = {
    fire: 'bg-pokemon-fire',
    water: 'bg-pokemon-water',
    grass: 'bg-pokemon-grass',
    electric: 'bg-pokemon-electric',
    psychic: 'bg-pokemon-psychic',
    fighting: 'bg-pokemon-fighting',
    dark: 'bg-pokemon-dark',
    steel: 'bg-pokemon-steel',
    fairy: 'bg-pokemon-fairy',
    dragon: 'bg-pokemon-dragon',
    colorless: 'bg-pokemon-colorless',
    normal: 'bg-pokemon-normal',
  };

  return typeMap[type.toLowerCase()] || 'bg-pokemon-colorless';
}
