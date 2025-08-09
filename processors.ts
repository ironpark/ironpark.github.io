import { Token } from "marked"
import path from "path"
import fs from "fs"
import puppeteer from "puppeteer"
import { renderMermaid } from "@mermaid-js/mermaid-cli"
import { MdMetadata } from "./lib/md.js"
import utils from "./lib/utils.js"
export const mermaidProcessor = (cacheDir:string, assetsDir:string) =>{
    let counting :{
        [file:string]:number
    } = {}
    return async (metadata:MdMetadata, file:string, lang:string, raw:string, code:string, embed:boolean = false) => {
        counting[file] = (counting[file] || 0) + 1
        // get md filename without path
        const mdFilename = file.split("/").pop() as string
        const svgFilename = mdFilename.trim().replace(".md", `-${counting[file]}.svg`).replace(" ", "-")
        const svgPath = path.join(assetsDir, metadata.slug, svgFilename)
        const linkPath = `/posts/${metadata.slug}/${svgFilename}`
        if(fs.existsSync(svgPath)){
            if(embed){
                const svg = fs.readFileSync(svgPath, "utf-8")
                return `<div class="mermaid">${svg}</div>`
            }
            return `![${mdFilename} ${counting[file]} ${lang} image](/static/${linkPath})`
        }
        // check if svg file exists in cacheDir/mermaid
        if(fs.existsSync(path.join(cacheDir,"mermaid", svgFilename))){
            // copy file to assetsDir
            utils.copyAnyway(path.join(cacheDir, "mermaid", svgFilename), svgPath)
            if(embed){
                const svg = fs.readFileSync(svgPath, "utf-8")
                return `<div class="mermaid">${svg}</div>`
            }
            return `![${mdFilename} ${counting[file]} ${lang} image](${linkPath})`
        }
        // if not exists, render mermaid
        const browser = await puppeteer.launch({headless: true});
        // @ts-ignore
        const {data} = await renderMermaid(browser, code, "svg",{
            mermaidConfig:{
                darkMode: true,
                theme: "base",
                themeCSS: `
                    .mermaid {
                        background-color: transparent;
                    }
                `
            }
        })
        // save data to file
        utils.writeFileAnyway(path.join(cacheDir, "mermaid", svgFilename), data)
        // copy file to assetsDir
        utils.copyAnyway(path.join(cacheDir, "mermaid", svgFilename), svgPath)
        await browser.close()
        if(embed){
            const svg = fs.readFileSync(svgPath, "utf-8")
            return `<div class="mermaid">${svg}</div>`
        }
        return `![${mdFilename} ${counting[file]} ${lang} image](${linkPath})`
    }
}

// ![[filename.imageExt]] -> ![](/posts/filename.imageExt)
export const wikilinkProcessor = () => {
    const match = /!\[\[(.*?)\.(.*?)\]\](.*)/
    return (metadata:MdMetadata, token:Token) => {
        const originalRaw = token.raw
        if(match.test(originalRaw)){
            // check extension is md return token.raw
            const groups = token.raw.match(match)
            if(groups){
                if(groups[2].endsWith('.md')){
                    return token.raw
                }
                const imagePath = path.join("/posts", metadata.slug, groups[1]+"."+groups[2])
                return `![${groups[1]}](${imagePath})${groups[3] || ""}`
            }
        }
        return token.raw
    }
}

export const imageCopyProcessor = (originalAssetsDir:string, outputAssetsDir:string) => {
    return (metadata:MdMetadata, token:Token) => {
        const match = /!\[.*?\]\((.*?)\)(.*)/
        if(match.test(token.raw)){
            const groups = token.raw.match(match)
            if(groups){
                const imagePath = groups[1]
                const imageFilename = imagePath.split("/").pop() as string
                const originalImagePath = path.join(originalAssetsDir, imageFilename)
                const outputImagePath = path.join(outputAssetsDir, metadata.slug, imageFilename)
                if(fs.existsSync(originalImagePath)){
                    utils.copyAnyway(originalImagePath, outputImagePath)
                }
            }
        }
        return token.raw
    }
}

export default {
    mermaidProcessor,
    wikilinkProcessor,
    imageCopyProcessor,
}