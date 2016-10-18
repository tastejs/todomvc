import { connect } from 'react-redux';
import { removeCompleted } from '../actions';
import App from '../components/App';

// Passes the state as a 'todos' property
const mapStateToProps = state => {
	return ({ todos: state });
}

// Exports a wrapped version of the presentational component
export default connect(mapStateToProps)(App);
