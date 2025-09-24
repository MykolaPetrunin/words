import type { DbSubject } from '@/lib/repositories/subjectRepository';

export interface SubjectsGridProps {
    subjects: DbSubject[];
}

export interface SubjectTileProps {
    name: string;
}
