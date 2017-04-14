'use strict';

$.my.cache({
	
	id: 'todoMVC.App.Row', 
	
	params: {strict: true},
	
	data: {title: '', completed: false},
	
	ui: {
		'.edit': {
			bind: function (d, v, $o) {
				if (null != v) {
					d.title = v.trim();
					$o.my().root.removeClass('editing');
					if (!d.title) $o.trigger('remove');
				}
				return d.title;
			},
			init: function($o){
				$o.keydown(function(e) {
					if (e.keyCode == 13) $o.blur();
					else if (e.keyCode == 27) $o.val($o.data('stash')).blur();
				});
			},
			events:'blur.my'
		},
		
		'label': {
			bind: function (d, v, $o) {
				if (null != v) {
					$o.my().root.addClass('editing')
					.find('.edit')
					.focus()
					.data('stash', d.title);
				}
				return d.title;
			},
			events: 'dblclick.my',
			watch: '.edit'
		},
		
		'.destroy': {
			bind: function (d, v, $o) {
				if (null != v) $o.trigger('remove');
			}
		},
		
		'.toggle': {
			bind: function (d, v, $o) {
				if (null != v) {
					d.completed = !!v[0];
					$o.my().root.toggleClass('completed', d.completed);
				}
				return d.completed?['done']:[];
			}
		}
	}
});