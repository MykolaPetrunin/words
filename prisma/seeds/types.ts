export interface AnswerMock {
    textUK: string;
    textEN: string;
    theoryUK: string;
    theoryEN: string;
    isCorrect: boolean;
}

export interface QuestionMock {
    textUK: string;
    textEN: string;
    theoryUK: string;
    theoryEN: string;
    answers: AnswerMock[];
    level: 'junior' | 'middle' | 'senior';
}

export interface TopicMock {
    titleUK: string;
    titleEN: string;
    questions: QuestionMock[];
}
