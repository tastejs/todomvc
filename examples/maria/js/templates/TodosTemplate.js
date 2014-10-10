/*global checkit */

// In a full development environment this template would be expressed
// in a file containing only HTML and be compiled to the following as part
// of the server/build functionality.
//
// Due to the limitations of a simple example that does not require
// any special server environment to try, the manually compiled version is
// included here.
//
checkit.TodosAppTemplate =
	'<section id="todoapp">' +
		'<header id="header">' +
			'<h1>todos</h1>' +
			'<input id="new-todo" placeholder="What needs to be done?" autofocus>' +
		'</header>' +
		'<section id="main">' +
			'<input id="toggle-all" type="checkbox">' +
			'<label for="toggle-all">Mark all as completed</label>' +
			'<ul id="todo-list"></ul>' +
		'</section>' +
		'<footer id="footer">' +
			'<span id="todo-count"></span>' +
			'<ul id="filters">' +
				'<li>' +
					'<a class="all-filter" href="#/">All</a>' +
				'</li>' +
				'<li>' +
					'<a class="incompleted-filter" href="#/active">Active</a>' +
				'</li>' +
				'<li>' +
					'<a class="completed-filter" href="#/completed">Completed</a>' +
				'</li>' +
			'</ul>' +
			'<button id="clear-completed"></button>' +
		'</footer>' +
	'</section>';
