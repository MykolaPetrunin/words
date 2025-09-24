import { render } from '@testing-library/react';

import SubjectLoadingSkeleton from '../loading';

describe('Subject Loading Skeleton', () => {
    it('renders loading skeleton', () => {
        const { container } = render(<SubjectLoadingSkeleton />);

        // Check that skeleton components are rendered
        const skeletons = container.querySelectorAll('[data-slot="skeleton"]');
        expect(skeletons.length).toBeGreaterThan(0);
    });
});
