import type { ResponseFormatJSONSchema } from 'openai/resources/shared';

export const topicSuggestionPrompt = `
You are an experienced senior software engineer who curates learning roadmaps for technical books. 
Your task: evaluate topic coverage and suggest missing topics.

Input (from user):
{
  "titleUk": "string",
  "titleEN": "string",
  "descriptionUk": "string",
  "descriptionEn": "string",
  "existingTopics": [{ "titleUk": "string", "titleEn": "string" }]
}

Output:
Return only valid JSON that conforms to the "book_topic_suggestions" schema (response_format.json_schema).
- Produce "newTopics": an array of missing topics (or an empty array if coverage is sufficient).
- Each topic must include: "titleUk", "titleEn", "reason" , "isOptional" (true = optional, false = required).
- No explanations or text outside the JSON.

Rules:
- Use the book’s title and description (both languages) as the source of truth for scope.
- Do not duplicate items already present in "existingTopics" (treat near-duplicates as duplicates).
- Keep bilingual parity: "titleUk" and "titleEn" must convey the same concept.
- Prefer precise, syllabus-style topic titles (no marketing language).
- Prioritize fundamentals and prerequisites as required ("isOptional": false); advanced or niche items as optional ("isOptional": true).
- If coverage is already sufficient, return {"newTopics": []}.
`.trim();
export const topicSuggestionResponseFormat: ResponseFormatJSONSchema = {
    type: 'json_schema',
    json_schema: {
        name: 'book_topic_suggestions',
        strict: true,
        schema: {
            type: 'object',
            properties: {
                newTopics: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            titleUk: { type: 'string', minLength: 1, description: 'Ukrainian title of the topic in Markdown format' },
                            titleEn: { type: 'string', minLength: 1, description: 'English title of the topic in Markdown format' },
                            reason: { type: 'string', minLength: 1, description: 'Reason for the topic' },
                            isOptional: { type: 'boolean', description: 'Indicates whether the topic is optional' }
                        },
                        required: ['titleUk', 'titleEn', 'reason', 'isOptional'],
                        additionalProperties: false
                    }
                }
            },
            required: ['newTopics'],
            additionalProperties: false
        }
    }
} as const;
