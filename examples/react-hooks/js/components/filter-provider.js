/* global React, Router */
const FilterContext = React.createContext(null);

function useFilter() {
	const contextValue = React.useContext(FilterContext);
	return contextValue;
}

function FilterProvider(props) {
	'use strict';

	const { children } = props;
	const contextValue = React.useState('');
	const [filter, setFilter] = contextValue;

	React.useEffect(
		() => {
			const router = new Router({
				'/': () => {
					setFilter('');
				},
				'/active': () => {
					setFilter('active');
				},
				'/completed': () => {
					setFilter('completed');
				}
			});
			router.init();
		},
		[filter]
	);

	return (
		<FilterContext.Provider value={contextValue}>
			{children}
		</FilterContext.Provider>
	);
}
