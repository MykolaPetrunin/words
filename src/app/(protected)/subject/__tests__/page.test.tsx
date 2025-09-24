import SubjectPage from '../page';

jest.mock('@/lib/repositories/subjectRepository', () => ({
    getAllActiveSubjects: jest.fn(() => Promise.resolve([]))
}));

describe('SubjectPage (Server Component)', () => {
    it('returns a Promise', () => {
        const page = SubjectPage();
        expect(page).toBeInstanceOf(Promise);
    });
});
