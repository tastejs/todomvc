/*jshint quotmark:false */
/*jshint white:false */
/*jshint trailing:false */
/*jshint newcap:false */
/*global React, Router*/
/*global define, app */
/*jshint unused:false */
import React from 'react';
import ReactDOM from 'react-dom';
import TodoApp from './todoApp.es6';
import TodoModel from './todoModel.es6';

var model = new TodoModel('react-todos');

function render() {
	'use strict';
	ReactDOM.render(
		/* jshint ignore:start */
		<TodoApp model={model}/>,
		/* jshint ignore:end */
		document.getElementsByClassName('todoapp')[0]
	);
}

model.subscribe(render);
render();
