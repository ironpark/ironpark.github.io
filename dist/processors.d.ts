import { Token } from "marked";
import { MdMetadata } from "./lib/md.js";
export declare const mermaidProcessor: (cacheDir: string, assetsDir: string) => (metadata: MdMetadata, file: string, lang: string, raw: string, code: string, embed?: boolean) => Promise<string>;
export declare const wikilinkProcessor: (originalPostsData: {
    [title: string]: {
        slug: string;
    };
}) => (metadata: MdMetadata, token: Token) => string;
export declare const wikilinkProcessorV2: (originalPostsData: {
    [title: string]: {
        slug: string;
    };
}) => (metadata: MdMetadata, token: Token) => string;
export declare const imageCopyProcessor: (originalAssetsDir: string, outputAssetsDir: string) => (metadata: MdMetadata, token: Token) => string;
declare const _default: {
    mermaidProcessor: (cacheDir: string, assetsDir: string) => (metadata: MdMetadata, file: string, lang: string, raw: string, code: string, embed?: boolean) => Promise<string>;
    wikilinkProcessor: (originalPostsData: {
        [title: string]: {
            slug: string;
        };
    }) => (metadata: MdMetadata, token: Token) => string;
    imageCopyProcessor: (originalAssetsDir: string, outputAssetsDir: string) => (metadata: MdMetadata, token: Token) => string;
};
export default _default;
//# sourceMappingURL=processors.d.ts.map