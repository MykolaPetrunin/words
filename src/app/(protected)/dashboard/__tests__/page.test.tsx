import DashboardPage from '../page';

jest.mock('@/lib/repositories/subjectRepository', () => ({
    getAllActiveSubjects: jest.fn(() => Promise.resolve([]))
}));

describe('DashboardPage (Server Component)', () => {
    it('returns a Promise', () => {
        const page = DashboardPage();
        expect(page).toBeInstanceOf(Promise);
    });
});
