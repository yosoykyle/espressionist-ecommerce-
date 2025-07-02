//Purpose: Utility function to merge class names using clsx and tailwind-merge
// This function takes any number of class names as input and merges them into a single string.

import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
