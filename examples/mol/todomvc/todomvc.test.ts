namespace $.$$ {
	
	function add_task( app: $todomvc, title = 'test title' ) {
		app.Add().value( title )
		app.Add().submit()
		return app.task_rows().at(-1)!
	}

	$mol_test({

		'task add'( $ ) {

			const app = $todomvc.make({ $ })
			
			const rows = app.task_rows()
			const title = $mol_guid()

			app.Add().value( title )
			app.Add().submit()
			
			const task1 = app.task_rows().at(-1)!
			const task2 = add_task( app, title )
	
			$mol_assert_equal( task1.title(), task2.title(), title )
			$mol_assert_equal( task1.completed(), task2.completed(), false )

			$mol_assert_equal( app.task_rows(), [ ... rows, task1, task2 ] )
			$mol_assert_equal( app.Add().value(), '' )

		} ,

		'task rename'( $ ) {

			const title = $mol_guid()

			save: {

				const app = $todomvc.make({ $ })
				const task = add_task( app )

				task.Title().value( title )

			}

			load: {

				const app = $todomvc.make({ $ })
				$mol_assert_equal( app.task_rows().at(-1)!.Title().value(), title )

			}

		} ,

		'task toggle'( $ ) {

			save: {

				const app = $todomvc.make({ $ })
				const task = add_task( app )

				$mol_assert_equal( task.Complete().checked(), false )

				task.Complete().click()

			}

			toggle: {

				const app = $todomvc.make({ $ })
				
				const task = app.task_rows().at(-1)!
				$mol_assert_equal( task.Complete().checked(), true )

				task.Complete().click()

			}

			load: {

				const app = $todomvc.make({ $ })
				$mol_assert_equal( app.task_rows().at(-1)!.Complete().checked(), false )

			}

		} ,

		'task delete'( $ ) {

			const app = $todomvc.make({ $ })
			const task = add_task( app )

			task.Drop().click()
			$mol_assert_equal( false, app.task_rows().includes( task ) )

		} ,

		'navigation'( $ ) {

			const app = $todomvc.make({ $ })
			const task1 = add_task( app )
			const task2 = add_task( app )
			
			task2.Complete().click()

			$mol_assert_equal( true, app.task_rows().includes( task1 ) )
			$mol_assert_equal( true, app.task_rows().includes( task2 ) )

			$.$mol_state_arg.href( app.Filter_completed().uri() )
			$mol_assert_equal( false, app.task_rows().includes( task1 ) )
			$mol_assert_equal( true, app.task_rows().includes( task2 ) )
			
			$.$mol_state_arg.href( app.Filter_active().uri() )
			$mol_assert_equal( true, app.task_rows().includes( task1 ) )
			$mol_assert_equal( false, app.task_rows().includes( task2 ) )
			
			$.$mol_state_arg.href( app.Filter_all().uri() )
			$mol_assert_equal( true, app.task_rows().includes( task1 ) )
			$mol_assert_equal( true, app.task_rows().includes( task2 ) )
			
		} ,

		'clear completed'( $ ) {

			const app = $todomvc.make({ $ })
			const task1 = add_task( app )
			const task2 = add_task( app )
			
			task2.Complete().click()
			$mol_assert_equal( true, app.task_rows().includes( task1 ) )
			$mol_assert_equal( true, app.task_rows().includes( task2 ) )

			app.Sweep().click()
			$mol_assert_equal( true, app.task_rows().includes( task1 ) )
			$mol_assert_equal( false, app.task_rows().includes( task2 ) )
			
		} ,

	})

}
