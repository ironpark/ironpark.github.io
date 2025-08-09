export interface TranslateOptions {
    markdownContent: string;
    fromLang: string;
    toLang: string;
    model?: string;
}
export interface TranslateMetadataOptions {
    metadata: {
        [key: string]: any;
    };
    fromLang: string;
    toLang: string;
    model?: string;
}
export declare const translate: ({ markdownContent, fromLang, toLang, model }: TranslateOptions) => Promise<string>;
export declare const translateMetadata: ({ metadata, fromLang, toLang, model }: TranslateMetadataOptions) => Promise<{
    [key: string]: any;
}>;
//# sourceMappingURL=trans.d.ts.map