import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * cn
 * @description Function
 */
export function cn(...inputs: []): string {
  return twMerge(clsx(inputs));
}
