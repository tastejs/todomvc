var fire = require('fire');
var app = fire.app('todomvc');

app.directive(function todoEscape() {
	var ESCAPE_KEY = 27;

	return function(scope, elem, attrs) {
		elem.bind('keydown', function(event) {
			if(event.keyCode === ESCAPE_KEY) {
				scope.$apply(attrs.todoEscape);
			}
		});
	};
});
