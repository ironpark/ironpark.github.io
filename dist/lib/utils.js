import fs from 'fs';
import crypto from 'crypto';
import path from 'path';
export const mkdirAnyway = (dir) => {
    if (Array.isArray(dir)) {
        for (const d of dir)
            mkdirAnyway(d);
    }
    else {
        if (!fs.existsSync(dir))
            fs.mkdirSync(dir, { recursive: true });
    }
};
export const rmAnyway = (dir) => {
    if (Array.isArray(dir)) {
        for (const d of dir)
            rmAnyway(d);
    }
    else {
        if (fs.existsSync(dir))
            fs.rmSync(dir, { recursive: true });
    }
};
export const copyAnyway = (src, dest) => {
    if (fs.existsSync(dest))
        fs.rmSync(dest, { recursive: true });
    fs.cpSync(src, dest, { recursive: true });
};
export const writeFileAnyway = (filePath, data) => {
    // check dir exists
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir))
        fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(filePath, data);
};
export const hash = (data) => {
    return crypto.createHash('sha256').update(data).digest('hex');
};
export default {
    mkdirAnyway,
    rmAnyway,
    copyAnyway,
    hash,
    writeFileAnyway,
};
//# sourceMappingURL=utils.js.map