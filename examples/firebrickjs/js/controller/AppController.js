/*!
 * @author Steven Masala [me@smasala.com]
 */
define(["jquery", "knockout-mapping"], function($, kom){
	"use strict";
	var ENTER_KEY = 13,
		ESCAPE_KEY = 27; 
	return Firebrick.createController("TODOMVC.controll.AppController", {
		
		init: function(){
			var me = this;
			
			me.app.on({
				".new-todo": {
					keyup: me.onNewKeyUp
				},
				".todo-list li label": {
					dblclick: me.onLabelDblClick
				},
				".todo-list li input.edit": {
					blur: me.onEditBlur,
					keyup: me.onEditKeyUp
				},
				".clear-completed": {
					click: me.clearCompleted
				},
				".destroy": {
					click: me.onDestroy
				},
				scope: me
			});
			
			me.routes();
			
			return me.callParent( arguments ); //important!
		},
		
		/**
		 * @method routes
		 */
		routes: function(){
			var me = this;
			Firebrick.router.hashbang.set({
				"/": {
					require: ["view/AppView"]
				},
				"*/#/": {
					require: ["view/AppView"],
					callback: function(){
						me.filterTodos( "none" );
					}
				},
				"*/#/:filter": {
					require: ["view/AppView"],
					callback: function(filter){
						me.filterTodos(filter);
					}
				},
			});
			Firebrick.router.init();
		},
		
		/**
		 * @method filterTodos
		 */
		filterTodos: function( filter ){
			Firebrick.getById("mytodoview").getData().filter( filter );
		},
		
		/**
		 * @method clearCompleted
		 */
		clearCompleted: function(){
			var todos = Firebrick.getById("mytodoview").getData().todos;
			Firebrick.getById("mytodoview").getData().todos( todos().filter(function(it){
				return !it.done();
			}));
		},
		
		/**
		 * @method onNewKeyUp
		 */
		onNewKeyUp: function( event, element ){
			var me = this,
				$el,
				key = event.which,
				value;
			if( key === ENTER_KEY ){
				$el = $(element);
				value = $el.val();
				me.newTodo( $el.val() );
				$el.val("");
			}
		},
		
		newTodo: function( text ){
			Firebrick.getById("mytodoview").getData().todos.push( kom.fromJS({
				text: text,
				done: false,
				editing: false
			}) );
		},
		
		/**
		 * @method onDestroy
		 */
		onDestroy: function(event, element){
			var me = this,
				$li = $(element).closest("li"),
				id = $li.attr("id");
			Firebrick.getById("mytodoview").getData().todos.splice(id, 1);
		},
		
		/**
		 * @method onLabelDblClick
		 */
		onLabelDblClick: function(event, element){
			var me = this,
				$el = $(element).closest("li");
			me.toggleEdit( $el );
		},
		
		/**
		 * @method onEditBlur
		 */
		onEditBlur: function(event, element){
			var me = this,
				$el = $(element).parent("li");
			me.toggleEdit( $el );
		},
		
		/**
		 * @method onEditKeyUp
		 * @param $li {jQuery Object}
		 */
		onEditKeyUp: function(event, element){
			var me = this,
				key = event.which,
				$el = $(element).closest("li");
			if( key === ENTER_KEY ){
				$el.find(".edit").blur();
			}else if( key === ESCAPE_KEY ){
				me.cancelEdit( $el );
			}
		},
		
		/**
		 * @method cancelEdit
		 * @param $li {jQuery Object}
		 */
		cancelEdit: function( $li ){
			var me = this,
				data = Firebrick.utils.dataFor( $li[0] ),
				$edit = $li.find(".edit");
			$li.prop("reset-value", $li.prop("original-value") );
			$edit.blur();
		},
		
		/**
		 * @method toggleEdit
		 * @param $li {jQuery Object} parent li element
		 */
		toggleEdit: function( $li ){
			var data = Firebrick.utils.dataFor( $li[0] ),
				editing = data.editing(),
				$edit = $li.find(".edit");
			data.editing( !editing );
			if( $li.prop("reset-value") ){
				data.text( $li.prop("reset-value") );
				$li.removeProp("reset-value");
			}else if( !editing ){
				$li.prop("original-value", data.text() );
				$edit.focus();
			}
		}
		
	});
});