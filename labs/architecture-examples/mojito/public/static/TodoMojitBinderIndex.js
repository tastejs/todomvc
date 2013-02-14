/*jslint anon:true, sloppy:true, nomen:true*/
YUI.add('TodoMojitBinderIndex', function(Y, NAME) {
	"use strict";

	Y.namespace('mojito.binders')[NAME] = {

		init: function(mojitProxy) {
			this.mp = mojitProxy;
		},

		bind: function(node) {
			var self = this;

			this.node = node;
			this.inputNode = node.one('#new-todo');
			this.listNode = node.one('#todo-list');
			this.toggleAll = node.one('#toggle-all');
			this.main = node.one('#main');

			this.addHandlers();

			self.resync();
		},

		resync: function() {
			var self = this;
			//Y.log('resync called', 'warn', NAME);
			self.mp.invoke('operate',  { 'params': { 'body': { 'op': 'get' } }}, function(err, response) {
				if(!err) {
					self.listNode.set('innerHTML', '');
					if(response) {
						self.listNode.append(response);
					}
					self._resyncUI();
				}
			});
		},

		_resyncUI: function() {
			var n = this.node,
				toggles = n.all('.toggle'),
				size = toggles.size(),
				allSel = true,
				i;

			//Y.log('Size: ' + size, 'warn', NAME);
			for(i = 0; i < size; i++) {
				if(!toggles.item(i).get('checked')) {
					allSel = false;
					break;
				}
			}
			this.toggleAll.set('checked', size > 0 ? allSel : false);
			this.main[size > 0 ? 'show': 'hide']();
		},

		addHandlers: function() {
			var node = this.node,
				self = this;

			this.inputNode.on('keypress', function(e) {
				self.addItem(e);
			});

			this.toggleAll.on('click', function(e) {
				//mark all completed <=> not completed
				self.batchMark();
			});

			node.delegate(['keypress', 'change', 'blur'], function(e) {
				if(e.type === 'change' || e.type === 'blur' || e.keyCode === 13 || e.keyCode === 27) {
					self.stopEdit(e);
				}
			}, '.edit');

			node.delegate(['dblclick'], function(e) {
				self.startEdit(e);
			}, 'div.view > label');

			node.delegate('click', function(e) {
				self.deleteItem(e);
			}, '.destroy');

			node.delegate('click', function(e) {
				self.toggleItem(e);
			}, '.toggle');
		},

		batchMark: function() {
			var allCompleted = this.toggleAll.get('checked'),
				self = this;

			this.listNode.all('li').each(function(liNode) {
				liNode[allCompleted ? 'addClass' : 'removeClass']('completed');
				liNode.one('.toggle').set('checked', allCompleted);
			});

			this.mp.invoke('operate', {
				'params': {
					'body': { 'op': 'batchMark', 'data': allCompleted }
				}
			}, function(err, response) {
				if(err) {
					alert('Error updating: ' + err);
				} else {
					self.resync();
				}
			});
		},

		toggleItem: function(e) {
			var cbox = e.currentTarget,
				complete = cbox.get('checked'),
				li = cbox.ancestor('li'),
				id = li.get('id'),
				self = this;

			this.mp.invoke('operate', { 'params': {
				'body': { 'op': 'toggle', 'data': id }
			}}, function(err, response) {
				if(err) {
					alert('Error: ' + err);
				} else {
					//li[complete ? 'addClass' : 'removeClass']('completed');
					self.resync();
				}
			});
		},

		startEdit: function(e) {
			var lbl = e.currentTarget,
				li = lbl.ancestor('li');

			li.addClass('editing');
			li.one('.edit').focus().select();
		},

		stopEdit: function(e) {
			//alert('value: ' + e.currentTarget.get("value"));
			var input = e.currentTarget,
				li = input.ancestor('li'),
				lbl = li.one('label'),
				value = Y.Escape.html(Y.Lang.trim(input.get("value"))),
				oldValue = lbl.getHTML(),
				id = li.get('id'),
				completed = li.one('.toggle').get('checked'),
				self = this;

			li.removeClass('editing');
			if(e.keyCode === 27) {
				input.set("value", oldValue);
			} else {
				self.updateItem(id, value, completed);
				lbl.setHTML(value);
			}
		},

		updateItem: function(id, value, completed) {
			var self = this,
				itemObj = { "id": id, "title": value, "completed": completed };
			this.mp.invoke('operate', {
				'params': { 'body': { 'op': 'update', 'data': Y.JSON.stringify(itemObj) }}
			}, function(err, response) {
				if(err) {
					alert('Error while updating: ' + err);
				} else {
					self.resync();
				}
			});
		},

		deleteItem: function(e) {
			var btn = e.target,
				li = btn.ancestor('li'),
				itemId = li.get('id'),
				self = this;

			this.mp.invoke('operate', { 'params':
				{ 'body': { 'op': 'delete', 'data': itemId }}
			}, function(err, response) {
				if(err) {
					alert('Error while deleting: ' + err);
				} else {
					//li.get('parentNode').removeChild(li);
					self.resync();
				}
			});
		},

		addItem: function(e) {
			var value = Y.Escape.html(Y.Lang.trim(this.inputNode.get('value'))),
				self  = this;

			if (e.keyCode !== 13 || !value) {
				return;
			}

			this.mp.invoke('operate', {
				params: {
					'body': {
						'op': 'add',
						'data': Y.JSON.stringify({ 'title': value })
					}
				}
			}, function(err, response) {
				if(err) {
					alert('Error occurred: ' + err);
				} else {
					self.inputNode.set('value', '');
					self.resync();
				}
			});
		}
	};

}, '0.0.1', {requires: ['mojito-client', 'node', 'json' ]});
