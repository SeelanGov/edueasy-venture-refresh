import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * cn
 * @description Function
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
