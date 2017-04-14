(function () {
	'use strict';

	App.Footer = absurd.component('Footer', {
		// That's the DOM element which the component will operate on.
		html: '#footer',
		// 0 - all, 1 - active, 2 - completed
		filterIndex: 0,
		// AbsurdJS could act as a CSS preprocessor. This method
		// sets the `css` property which is converted to CSS styles.
		// The styles are injected to the page dynamically.
		styles: function(shown) {
			this.css = { 
				'#footer': {
					display: shown ? 'block' : 'none'
				} 
			}
		},
		// The entry point of the component.
		constructor: function(model) {
			this.model = model;
			this.model.on('updated', this.bind(this.update));
			this.update();
		},
		// The method calls the `populate` function which 
		// updates the DOM element and the CSS styles.
		update: function(filterIndex) {
			this.filterIndex = typeof filterIndex != 'undefined' ? filterIndex : this.filterIndex;			
			this.styles(this.model.all() > 0);
			this.populate();
			return this;
		},
		// Event handler
		clearCompleted: function() {
			this.model.clearCompleted();
		}
	});

})();