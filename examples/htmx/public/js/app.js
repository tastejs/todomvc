(function (window) {
	'use strict';

	// Clear the todo label input after creating a new todo
	window.document.body.addEventListener('todoCreated', () => {
		const todoLabelInputElement = window.document.querySelector('.new-todo');
		todoLabelInputElement.value = '';
	});
})(window);
