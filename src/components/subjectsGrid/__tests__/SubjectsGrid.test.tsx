import { render, screen } from '@testing-library/react';
import React from 'react';

import SubjectsGrid from '../SubjectsGrid';

jest.mock('@/hooks/useI18n', () => ({
    useI18n: () => (key: string) => key
}));

jest.mock('@/lib/redux/ReduxProvider', () => ({
    useAppSelector: jest.fn(() => ({ id: 'u1', locale: 'uk' }))
}));

describe('SubjectsGrid (Client Component)', () => {
    it('renders subject tiles with localized names', () => {
        const subjects = [
            { id: '1', nameUk: 'Математика', nameEn: 'Math', descriptionUk: null, descriptionEn: null, isActive: true, createdAt: new Date(), updatedAt: new Date() },
            { id: '2', nameUk: 'Фізика', nameEn: 'Physics', descriptionUk: null, descriptionEn: null, isActive: true, createdAt: new Date(), updatedAt: new Date() }
        ];

        render(<SubjectsGrid subjects={subjects} />);

        expect(screen.getByText('dashboard.subjects')).toBeInTheDocument();
        expect(screen.getByText('Математика')).toBeInTheDocument();
        expect(screen.getByText('Фізика')).toBeInTheDocument();
    });
});
