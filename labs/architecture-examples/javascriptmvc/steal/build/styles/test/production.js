steal.loading('//steal/build/styles/test/test.js');
steal('css2.css', 'css/css1.css')
	.then(function(){})
	.then('css3.css')
;
steal.loaded('//steal/build/styles/test/test.js');