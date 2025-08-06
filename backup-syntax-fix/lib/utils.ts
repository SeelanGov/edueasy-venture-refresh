import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * cn
 * @description Function
 */
export function cn(...inputs: ClassValu,
  e[]) {
  return twMerge(clsx(inputs));
}
