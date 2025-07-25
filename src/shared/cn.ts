import { twMerge } from 'tailwind-merge';
import { clsx, type ClassValue } from 'clsx';

/**
 * A utility function that merges multiple class values into a single string.
 * It combines the functionality of clsx and tailwind-merge to handle
 * conditional classes and properly merge Tailwind CSS classes.
 *
 * @param inputs - List of class values to merge
 * @returns A string of merged classesr
 */
export function cn(...inputs: ClassValue[]): string {
    return twMerge(clsx(inputs));
}