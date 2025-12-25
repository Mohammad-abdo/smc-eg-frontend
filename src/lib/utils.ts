import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Get full image URL from path or base64 string
 * Handles both file paths (/uploads/...) and base64 data URLs
 */
export function getImageUrl(image: string | null | undefined): string {
  if (!image) {
    console.log("getImageUrl: No image provided");
    return "";
  }

  // If it's a base64 data URL, return as is
  if (image.startsWith("data:image")) {
    console.log("getImageUrl: Base64 image detected");
    return image;
  }

  // If it's already a full URL (http:// or https://), return as is
  if (image.startsWith("http://") || image.startsWith("https://")) {
    console.log("getImageUrl: Full URL detected, returning as-is");
    return image;
  }

  // If it's a file path starting with /uploads/, prepend API base URL
  // Handle both with and without query parameters
  if (image.startsWith("/uploads/")) {
    const API_BASE_URL =
      import.meta.env.VITE_API_URL || "http://localhost:3000/api";
    // Remove /api from the end if present, then add the image path
    const baseUrl = API_BASE_URL.replace(/\/api$/, "");
    // Ensure baseUrl doesn't end with / and image doesn't start with /
    const cleanBaseUrl = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
    const cleanImagePath = image.startsWith("/") ? image : `/${image}`;
    const fullUrl = `${cleanBaseUrl}${cleanImagePath}`;
    console.log("getImageUrl: Constructed URL:", {
      image,
      API_BASE_URL,
      baseUrl: cleanBaseUrl,
      fullUrl,
      env: import.meta.env.VITE_API_URL,
    });
    return fullUrl;
  }

  // Return as is for other URLs
  console.log("getImageUrl: Returning image as-is:", image);
  return image;
}
