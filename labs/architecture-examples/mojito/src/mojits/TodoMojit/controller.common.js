/*jslint anon:true, sloppy:true, nomen:true*/
YUI.add('TodoMojit', function(Y, NAME) {
	"use strict";

	Y.namespace('mojito.controllers')[NAME] = {

		index: function(ac) {
			ac.assets.addBlob('<meta charset="utf-8">\n<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">', 'top');
			ac.assets.addBlob('<link href="/static/' + ac.type + '/assets/base.css" rel="stylesheet" type="text/css" />', 'top');
			ac.assets.addBlob('<!--[if IE]>\n<script src="/static/' + ac.type + '/assets/ie.js"></script>\n<![endif]-->', 'top');
			ac.done({});
		},

		operate: function(ac) {
			var op = ac.params.getFromBody('op'),
				data = ac.params.getFromBody('data'),
				todo = ac.models.get('Todo');

			Y.log('operate called: op = ' + op + ', todo: ' + todo);
			switch(op) {
				case 'get':
					if(data) {
						data = String(data);
						switch(data) {
							case 'completed':
							case 'incomplete':
								todo.getFiltered((data == 'completed'), function(err, items) {
									if(err) {
										ac.error(err);
									} else {
										ac.done({ "items": items.reverse(), "count": items.length }, 'items');
									}
								});
								break;
							default:
								todo.get(data, function(err, item) {
									if(err) {
										ac.error(err);
									} else {
										ac.done(item, 'item');
									}
								});
								break;
						}
					} else {
						todo.getAll(function(err, items) {
							//Y.log('getAll => ' + Y.JSON.stringify(items), 'warn', NAME);
							if(err) {
								ac.error(err);
							} else {
								ac.done({ "items": items.reverse(), "count": items.length }, 'items');
							}
						});
					}
					break;
				case 'add':
					data = Y.JSON.parse(data);
					todo.add(data, function(err, items) {
						if(err) {
							ac.error(err);
						} else {
							ac.done({ "items": items.reverse(), "count": items.length }, 'items');
						}
					});
					break;
				case 'delete':
					todo.remove(data, function(err, item) {
						if(err) {
							ac.error(err);
						} else {
							ac.done('success');
						}
					});
					break;
				case 'update':
					data = Y.JSON.parse(data);
					if(!data.title) {
						todo.remove(data.id, function(err, item) {
							if(err) {
								ac.error(err);
							} else {
								ac.done('success');
							}
						});
					} else {
						todo.update(data, function(err, item) {
							if(err) {
								ac.error(err);
							} else {
								ac.done(item, 'item');
							}
						});
					}
					break;
				case 'clear':
					if(data) {
						switch(data) {
							case 'completed':
								break;
						}
					} else {
						todo.removeAll(function(err, items) {
							if(err) {
								ac.error(err);
							} else {
								ac.done({ "items": items, "count": items.length }, 'items');
							}
						});
					}
					break;
				case 'toggle':
					todo.toggle(data, function(err, item) {
						if(err) {
							ac.error(err);
						} else {
							ac.done(item, 'item');
						}
					});
					break;
				case 'batchMark':
					data = Y.JSON.parse(data);
					todo.batchMark(!!data, function(err, response) {
						if(err) {
							ac.error(err);
						} else {
							ac.done('successful');
						}
					});
					break;
				default:
					Y.log('ac.done[default/no-op]', 'error', NAME);
					ac.done('noop');
					break;
			}
		}
	};

}, '0.0.1', {requires: ['mojito', 'TodoMojitModelTodo', 'mojito-models-addon',  'json', 'mojito-assets-addon', 'mojito-params-addon']});
