import { connect } from 'react-redux';
import { toggleAll } from '../actions';
import TodoList from '../components/TodoList';

// Passes actions hash as a property of the
// wrapped component to dispatch the toggleAll action
const mapDispatchToProps = dispatch => ({
	actions: {
		toggleAll: () => dispatch(toggleAll())
	}
});

// Exports a wrapped version of the presentational component
export default connect(null, mapDispatchToProps)(TodoList);
