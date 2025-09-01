// In-memory URL storage for demonstration purposes
// In production, this would be replaced with a database like Vercel KV, PostgreSQL, etc.

import { nanoid } from 'nanoid';

// Global store for URL mappings
const urlStore = new Map<string, string>();

/**
 * Generate a unique short code and store the URL mapping
 * @param longUrl - The original URL to shorten
 * @returns The generated short code
 */
export function addUrl(longUrl: string): string {
  // Generate a 7-character short code
  const shortCode = nanoid(7);
  
  // Store the mapping
  urlStore.set(shortCode, longUrl);
  
  return shortCode;
}

/**
 * Retrieve the original URL for a given short code
 * @param code - The short code to lookup
 * @returns The original URL or undefined if not found
 */
export function getUrl(code: string): string | undefined {
  return urlStore.get(code);
}

/**
 * Get all stored URLs (for debugging/admin purposes)
 * @returns Array of all stored URL mappings
 */
export function getAllUrls(): Array<{ code: string; url: string }> {
  return Array.from(urlStore.entries()).map(([code, url]) => ({ code, url }));
}

/**
 * Clear all stored URLs (for testing purposes)
 */
export function clearStore(): void {
  urlStore.clear();
}

/**
 * Get the total count of stored URLs
 * @returns Number of stored URLs
 */
export function getUrlCount(): number {
  return urlStore.size;
}