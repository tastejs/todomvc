import { connect } from 'react-redux';
import { removeCompleted } from '../actions';
import Footer from '../components/Footer';

// Passes the state as a 'todos' property
const mapStateToProps = state => ({ todos: state });

// Passes actions hash as a property of the
// wrapped component to dispatch the removeCompleted action
const mapDispatchToProps = dispatch => ({
	actions: {
		removeCompleted: () => dispatch(removeCompleted())
	}
});

// Exports a wrapped version of the presentational component
export default connect(mapStateToProps, mapDispatchToProps)(Footer);
