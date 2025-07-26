import fs from 'fs'
import parseMD from 'parse-md'

const fileContents = fs.readFileSync('posts/first.md', 'utf8')
const { metadata, content } = parseMD(fileContents)

console.log(metadata)
console.log(content)