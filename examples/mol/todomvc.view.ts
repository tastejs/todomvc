interface $mol_app_todomvc_task {
	completed? : boolean
	title? : string
}

namespace $.$mol {
	
	export class $mol_app_todomvc_add extends $.$mol_app_todomvc_add {
		
		event_press( next? : KeyboardEvent ) {
			switch( next.keyCode ) {
				case $mol_keyboard_code.enter : return this.event_done( next )
			}
		}
		
	}
	
	export class $mol_app_todomvc extends $.$mol_app_todomvc {
		
		task_ids( next? : number[] ) : number[] {
			return $mol_state_local.value( this.state_key( 'mol-todos' ) , next ) || []
		}
		
		arg_completed() {
			return $mol_state_arg.value( this.state_key( 'completed' ) )
		}

		@ $mol_mem()
		groups_completed() {
			var groups : { [ index : string ] : number[] } = { 'true' : [] , 'false' : [] }
			for( let id of this.task_ids() ) {
				var task = this.task( id )
				groups[ String( task.completed ) ].push( id )
			}
			return groups
		}

		@ $mol_mem()
		tasks_filtered() {
			var completed = this.arg_completed()
			if( completed ) {
				return this.groups_completed()[ completed ] || []
			} else {
				return this.task_ids()
			}
		}

		@ $mol_mem()
		completed_all( next? : boolean ) {
			if( next === void 0 ) return this.groups_completed()[ 'false' ].length === 0
			
			for( let id of this.groups_completed()[ String( !next ) ] ) {
				var task = this.task( id )
				this.task( id , { title : task.title , completed : next } )
			}
			
			return next
		}
		
		head_complete_enabled() {
			return this.task_ids().length > 0 
		}

		@ $mol_mem()
		pending_message() {
			let count = this.groups_completed()[ 'false' ].length
			return ( count === 1 ) ? '1 item left' : `${count} items left`
		}
		
		@ $mol_mem()
		new_id() {
			return Math.max( 1 , 1 + Math.max( ... this.task_ids() ) )
		}
		
		event_add( next : Event ) {
			var title = this.task_title_new() 
			if( !title ) return
			
			var id = this.new_id()
			var task = { completed : false , title }
			this.task( id , task )
			
			this.task_ids( this.task_ids().concat( id ) )
			this.task_title_new( '' )
		}

		@ $mol_mem()
		task_rows() {
			return this.tasks_filtered().map( ( id , index )=> this.Task_row( index ) )
		}
		
		task( id : number , next? : $mol_app_todomvc_task ) {
			const key = this.state_key( `mol-todos-${id}` )
			if( next === void 0 ) {
				return $mol_state_local.value<$mol_app_todomvc_task>( key ) || { title : '' , completed : false }
			}
			
			$mol_state_local.value( key , next )
			
			return next || void 0
		}
		
		@ $mol_mem_key()
		task_completed( index : number , next? : boolean ) {
			var id = this.tasks_filtered()[ index ]
			if( next === void 0 ) return this.task( id ).completed
			
			this.task( id , $mol_merge_dict( this.task( id ) , { completed : next } ) )
			
			return next
		}
		
		@ $mol_mem_key()
		task_title( index : number , next? : string ) {
			var id = this.tasks_filtered()[ index ]
			if( next === void 0 ) return this.task( id ).title
			
			this.task( id , $mol_merge_dict( this.task( id ) , { title : next } ) )
			
			return next
		}
		
		event_task_drop( index : number , next? : Event ) {
			var tasks = this.tasks_filtered()
			var id = tasks[index]
			tasks = tasks.slice( 0 , index ).concat( tasks.slice( index + 1 , tasks.length ) )
			this.task( id , null )
			this.task_ids( tasks )
		}

		event_sweep() {
			this.task_ids( this.task_ids().filter( id => {
				if( !this.task( id ).completed ) return true
				this.task( id , null )
				return false
			} ) )
		}
		
		panels() {
			return [
				this.Head() , 
				this.List() ,
				this.foot_visible() ? this.Foot() : null ,
			]
		}
		
		foot_visible() {
			return this.task_ids().length > 0
		}

		sweep_enabled() {
			return this.groups_completed()[ 'true' ].length > 0
		}
		
	}
	
}
