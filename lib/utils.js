import fs from 'fs'
import yaml from 'js-yaml'
import parseMD from 'parse-md'
import path from 'path'
import crypto from 'crypto'

export const mkdirAnyway = (dir)=>{
    // if dir is array, create all dirs
    if(Array.isArray(dir)) {
        for(const d of dir) mkdirAnyway(d)
    } else {
        if(!fs.existsSync(dir)) fs.mkdirSync(dir, {recursive: true})
    }
}

export const rmAnyway = (dir)=>{
    if(fs.existsSync(dir)) fs.rmSync(dir, {recursive: true})
}

export const copyAnyway = (src, dest)=>{
    if(fs.existsSync(dest)) fs.rmSync(dest, {recursive: true})
    fs.cpSync(src, dest, {recursive: true})
}

export const readMD = (file)=>{
    const fileContents = fs.readFileSync(file, 'utf8')
    const { metadata, content } = parseMD(fileContents)
    return { metadata, content }
}

export const writeMD = (data, file)=>{
    // split dir and file
    const dir = path.dirname(file)
    console.log("writing to", file)
    mkdirAnyway(dir)
    const { metadata, content } = data
    if (metadata && content) {
        const outputContent = "---\n" + yaml.dump(metadata) + "---\n" + content.trim()
        fs.writeFileSync(file, outputContent)
    }else{
        throw new Error('Invalid data')
    }
}

export const getPosts = (dir, publishedOnly=true)=>{
    const files = fs.readdirSync(dir)
    const mdFiles = files.filter(file => file.endsWith('.md'))
    const posts = mdFiles.map(file=>{
        const { metadata, content } = readMD(path.join(dir, file))
        const metadataHash = crypto.createHash('sha256').update(JSON.stringify(metadata)).digest('hex')
        const contentHash = crypto.createHash('sha256').update(content.trim()).digest('hex')
        // create cache file if not exists
        return {
            filename: file,
            metadataHash,
            contentHash,
            metadata,
            content
        }
    });
    if(publishedOnly){
        return posts.filter(post=>post.metadata.published === true)
    }else{
        return posts
    }
}