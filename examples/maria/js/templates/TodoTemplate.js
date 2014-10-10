/*global checkit */

// In a full development environment this template would be expressed
// in a file containing only HTML and be compiled to the following as part
// of the server/build functionality.
//
// Due to the limitations of a simple example that does not require
// any special server environment to try, the manually compiled version is
// included here.
//
checkit.TodoTemplate =
	'<li>' +
		'<div class="view">' +
			'<input class="toggle" type="checkbox">' +
			'<label></label>' +
			'<button class="destroy"></span>' +
		'</div>' +
		'<input class="edit">' +
	'</li>';
