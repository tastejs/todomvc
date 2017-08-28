/*jshint quotmark:false */
/*jshint white:false */
/*jshint trailing:false */
/*jshint newcap:false */
/*global React, Router*/
import React from 'react';
import ReactDOM from 'react-dom';
import TodoApp from './todoApp.es6';

var model = new app.TodoModel('react-todos');

function render() {
	ReactDOM.render(
		<TodoApp model={model}/>,
		document.getElementsByClassName('todoapp')[0]
	);
}

model.subscribe(render);
render();
