/*global define */
/*jshint unused:false */

define(['models/todo'], function(todo){

	'use strict';

	var singular, plural, filters;

	function filterItem( label ){

		return{
			label 	:label,
			slug 	:label.toLowerCase(),

			selected:function(){
				return todo.filter() === this.slug? 'selected' : '';
			}
		};
	}

	return{

		filters :[],

		init :function( o ){

			var filters, model = this;

			singular = o.singular;
			plural   = o.plural;
			filters = o.filters.replace(/\s/g, '');

			model.filters = filters.split(/,/).map(function( filter ){
				return filterItem( filter );
			});
		},

		items :function(){
			var left = todo.filters.active();
			return left.length !== 1 ? plural :singular;
		},

		clear :function(){
			var completed = todo.filters.completed();
			return completed.length? '' : 'hide';
		},

		count :function(){
			return todo.filters.active().length;
		}
	};
});
