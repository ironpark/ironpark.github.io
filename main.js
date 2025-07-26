import fs from 'fs'
import path from 'path'
import { mkdirAnyway, rmAnyway, readMD, copyAnyway, writeMD, getPosts } from './lib/utils.js'
import { translate, translateMetadata } from './lib/trans.js'

// Configs
const outputDir = 'output'
const postsDir = 'posts'
const cacheDir = ".cache"

// Basic Setup
rmAnyway(outputDir)
mkdirAnyway([outputDir, 
    path.join(outputDir, "posts"),
    path.join(outputDir, "static", "posts"),
    cacheDir,
])

const posts = getPosts(postsDir)

const replaceImageLinks = (metadata, content)=>{
    // [[anyimagename.{png,jpg,jpeg,gif,svg}]] -> ![anyimagename.{png,jpg,jpeg,gif,svg}](/anyimagename.{png,jpg,jpeg,gif,svg})
    return content.replace(/\!\[\[.*?\.(png|jpg|jpeg|gif|svg)\]\]/g, (match, p1)=>{   
        const imageName = match.replace('![[', '').replace(']]', '')
        return `![](/posts/${imageName})`
    })
}

const rebuild = (post, outputPath)=>{
    const { metadata, content } = post
    const replacedContent = replaceImageLinks(metadata, content)
    writeMD({metadata, content: replacedContent}, outputPath)
    const imageFiles = fs.readdirSync("assets")
    const imageDir = path.join(outputDir, "static", "posts", post.metadata.slug)
    for(const imageFile of imageFiles){
        copyAnyway(path.join("assets", imageFile), path.join(imageDir, imageFile))
    }
}

for(const post of posts){
    console.log(post.filename)
    rebuild(post,  path.join(outputDir, "posts", `${post.metadata.slug}.md`))
}

// auto translate
const generatedPosts = getPosts("output/posts", false)
const translatePost = async (post, lang, model="openai/gpt-4.1-mini")=>{
    // check if cache file exists
    const cacheFile = path.join(cacheDir, `${post.metadata.slug}.${lang}.md`)
    if(fs.existsSync(cacheFile)){
        // get metadata from cache file
        const {metadata} = readMD(cacheFile)
        if(metadata.ogHash === post.contentHash){
            console.log(`Cache hit for ${post.filename} ${lang} skipping...`)
            // copy cache file to output/posts
            copyAnyway(cacheFile, path.join(outputDir, "posts", `${post.metadata.slug}.${lang}.md`))
            return
        }
    }
    
    const translated = await translate({ data: post, lang, model })
    const translatedMetadata = await translateMetadata({ metadata: post.metadata, fromLang: "ko", toLang: lang, model })
    translated.metadata = translatedMetadata
    translated.metadata.ogHash = post.contentHash
    writeMD(translated, path.join(outputDir, "posts", `${post.metadata.slug}.${lang}.md`))
    copyAnyway(path.join(outputDir, "posts", `${post.metadata.slug}.${lang}.md`), path.join(cacheDir, `${post.metadata.slug}.${lang}.md`))
}

for(const post of generatedPosts){
    await translatePost(post, "en")
    await translatePost(post, "ja")
}

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