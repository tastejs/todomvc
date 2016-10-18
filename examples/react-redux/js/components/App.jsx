import React from 'react';
import Header from '../components/Header';
import VisibleTodoList from '../containers/VisibleTodoList';
import Footer from '../containers/Footer';

const App = ({ todos }) => {
	const visibleTodoList = todos.length ? <VisibleTodoList /> : null;
	const footer = todos.length ? <Footer /> : null;

	return (
		<div>
			<Header />
			{ visibleTodoList }
			{ footer }
		</div>
	)
}
export default App
