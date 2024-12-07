import OpenAI from "openai";
import * as dotenv from "dotenv";

dotenv.config();

export class OpenAIService {
  private openai: OpenAI;

  constructor() {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY is required");
    }
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async generatePRSummary(
    title: string,
    description: string,
    changes: string
  ): Promise<string> {
    const prompt = `Analyze this pull request and provide a concise summary:
    Title: ${title}
    Description: ${description}
    Changes: ${changes}
    
    Focus on:
    1. Key changes and their impact on the Recoup music platform
    2. Technical improvements that benefit musicians and rights holders
    3. Value add for the music industry ecosystem
    
    Format the response in a clear, tweet-friendly way that resonates with music professionals.`;

    const response = await this.openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 1111,
      temperature: 0.7,
    });

    return response.choices[0].message.content || "No summary generated";
  }

  async generateTweetText(summary: string): Promise<string> {
    const systemPrompt = `You are a music industry social media expert. 
    - Your task is to create engaging tweets about technical updates. 
    - NEVER use hashtags or the '#' symbol. 
    - Keep tweets under 200 characters and focus on clear, direct communication.`;

    const prompt = `Convert this PR summary into a very concise tweet (max 200 chars):
    ${summary}
    
    Make it:
    1. Informative and relevant to the music industry
    2. Engaging for musicians, producers, and music business professionals
    3. Include music tech and music rights management keywords WITHOUT hashtags
    4. Keep the tone professional yet approachable for the music community
    5. MUST be under 200 characters total, including emojis
    6. ABSOLUTELY NO hashtags or '#' symbols allowed`;

    const response = await this.openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt },
      ],
      max_tokens: 100,
      temperature: 0.8,
    });

    return response.choices[0].message.content || "No tweet generated";
  }
}
