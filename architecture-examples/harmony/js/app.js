(function() {
	'use strict';

	var namespace = 'todos_harmony',

		tasks = hm( namespace ).cd( "tasks" ),

		todos = hm( namespace, {

			tasks: hm.table( hm( namespace ).getLocal( 'tasks' ) || [] ),

			newTask: '',

			//enum type : "", "active", "completed"
			showType: "",

			finishedCount: function() {
				return $( this.get( 'tasks' ) ).filter(
					function() {
						return this.done;
					} ).length;
			},

			unfinishedCount: function() {
				return this.get( 'tasks' ).length - this.get( 'finishedCount' );
			},

			isAllDone: function() {
				return this.get( 'finishedCount' ) === this.get( 'tasks' ).length;
			},

			handlers: {
				clearFinishedTasks: function( e ) {
					tasks.each( function( i, task ) {
						if (task.get( 'done' )) {
							task.del();
						}
					} );
				},

				addTask: function( e ) {
					var newTask = $.trim( todos.get( 'newTask' ) );

					if (newTask) {
						tasks.push( {
							taskName: newTask,
							done: false
						} );
						todos.set( 'newTask', '' );
					}
				},

				toggleAllDone: function( e ) {
					var checked = e.publisher[0].checked;
					tasks.each( function( i, model ) {
						model.set( 'done', checked );
					} );
				}
			}
		} );

	tasks.cacheable();
	todos.cd("showType" ).bookmarkable();


})();
