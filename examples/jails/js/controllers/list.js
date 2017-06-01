/*global define, $*/
/*jshint unused:false */
define([

	'jails',
	'models/todo',
	'comps/view/view',
	'components/field'

], function( jails, todo ){

	'use strict';

	return jails.controller('list', function( html, data ){

		var
			checkbox,
			view = this.x('[data-component*=view]');

		this.init = function(){

			checkbox = html.find('.toggle-all');

			this.watch('.toggle', 'change', toggle);
			this.watch('.toggle-all', 'change', toggleall);
			this.watch('.destroy', 'click', destroy);
			this.watch('li', 'dblclick', edit);

			this.listen('field:save', save);
			this.listen('field:edit', save);
			this.listen('field:cancel', cancel);
			this.subscribe('model:update', update);
		};

		//I had to use e.target/e.currentTarget instead of "this" because of strict mode
		//I rather do that then use var statement.
		//I think it's more elegant to use the good old function statement.

		function update(model){

			view('render', model);

			visibility( model );
			checked( model );
		}

		function cancel(e){
			$(e.target).parent().removeClass('editing');
		}

		function save(e, message){
			var id = +e.target.getAttribute('data-id');
			todo.update( id, message );
		}

		function edit(e){
			var li = $(e.currentTarget);
			li.addClass('editing');
			li.find('.edit').focus();
		}

		function toggle(e){
			var id = +e.target.getAttribute('data-id');
			todo.status( id, e.target.checked );
		}

		function toggleall(e){
			todo.toggleall( e.target.checked );
		}

		function destroy(e){
			var id = +e.target.getAttribute('data-id');
			todo.destroy( id );
		}

		function checked(){
			var all = todo.filters.active().length > 0;
			checkbox.prop('checked', !all);
		}

		function visibility(model){

			var len = model.todos.length;

			if( len ){
				html.removeClass('hide');
			}
			else{
				html.addClass('hide');
			}
		}
	});
});
