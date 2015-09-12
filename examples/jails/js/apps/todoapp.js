/*global define */
/*jshint unused:false */

define([

	'jails',
	'models/todo',
	'mods/routr/routr',
	'mods/storage/storage',
	'controllers/list',
	'controllers/status',
	'components/field'

], function( jails, todo, routr, storage ){

	'use strict';

	return jails.app('todoapp', function( html, data ){

		var app = this, todos;

		this.init = function(){

			todo.init( (storage.local.get('todos') || []) );

			this.listen('field:save', add);
			this.subscribe('model:update', save);

			routes();
		};

		function routes(){
			routr({
				'/:filter' 	:filter,
				'' 			:filter
			}).run().watch();
		}

		function save(){
			storage.local.set('todos', todo.filters.all());
		}

		function add( e, message ){
			todo.add({ message :message });
		}

		function filter( param ){
			param = param || 'all';
			todo.filter( param );
		}
	});
});
