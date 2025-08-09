import {Lexer, Token} from "marked"
import path from "path"
import fs from "fs"
import parseMD from 'parse-md'
import yaml from 'js-yaml'

export interface ProcessedMd {
    metadata: {[key:string]:any}
    metadataRaw: string
    content: string
    markdown: string
}

export interface MdMetadata {
    [key:string]:any
}

export interface MdPreProcessorConfig {
    markdownPath: string
    metadata?: (src:string, metadata:MdMetadata) => Promise<MdMetadata>
    codeblock?: {
        [lang: string]: (metadata:MdMetadata, file:string, lang:string, raw:string, code:string) => Promise<string>
    }
    processors?: {
        [key: string]: ((metadata:MdMetadata,token:Token) => string)[]
    }
    processedMd: (srcPath:string, processedMd:ProcessedMd) => Promise<void>
}

export const execute = async (config: MdPreProcessorConfig) => {
    const { markdownPath, processors, codeblock} = config
    // get all markdown files in the markdownPath
    const mdFiles = fs.readdirSync(markdownPath).filter(file => file.endsWith(".md"))
    for(const mdFile of mdFiles) {
        const md = fs.readFileSync(path.join(markdownPath, mdFile), 'utf8')
        let {metadata, content} = parseMD(md) as {metadata: {[key:string]:any}, content: string}
        if(config.metadata){
            metadata = await config.metadata(mdFile,metadata)
        }
        const metadataRaw = "---\n" + yaml.dump(metadata) + "---\n"
        const tokens = Lexer.lex(content)
        const processedTokens = tokens.map(async (token) => {      
            if(token.type === "code"){
                if(codeblock && codeblock[token.lang]){
                    return await codeblock[token.lang](metadata, mdFile, token.lang, token.raw, token.text)
                }
            }
            if(processors && processors[token.type] && processors[token.type].length > 0){
                return processors[token.type].reduce((acc, processor) => {
                    const processedToken = Lexer.lex(acc)
                    return processor(metadata,processedToken[0])
                }, token.raw)
            }
            return token.raw
        })
        let processedContent = ""
        for(const processedToken of processedTokens){
            processedContent += await processedToken
        }
        const markdown = metadataRaw + processedContent
        if(config.processedMd){
            await config.processedMd(mdFile, {metadataRaw, content:processedContent, markdown, metadata})
        }
        // console.log(processedTokens.join(""))
    }
}

export const executeSequence = async (configs: MdPreProcessorConfig[]) => {
    for(const config of configs){
        try {
            await execute(config)
        } catch (error) {
            console.error(`Error processing ${config.markdownPath} ${JSON.stringify(config)}`)
            console.error(error)
        }
    }
}

