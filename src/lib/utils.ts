import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const degreesToRads = (deg: number) => (deg * Math.PI) / 180.0;
export const radsToDegrees = (rad: number) => (rad * 180.0) / Math.PI;
