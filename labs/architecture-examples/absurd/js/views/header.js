(function () {
	'use strict';

	App.Header = absurd.component('Header', {
		// That's the DOM element which the component will operate on.
		html: '#header',
		// Event handler.
		onInputChanged: function(e) {
			if(e.keyCode == 13 && e.target.value.toString().trim() != '') {
				this.model.add(e.target.value.trim());
				e.target.value = '';
			}
		},
		// The entry point of the componment
		constructor: function(model) {
			this.model = model;
			this.populate();
		}
	});

})();