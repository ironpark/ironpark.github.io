import path from "path"
import fs from "fs"

interface MdCache {
    metadataHash: string
    contentHash: string
    metadata: {[key:string]:any}
    content: string
}

export class Cache {
    private cacheDir: string
    constructor(cacheDir: string) {
        this.cacheDir = cacheDir
    }
    getMdCache = (cacheId:string): MdCache  => {
        const cacheFile = path.join(this.cacheDir, `${cacheId}.json`)
        if(fs.existsSync(cacheFile)){
            return JSON.parse(fs.readFileSync(cacheFile, "utf8"))
        }
        return {
            metadataHash: "",
            contentHash: "",
            metadata: {},
            content: ""
        }
    }
    setMdCache = (cacheId:string, cacheInfo:MdCache) => {
        const cacheFile = path.join(this.cacheDir, `${cacheId}.json`)
        fs.writeFileSync(cacheFile, JSON.stringify(cacheInfo))
    }
}
