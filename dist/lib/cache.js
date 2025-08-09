import path from "path";
import fs from "fs";
export class Cache {
    cacheDir;
    constructor(cacheDir) {
        this.cacheDir = cacheDir;
    }
    getMdCache = (cacheId) => {
        const cacheFile = path.join(this.cacheDir, `${cacheId}.json`);
        if (fs.existsSync(cacheFile)) {
            return JSON.parse(fs.readFileSync(cacheFile, "utf8"));
        }
        return {
            metadataHash: "",
            contentHash: "",
            metadata: {},
            content: ""
        };
    };
    setMdCache = (cacheId, cacheInfo) => {
        const cacheFile = path.join(this.cacheDir, `${cacheId}.json`);
        fs.writeFileSync(cacheFile, JSON.stringify(cacheInfo));
    };
}
//# sourceMappingURL=cache.js.map