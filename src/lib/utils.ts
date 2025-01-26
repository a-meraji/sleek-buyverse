import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatParameters(parameters: Record<string, string | number>): string {
  return Object.entries(parameters)
    .map(([key, value]) => `${key}: ${value}`)
    .join(', ');
}