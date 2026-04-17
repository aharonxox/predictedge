import type { ChatMessage } from "@/types";

const DEFAULT_BASE_URL = "https://integrate.api.nvidia.com/v1";
const DEFAULT_MODEL = "meta/llama-3.1-70b-instruct";

export type NvidiaCompletionResult =
  | { ok: true; content: string; model: string; source: "nvidia-nim" }
  | { ok: false; content: string; model: string; source: "fallback"; error: string };

/**
 * Call NVIDIA NIM's OpenAI-compatible `/v1/chat/completions` endpoint.
 *
 * If the API is unavailable, an auth error occurs, or the request times out,
 * this returns a graceful fallback response so the UI never breaks.
 */
export async function nvidiaChatCompletion(
  messages: ChatMessage[],
  opts: { temperature?: number; maxTokens?: number; model?: string } = {},
): Promise<NvidiaCompletionResult> {
  const apiKey = process.env.NVIDIA_API_KEY;
  const baseUrl = process.env.NVIDIA_NIM_BASE_URL || DEFAULT_BASE_URL;
  const model = opts.model || process.env.NVIDIA_NIM_MODEL || DEFAULT_MODEL;

  if (!apiKey) {
    return {
      ok: false,
      content: fallbackMessage(messages, "NVIDIA_API_KEY not configured"),
      model,
      source: "fallback",
      error: "missing_api_key",
    };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30_000);

  try {
    const res = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: opts.temperature ?? 0.3,
        top_p: 0.9,
        max_tokens: opts.maxTokens ?? 1024,
        stream: false,
      }),
      signal: controller.signal,
      cache: "no-store",
    });

    if (!res.ok) {
      const errText = await safeText(res);
      return {
        ok: false,
        content: fallbackMessage(
          messages,
          `NVIDIA NIM responded ${res.status}. ${truncate(errText, 160)}`,
        ),
        model,
        source: "fallback",
        error: `http_${res.status}`,
      };
    }

    const data = (await res.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const content = data?.choices?.[0]?.message?.content?.trim();
    if (!content) {
      return {
        ok: false,
        content: fallbackMessage(messages, "NVIDIA NIM returned an empty response."),
        model,
        source: "fallback",
        error: "empty_response",
      };
    }

    return { ok: true, content, model, source: "nvidia-nim" };
  } catch (err) {
    const message =
      err instanceof Error
        ? err.name === "AbortError"
          ? "request timed out"
          : err.message
        : "unknown error";
    return {
      ok: false,
      content: fallbackMessage(messages, `NVIDIA NIM unavailable: ${message}`),
      model,
      source: "fallback",
      error: message,
    };
  } finally {
    clearTimeout(timeout);
  }
}

function truncate(text: string, n: number): string {
  if (text.length <= n) return text;
  return `${text.slice(0, n)}…`;
}

async function safeText(res: Response): Promise<string> {
  try {
    return await res.text();
  } catch {
    return "";
  }
}

/**
 * Deterministic, offline fallback the UI can display when the AI backend is
 * unreachable. We surface useful, structured guidance rather than a dead-end
 * error so the product still feels responsive.
 */
function fallbackMessage(messages: ChatMessage[], reason: string): string {
  const lastUser = [...messages].reverse().find((m) => m.role === "user");
  const question = lastUser?.content?.trim() || "your question";

  return [
    "**AI service temporarily unavailable — showing fallback analysis.**",
    `_Reason:_ ${reason}`,
    "",
    `**Question:** ${truncate(question, 400)}`,
    "",
    "**Framework you can apply right now:**",
    "1. **Identify the event.** What specific, verifiable outcome is being priced?",
    "2. **Check base rates.** What does history and current polling/telemetry imply as a prior?",
    "3. **Compare to market price.** Is YES/NO mispriced vs. your fundamental probability?",
    "4. **Size the edge.** Only act when expected value exceeds fees + slippage with a margin.",
    "5. **Watch settlement risk.** Read the contract rules — ambiguous settlement kills edge.",
    "",
    "Try again in a few seconds; the live model will resume automatically.",
  ].join("\n");
}
