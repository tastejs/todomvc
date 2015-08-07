/*!
 * @author Steven Masala [me@smasala.com]
 */
define(["text!./AppView.html", "knockout"], function(tpl, ko){
	"use strict";
	return Firebrick.createView("TODOMVC.view.AppView", {
		id: "mytodoview",
		target: "#app",
		tpl: tpl,
		store: {
			todos: []
		},
		init: function(){
			var me = this,
				computed;
			
			me.store.allChecked = function(){
				computed = computed || ko.computed({
					read: function () {
					    var tasks = me.store.todos || me.getData().todos(),
				    		done;
					    for (var i=0; i<tasks.length; ++i) {
					    	done = $.isFunction( tasks[i].done ) ? tasks[i].done() : tasks[i].done;
					        if (!done) {
					            return false;
					        }
					    }
					    return true;
					},
					write: function (newValue) {
					    var tasks = me.getData().todos();
					    for (var i=0; i<tasks.length; ++i) {
					        tasks[i].done(newValue);
					    }
					}
				});
				return computed;
			};
			
			me.store.filter = "none";
			
			me.store.getTodos = function(){
				var data = me.getData(),
					filter = data.filter(),
					todos = data.todos(),
					filtered = ko.observableArray(),
					it, done;

				if( filter === "none" ){
					return todos;
				} else {
					for(var i = 0, l = todos.length; i<l; i++){
						it = todos[i];
						done = it.done();
						if( filter === "active" && !done ){
							filtered.push( it );
						}else if ( filter === "completed" && done ){
							filtered.push( it );
						}
					}
					return filtered;
				}
				
			};
			
			me.store.getTodosLeft = function(){
				return me.getData().todos().filter(function(it){
					return !it.done();
				}).length;
			}
			
			me.store.itemText = function(){
				var num = me.getData().getTodosLeft();
				if(num === 1){
					return "item"
				}else{
					return "items";
				}
			}
					
			return me.callParent( arguments ); //important!
		}
	});
});