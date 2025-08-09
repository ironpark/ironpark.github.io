export interface PostMetadata {
    title: string;
    subTitle?: string;
    description?: string;
    slug: string;
    lang: string;
    published?: boolean;
    ogHash?: string;
    [key: string]: any;
}
export interface Post {
    filename: string;
    metadataHash: string;
    contentHash: string;
    metadata: PostMetadata;
    content: string;
}
export interface TranslateMetadataOptions {
    metadata: PostMetadata;
    fromLang: string;
    toLang: string;
    model?: string;
}
//# sourceMappingURL=types.d.ts.map