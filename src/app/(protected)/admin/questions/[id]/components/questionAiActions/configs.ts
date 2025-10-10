import type { ResponseFormatJSONSchema } from 'openai/resources/shared';

export const questionClarityPrompt = `
You are a senior instructional designer reviewing bilingual (Ukrainian–English) quiz questions.

Goal:
Ensure the question and all answers are clear, self-contained, unambiguous, and preserve the original meaning.

Input (from user):
{
  "question": {
    "textUk": "string",
    "textEn": "string",
    "answers": [
      { "id": "string", "textUk": "string", "textEn": "string", "isCorrect": boolean }
    ]
  }
}

Output:
Return only valid JSON that conforms to the "test_question_review" schema.
- Always include "needImprovements" for the question and each answer.
- Include "improvedTextUK" and "improvedTextEN" only if "needImprovements" is true.
- The text of "improvedTextUK" and "improvedTextEN" must be in Markdown format.
- No explanations or text outside the JSON.

Rules:
- Assess clarity, completeness, and tone for both Ukrainian and English.
- Assume users see only the question and answers before answering.
- Propose changes only if they improve clarity or correctness.
- Keep bilingual meaning and tone consistent.
- Do not change IDs or correctness flags.
- Avoid uncertain or vague wording (e.g., "може", "maybe").
- Keep text concise and technically accurate.
`.trim();

export const questionClarityResponseFormat: ResponseFormatJSONSchema = {
    type: 'json_schema',
    json_schema: {
        name: 'test_question_review',
        strict: true,
        schema: {
            type: 'object',
            properties: {
                question: {
                    type: 'object',
                    properties: {
                        needImprovements: {
                            type: 'boolean',
                            description: 'Indicates whether the question needs improvement'
                        },
                        improvedTextUK: {
                            type: 'string',
                            description: 'Improved version of the question in Ukrainian (Markdown format)',
                            minLength: 1
                        },
                        improvedTextEN: {
                            type: 'string',
                            description: 'Improved version of the question in English (Markdown format)',
                            minLength: 1
                        }
                    },
                    required: ['needImprovements', 'improvedTextUK', 'improvedTextEN'],
                    additionalProperties: false
                },
                answers: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            id: {
                                type: 'string',
                                description: 'Unique identifier of the answer',
                                minLength: 1
                            },
                            needImprovements: {
                                type: 'boolean',
                                description: 'Indicates whether the answer needs improvement'
                            },
                            improvedTextUK: {
                                type: 'string',
                                description: 'Improved version of the answer in Ukrainian (Markdown format)',
                                minLength: 1
                            },
                            improvedTextEN: {
                                type: 'string',
                                description: 'Improved version of the answer in English (Markdown format)',
                                minLength: 1
                            },
                            isCorrect: {
                                type: 'boolean',
                                description: 'Indicates whether the answer is correct'
                            }
                        },
                        required: ['id', 'needImprovements', 'improvedTextUK', 'improvedTextEN', 'isCorrect'],
                        additionalProperties: false
                    },
                    description: 'List of answers with improvement flags'
                }
            },
            required: ['question', 'answers'],
            additionalProperties: false
        }
    }
} as const;

export const questionTheoryCheckPrompt = `
You are a senior instructional designer reviewing bilingual (Ukrainian–English) quiz theory.

Goal:
Ensure the theory for the question and each answer is accurate, complete, well-structured, consistent with the question/answers, and preserves the original meaning.

Input (from user):
{
  "question": {
    "textUk": "string",
    "textEn": "string",
    "theoryUk": "string",
    "theoryEn": "string",
    "answers": [
      { "id": "string", "textUk": "string", "textEn": "string", "theoryUk": "string", "theoryEn": "string", "isCorrect": boolean }
    ]
  }
}

Output:
Return only valid JSON that conforms to the "test_question_theory_review" schema.
- Always include "needImprovements" for the question theory and for each answer theory.
- Include "improvedTheoryUK" and "improvedTheoryEN" only if "needImprovements" is true.
- The text of "improvedTheoryUK" and "improvedTheoryEN" must be in Markdown format.
- No explanations or text outside the JSON.

Rules:
- Review theory for clarity, correctness, completeness, and structure (headings, short paragraphs, lists, examples).
- Keep bilingual meaning and tone consistent between Ukrainian and English.
- Ensure theory directly supports the question/answer content; remove fluff and off-topic details.
- Prefer concise sections, e.g., **Summary**, **Key points**, **Examples**, **Common pitfalls**, **Notes** (use only when helpful).
- Use fenced code blocks where code is needed (e.g., \`\`\`js ... \`\`\`).
- Avoid revealing or hinting which specific answer ID is correct; keep theory neutral and educational.
- Do not change IDs or "isCorrect" flags.
- Avoid hedging and vague wording (e.g., "може", "maybe"); be precise and technically accurate.
`.trim();

export const questionTheotyCheckResponseFormat: ResponseFormatJSONSchema = {
    type: 'json_schema',
    json_schema: {
        name: 'test_question_theory_review',
        strict: true,
        schema: {
            type: 'object',
            properties: {
                question: {
                    type: 'object',
                    properties: {
                        needImprovements: {
                            type: 'boolean',
                            description: 'Indicates whether the question theory needs improvement'
                        },
                        improvedTheoryUK: {
                            type: 'string',
                            description: 'Improved version of the theory in Ukrainian (Markdown format)',
                            minLength: 1
                        },
                        improvedTheoryEN: {
                            type: 'string',
                            description: 'Improved version of the theory in English (Markdown format)',
                            minLength: 1
                        }
                    },
                    required: ['needImprovements', 'improvedTheoryUK', 'improvedTheoryEN'],
                    additionalProperties: false
                },
                answers: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            id: {
                                type: 'string',
                                description: 'Unique identifier of the answer',
                                minLength: 1
                            },
                            needImprovements: {
                                type: 'boolean',
                                description: 'Indicates whether the answer theory needs improvement'
                            },
                            improvedTheoryUK: {
                                type: 'string',
                                description: 'Improved version of the answer theory in Ukrainian (Markdown format)',
                                minLength: 1
                            },
                            improvedTheoryEN: {
                                type: 'string',
                                description: 'Improved version of the answer theory in English (Markdown format)',
                                minLength: 1
                            },
                            isCorrect: {
                                type: 'boolean',
                                description: 'Indicates whether the answer is correct'
                            }
                        },
                        required: ['id', 'needImprovements', 'improvedTheoryUK', 'improvedTheoryEN', 'isCorrect'],
                        additionalProperties: false
                    },
                    description: 'List of answers with improvement flags'
                }
            },
            required: ['question', 'answers'],
            additionalProperties: false
        }
    }
} as const;
