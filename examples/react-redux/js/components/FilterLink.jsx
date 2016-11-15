import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { ALL } from '../constants';

const FilterLink = ({ filter, children }) => {
	const linkFilter = filter === ALL ? '' : filter;
	return (
		<Link to={linkFilter}
			activeClassName="selected">
			{children}
		</Link>
	)
}

FilterLink.propTypes = {
	children: PropTypes.node.isRequired,
	filter: PropTypes.string.isRequired
};

export default FilterLink;
