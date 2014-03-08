(function () {
	'use strict';

	App.Footer = absurd.component('Footer', {
		html: '#footer',
		filterIndex: 0,
		styles: function(shown) {
			this.css = { 
				'#footer': {
					display: shown ? 'block' : 'none'
				} 
			}
			this.css['#footer']['#filters li:nth-child(' + (this.filterIndex + 1) + ') a'] = { fontWeight: 'bold' };
		},
		constructor: function(model, router) {
			this.model = model;
			this.model.on('updated', this.bind(this.update));
		},
		update: function(filterIndex) {
			this.filterIndex = typeof filterIndex != 'undefined' ? filterIndex : 0;
			this.styles(this.model.all() > 0);
			this.populate();
			return this;
		},
		clearCompleted: function() {
			this.model.clearCompleted();
		}
	});

})();