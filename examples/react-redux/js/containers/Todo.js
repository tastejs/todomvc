import { connect } from 'react-redux';
import { editTodo, toggleTodo, removeTodo } from '../actions';
import Todo from '../components/Todo';

// Passes actions hash as a property of the
// wrapped component to dispatch todo actions
const mapDispatchToProps = dispatch => ({
	actions: {
		editTodo: (todo) => dispatch(editTodo(todo)),
		toggleTodo: id => dispatch(toggleTodo(id)),
		removeTodo: id => dispatch(removeTodo(id))
	}
});

// Exports a wrapped version of the presentational component
export default connect(null, mapDispatchToProps)(Todo);
