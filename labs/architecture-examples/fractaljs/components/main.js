/* jshint newcap: false */
/* global F, getStore, $, ENTER_KEY, ESCAPE_KEY */
F(function(){
	'use strict';
	F('main', F.Component.extend({
		init: function(name, $container){
			var self = this;
			self._super(name, $container);
			self.store = getStore();
			self.store.onChange(function(){
				self.load();
			});
			self.subscribe(F.TOPIC.ENV_CHANGED, function(topic, data){
				if (data.page) {
					var filterString = F.env.page ? F.env.page.substring(1) : '';
					self.filter = null;
					if (filterString) {
						self.filter = {
							key: 'completed',
							value: (filterString === 'completed'),
						};
					}
					self.load();
				}
			});
		},
		afterRender: function(callback){
			var self = this;

			var getId = function(){ return parseInt($(this).closest('li').data('id')); };

			self.$('#toggle-all').click(function() {
				var checked = this.checked;
				var idList = [];
				self.$('.toggle').each(function(){
					idList.push(getId.bind(this)());
					$(this).get(0).checked = checked;
				});
				self.store.update(idList, 'completed', checked);
			});
			self.$('.toggle').click(function(){
				self.store.update(getId.bind(this)(), 'completed', this.checked);
			});
			self.$('.destroy').click(function(){
				self.store.remove(getId.bind(this)());
			});
			(function(){
				var update = function(item){
					var value = $(item).val().trim();
					if (value) {
						self.store.update(getId.bind(item)(), 'value', value);
					} else {
						self.store.remove(getId.bind(item)());
					}
				};
				self.$('#todo-list li').dblclick(function(){
					$(this).addClass('editing');
					var $edit = $(this).find('.edit');
					$edit.data('before', $edit.val());
					$edit.focus();
					$edit.select();
				});
				self.$('#todo-list li .edit').blur(function(){
					update(this);
				});
				self.$('#todo-list li .edit').keydown(function(event){
					if (event.keyCode === ENTER_KEY) {
						update(this);
					} else if (event.keyCode === ESCAPE_KEY) {
						$(this).closest('li').removeClass('editing');
						$(this).val($(this).data('before'));
					}
				});
			})();
			callback();
		},
		getData: function(callback){
			var data = this.store.getAll();
			var f = this.filter;
			var filtered = f ? data.filter(function(v){ return v[f.key] === f.value; }) : data;
			this.data = {
				hasTodos: data.length > 0,
				todos: filtered,
				allCompleted: function(){
					return !data.filter(function(v){ return !v.completed; }).length;
				}
			};
			callback();
		}
	}));
});

