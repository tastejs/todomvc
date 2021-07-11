import React from 'react';
import { render } from '@testing-library/react';

import { BadgeComponent } from '../BadgeComponent';

describe('<BadgeComponent />', () => {
	it('should render badge', async () => {
		const { container } = await render(<BadgeComponent name='label' />);
		expect(container.firstChild).toMatchSnapshot();
	});

	it('should display text', async () => {
		const testLabel = 'some-label';
		const { findByText } = await render(<BadgeComponent name={testLabel} />);
		expect(findByText(testLabel)).toBeTruthy();
	});
});
