import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export function transformToSlug(input: string): string {
  return input.toLowerCase().replace(/\s+/g, '-')
}