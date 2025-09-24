import { render } from '@testing-library/react';

import Loading from '../loading';

describe('Protected Root Loading', () => {
    it('renders sidebar and content skeletons', () => {
        const { container } = render(<Loading />);
        const skeletons = container.querySelectorAll('[data-slot="skeleton"]');
        expect(skeletons.length).toBeGreaterThan(0);
    });
});
