import { render } from '@testing-library/react';

import BookLoadingSkeleton from '../loading';

describe('Book Loading Skeleton', () => {
    it('renders loading skeleton', () => {
        const { container } = render(<BookLoadingSkeleton />);

        // Check that skeleton components are rendered
        const skeletons = container.querySelectorAll('[data-slot="skeleton"]');
        expect(skeletons.length).toBeGreaterThan(0);
    });
});
