# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a multilingual developer blog built with SvelteKit and deployed as a static site to GitHub Pages. The project uses modern web technologies including Svelte 5, Tailwind CSS v4, and Paraglide.js for internationalization.

## Commands

### Development
```bash
pnpm dev              # Start development server
pnpm dev -- --open    # Start dev server and open browser
```

### Building and Testing
```bash
pnpm build            # Build static site for production
pnpm preview          # Preview production build
pnpm check            # Run svelte-check for TypeScript errors
pnpm check:watch      # Run svelte-check in watch mode
```

### Component Development
```bash
pnpm storybook        # Start Storybook development server
pnpm build-storybook  # Build Storybook for production
```

### Installing UI Components
```bash
pnpm dlx shadcn-svelte@latest add [component-name]
```

## Architecture

### Tech Stack
- **Framework**: SvelteKit with Svelte 5 (using new runes API)
- **Styling**: Tailwind CSS v4 with OKLCH color space
- **UI Components**: shadcn-svelte pattern in `/src/lib/components/ui/`
- **Internationalization**: Paraglide.js with support for English, Korean (ko-kr), and Japanese (jp)
- **Build**: Vite with static adapter for GitHub Pages

### Project Structure
- `/src/routes/` - SvelteKit pages and layouts
- `/src/lib/components/ui/` - Reusable UI components (shadcn-svelte)
- `/src/lib/paraglide/` - Generated i18n runtime (do not edit directly)
- `/messages/` - Translation files for each locale
- `/src/hooks.server.ts` - Server hooks for i18n middleware
- `/src/stories/` - Storybook component stories

### Internationalization
The project uses Paraglide.js with server-side locale detection:
- Messages are stored in `/messages/{locale}.json`
- The Paraglide middleware in `hooks.server.ts` handles locale detection and HTML lang attribute
- Use `import * as m from '$lib/paraglide/messages'` to access translations
- Language switcher example available in `/src/routes/demo/paraglide/+page.svelte`

### Deployment
The site is configured for static generation using `@sveltejs/adapter-static`. All pages are pre-rendered at build time, making it suitable for GitHub Pages hosting.

### Key Development Patterns
1. **Svelte 5 Runes**: Use `$props()`, `{@render}`, and other Svelte 5 features
2. **TypeScript**: Strict mode is enabled - ensure all code is properly typed
3. **Component Pattern**: Follow the shadcn-svelte pattern for UI components
4. **Styling**: Use Tailwind classes with the `cn()` utility for conditional classes
5. **Dark Mode**: Handled by mode-watcher - components should support both themes