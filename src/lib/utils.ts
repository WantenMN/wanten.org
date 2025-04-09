import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const capitalizeFirstAlpha = (str: string): string => {
  const firstAlphaIndex = str.search(/[a-zA-Z]/);
  if (firstAlphaIndex === -1) {
    return str;
  }
  return (
    str.slice(0, firstAlphaIndex) +
    str[firstAlphaIndex].toUpperCase() +
    str.slice(firstAlphaIndex + 1)
  );
};
