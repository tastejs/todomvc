/*jslint anon:true, sloppy:true, nomen:true*/
YUI.add('TodoMojit', function(Y, NAME) {
	"use strict";

	Y.namespace('mojito.controllers')[NAME] = {

		index: function(ac) {
			ac.assets.addCss('./base.css');
			ac.assets.addBlob('<!--[if IE]>\n<script src="/static/' + ac.type + '/assets/ie.js"></script>\n<![endif]-->', 'top');
			ac.done({});
		},

		'getAll': function(ac) {
			var todo = ac.models.get('Todo');
			todo.getAll(function(err, items) {
				if(err) {
					ac.error(err);
				} else {
					ac.done({ "items": items }, 'items');
				}
			});
		},

		'getCompleted': function(ac) {
			var todo = ac.models.get('Todo');

			todo.getFiltered(true, function(err, items) {
				if(err) {
					ac.error(err);
				} else {
					ac.done({ "items": items, "count": items.length }, 'items');
				}
			});
		},

		'getIncomplete': function(ac) {
			var todo = ac.models.get('Todo');

			todo.getFiltered(false, function(err, items) {
				if(err) {
					ac.error(err);
				} else {
					ac.done({ "items": items, "count": items.length }, 'items');
				}
			});
		},

		'getById': function(ac) {
			var id = ac.params.getFromBody('id'),
			todo = ac.models.get('Todo');

			todo.get(id, function(err, item) {
				if(err) {
					ac.error(err);
				} else {
					ac.done(item, 'item');
				}
			});
		},

		'add': function(ac) {
			var data = ac.params.getFromBody('data'),
			todo = ac.models.get('Todo');

			data = Y.JSON.parse(data);
			todo.add(data, function(err, items) {
				if(err) {
					ac.error(err);
				} else {
					ac.done({ "items": items, "count": items.length }, 'items');
				}
			});
		},

		'delete': function(ac) {
			var id = ac.params.getFromBody('id'),
			todo = ac.models.get('Todo');

			todo.remove(id, function(err, item) {
				if(err) {
					ac.error(err);
				} else {
					ac.done('success');
				}
			});
		},

		'update': function(ac) {
			var item = ac.params.getFromBody('data'),
			todo = ac.models.get('Todo');

			item = Y.JSON.parse(item);
			if(!item.title) {
				todo.remove(item.id, function(err, item) {
					if(err) {
						ac.error(err);
					} else {
						ac.done('success');
					}
				});
			} else {
				todo.update(item, function(err, item) {
					if(err) {
						ac.error(err);
					} else {
						ac.done(item, 'item');
					}
				});
			}
		},

		'clear': function(ac) {
			var todo = ac.models.get('Todo');

			todo.removeAll(function(err, items) {
				if(err) {
					ac.error(err);
				} else {
					ac.done({ "items": items, "count": items.length }, 'items');
				}
			});
		},

		batchMark: function(ac) {
			var complete = ac.params.getFromBody('complete'),
			todo = ac.models.get('Todo');

			complete = Y.JSON.parse(complete);
			todo.batchMark(!!complete, function(err, response) {
				if(err) {
					ac.error(err);
				} else {
					ac.done('successful');
				}
			});
		},

		'toggle': function(ac) {
			var id = ac.params.getFromBody('id'),
			todo = ac.models.get('Todo');

			todo.toggle(id, function(err, item) {
				if(err) {
					ac.error(err);
				} else {
					ac.done(item, 'item');
				}
			});
		}
	};

}, '0.0.1', {requires: ['mojito', 'TodoMojitModelTodo',
 'mojito-models-addon',  'json',
 'mojito-assets-addon', 'mojito-params-addon']});
