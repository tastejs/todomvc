/*global require*/
require.config({
	paths: {
		Stapes: '../bower_components/stapes/stapes'
	}
});

require(
		["controllers/todoController"],
		function(todoController) {
				todoController.init();
		}
);
