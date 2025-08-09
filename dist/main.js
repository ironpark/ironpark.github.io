import fs from 'fs';
import os from 'os';
import path from 'path';
import { executeSequence } from './lib/md.js';
import { translate, translateMetadata } from './lib/trans.js';
import { mermaidProcessor, wikilinkProcessor, imageCopyProcessor } from './processors.js';
import utils from './lib/utils.js';
import { Cache } from './lib/cache.js';
// create temp dir
const tempDir = path.join(os.tmpdir(), "posts");
const config = {
    originalPosts: "posts",
    output: "output",
    cache: ".cache",
    assets: "assets",
    temp: tempDir,
};
// clean up
utils.rmAnyway([config.output, config.temp]);
utils.mkdirAnyway([
    config.output,
    config.cache,
    path.join(config.cache, "mermaid"),
    config.temp,
    config.originalPosts,
    path.join(config.output, "posts"),
    path.join(config.output, "static", "posts"),
]);
const cache = new Cache(config.cache);
const targetLangs = ["ko", "en", "ja"];
const translatePost = targetLangs.map(lang => {
    return {
        markdownPath: config.originalPosts,
        metadata: async (src, metadata) => {
            // Skip if lang is same as original lang
            metadata["originalLang"] = metadata.lang;
            if (metadata.lang === lang) {
                return metadata;
            }
            const filename = `${metadata.slug}.${lang}.md`;
            const cacheInfo = cache.getMdCache(filename);
            if (cacheInfo.metadataHash === utils.hash(JSON.stringify(metadata))) {
                return cacheInfo.metadata;
            }
            const translated = await translateMetadata({ metadata: metadata, fromLang: "ko", toLang: lang, model: "openai/gpt-4.1-nano" });
            cache.setMdCache(filename, {
                ...cacheInfo,
                metadataHash: utils.hash(JSON.stringify(metadata)),
                metadata: translated,
            });
            return translated;
        },
        processedMd: async (src, { metadataRaw, content, metadata }) => {
            const filename = `${metadata.slug}.${lang}.md`;
            if (metadata.originalLang === lang) {
                console.log(`[TRANSLATE] ${filename} ${lang} is same as original post language, skip`);
                fs.writeFileSync(path.join(config.temp, filename), metadataRaw + content);
                return;
            }
            const cacheInfo = cache.getMdCache(filename);
            const contentHash = utils.hash(content);
            if (cacheInfo.contentHash === contentHash) {
                console.log(`[TRANSLATE] ${filename} ${lang} has cached content, skip`);
                fs.writeFileSync(path.join(config.temp, filename), metadataRaw + cacheInfo.content);
                return;
            }
            console.log(`[TRANSLATE] ${filename} ${lang} is not cached, translate`);
            const translated = await translate({ markdownContent: content, fromLang: "ko", toLang: lang, model: "openai/gpt-4.1-mini" });
            // save translated to file
            fs.writeFileSync(path.join(config.temp, filename), metadataRaw + translated);
            cache.setMdCache(filename, {
                ...cacheInfo,
                contentHash,
                content: translated
            });
        }
    };
});
// Translate Post
executeSequence([...translatePost, {
        markdownPath: config.temp,
        codeblock: {
            // mermaid codeblock to svg
            "mermaid": mermaidProcessor(config.cache, path.join(config.output, "static", "posts")),
        },
        processors: {
            paragraph: [
                // wikilink to normal markdown link
                wikilinkProcessor(),
                // image copy from original assets to output assets
                imageCopyProcessor(config.assets, path.join(config.output, "static", "posts"))
            ],
        },
        processedMd: async (src, { markdown, metadata }) => {
            fs.writeFileSync(path.join(config.output, "posts", `${metadata.slug}.${metadata.lang}.md`), markdown);
        }
    }]);
//# sourceMappingURL=main.js.map