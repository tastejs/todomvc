function TodoApp(props) {
	'use strict';

	return (
		<TodosProvider>
			<Header />
			<FilterProvider>
				<Main />
				<Footer />
			</FilterProvider>
		</TodosProvider>
	);
}
