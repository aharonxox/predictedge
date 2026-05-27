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
// AI LIFE COACH — Multi-mode with progress tracking
// ═══════════════════════════════════════════════════════════════

export type CoachMode = "overview" | "business" | "health" | "communication" | "relationships";

export interface CoachInsight {
  domain: string;
  title: string;
  feedback: string;
  actionItems: string[];
  rating: number;
}

export interface CoachResponse {
  overallScore: number;
  summary: string;
  insights: CoachInsight[];
  mode: CoachMode;
}

const MODE_PROMPTS: Record<CoachMode, string> = {
  overview: `You are an AI Life Coach that is BRUTALLY HONEST. Assess ALL areas of life.

Evaluate these 4 domains and give a score for each:
1. BUSINESS/FINANCE - Are they making smart money moves? Revenue, strategy, business formation, tax optimization, financial freedom path.
2. HEALTH - Physical fitness, diet, sleep, habits, energy.
3. COMMUNICATION - Speaking skills, presentation, persuasion, networking, social media presence.
4. RELATIONSHIPS - Social connections, emotional intelligence, personal relationships.

Give an overallScore (1-10) and insights for each domain.`,

  business: `You are a BUSINESS PARTNER and FINANCIAL ADVISOR. You think like a millionaire mentor.

Your job:
- Evaluate their business strategy, revenue streams, and execution
- Give SPECIFIC advice on: LLC/business formation, tax strategies (legal ways to minimize taxes), scaling
- Tell them about: business certifications, licenses they might need, legal protections
- Suggest revenue optimization — not just "make a website" but HOW to get clients, pricing strategy, upsells
- Think about passive income, automation, delegation
- Cover: invoicing, contracts, intellectual property, branding
- Teach them about S-Corp vs LLC tax benefits, quarterly estimated taxes, business deductions (home office, equipment, software, mileage)
- Financial freedom roadmap: emergency fund → debt payoff → invest → scale

Give exactly 1 insight with domain "business", be extremely detailed with 5+ action items.`,

  health: `You are a PERSONAL TRAINER and HEALTH COACH. Be direct and motivating.

Your job:
- Evaluate their fitness level, diet habits, sleep patterns, and daily routine
- Give SPECIFIC workout advice — not generic "exercise more" but actual routines
- Nutrition guidance: meal timing, macros, hydration, supplements worth taking
- Sleep optimization: blue light, schedule consistency, sleep environment
- Mental health: stress management, meditation, journaling, screen time
- Energy management: morning routine, afternoon slumps, evening wind-down
- Recovery: rest days, stretching, injury prevention

Give exactly 1 insight with domain "health", be extremely detailed with 5+ action items.`,

  communication: `You are a COMMUNICATION SPECIALIST and PUBLIC SPEAKING COACH.

Your job:
- Evaluate their communication skills based on their notes/writing style
- Teach: persuasion techniques, active listening, body language awareness
- Business communication: cold emails, pitches, client calls, negotiation
- Social media: content strategy, engagement, personal branding voice
- Public speaking: structure, storytelling, confidence building
- Written communication: copywriting, proposals, professional emails
- Conflict resolution and difficult conversations
- Networking: how to approach people, follow up, build genuine connections

Give exactly 1 insight with domain "communication", be extremely detailed with 5+ action items.`,

  relationships: `You are a RELATIONSHIP COACH and SOCIAL SKILLS EXPERT.

Your job:
- Evaluate their social life, relationships, emotional intelligence
- Personal relationships: boundaries, vulnerability, trust building
- Professional relationships: mentorship, collaboration, loyalty
- Family dynamics: communication with parents, siblings
- Romantic relationships: self-worth, healthy patterns, red flags to avoid
- Friendship: quality over quantity, being a good friend, cutting toxic people
- Emotional intelligence: self-awareness, empathy, emotional regulation
- Social skills: reading rooms, adapting communication style, charisma

Give exactly 1 insight with domain "relationships", be extremely detailed with 5+ action items.`,
};

