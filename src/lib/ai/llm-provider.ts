/**
 * LLM Provider Module - Hỗ trợ Gemini API, OpenAI/DeepSeek và Fallback Đàm Đạo Tự Nhiên
 * Tự động chuyển đổi giữa Cloud LLM và High-Fidelity Heuristic Engine.
 */

export interface LlmConfig {
  provider: 'gemini' | 'openai' | 'deepseek' | 'offline';
  modelName: string;
  apiKey?: string;
  temperature?: number;
  topP?: number;
  maxTokens?: number;
}

// In-memory runtime override (có thể cập nhật trực tiếp từ Admin Dashboard)
let runtimeConfig: Partial<LlmConfig> = {};

export function updateRuntimeLlmConfig(config: Partial<LlmConfig>) {
  runtimeConfig = { ...runtimeConfig, ...config };
}

export function getActiveLlmConfig(): LlmConfig {
  const geminiKey = runtimeConfig.apiKey || process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || '';
  const openaiKey = process.env.OPENAI_API_KEY || '';
  const deepseekKey = process.env.DEEPSEEK_API_KEY || '';

  if (runtimeConfig.provider) {
    return {
      provider: runtimeConfig.provider,
      modelName: runtimeConfig.modelName || (runtimeConfig.provider === 'gemini' ? 'gemini-1.5-flash' : 'gpt-4o-mini'),
      apiKey: runtimeConfig.apiKey || geminiKey || openaiKey || deepseekKey,
      temperature: runtimeConfig.temperature ?? 0.65,
    };
  }

  if (geminiKey) {
    return {
      provider: 'gemini',
      modelName: runtimeConfig.modelName || 'gemini-1.5-flash',
      apiKey: geminiKey,
      temperature: runtimeConfig.temperature ?? 0.65,
    };
  }

  if (openaiKey) {
    return {
      provider: 'openai',
      modelName: runtimeConfig.modelName || 'gpt-4o-mini',
      apiKey: openaiKey,
      temperature: runtimeConfig.temperature ?? 0.65,
    };
  }

  if (deepseekKey) {
    return {
      provider: 'deepseek',
      modelName: runtimeConfig.modelName || 'deepseek-chat',
      apiKey: deepseekKey,
      temperature: runtimeConfig.temperature ?? 0.65,
    };
  }

  return {
    provider: 'offline',
    modelName: 'offline-natural-synthesis',
    temperature: 0.65,
  };
}

export interface StreamLlmParams {
  systemInstruction?: string;
  userPrompt: string;
  conversationHistory?: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>;
  temperature?: number;
}

/**
 * Gọi Google Gemini Streaming API
 */
async function* callGeminiStream(
  config: LlmConfig,
  params: StreamLlmParams
): AsyncGenerator<string, void, unknown> {
  const apiKey = config.apiKey;
  if (!apiKey) return;

  const model = config.modelName.includes('gemini') ? config.modelName : 'gemini-1.5-flash';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?alt=sse&key=${apiKey}`;

  // Chuẩn bị contents
  const contents: any[] = [];

  // Lịch sử chat
  if (params.conversationHistory && params.conversationHistory.length > 0) {
    for (const msg of params.conversationHistory.slice(-6)) {
      contents.push({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }],
      });
    }
  }

  // Câu hỏi hiện tại
  contents.push({
    role: 'user',
    parts: [{ text: params.userPrompt }],
  });

  const bodyPayload: any = {
    contents,
    generationConfig: {
      temperature: params.temperature ?? config.temperature ?? 0.65,
      maxOutputTokens: 2048,
    },
  };

  if (params.systemInstruction) {
    bodyPayload.systemInstruction = {
      parts: [{ text: params.systemInstruction }],
    };
  }

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(bodyPayload),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Gemini API Error (${res.status}): ${errText}`);
  }

  const reader = res.body?.getReader();
  if (!reader) throw new Error('Không thể đọc stream từ Gemini API');

  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';

    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith('data: ')) {
        const jsonStr = trimmed.slice(6);
        try {
          const parsed = JSON.parse(jsonStr);
          const textChunk = parsed.candidates?.[0]?.content?.parts?.[0]?.text;
          if (textChunk) {
            yield textChunk;
          }
        } catch {
          // Bỏ qua dòng json không hoàn chỉnh
        }
      }
    }
  }
}

/**
 * Gọi OpenAI / DeepSeek Streaming API
 */
async function* callOpenAiCompatibleStream(
  config: LlmConfig,
  params: StreamLlmParams,
  baseUrl: string
): AsyncGenerator<string, void, unknown> {
  const apiKey = config.apiKey;
  if (!apiKey) return;

  const messages: any[] = [];
  if (params.systemInstruction) {
    messages.push({ role: 'system', content: params.systemInstruction });
  }
  if (params.conversationHistory) {
    for (const msg of params.conversationHistory.slice(-6)) {
      messages.push({ role: msg.role === 'assistant' ? 'assistant' : 'user', content: msg.content });
    }
  }
  messages.push({ role: 'user', content: params.userPrompt });

  const res = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: config.modelName,
      messages,
      stream: true,
      temperature: params.temperature ?? config.temperature ?? 0.65,
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`OpenAI API Error (${res.status}): ${errText}`);
  }

  const reader = res.body?.getReader();
  if (!reader) throw new Error('Không thể đọc stream từ OpenAI API');

  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';

    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith('data: ') && trimmed !== 'data: [DONE]') {
        try {
          const parsed = JSON.parse(trimmed.slice(6));
          const textChunk = parsed.choices?.[0]?.delta?.content;
          if (textChunk) yield textChunk;
        } catch {}
      }
    }
  }
}

/**
 * Điểm vào chính: Stream phản hồi từ mô hình LLM đang hoạt động
 */
export async function* streamLlmOrFallback(
  params: StreamLlmParams,
  fallbackGenerator: () => AsyncGenerator<string, void, unknown>
): AsyncGenerator<string, void, unknown> {
  const config = getActiveLlmConfig();

  if (config.provider === 'gemini' && config.apiKey) {
    try {
      for await (const chunk of callGeminiStream(config, params)) {
        yield chunk;
      }
      return;
    } catch (err) {
      console.warn('Gemini stream thất bại, tự động chuyển về Fallback Heuristic:', err);
    }
  }

  if (config.provider === 'openai' && config.apiKey) {
    try {
      for await (const chunk of callOpenAiCompatibleStream(config, params, 'https://api.openai.com/v1')) {
        yield chunk;
      }
      return;
    } catch (err) {
      console.warn('OpenAI stream thất bại, tự động chuyển về Fallback Heuristic:', err);
    }
  }

  if (config.provider === 'deepseek' && config.apiKey) {
    try {
      for await (const chunk of callOpenAiCompatibleStream(config, params, 'https://api.deepseek.com/v1')) {
        yield chunk;
      }
      return;
    } catch (err) {
      console.warn('DeepSeek stream thất bại, tự động chuyển về Fallback Heuristic:', err);
    }
  }

  // Chạy Fallback nội bộ chất lượng cao
  for await (const chunk of fallbackGenerator()) {
    yield chunk;
  }
}
