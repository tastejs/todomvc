(function () {
	'use strict';

	App.Header = absurd.component('Header', {
		html: '#header',
		onInputChanged: function(e) {
			if(e.keyCode == 13 && e.target.value.toString().trim() != '') {
				this.model.add(e.target.value);
				e.target.value = '';
			}
		},
		constructor: function(model) {
			this.model = model;
			this.populate();
		}
	});

})();