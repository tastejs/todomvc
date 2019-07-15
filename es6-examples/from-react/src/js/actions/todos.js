import checkStatus from '@app-libs/check-status';
import fetchOptions from '@app-libs/fetch-options';
/**
 * @author Jonmathon Hibbard
 * @license MIT
 */
const METHOD_TYPE_POST = 'POST';
const POST_JSON_HEADERS =  {
	'Accept': 'application/json',
	'Content-Type': 'application/json'
};

const todoDefaults = {
	title: '',
	order: 0,
	completed: false
};

export const TODOS_URL = '/todos';
export const TODO_URL = '/todo';

export const fetchTodos = () => fetch(TODOS_URL, fetchOptions).then(checkStatus).then(response => response.json());
export const createTodo = props => {
	const todo  = { ...todoDefaults, ...props };

	return fetch(TODO_URL, {
		method: METHOD_TYPE_POST,
		headers: POST_JSON_HEADERS,
		body: JSON.stringify(todo)
	}).then(response => {
		if (response.status !== 200) {
			// handle the error!  fer now just log it.
			console.log(`Error Posting Todo Data.    Error status: ${ response.status }, Error status text: ${ response.statustext }`)
		} else {
			console.log('Todo Data saved successfully!');
		}
	}).catch(err => {
		console.log(err);
	});
};
