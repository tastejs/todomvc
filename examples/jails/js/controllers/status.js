/*global define */
/*jshint unused:false */

define([

	'jails',
	'models/todo',
	'models/status'

], function( jails, todo, status ){

	'use strict';

	return jails.controller('status', function( html, data ){

		var
			ctrl = this,
			view = this.x('[data-component*=view]');

		this.init = function(){

			initmodel();

			this.subscribe('model:update', update);
			this.watch('.clear-completed', 'click', todo.clear );
		};

		function initmodel(){

			var list = html.find('.filters'),
				filters  = list.data('filters'),
				items 	= html.find('.items');

			status.init({
				plural 	:items.data('plural'),
				singular:items.data('singular'),
				filters	:filters
			});
		}

		function update(){

			if( todo.count() > 0){
				view('render', status);
				html.removeClass('hide');
			}
			else{
				html.addClass('hide');
			}
		}
	});
});
