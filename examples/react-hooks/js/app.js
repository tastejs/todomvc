/* global React, ReactDOM */
(function(window) {
	'use strict';

	window.ENTER_CODE = 13;
	window.ESC_CODE = 27;

	ReactDOM.render(<TodoApp />, document.querySelector('.todoapp'));
})(window);
