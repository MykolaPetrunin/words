import { render, screen } from '@testing-library/react';
import React from 'react';

import { useAuth } from '@/lib/auth/AuthContext';

import DashboardPage from '../page';

jest.mock('@/lib/auth/AuthContext', () => ({
    useAuth: jest.fn()
}));

jest.mock('next/link', () => {
    const MockedLink = ({ children, href, className }: { children: React.ReactNode; href: string; className?: string }) => (
        <a href={href} className={className}>
            {children}
        </a>
    );
    MockedLink.displayName = 'MockedLink';
    return MockedLink;
});

describe('DashboardPage', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should render with user email', () => {
        (useAuth as jest.Mock).mockReturnValue({
            user: { email: 'test@example.com' }
        });

        render(<DashboardPage />);

        expect(screen.getByText('Вітаємо, test!')).toBeInTheDocument();
        expect(screen.getByText('Ось ваша статистика навчання на сьогодні')).toBeInTheDocument();
    });

    it('should render with default username when no email', () => {
        (useAuth as jest.Mock).mockReturnValue({
            user: {}
        });

        render(<DashboardPage />);

        expect(screen.getByText('Вітаємо, Користувач!')).toBeInTheDocument();
    });

    it('should render with default username when no user', () => {
        (useAuth as jest.Mock).mockReturnValue({
            user: null
        });

        render(<DashboardPage />);

        expect(screen.getByText('Вітаємо, Користувач!')).toBeInTheDocument();
    });

    it('should render all stat cards', () => {
        (useAuth as jest.Mock).mockReturnValue({
            user: { email: 'test@example.com' }
        });

        render(<DashboardPage />);

        expect(screen.getByText('Вивчено слів')).toBeInTheDocument();
        expect(screen.getByText('Дні поспіль')).toBeInTheDocument();
        expect(screen.getByText('Точність')).toBeInTheDocument();
        expect(screen.getByText('Час навчання')).toBeInTheDocument();

        const zeroValues = screen.getAllByText('0');
        expect(zeroValues).toHaveLength(2);
        expect(screen.getByText('0%')).toBeInTheDocument();
        expect(screen.getByText('0 хв')).toBeInTheDocument();
    });

    it('should render quick actions card', () => {
        (useAuth as jest.Mock).mockReturnValue({
            user: { email: 'test@example.com' }
        });

        render(<DashboardPage />);

        expect(screen.getByText('Швидкі дії')).toBeInTheDocument();
        expect(screen.getByText('Почніть навчання прямо зараз')).toBeInTheDocument();

        const objectsLink = screen.getByText("Об'єкти").closest('a');
        expect(objectsLink).toHaveAttribute('href', '/objects');
    });

    it('should render achievements card', () => {
        (useAuth as jest.Mock).mockReturnValue({
            user: { email: 'test@example.com' }
        });

        render(<DashboardPage />);

        expect(screen.getByText('Останні досягнення')).toBeInTheDocument();
        expect(screen.getByText('Ваш прогрес у навчанні')).toBeInTheDocument();
        expect(screen.getByText('Поки що немає досягнень. Почніть навчання, щоб отримати перші!')).toBeInTheDocument();
    });

    it('should render all icons', () => {
        (useAuth as jest.Mock).mockReturnValue({
            user: { email: 'test@example.com' }
        });

        const { container } = render(<DashboardPage />);

        const icons = container.querySelectorAll('svg');
        expect(icons.length).toBeGreaterThan(0);
    });
});
