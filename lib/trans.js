import ModelClient, { isUnexpected } from "@azure-rest/ai-inference";
import { AzureKeyCredential } from "@azure/core-auth";

const token = process.env["GITHUB_TOKEN"];
const endpoint = "https://models.github.ai/inference";

export const translate = async ({data, lang, model="openai/gpt-4.1"}) => {
    const { metadata, content : originalMarkdown } = data
    const fromLang = metadata.lang
    const toLang = lang
    
    const langNames = {
        ko: "Korean",
        en: "English", 
        ja: "Japanese"
    }
    
    const prompt = `Please translate the following markdown content from ${langNames[fromLang]} to ${langNames[toLang]}.

IMPORTANT TRANSLATION GUIDELINES:
1. Understand the original context, tone, nuance, and writing style
2. Translate naturally and idiomatically in the target language while preserving the author's voice
3. Maintain consistency in terminology and style throughout the entire text
4. Preserve all markdown formatting, links, and image references exactly as they are
5. Only translate the text content, not markdown syntax, code blocks, or image filenames
6. Keep the same document structure and formatting
7. Ensure the translation reads naturally to native speakers of the target language
8. Maintain the same level of formality/informality as the original

<original_markdown>
${originalMarkdown}
</original_markdown>
`

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
      throw response.body.error;
    }
  
    return {
        metadata: {
            ...metadata,
            lang: toLang
        },
        content: response.body.choices[0].message.content
    }
}

export const translateMetadata = async ({metadata, fromLang, toLang, model="openai/gpt-4.1"}) => {
    const langNames = {
        ko: "Korean",
        en: "English", 
        ja: "Japanese"
    }
    
    const fieldsToTranslate = {
        title: metadata.title,
        subTitle: metadata.subTitle,
        description: metadata.description
    }
    
    const prompt = `Translate these metadata fields from ${langNames[fromLang]} to ${langNames[toLang]}.
Keep the original tone and style. Return in the same JSON format:

${JSON.stringify(fieldsToTranslate, null, 2)}`

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
      throw response.body.error;
    }
  
    const translatedFields = JSON.parse(response.body.choices[0].message.content)
    
    return {
        ...metadata,
        lang: toLang,
        title: translatedFields.title,
        subTitle: translatedFields.subTitle,
        description: translatedFields.description
    }
}