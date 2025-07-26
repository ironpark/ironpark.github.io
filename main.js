import fs from 'fs'
import path from 'path'
import parseMD from 'parse-md'
import yaml from 'js-yaml'
import crypto from 'crypto'

// Configs
const originalLang = 'ko'
const outputDir = 'output'
const postsDir = 'posts'
const cacheDir = ".cache"

const mkDirIfNotExists = (dir)=>{
    // if dir is array, create all dirs
    if(Array.isArray(dir)) {
        for(const d of dir) mkDirIfNotExists(d)
    } else {
        if(!fs.existsSync(dir)) fs.mkdirSync(dir, {recursive: true})
    }
}
// Basic Setup
if(fs.existsSync(outputDir)){
    fs.rmSync(outputDir, {recursive: true})
}
mkDirIfNotExists([outputDir, 
    path.join(outputDir, "src", "content","posts"),
    path.join(outputDir, "static", "posts"),
    cacheDir,
])

const files = fs.readdirSync(postsDir)
const mdFiles = files.filter(file => file.endsWith('.md'))
const posts = mdFiles.map(file=>{
    const fileContents = fs.readFileSync(path.join(postsDir, file), 'utf8')
    const { metadata, content } = parseMD(fileContents)
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
}).filter(post=>post.metadata.published === true)

const replaceImageLinks = (metadata,content)=>{
    // [[anyimagename.{png,jpg,jpeg,gif,svg}]] -> ![anyimagename.{png,jpg,jpeg,gif,svg}](/anyimagename.{png,jpg,jpeg,gif,svg})
    return content.replace(/\[\[.*?\.(png|jpg|jpeg|gif|svg)\]\]/g, (match, p1)=>{   
        const imageName = match.replace('[[', '').replace(']]', '')
        return `![](/posts/${imageName})`
    })
}

const rebuild = (post, outputPath)=>{
    const { metadata, content } = post
    const replacedContent = replaceImageLinks(metadata, content)
    const outputContent = "---\n" + yaml.dump(metadata) + "---\n" + replacedContent
    fs.writeFileSync(outputPath, outputContent)
    // copy image files to output/src/static/posts/{post.metadata.slug}
    const imageFiles = fs.readdirSync("assets")
    const imageDir = path.join(outputDir, "static", "posts", post.metadata.slug)
    mkDirIfNotExists(imageDir)
    for(const imageFile of imageFiles){
        fs.copyFileSync(path.join("assets", imageFile), path.join(imageDir, imageFile))
    }
}

const rebuildAll = ()=>{
    for(const post of posts){
        console.log(post.filename)
        rebuild(post,  path.join(outputDir, "src", "content","posts", `${post.metadata.slug}.md`))
    }
}

rebuildAll()

// create cache file
for(const post of posts){
    const cacheFile = path.join( cacheDir, `${post.filename}.json`)
    if(!fs.existsSync(cacheFile)){
        fs.writeFileSync(cacheFile, JSON.stringify({
            metadataHash: post.metadataHash,
            contentHash: post.contentHash,
            metadata: post.metadata,
        }))
    }
}