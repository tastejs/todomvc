define( 'app/specs/helper', [ 'jasmine', 'jasmine_html' ],
	/**
	 * Specs Runner
	 */
	function() {
		// Load testsuite
		require([
			'app/specs/todoMVC',
		], function() {
				var jasmineEnv = jasmine.getEnv();
				var htmlReporter = new jasmine.HtmlReporter();
				jasmineEnv.addReporter( htmlReporter );
				jasmineEnv.execute();
		});
	}
);