export async function getLifeCoachInsights(
  recentNotes: string,
  userContext: string,
  mode: CoachMode = "overview"
): Promise<CoachResponse> {
  const modePrompt = MODE_PROMPTS[mode];

  const systemPrompt = `${modePrompt}

USER CONTEXT:
${userContext}

RULES:
- Be BRUTALLY HONEST. Don't sugarcoat anything.
- Rate performance 1-10 per domain.
- Reference SPECIFIC things from their notes to prove you read them.
- Think like a high-performance coach who genuinely wants them to WIN.
- Give advice that's actionable TODAY, not abstract motivation.
- Remember: this person wants to become financially free. Every tip should move toward that goal.

Respond with ONLY valid JSON:
{
  "overallScore": <1-10>,
  "summary": "<2-3 sentence brutal honest assessment>",
  "insights": [
    {
      "domain": "<domain name>",
      "title": "<short punchy title>",
      "feedback": "<detailed honest assessment — at least 3-4 sentences>",
      "actionItems": ["<specific action>", ...],
      "rating": <1-10>
    }
  ]
}`;

  const responseText = await callWithFailover(
    [
      { role: "system", content: systemPrompt },
      { role: "user", content: `Here are my recent notes and activity. Coach me hard:\n\n${recentNotes}` },
    ],
    4000
  );

  try {
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return { ...parsed, mode };
    }
  } catch {
    // fallback
  }

  return {
    overallScore: 5,
    summary: "Unable to generate insights. Add more notes for better coaching.",
    insights: [],
    mode,
  };
}

// ═══════════════════════════════════════════════════════════════
// AI CHAT — Conversational interface with smart organization
// ═══════════════════════════════════════════════════════════════

interface ChatResult {
  response: string;
  saveItems: { title: string; content: string; category: string }[];
}

export async function chatWithAI(
  message: string,
  history: { role: string; content: string }[],
  categories: { id: string; name: string }[],
  recentContext: string
): Promise<ChatResult> {
  const categoryList = categories.map((c) => `"${c.id}" (${c.name})`).join(", ");

  const systemPrompt = `You are a smart knowledge organizer assistant. You help the user store, organize, and manage their notes.

AVAILABLE CATEGORIES: ${categoryList}

RECENT KNOWLEDGE (for context):
${recentContext}

YOUR BEHAVIOR:
1. When the user sends you information (passwords, links, ideas, contacts, etc.), you MUST save it by including "saveItems" in your response.
2. SPLIT multi-topic messages into SEPARATE items. For example, if someone sends you a file about themselves that has business info, health info, and personal info — split it into multiple items in different categories.
3. LISTEN to the user's instructions. If they say "put this in passwords" or "name it Business Plan" — do exactly that.
4. PRESERVE all sensitive data EXACTLY (passwords, links, numbers, emails, credentials). Never modify them.
5. If the user is just chatting or asking a question (not adding knowledge), respond helpfully WITHOUT saving anything.
6. Give short, clear titles to each saved item.
7. If you're unsure which category, use "other".

RESPONSE FORMAT (JSON only):
{
  "response": "<your conversational reply to the user — confirm what you saved, answer questions, etc.>",
  "saveItems": [
    {"title": "short title", "content": "full preserved content", "category": "category_id"},
    ...
  ]
}

If nothing to save, use empty array: "saveItems": []

CRITICAL: 
- NEVER change passwords, links, emails, phone numbers, API keys — keep them EXACTLY as given
- ALWAYS split multi-topic content into separate items
- Response must be valid JSON`;

  const messages = [
    { role: "system", content: systemPrompt },
    ...history.slice(-8).map((m) => ({ role: m.role, content: m.content })),
    { role: "user", content: message },
  ];

  const responseText = await callWithFailover(messages, 4000);

  try {
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        response: parsed.response || "Done.",
        saveItems: Array.isArray(parsed.saveItems) ? parsed.saveItems : [],
      };
    }
  } catch {
    // If JSON parsing fails, treat the whole response as a conversational reply
  }

  return { response: responseText || "I couldn't process that. Try again.", saveItems: [] };
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
