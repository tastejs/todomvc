import { connect } from 'react-redux';
import { addTodo } from '../actions';
import AddTodoComponent from '../components/AddTodo';

// Passes actions hash as a property of the
// wrapped component to dispatch the addTodo action
const mapDispatchToProps = dispatch => ({
	actions: {
		addTodo: todoName => dispatch(addTodo(todoName))
	}
});

// Exports a wrapped version of the presentational component
export default connect(null, mapDispatchToProps)(AddTodoComponent);
