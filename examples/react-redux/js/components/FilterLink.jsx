import React, { PropTypes } from 'react';
import { Link } from 'react-router';

const FilterLink = ({ filter, children }) => {
	return (
		<Link to={filter === 'ALL' ? '' : filter}
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
