import React from 'react';
import Header from '../components/Header';
import VisibleTodoList from '../containers/VisibleTodoList';
import Footer from '../containers/Footer';

const App = () => {
	return (
		<div>
			<Header />
			<VisibleTodoList />
			<Footer />
		</div>
	)
}
export default App
