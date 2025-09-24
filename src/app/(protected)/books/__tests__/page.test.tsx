import { redirect } from 'next/navigation';

import { appPaths } from '@/lib/appPaths';

import BooksPage from '../page';

jest.mock('next/navigation', () => ({
    redirect: jest.fn()
}));

describe('Books Page', () => {
    it('redirects to subjects page', () => {
        BooksPage();

        expect(redirect).toHaveBeenCalledWith(appPaths.subjects);
    });
});
