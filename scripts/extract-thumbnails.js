#!/usr/bin/env node

import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = join(__dirname, '..');
const BLOG_DIR = join(ROOT_DIR, 'src/content/blog');
const TRANSLATE_DIR = join(BLOG_DIR, 'translate');

/**
 * Extract the first image URL from markdown content
 */
function extractFirstImage(content) {
  // Regular expressions to match different image formats
  const patterns = [
    /!\[.*?\]\(([^)]+)\)/, // Standard markdown: ![alt](url)
    /<img[^>]+src=["']([^"']+)["'][^>]*>/i, // HTML img tags
    /\[.*?\]:\s*([^\s]+)/m // Reference style: [1]: url
  ];
  
  for (const pattern of patterns) {
    const match = content.match(pattern);
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

/**
 * Parse frontmatter and content from markdown file
 */
function parseMarkdown(content) {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
  const match = content.match(frontmatterRegex);
  
  if (!match) {
    throw new Error('Invalid markdown format - frontmatter not found');
  }
  
  const frontmatter = match[1];
  const body = match[2];
  
  return { frontmatter, body };
}

/**
 * Update frontmatter with thumbnail if not already present
 */
function updateFrontmatter(frontmatter, thumbnail) {
  // Check if thumbnail already exists
  if (frontmatter.includes('thumbnail:')) {
    console.log('  ✓ Thumbnail already exists, skipping');
    return frontmatter;
  }
  
  // Add thumbnail after the last frontmatter field
  const lines = frontmatter.split('\n');
  const lastLineIndex = lines.length - 1;
  
  // Insert thumbnail before the last empty line (if any)
  if (lines[lastLineIndex].trim() === '') {
    lines.splice(lastLineIndex, 0, `thumbnail: '${thumbnail}'`);
  } else {
    lines.push(`thumbnail: '${thumbnail}'`);
  }
  
  return lines.join('\n');
}

/**
 * Process a single markdown file
 */
function processMarkdownFile(filePath) {
  console.log(`Processing: ${filePath}`);
  
  try {
    const content = readFileSync(filePath, 'utf-8');
    const { frontmatter, body } = parseMarkdown(content);
    
    // Extract first image from body
    const thumbnail = extractFirstImage(body);
    
    if (!thumbnail) {
      console.log('  ⚠ No image found, skipping');
      return;
    }
    
    console.log(`  📸 Found image: ${thumbnail}`);
    
    // Update frontmatter
    const updatedFrontmatter = updateFrontmatter(frontmatter, thumbnail);
    
    // Only write if frontmatter was actually updated
    if (updatedFrontmatter !== frontmatter) {
      const updatedContent = `---\n${updatedFrontmatter}\n---\n${body}`;
      writeFileSync(filePath, updatedContent, 'utf-8');
      console.log('  ✅ Updated frontmatter with thumbnail');
    }
    
  } catch (error) {
    console.error(`  ❌ Error processing ${filePath}:`, error.message);
  }
}

/**
 * Process all markdown files in a directory
 */
function processDirectory(dirPath, pattern = /\.md$/) {
  console.log(`\n📁 Processing directory: ${dirPath}`);
  
  try {
    const files = readdirSync(dirPath);
    const markdownFiles = files.filter(file => pattern.test(file));
    
    console.log(`Found ${markdownFiles.length} markdown files`);
    
    markdownFiles.forEach(file => {
      const filePath = join(dirPath, file);
      processMarkdownFile(filePath);
    });
    
  } catch (error) {
    console.error(`❌ Error reading directory ${dirPath}:`, error.message);
  }
}

/**
 * Main execution
 */
function main() {
  console.log('🔍 Extracting thumbnails from markdown files...\n');
  
  // Process Korean blog posts
  processDirectory(BLOG_DIR, /^[^.]*\.md$/); // Only .md files, not .en.md or .ja.md
  
  // Process English translations
  processDirectory(TRANSLATE_DIR, /\.en\.md$/);
  
  // Process Japanese translations  
  processDirectory(TRANSLATE_DIR, /\.ja\.md$/);
  
  console.log('\n✨ Thumbnail extraction completed!');
}

// Run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { extractFirstImage, processMarkdownFile };