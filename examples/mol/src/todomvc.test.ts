namespace $.$$ {

	$mol_test({

		'task add'( $ ) {

			const app = $hyoo_todomvc.make({ $ })

			const rows = app.task_rows()
			const title = Math.random().toString(16).slice(2)

			app.Add().value( title )
			app.Add().done()

			$mol_assert_equal( app.task_rows()[0].title() , title )
			$mol_assert_equal( app.task_rows()[0].completed() , false )

			$mol_assert_like( app.task_rows().slice(1) , rows )
			
			$mol_assert_equal( app.Add().value() , '' )

		} ,

		'task rename'( $ ) {

			const title = Math.random().toString(16).slice(2)

			save: {

				const app = $hyoo_todomvc.make({ $ })

				app.Add().value( 'test title' )
				app.Add().done()

				app.task_rows()[0].Title().value( title )

			}

			load: {

				const app = $hyoo_todomvc.make({ $ })
				$mol_assert_equal( app.task_rows()[0].Title().value() , title )

			}

		} ,

		'task toggle'( $ ) {

			save: {

				const app = $hyoo_todomvc.make({ $ })

				app.Add().value( 'test title' )
				app.Add().done()

				$mol_assert_equal( app.task_rows()[0].Complete().checked() , false )

				app.task_rows()[0].Complete().click()

			}

			toggle: {

				const app = $hyoo_todomvc.make({ $ })
				$mol_assert_equal( app.task_rows()[0].Complete().checked() , true )

				app.task_rows()[0].Complete().click()

			}

			load: {

				const app = $hyoo_todomvc.make({ $ })
				$mol_assert_equal( app.task_rows()[0].Complete().checked() , false )

			}

		} ,

		'task delete'( $ ) {

			const app = $hyoo_todomvc.make({ $ })

			app.Add().value( 'test title' )
			app.Add().done()

			const top = app.task_rows()[0]
			
			top.Drop().click()
			$mol_assert_not( app.task_rows().includes( top ) )

		} ,

		'navigation'( $ ) {

			const app = $hyoo_todomvc.make({ $ })

			app.Add().value( 'test title' )
			app.Add().done()

			const task1 = app.task_rows()[0]
			
			app.Add().value( 'test title 2' )
			app.Add().done()

			const task2 = app.task_rows()[1]
			task2.Complete().click()

			$mol_assert_ok( app.task_rows().includes( task1 ) )
			$mol_assert_ok( app.task_rows().includes( task2 ) )

			$.$mol_state_arg.href( app.Filter_completed().uri() )
			$mol_assert_not( app.task_rows().includes( task1 ) )
			$mol_assert_ok( app.task_rows().includes( task2 ) )
			
			$.$mol_state_arg.href( app.Filter_active().uri() )
			$mol_assert_ok( app.task_rows().includes( task1 ) )
			$mol_assert_not( app.task_rows().includes( task2 ) )
			
			$.$mol_state_arg.href( app.Filter_all().uri() )
			$mol_assert_ok( app.task_rows().includes( task1 ) )
			$mol_assert_ok( app.task_rows().includes( task2 ) )
			
		} ,

		'clear completed'( $ ) {

			const app = $hyoo_todomvc.make({ $ })

			app.Add().value( 'test title' )
			app.Add().done()

			const task1 = app.task_rows()[0]
			
			app.Add().value( 'test title 2' )
			app.Add().done()

			const task2 = app.task_rows()[1]
			task2.Complete().click()

			$mol_assert_ok( app.task_rows().includes( task1 ) )
			$mol_assert_ok( app.task_rows().includes( task2 ) )

			app.Sweep().click()
			$mol_assert_ok( app.task_rows().includes( task1 ) )
			$mol_assert_not( app.task_rows().includes( task2 ) )
			
		} ,

	})

}
