import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * cn
 * @description Function
 */
export function cn(...inputs: ClassValue[]): void {
  return twMerge(clsx(inputs));
}
