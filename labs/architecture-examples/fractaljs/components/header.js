/* jshint newcap: false */
/* global F, getStore, ENTER_KEY */
F(function(){
	'use strict';
	F('header', F.Component.extend({
		afterRender: function(callback) {
			var self = this;
			var $input = self.$('#new-todo');
			$input.keydown(function(event){
				if (event.keyCode === ENTER_KEY) {
					var value = $input.val().trim();
					if (value) {
						getStore().insert({ completed: false, value: value });
					}
					$input.val('');
				}
			});
			callback();
		}
	}));
});
