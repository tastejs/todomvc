/*global Todos DS */
'use strict';

Todos.Store = DS.Store.extend({
	revision: 13,
	adapter: 'Todos.LSAdapter'
});

Todos.LSAdapter = DS.LSAdapter.extend({
	namespace: 'todos-emberjs'
});
