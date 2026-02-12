/**
 * Replaces the first character with it's uppercase if it is lowercase.
 * @param (string) str - string to modify
 * @returns (string) - No change if first char is not a lowercase letter.
 */
export const capitalizeFirst = (str = ""): string =>
  str[0] ? str.replace(/^[a-z]/, str[0].toUpperCase()) : str;
