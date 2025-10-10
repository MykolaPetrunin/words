export type ChatCompletionRole = 'system' | 'user' | 'assistant' | 'tool';

export interface ChatCompletionMessage {
    role: ChatCompletionRole;
    content: string;
}

export interface ChatCompletionResponseFormat {
    type: string;
}

export interface ChatCompletionRequest {
    apiUrl: string;
    apiKey: string;
    model?: string;
    messages: readonly ChatCompletionMessage[];
    maxCompletionTokens?: number;
    responseFormat?: ChatCompletionResponseFormat;
    temperature?: number;
    timeoutMs?: number;
}

export async function requestChatCompletion({
    apiUrl,
    apiKey,
    model = 'gpt-5-mini',
    messages,
    maxCompletionTokens,
    responseFormat,
    temperature,
    timeoutMs = 240000
}: ChatCompletionRequest): Promise<Response> {
    const defaultResponseFormat: ChatCompletionResponseFormat = { type: 'json_object' };
    const resolvedResponseFormat = responseFormat ?? defaultResponseFormat;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    try {
        const body: Record<string, unknown> = {
            model,
            messages
        };
        if (typeof maxCompletionTokens === 'number') {
            body.max_completion_tokens = maxCompletionTokens;
        }
        body.response_format = resolvedResponseFormat;
        if (typeof temperature === 'number') {
            body.temperature = temperature;
        }
        return await fetch(apiUrl, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body),
            signal: controller.signal
        });
    } finally {
        clearTimeout(timeout);
    }
}
