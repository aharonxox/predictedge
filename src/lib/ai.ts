import Groq from "groq-sdk";
import { Category } from "./store";

// ═══════════════════════════════════════════════════════════════
// MULTI-PROVIDER AI FAILOVER SYSTEM
// Providers: Groq (5 models) + NVIDIA (2 models) = 7 total
// Falls through automatically when one hits rate limits
// ═══════════════════════════════════════════════════════════════

interface AIProvider {
  name: string;
  model: string;
  call: (messages: { role: string; content: string }[], maxTokens: number) => Promise<string>;
}

function createGroqProvider(model: string): AIProvider {
  return {
    name: `Groq/${model}`,
    model,
    call: async (messages, maxTokens) => {
      const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
      const response = await groq.chat.completions.create({
        model,
        messages: messages as { role: "system" | "user" | "assistant"; content: string }[],
        temperature: 0.1,
        max_tokens: maxTokens,
      });
      return response.choices[0]?.message?.content || "";
    },
  };
}

function createNvidiaProvider(model: string): AIProvider {
  return {
    name: `NVIDIA/${model}`,
    model,
    call: async (messages, maxTokens) => {
      const res = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NVIDIA_API_KEY}`,
        },
        body: JSON.stringify({ model, messages, max_tokens: maxTokens, temperature: 0.1 }),
      });
      if (!res.ok) throw new Error(`NVIDIA ${res.status}: ${await res.text()}`);
      const data = await res.json();
      return data.choices?.[0]?.message?.content || "";
    },
  };
}

// Ordered by strength. Falls through on failure.
const providers: AIProvider[] = [
  createGroqProvider("llama-3.3-70b-versatile"),
  createNvidiaProvider("meta/llama-3.3-70b-instruct"),
  createGroqProvider("qwen/qwen3-32b"),
  createGroqProvider("meta-llama/llama-4-scout-17b-16e-instruct"),
  createNvidiaProvider("meta/llama-3.1-70b-instruct"),
  createGroqProvider("llama-3.1-8b-instant"),
  createGroqProvider("openai/gpt-oss-120b"),
];

async function callWithFailover(
  messages: { role: string; content: string }[],
  maxTokens: number
): Promise<string> {
  let lastError: Error | null = null;

  for (const provider of providers) {
    try {
      const result = await provider.call(messages, maxTokens);
      if (result) return result;
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      console.warn(`[AI Failover] ${provider.name} failed: ${lastError.message}. Trying next...`);
    }
  }

  throw lastError || new Error("All AI providers failed");
}

// ═══════════════════════════════════════════════════════════════
// KNOWLEDGE ORGANIZATION
// ═══════════════════════════════════════════════════════════════

interface OrganizedItem {
  title: string;
  content: string;
  category: string;
}

const ORGANIZE_SYSTEM_PROMPT = (categoryList: string) => `You are a knowledge organizer. Your job is to take raw notes and organize them into categorized items.

CRITICAL RULES:
1. NEVER change, modify, or paraphrase links, URLs, passwords, credentials, phone numbers, email addresses, or any sensitive data. Keep them EXACTLY as they appear.
2. Keep the original meaning and context intact.
3. Give each item a short, clear title that describes what it is.
4. Assign each item to the most appropriate category.
5. If one note contains multiple distinct pieces of info, split them into separate items.
6. Clean up formatting to be readable but preserve all important content.
7. Skip empty notes or notes that say "New Note" with no content.

Available categories:
${categoryList}

Respond ONLY with a valid JSON array of objects with these fields:
- "title": short descriptive title
- "content": the organized content (preserve links, passwords, numbers exactly)
- "category": the category id from the list above

Example response:
[{"title":"Netflix Login","content":"Email: user@email.com\\nPassword: mypass123","category":"passwords"},{"title":"Project Idea","content":"Build an app that...","category":"ideas"}]`;

export async function organizeNotes(
  rawText: string,
  categories: Category[]
): Promise<OrganizedItem[]> {
  const categoryList = categories.map((c) => `- "${c.id}": ${c.name} (${c.description})`).join("\n");
  const chunks = splitIntoChunks(rawText, 6000);
  const allItems: OrganizedItem[] = [];

  for (const chunk of chunks) {
    const text = await callWithFailover(
      [
        { role: "system", content: ORGANIZE_SYSTEM_PROMPT(categoryList) },
        { role: "user", content: `Organize these notes:\n\n${chunk}` },
      ],
      8000
    );

    try {
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const items: OrganizedItem[] = JSON.parse(jsonMatch[0]);
        allItems.push(...items);
      }
    } catch {
      allItems.push({ title: "Unorganized Note", content: chunk, category: "other" });
    }
  }

  return allItems;
}

export async function organizeSingleNote(
  text: string,
  categories: Category[]
): Promise<OrganizedItem> {
  const categoryList = categories.map((c) => `- "${c.id}": ${c.name} (${c.description})`).join("\n");

  const responseText = await callWithFailover(
    [
      {
        role: "system",
        content: `You are a knowledge organizer. Categorize and title this note.

CRITICAL: NEVER modify links, URLs, passwords, credentials, phone numbers, or email addresses. Keep them EXACTLY as they appear.

Available categories:
${categoryList}

Respond with a JSON object: {"title":"short title","content":"cleaned content preserving all important data","category":"category_id"}`,
      },
      { role: "user", content: text },
    ],
    2000
  );

  try {
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (jsonMatch) return JSON.parse(jsonMatch[0]);
  } catch {
    // fallback
  }
  return { title: "Note", content: text, category: "other" };
}

// ═══════════════════════════════════════════════════════════════
// AI LIFE COACH
// ═══════════════════════════════════════════════════════════════

export interface CoachInsight {
  domain: "business" | "health" | "relationships" | "learning";
  title: string;
  feedback: string;
  actionItems: string[];
  rating: number; // 1-10 performance rating
}

export interface CoachResponse {
  overallScore: number;
  summary: string;
  insights: CoachInsight[];
}

export async function getLifeCoachInsights(
  recentNotes: string,
  userContext: string
): Promise<CoachResponse> {
  const systemPrompt = `You are an AI Life Coach that is BRUTALLY HONEST. You judge performance and provide actionable improvements.

You operate in 4 domains:
1. BUSINESS - Act as a business partner. Help make money. Evaluate hustles, strategy, execution.
2. HEALTH - Act as a personal trainer. Evaluate fitness, diet, habits, sleep.
3. RELATIONSHIPS - Act as a communication coach. Evaluate social skills, emotional intelligence.
4. LEARNING - Act as a mentor. Evaluate knowledge growth, skill development, self-education.

USER CONTEXT:
${userContext}

RULES:
- Be direct and honest. Don't sugarcoat.
- Judge performance on a 1-10 scale per domain.
- Give specific, actionable advice based on the actual notes/activity.
- Reference specific things from their notes to show you're paying attention.
- Think like a high-performance coach who wants them to win.

Respond with ONLY valid JSON:
{
  "overallScore": <1-10>,
  "summary": "<2-3 sentence overall assessment>",
  "insights": [
    {
      "domain": "business",
      "title": "<short title>",
      "feedback": "<honest assessment paragraph>",
      "actionItems": ["<specific action 1>", "<specific action 2>", "<specific action 3>"],
      "rating": <1-10>
    },
    {
      "domain": "health",
      "title": "<short title>",
      "feedback": "<honest assessment>",
      "actionItems": ["<action>", "<action>", "<action>"],
      "rating": <1-10>
    },
    {
      "domain": "relationships",
      "title": "<short title>",
      "feedback": "<honest assessment>",
      "actionItems": ["<action>", "<action>", "<action>"],
      "rating": <1-10>
    },
    {
      "domain": "learning",
      "title": "<short title>",
      "feedback": "<honest assessment>",
      "actionItems": ["<action>", "<action>", "<action>"],
      "rating": <1-10>
    }
  ]
}`;

  const responseText = await callWithFailover(
    [
      { role: "system", content: systemPrompt },
      { role: "user", content: `Based on my recent notes and activity, give me your honest coaching assessment:\n\n${recentNotes}` },
    ],
    4000
  );

  try {
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch {
    // fallback
  }

  return {
    overallScore: 5,
    summary: "Unable to generate insights. Add more notes for better coaching.",
    insights: [],
  };
}

// ═══════════════════════════════════════════════════════════════
// UTILITIES
// ═══════════════════════════════════════════════════════════════

function splitIntoChunks(text: string, maxChars: number): string[] {
  if (text.length <= maxChars) return [text];

  const chunks: string[] = [];
  const sections = text.split(/\n{2,}/);
  let current = "";

  for (const section of sections) {
    if (current.length + section.length > maxChars && current.length > 0) {
      chunks.push(current.trim());
      current = section;
    } else {
      current += "\n\n" + section;
    }
  }

  if (current.trim()) chunks.push(current.trim());
  return chunks.length > 0 ? chunks : [text];
}
