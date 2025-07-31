import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * cn
 * @description Function
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
