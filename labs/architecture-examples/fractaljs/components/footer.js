/* jshint newcap: false */
/* global F, getStore, $ */
F(function(){
	'use strict';
	F('footer', F.Component.extend({
		init: function(name, $container){
			var self = this;
			self._super(name, $container);
			self.store = getStore();
			self.store.onChange(function(){
				self.load();
			});
		},
		afterRender: function(callback){
			var self = this;
			self.$('#filters li a').click(function(){
				self.$('#filters li a').each(function(){
					$(this).removeClass('selected');
				});
				$(this).addClass('selected');
			});
			self.$('#clear-completed').click(function(){
				var data = self.store.getAll();
				var idList = data.filter(function(v){ return v.completed; }).map(function(v){ return v._id; });
				self.store.remove(idList);
			});
			callback();
		},
		getData: function(callback){
			var data = this.store.getAll();
			var nbTodo = data.filter(function(v){ return !v.completed; }).length;
			this.data = {
				hasTodos: data.length > 0,
				nbTodo: nbTodo,
				plural: nbTodo !== 1,
				nbCompleted: data.filter(function(v){ return v.completed; }).length
			};
			callback();
		}
	}));
});
