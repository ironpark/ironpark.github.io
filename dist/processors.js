import path from "path";
import fs from "fs";
import puppeteer from "puppeteer";
import { renderMermaid } from "@mermaid-js/mermaid-cli";
import utils from "./lib/utils.js";
export const mermaidProcessor = (cacheDir, assetsDir) => {
    let counting = {};
    return async (metadata, file, lang, raw, code, embed = false) => {
        counting[file] = (counting[file] || 0) + 1;
        // get md filename without path
        const mdFilename = file.split("/").pop();
        const svgFilename = mdFilename.trim().replace(".md", `-${counting[file]}.svg`).replace(" ", "-");
        const svgPath = path.join(assetsDir, metadata.slug, svgFilename);
        const linkPath = `/posts/${metadata.slug}/${svgFilename}`;
        if (fs.existsSync(svgPath)) {
            if (embed) {
                const svg = fs.readFileSync(svgPath, "utf-8");
                return `<div class="mermaid">${svg}</div>`;
            }
            return `![${mdFilename} ${counting[file]} ${lang} image](/static/${linkPath})`;
        }
        // check if svg file exists in cacheDir/mermaid
        if (fs.existsSync(path.join(cacheDir, "mermaid", svgFilename))) {
            // copy file to assetsDir
            utils.copyAnyway(path.join(cacheDir, "mermaid", svgFilename), svgPath);
            if (embed) {
                const svg = fs.readFileSync(svgPath, "utf-8");
                return `<div class="mermaid">${svg}</div>`;
            }
            return `![${mdFilename} ${counting[file]} ${lang} image](${linkPath})`;
        }
        // if not exists, render mermaid
        const browser = await puppeteer.launch({ headless: true });
        // @ts-ignore
        const { data } = await renderMermaid(browser, code, "svg", {
            mermaidConfig: {
                darkMode: true,
                theme: "base",
                themeCSS: `
                    .mermaid {
                        background-color: transparent;
                    }
                `
            }
        });
        // save data to file
        utils.writeFileAnyway(path.join(cacheDir, "mermaid", svgFilename), data);
        // copy file to assetsDir
        utils.copyAnyway(path.join(cacheDir, "mermaid", svgFilename), svgPath);
        await browser.close();
        if (embed) {
            const svg = fs.readFileSync(svgPath, "utf-8");
            return `<div class="mermaid">${svg}</div>`;
        }
        return `![${mdFilename} ${counting[file]} ${lang} image](${linkPath})`;
    };
};
// ![[filename.imageExt]] -> ![](/posts/filename.imageExt)
// [[doc name]] -> [doc name](/posts/slug)
// [[doc name|alias]] -> [alias](/posts/slug)
export const wikilinkProcessor = (originalPostsData) => {
    const imageMatch = /!\[\[(.*?)\.(.*?)\]\](.*)/;
    const linkMatch = /\[\[(.*?)\]\](.*)/;
    const linkAliasMatch = /\[\[(.*?)\|(.*?)\]\](.*)/;
    return (metadata, token) => {
        const originalRaw = token.raw;
        if (imageMatch.test(originalRaw)) {
            // check extension is md return token.raw
            const groups = originalRaw.match(imageMatch);
            if (groups) {
                if (groups[2].endsWith('.md')) {
                    return originalRaw;
                }
                const imagePath = path.join("/posts", metadata.slug, groups[1] + "." + groups[2]);
                return `![${groups[1]}](${imagePath})${groups[3] || ""}`;
            }
        }
        if (linkMatch.test(originalRaw)) {
            if (linkAliasMatch.test(originalRaw)) {
                const groups = originalRaw.match(linkAliasMatch);
                if (groups) {
                    const linkPath = path.join("/posts", originalPostsData[groups[1]].slug, groups[1]);
                    return `[${groups[2]}](${linkPath})${groups[3] || ""}`;
                }
            }
            const groups = originalRaw.match(linkMatch);
            if (groups) {
                const linkPath = path.join("/posts", originalPostsData[groups[1]].slug, groups[1]);
                return `[${groups[1]}](${linkPath})${groups[2] || ""}`;
            }
        }
        return originalRaw;
    };
};
// Improved version 2 with better structure and performance
export const wikilinkProcessorV2 = (originalPostsData) => {
    const markdownExtensions = new Set(['md', 'markdown', 'mdx']);
    return (metadata, token) => {
        let content = token.raw;
        // Process image links: ![[filename.ext]]
        content = content.replace(/!\[\[([^\]]+)\]\]/g, (match, fullname) => {
            // Extract filename and extension
            const lastDotIndex = fullname.lastIndexOf('.');
            const hasExtension = lastDotIndex > 0;
            const filename = hasExtension ? fullname.substring(0, lastDotIndex) : fullname;
            const ext = hasExtension ? fullname.substring(lastDotIndex + 1) : '';
            // Skip markdown file references
            if (ext && markdownExtensions.has(ext.toLowerCase())) {
                return match;
            }
            const imagePath = path.join("/posts", metadata.slug, fullname);
            const altText = filename.replace(/[-_]/g, ' ');
            return `![${altText}](${imagePath})`;
        });
        // Process link with alias: [[target|alias]]
        content = content.replace(/\[\[([^|\]]+)\|([^|\]]+)\]\]/g, (match, target, alias) => {
            if (originalPostsData[target.trim()]) {
                const linkPath = path.join("/blog", originalPostsData[target.trim()].slug);
                return `[${alias}](${linkPath})`;
            }
            return match;
        });
        // Process simple link: [[target]]
        content = content.replace(/\[\[([^|\]]+)\]\]/g, (match, target) => {
            if (originalPostsData[target.trim()]) {
                const linkPath = path.join("/blog", originalPostsData[target.trim()].slug);
                return `[${target}](${linkPath})`;
            }
            return match;
        });
        return content;
    };
};
export const imageCopyProcessor = (originalAssetsDir, outputAssetsDir) => {
    return (metadata, token) => {
        const match = /!\[.*?\]\((.*?)\)(.*)/;
        if (match.test(token.raw)) {
            const groups = token.raw.match(match);
            if (groups) {
                const imagePath = groups[1];
                const imageFilename = imagePath.split("/").pop();
                const originalImagePath = path.join(originalAssetsDir, imageFilename);
                const outputImagePath = path.join(outputAssetsDir, metadata.slug, imageFilename);
                if (fs.existsSync(originalImagePath)) {
                    utils.copyAnyway(originalImagePath, outputImagePath);
                }
            }
        }
        return token.raw;
    };
};
export default {
    mermaidProcessor,
    wikilinkProcessor,
    imageCopyProcessor,
};
//# sourceMappingURL=processors.js.map