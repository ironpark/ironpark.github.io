import ModelClient, { isUnexpected } from "@azure-rest/ai-inference";
import { AzureKeyCredential } from "@azure/core-auth";
const token = process.env["GITHUB_TOKEN"];
const endpoint = "https://models.github.ai/inference";


const langNames:{[key:string]:string} = {
  ko: "Korean",
  en: "English", 
  ja: "Japanese"
}

export interface TranslateOptions {
  markdownContent: string;
  fromLang: string;
  toLang: string;
  model?: string;
}

export interface TranslateMetadataOptions {
  metadata: {[key:string]:any};
  fromLang: string;
  toLang: string;
  model?: string;
}

export const translate = async ({markdownContent, fromLang, toLang, model = "openai/gpt-4.1"}: TranslateOptions): Promise<string> => {
    const fromLangName = langNames[fromLang] || fromLang
    const toLangName = langNames[toLang] || toLang
    const prompt = `Please translate the following markdown content from ${fromLangName} to ${toLangName}.

IMPORTANT TRANSLATION GUIDELINES:
1. Understand the original context, tone, nuance, and writing style
2. Translate naturally and idiomatically in the target language while preserving the author's voice
3. Maintain consistency in terminology and style throughout the entire text
4. Preserve all markdown formatting, links, and image references exactly as they are
5. Only translate the text content, not markdown syntax, or image filenames
6. For code blocks, only translate the comments, not the code
7. Specifically, mermaid code blocks, only translate the diagram text, not the diagram itself
8. Keep the same document structure and formatting
9. Ensure the translation reads naturally to native speakers of the target language
10. Maintain the same level of formality/informality as the original

<original_markdown>
${markdownContent}
</original_markdown>
`

    if (!token) {
        throw new Error("GITHUB_TOKEN is not set");
    }

    const client = ModelClient(
      endpoint,
      new AzureKeyCredential(token),
    );
    const response = await client.path("/chat/completions").post({
      body: {
        messages: [
          { role:"system", content: "You are a professional translator specializing in technical and creative content. Focus on capturing the author's original intent, tone, and style while producing natural, fluent translations that read as if originally written in the target language." },
          { role:"user", content: prompt }
        ],
        temperature: 0.3,
        top_p: 0.9,
        model: model
      }
    });
  
    if (isUnexpected(response)) {
      console.log(response)
      throw response.body?.error || new Error("Unexpected response");
    }
  
    return response.body.choices[0].message.content || ""
}

export const translateMetadata = async ({metadata, fromLang, toLang, model = "openai/gpt-4.1"}: TranslateMetadataOptions): Promise<{[key:string]:any}> => {
    const fromLangName = langNames[fromLang] || fromLang
    const toLangName = langNames[toLang] || toLang
    
    const fieldsToTranslate = {
        title: metadata.title,
        subTitle: metadata.subTitle,
        description: metadata.description
    }
    
    const prompt = `Translate these metadata fields from ${fromLangName} to ${toLangName}.
Keep the original tone and style. Return in the same JSON format:

${JSON.stringify(fieldsToTranslate, null, 2)}`

    if (!token) {
        throw new Error("GITHUB_TOKEN is not set");
    }

    const client = ModelClient(
      endpoint,
      new AzureKeyCredential(token),
    );
    const response = await client.path("/chat/completions").post({
      body: {
        messages: [
          { role:"system", content: "You are a professional translator specializing in metadata and marketing content. Focus on capturing the original intent and appeal while producing natural translations that maintain the same impact in the target language." },
          { role:"user", content: prompt }
        ],
        temperature: 0.3,
        top_p: 0.9,
        model: model
      }
    });
  
    if (isUnexpected(response)) {
      throw response.body?.error || new Error("Unexpected response");
    }
  
    const translatedFields = JSON.parse(response.body.choices[0].message.content || "{}")
    
    return {
        ...metadata,
        lang: toLang,
        title: translatedFields.title,
        subTitle: translatedFields.subTitle,
        description: translatedFields.description
    }
}