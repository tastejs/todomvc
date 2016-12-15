interface $mol_app_todomvc_task {
	completed? : boolean
	title? : string
}

namespace $.$mol {
	
	export class $mol_app_todomvc_adder extends $.$mol_app_todomvc_adder {
		
		eventPress( next? : KeyboardEvent ) {
			switch( next['code'] || next.key ) {
				case 'Enter' : return this.eventDone( next )
			}
		}
		
	}
	
	export class $mol_app_todomvc extends $.$mol_app_todomvc {
		
		taskIds( next? : number[] ) : number[] {
			return $mol_state_local.value( this.stateKey( 'taskIds' ) , next ) || []
		}
		
		argCompleted() {
			return $mol_state_arg.value( this.stateKey( 'completed' ) )
		}

		@ $mol_mem()
		groupsByCompleted() {
			var groups : { [ index : string ] : number[] } = { 'true' : [] , 'false' : [] }
			for( let id of this.taskIds() ) {
				var task = this.task( id )
				groups[ String( task.completed ) ].push( id )
			}
			return groups
		}

		@ $mol_mem()
		tasksFiltered() {
			var completed = this.argCompleted()
			if( completed ) {
				return this.groupsByCompleted()[ completed ] || []
			} else {
				return this.taskIds()
			}
		}

		@ $mol_mem()
		allCompleted( next? : boolean ) {
			if( next === void 0 ) return this.groupsByCompleted()[ 'false' ].length === 0
			
			for( let id of this.groupsByCompleted()[ String( !next ) ] ) {
				var task = this.task( id )
				this.task( id , { title : task.title , completed : next } )
			}
			
			return next
		}
		
		allCompleterEnabled() {
			return this.taskIds().length > 0 
		}

		@ $mol_mem()
		pendingMessage() {
			let count = this.groupsByCompleted()[ 'false' ].length
			return ( count === 1 ) ? '1 item left' : `${count} items left`
		}
		
		_idSeed = 0

		eventAdd( next : Event ) {
			var title = this.taskNewTitle() 
			if( !title ) return
			
			var id = ++ this._idSeed
			var task = { completed : false , title }
			this.task( id , task )
			
			this.taskIds( this.taskIds().concat( id ) )
			this.taskNewTitle( '' )
		}

		@ $mol_mem()
		taskers() {
			return this.tasksFiltered().map( ( id , index )=> this.tasker( index ) )
		}
		
		task( id : number , next? : $mol_app_todomvc_task ) {
			const key = this.stateKey( `task=${id}` )
			if( next === void 0 ) return $mol_state_local.value( key ) || { title : '' , completed : false }
			
			$mol_state_local.value( key , next )
			
			return next || void 0
		}
		
		@ $mol_mem_key()
		taskCompleted( index : number , next? : boolean ) {
			var id = this.tasksFiltered()[ index ]
			if( next === void 0 ) return this.task( id ).completed
			
			this.task( id , $mol_merge_dict( this.task( id ) , { completed : next } ) )
			
			return next
		}
		
		@ $mol_mem_key()
		taskTitle( index : number , next? : string ) {
			var id = this.tasksFiltered()[ index ]
			if( next === void 0 ) return this.task( id ).title
			
			this.task( id , $mol_merge_dict( this.task( id ) , { title : next } ) )
			
			return next
		}
		
		eventTaskDrop( index : number , next? : Event ) {
			var tasks = this.tasksFiltered()
			var id = tasks[index]
			tasks = tasks.slice( 0 , index ).concat( tasks.slice( index + 1 , tasks.length ) )
			this.task( id , null )
			this.taskIds( tasks )
		}

		eventSanitize() {
			this.taskIds( this.taskIds().filter( id => {
				if( !this.task( id ).completed ) return true
				this.task( id , null )
				return false
			} ) )
		}
		
		panels() {
			return [
				this.header() , 
				this.lister() ,
				this.footerVisible() ? this.footer() : null ,
			]
		}
		
		footerVisible() {
			return this.taskIds().length > 0
		}

		sanitizerEnabled() {
			return this.groupsByCompleted()[ 'true' ].length > 0
		}
		
	}
	
}
