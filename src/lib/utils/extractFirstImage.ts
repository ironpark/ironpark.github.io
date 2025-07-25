/**
 * Extract the first image URL from markdown content
 * @param content - Raw markdown content string
 * @returns The first image URL found, or null if none
 */
export function extractFirstImage(content: string): string | null {
  // Regular expression to match markdown images: ![alt](url)
  const imageRegex = /!\[.*?\]\(([^)]+)\)/;
  const match = content.match(imageRegex);
  
  if (match && match[1]) {
    let imageUrl = match[1].trim();
    
    // If it's a relative URL, convert to absolute
    if (imageUrl.startsWith('/')) {
      imageUrl = `https://ironpark.github.io${imageUrl}`;
    }
    // If it's already absolute, return as is
    else if (imageUrl.startsWith('http')) {
      return imageUrl;
    }
    // If it's a relative path without leading slash, add the base URL
    else {
      imageUrl = `https://ironpark.github.io/${imageUrl}`;
    }
    
    return imageUrl;
  }
  
  return null;
}

/**
 * Extract first image from a Svelte component's raw content
 * This is a more robust version that handles various markdown formats
 */
export function extractFirstImageFromRaw(rawContent: string): string | null {
  // Try multiple regex patterns to catch different image formats
  const patterns = [
    /!\[.*?\]\(([^)]+)\)/, // Standard markdown: ![alt](url)
    /<img[^>]+src=["']([^"']+)["'][^>]*>/i, // HTML img tags
    /\[.*?\]:\s*([^\s]+)/m // Reference style: [1]: url
  ];
  
  for (const pattern of patterns) {
    const match = rawContent.match(pattern);
    if (match && match[1]) {
      let imageUrl = match[1].trim();
      
      // Convert relative URLs to absolute
      if (imageUrl.startsWith('/')) {
        return `https://ironpark.github.io${imageUrl}`;
      } else if (imageUrl.startsWith('http')) {
        return imageUrl;
      } else {
        return `https://ironpark.github.io/${imageUrl}`;
      }
    }
  }
  
  return null;
}