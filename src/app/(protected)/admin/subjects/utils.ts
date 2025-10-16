import type { DbSubject } from '@/lib/repositories/subjectRepository';

import type { SubjectFormData } from './schemas';

export const mapSubjectToFormData = (subject: DbSubject): SubjectFormData => ({
    nameUk: subject.nameUk,
    nameEn: subject.nameEn,
    descriptionUk: subject.descriptionUk ?? '',
    descriptionEn: subject.descriptionEn ?? '',
    coverUrl: subject.coverUrl ?? null,
    isActive: subject.isActive
});

export const emptySubjectFormData: SubjectFormData = {
    nameUk: '',
    nameEn: '',
    descriptionUk: '',
    descriptionEn: '',
    coverUrl: null,
    isActive: true
};
