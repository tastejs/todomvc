/*global define */
/*jshint unused:false */

define([

	'jails',
	'models/item'

], function( jails, modelItem ){

	'use strict';

	var model, todos = [], filter = 'all';

	model = {

		init :function( m ){
			m.forEach(function(item){ model.add( item ); });
			publish();
		},

		add :function( item ){
			todos.push( modelItem( item, todos.length ) );
			publish();
		},

		status :function( index, completed){
			todos[index].completed = completed;
			publish();
		},

		destroy :function( index ){
			todos.splice( index, 1 );
			model.sort();
			publish();
		},

		update :function( index, text ){
			todos[index].message = text;
			publish();
		},

		toggleall :function( completed ){
			todos.map(function(item){ item.completed = completed; });
			publish();
		},

		clear :function(){
			todos = model.filters.active();
			model.sort();
			publish();
		},

		sort :function(){
			todos.forEach(function( item, index ){ item.id = index; });
		},

		count :function(){
			return todos.length;
		},

		filter :function( by ){

			if(!by){
				return filter;
			}

			if( by in model.filters ){
				filter = by;
				publish();
			}
		},

		filters :{
			all :function(){
				return todos;
			},
			completed :function(){
				return todos.filter(function(item){ return item.completed; });
			},
			active :function(){
				return todos.filter(function(item){ return !item.completed; });
			}
		}
	};

	function publish(){
		jails.publish('model:update', {
			todos :model.filters[ filter ]()
		});
	}

	return model;
});
