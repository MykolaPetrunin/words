const levelKeyValues = ['junior', 'middle', 'senior'] as const;

export type LevelKey = (typeof levelKeyValues)[number];

export type BookLevelCompletion = Record<LevelKey, number>;

export interface BookLevelCompletionInput {
    levelKey: string;
    score?: number | null;
}

const studiedScoreThreshold = 5;

function isLevelKey(value: string): value is LevelKey {
    return (levelKeyValues as readonly string[]).includes(value);
}

function createEmptyCounts(): Record<LevelKey, { completed: number; total: number }> {
    return {
        junior: { completed: 0, total: 0 },
        middle: { completed: 0, total: 0 },
        senior: { completed: 0, total: 0 }
    };
}

export function createEmptyBookLevelCompletion(): BookLevelCompletion {
    return {
        junior: 0,
        middle: 0,
        senior: 0
    };
}

export function calculateBookLevelCompletion(inputs: Iterable<BookLevelCompletionInput>): BookLevelCompletion {
    const counts = createEmptyCounts();

    for (const input of inputs) {
        if (!isLevelKey(input.levelKey)) {
            continue;
        }

        counts[input.levelKey].total += 1;
        const score = input.score ?? 0;

        if (score >= studiedScoreThreshold) {
            counts[input.levelKey].completed += 1;
        }
    }

    return {
        junior: counts.junior.total === 0 ? 0 : Math.round((counts.junior.completed / counts.junior.total) * 100),
        middle: counts.middle.total === 0 ? 0 : Math.round((counts.middle.completed / counts.middle.total) * 100),
        senior: counts.senior.total === 0 ? 0 : Math.round((counts.senior.completed / counts.senior.total) * 100)
    };
}
