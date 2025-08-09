import { Token } from "marked";
export interface ProcessedMd {
    metadata: {
        [key: string]: any;
    };
    metadataRaw: string;
    content: string;
    markdown: string;
}
export interface MdMetadata {
    [key: string]: any;
}
export interface MdPreProcessorConfig {
    markdownPath: string;
    metadata?: (src: string, metadata: MdMetadata) => Promise<MdMetadata>;
    codeblock?: {
        [lang: string]: (metadata: MdMetadata, file: string, lang: string, raw: string, code: string) => Promise<string>;
    };
    processors?: {
        [key: string]: ((metadata: MdMetadata, token: Token) => string)[];
    };
    processedMd: (srcPath: string, processedMd: ProcessedMd) => Promise<void>;
}
export declare const execute: (config: MdPreProcessorConfig) => Promise<void>;
export declare const executeSequence: (configs: MdPreProcessorConfig[]) => Promise<void>;
//# sourceMappingURL=md.d.ts.map