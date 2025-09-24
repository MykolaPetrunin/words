import SubjectsPage from '../page';

jest.mock('@/lib/repositories/subjectRepository', () => ({
    getAllActiveSubjects: jest.fn(() => Promise.resolve([]))
}));

describe('SubjectsPage (Server Component)', () => {
    it('returns a Promise', () => {
        const page = SubjectsPage();
        expect(page).toBeInstanceOf(Promise);
    });
});
