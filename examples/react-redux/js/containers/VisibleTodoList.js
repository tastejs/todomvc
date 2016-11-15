import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import TodoList from './TodoList';
import { ALL, ACTIVE, COMPLETED } from '../constants';

const getVisibleTodos = (todos, filter) => {
	switch (filter) {
		case ALL:
			return todos;
		case COMPLETED:
			return todos.filter(t => t.completed);
		case ACTIVE:
			return todos.filter(t => !t.completed);
		default:
			throw new Error('Unknown filter: ' + filter);
	}
};

// Passes the filtered state as a 'todos' property of our list
const mapStateToProps = (state, { params }) => ({
	todos: getVisibleTodos(state, params.filter || ALL)
});

// Exports a wrapped version of the presentational component
export default withRouter(connect(mapStateToProps)(TodoList));
