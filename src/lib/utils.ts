import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// This is a standard 'cn' utility function for merging Tailwind classes.
export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));
