import type { DbBookWithLearningStatus } from '@/lib/repositories/bookRepository';
import type { DbSubject } from '@/lib/repositories/subjectRepository';

export interface BooksGridProps {
    books: DbBookWithLearningStatus[];
    subject: DbSubject;
}

export interface BookTileProps {
    id: string;
    title: string;
    isLearning: boolean;
}
