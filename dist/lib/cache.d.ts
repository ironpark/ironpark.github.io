interface MdCache {
    metadataHash: string;
    contentHash: string;
    metadata: {
        [key: string]: any;
    };
    content: string;
}
export declare class Cache {
    private cacheDir;
    constructor(cacheDir: string);
    getMdCache: (cacheId: string) => MdCache;
    setMdCache: (cacheId: string, cacheInfo: MdCache) => void;
}
export {};
//# sourceMappingURL=cache.d.ts.map