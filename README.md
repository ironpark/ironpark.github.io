# ironpark.github.io Blog Preprocessor

A TypeScript-based blog preprocessing system that automatically translates markdown posts and prepares content for a multilingual blog before publishing.

## Features

- **Automatic Translation**: Translates blog posts from Korean to English and Japanese using OpenAI GPT-4
- **Mermaid Diagram Support**: Converts Mermaid code blocks to SVG images
- **WikiLink Processing**: Converts WikiLinks to standard markdown links
- **Image Asset Management**: Automatically copies and organizes images from assets to output directory
- **Caching System**: Caches translations to avoid redundant API calls
- **Multi-language Support**: Generates posts in Korean, English, and Japanese

## Project Structure

```
.
├── posts/              # Original Korean markdown posts
├── assets/             # Original image assets
├── output/             # Processed output
│   ├── posts/          # Translated markdown files
│   └── static/posts/   # Processed images and diagrams
├── lib/                # Core library modules
│   ├── cache.ts        # Caching system
│   ├── md.ts           # Markdown processing
│   ├── trans.ts        # Translation utilities
│   └── utils.ts        # Utility functions
├── processors.ts       # Content processors (mermaid, wikilink, images)
└── main.ts             # Main application entry point
```
## Installation

```bash
# Install dependencies
pnpm install
```

## Usage

```bash
# Build and process posts
pnpm run build
# Compile TypeScript only
pnpm run compile
```

## How It Works
1. **Read Posts**: Reads markdown posts from the `posts/` directory
2. **Translation**: 
   - Extracts metadata and content
   - Translates metadata and content to target languages (ko, en, ja)
   - Uses caching to avoid redundant translations
3. **Processing**:
   - Converts Mermaid diagrams to SVG
   - Processes WikiLinks to markdown links
   - Copies and organizes image assets
4. **Output**: Generates translated posts in `output/posts/` with associated assets in `output/static/posts/`

## Configuration

The main configuration is in `main.ts`:

- `originalPosts`: Source directory for original posts
- `output`: Output directory for processed content
- `cache`: Cache directory for translation results
- `assets`: Directory containing image assets
- `targetLangs`: Target languages for translation (currently: ko, en, ja)

## Dependencies

- **@azure-rest/ai-inference**: Azure AI inference client
- **openai**: OpenAI API client for translations
- **@mermaid-js/mermaid-cli**: Mermaid diagram rendering
- **marked**: Markdown parsing
- **js-yaml**: YAML frontmatter parsing
- **puppeteer**: Browser automation for diagram rendering

## Environment Variables

Make sure to set up your OpenAI API credentials for the translation service to work properly.

## License

ISC