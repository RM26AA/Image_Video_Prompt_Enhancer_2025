const API_KEY = "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";
const API_ENDPOINT = "https://openrouter.ai/api/v1/chat/completions";

export interface EnhancePromptParams {
  prompt: string;
  type: 'image' | 'video';
}

export async function enhancePrompt({ prompt, type }: EnhancePromptParams): Promise<string> {
  const systemPrompt = type === 'image' 
    ? "You are an expert at enhancing image generation prompts. Take the user's simple prompt and expand it into a detailed, vivid, and creative prompt that will produce stunning images. Include artistic style, lighting, composition, colors, mood, and technical details. Make it specific and evocative."
    : "You are an expert at enhancing video generation prompts. Take the user's simple prompt and expand it into a detailed, cinematic prompt that will produce engaging videos. Include camera movements, scene transitions, lighting, mood, pacing, and visual storytelling elements. Make it specific and cinematic.";

  try {
    const response = await fetch(API_ENDPOINT, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "HTTP-Referer": window.location.origin,
        "X-Title": "Prompt Enhancer Tool",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "model": "deepseek/deepseek-chat-v3.1:free",
        "messages": [
          {
            "role": "system",
            "content": systemPrompt
          },
          {
            "role": "user",
            "content": `Enhance this ${type} prompt: "${prompt}"`
          }
        ],
        "temperature": 0.8,
        "max_tokens": 500
      })
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || "Could not enhance prompt. Please try again.";
  } catch (error) {
    console.error('Error enhancing prompt:', error);
    throw new Error('Failed to enhance prompt. Please check your connection and try again.');
  }
}

export function downloadAsTextFile(content: string, filename: string = 'enhanced-prompt.txt') {
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}