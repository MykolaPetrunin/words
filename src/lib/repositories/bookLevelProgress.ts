const levelKeyValues = ['junior', 'middle', 'senior'] as const;

export type LevelKey = (typeof levelKeyValues)[number];

export type BookLevelCompletion = Record<LevelKey, number>;

export interface BookLevelCompletionInput {
    levelKey: string;
    averageScore?: number | null;
    totalQuestions?: number | null;
}

const studiedScoreThreshold = 5;

function isLevelKey(value: string): value is LevelKey {
    return (levelKeyValues as readonly string[]).includes(value);
}

function clampScore(score: number): number {
    if (Number.isNaN(score)) {
        return 0;
    }

    if (score <= 0) {
        return 0;
    }

    if (score >= studiedScoreThreshold) {
        return studiedScoreThreshold;
    }

    return score;
}

export function createEmptyBookLevelCompletion(): BookLevelCompletion {
    return {
        junior: 0,
        middle: 0,
        senior: 0
    };
}

export function calculateBookLevelCompletion(inputs: Iterable<BookLevelCompletionInput>): BookLevelCompletion {
    const completion = createEmptyBookLevelCompletion();

    for (const input of inputs) {
        if (!isLevelKey(input.levelKey)) {
            continue;
        }

        const totalQuestions = input.totalQuestions ?? 0;

        if (totalQuestions <= 0) {
            completion[input.levelKey] = 0;
            continue;
        }

        const normalizedScore = clampScore(input.averageScore ?? 0);
        completion[input.levelKey] = Math.round((normalizedScore / studiedScoreThreshold) * 100);
    }

    return completion;
}
