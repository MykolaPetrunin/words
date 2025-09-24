import { render } from '@testing-library/react';

import Loading from '../loading';

describe('Login Loading', () => {
    it('renders loading skeleton', () => {
        const { container } = render(<Loading />);

        // Check that skeleton components are rendered
        const skeletons = container.querySelectorAll('[data-slot="skeleton"]');
        expect(skeletons.length).toBeGreaterThan(0);
    });
});
