interface $hyoo_todomvc_task {
	completed? : boolean
	title? : string
}

namespace $.$$ {
	
	export class $hyoo_todomvc_add extends $.$hyoo_todomvc_add {
		
		press( next : KeyboardEvent ) {
			switch( next.keyCode ) {
				case $mol_keyboard_code.enter : return this.done( next )
			}
		}
		
	}
	
	export class $hyoo_todomvc extends $.$hyoo_todomvc {
		
		task_ids( next? : number[] ) : number[] {
			return this.$.$mol_state_local.value( this.state_key( 'mol-todos' ) , next ) || []
		}
		
		arg_completed() {
			return this.$.$mol_state_arg.value( this.state_key( 'completed' ) )
		}

		@ $mol_mem
		groups_completed() {
			var groups : { [ index : string ] : number[] } = { 'true' : [] , 'false' : [] }
			for( let id of this.task_ids() ) {
				var task = this.task( id )!
				groups[ String( task.completed ) ].push( id )
			}
			return groups
		}

		@ $mol_mem
		task_ids_filtered() {
			var completed = this.arg_completed()
			if( completed ) {
				return this.groups_completed()[ completed ] || []
			} else {
				return this.task_ids()
			}
		}

		@ $mol_mem
		completed_all( next? : boolean ) {
			if( next === void 0 ) return this.groups_completed()[ 'false' ].length === 0
			
			for( let id of this.groups_completed()[ String( !next ) ] ) {
				var task = this.task( id )!
				this.task( id , { title : task.title , completed : next } )
			}
			
			return next
		}
		
		head_complete_enabled() {
			return this.task_ids().length > 0 
		}

		@ $mol_mem
		pending_message() {
			let count = this.groups_completed()[ 'false' ].length
			return ( count === 1 ) ? '1 item left' : `${count} items left`
		}
		
		@ $mol_mem
		new_id() {
			return Math.max( 1 , 1 + Math.max( ... this.task_ids() ) )
		}
		
		add( next? : Event ) {
			var title = this.task_title_new() 
			if( !title ) return
			
			var id = this.new_id()
			var task = { completed : false , title }
			this.task( id , task )
			
			this.task_ids([ ... this.task_ids(), id ])
			this.task_title_new( '' )
		}

		@ $mol_mem
		task_rows() {
			return this.task_ids_filtered().map( id => this.Task_row( id ) )
		}
		
		task( id : number , next? : $hyoo_todomvc_task | null ) {
			const key = this.state_key( `mol-todos-${id}` )
			if( next === void 0 ) {
				return this.$.$mol_state_local.value<$hyoo_todomvc_task>( key ) || { title : '' , completed : false }
			}
			
			this.$.$mol_state_local.value( key , next )
			
			return next || null
		}
		
		@ $mol_mem_key
		task_completed( id : number , next? : boolean ) {
			return this.task( id , next === undefined ? undefined : { ... this.task( id ) , completed : next } )!.completed
		}
		
		@ $mol_mem_key
		task_title( id : number , next? : string ) {
			return this.task( id , next === undefined ? undefined : { ... this.task( id ) , title : next } )!.title
		}
		
		task_drop( id : number , next? : Event ) {
			this.task( id , null )
			this.task_ids( this.task_ids().filter( id2 => id !== id2 ) )
		}

		sweep() {
			this.task_ids( this.task_ids().filter( id => {
				if( !this.task( id )!.completed ) return true
				this.task( id , null )
				return false
			} ) )
		}
		
		panels() {
			return [
				this.Head() , 
				this.List() ,
				... this.foot_visible() ? [ this.Foot() ] : [] ,
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
