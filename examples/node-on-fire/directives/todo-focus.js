var fire = require('fire');
var app = fire.app('todomvc');

app.directive(function todoFocus($timeout) {
	return function(scope, elem, attrs) {
		scope.$watch(attrs.todoFocus, function(newVal) {
			if(newVal) {
				$timeout(function() {
					elem[0].focus();
				}, 0, false);
			}
		});
	};
});
