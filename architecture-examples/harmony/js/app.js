(function() {
	'use strict';

	var namespace = 'todos_harmony',

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
					var newTask = todos.cd( 'newTask' ),
						taskName = $.trim( newTask.get() );

					if (taskName) {
						tasks.push( {
							taskName: taskName,
							done: false
						} );
						newTask.set( '' );
					}
				},

				toggleAllDone: function( e ) {
					var checked = e.publisher[0].checked;
					tasks.each( function( i, task ) {
						task.set( 'done', checked );
					} );
				}
			}

		} ).bookmarkable( "showType" ),

		tasks = todos.cd( "tasks" ).cacheable();

})();
