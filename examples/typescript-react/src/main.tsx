import { TodoModel } from './model';
import * as ReactDOM from 'react-dom';
import * as React from 'react';
import { AppComponent } from './AppComponent';

const model = new TodoModel('react-todos');

function render() {
	ReactDOM.render(
		<AppComponent model={model} />,
		document.getElementsByClassName('todoapp')[0]
	);
}

model.subscribe(render);
render();
