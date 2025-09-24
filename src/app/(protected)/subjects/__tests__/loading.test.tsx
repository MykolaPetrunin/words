import { render } from '@testing-library/react';

import Loading from '../loading';

describe('Subjects Loading', () => {
    it('renders grid skeletons', () => {
        const { container } = render(<Loading />);
        const skeletons = container.querySelectorAll('[data-slot="skeleton"]');
        expect(skeletons.length).toBeGreaterThan(0);
    });
});
