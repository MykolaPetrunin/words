import type { DbBook } from '@/lib/repositories/bookRepository';
import type { DbSubject } from '@/lib/repositories/subjectRepository';

export interface BooksGridProps {
    books: DbBook[];
    subject: DbSubject;
}

export interface BookTileProps {
    id: string;
    title: string;
}
