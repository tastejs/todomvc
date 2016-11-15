import React from 'react';
import Header from '../components/Header';
import VisibleTodoList from '../containers/VisibleTodoList';
import Footer from '../containers/Footer';

const App = ({ todos }) => {
	let visibleTodoList,
		footer;

	if (todos.length) {
		visibleTodoList = <VisibleTodoList />
		footer = <Footer />
	} else {
		visibleTodoList = footer = null;
	}

	return (
		<div>
			<Header />
			{ visibleTodoList }
			{ footer }
		</div>
	)
}
export default App
