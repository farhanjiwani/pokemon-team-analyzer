import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Replaces the first character with it's uppercase if it is lowercase.
 * @param (string) str - string to modify
 * @returns (string) - No change if first char is not a lowercase letter.
 */
export const capitalizeFirst = (str = ""): string =>
  str[0] ? str.replace(/^[a-z]/, str[0].toUpperCase()) : str;

/**
 * CSS related cleanup tool. Uses clsx and wrapped with twMerge.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
