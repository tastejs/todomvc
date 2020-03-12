namespace $.$$ {

	$mol_test({

		'task add'( $ ) {

			const app = $hyoo_todomvc.make({ $ })

			$mol_assert_like( app.task_ids() , [] )

			app.Add().value( 'test title' )
			app.Add().done()

			$mol_assert_like( app.task_ids() , [ 1 ] )

			$mol_assert_equal( app.Task_row(1).title() , 'test title' )
			$mol_assert_equal( app.Task_row(1).completed() , false )
			
			$mol_assert_equal( app.Add().value() , '' )

		} ,

		'task rename'( $ ) {

			const app = $hyoo_todomvc.make({ $ })

			app.Add().value( 'test title' )
			app.Add().done()

			$mol_assert_equal( app.task_title( 1 ) , 'test title' )

			app.Task_row(1).Title().value( 'test title 2' )
			$mol_assert_equal( app.task_title( 1 ) , 'test title 2' )

		} ,

		'task toggle'( $ ) {

			const app = $hyoo_todomvc.make({ $ })

			app.task_title_new( 'test title' )
			app.add()

			$mol_assert_equal( app.task_completed( 1 ) , false )

			app.Task_row(1).Complete().click()
			$mol_assert_equal( app.task_completed( 1 ) , true )
			
			app.Task_row(1).Complete().click()
			$mol_assert_equal( app.task_completed( 1 ) , false )
			
		} ,

		'navigation'( $ ) {

			const app = $hyoo_todomvc.make({ $ })

			app.Add().value( 'test title' )
			app.Add().done()

			app.Add().value( 'test title 2' )
			app.Add().done()

			app.Task_row(1).Complete().click()

			$mol_assert_like( app.task_ids_filtered() , [ 1 , 2 ] )

			$.$mol_state_arg.href( app.Filter_completed().uri() )
			$mol_assert_like( app.task_ids_filtered() , [ 1 ] )
			
			$.$mol_state_arg.href( app.Filter_active().uri() )
			$mol_assert_like( app.task_ids_filtered() , [ 2 ] )
			
			$.$mol_state_arg.href( app.Filter_all().uri() )
			$mol_assert_like( app.task_ids_filtered() , [ 1 , 2 ] )
			
		} ,

	})

}
