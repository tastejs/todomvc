(function( $ , Handlebars ){	
	'use strict' ;

	//widget register
	$.widget( 'ui.todoMVC' , {
		options : {
			todoList : [] ,
			showModal : 'all' , // all | active | completed
		},
		_create : function(){
			var $el = this.element ;

			$el.find('input#new-todo').on( 'keyup' , this._addList.bind( this ) ) ;
			$el.find('#toggle-all').on( 'click' , this._toggleList.bind( this ) ) ;
			
			this.options.todoTemplate = Handlebars.compile( $('#todo-template').html() ) ;
			this.options.footerTemplate = Handlebars.compile( $('#footer-template').html() );
		
			$el.find('#footer').html( this.options.footerTemplate({
				activeTodoCount : '' ,
				activeTodoWord : '' ,
			}) ) ;		

			$el.find('#footer li').on( 'click' , this._changeModel.bind( this ) ) ;
			$el.find('#clear-completed').on( 'click' , this._clearList.bind( this ) ) ;
		
			new Router({
				'/:filter': function ( showModal ) {
					this.options.showModal = showModal ;
					this.refresh();
				}.bind( this )
			}).init( '/all' );
		},
		_init : function(){
			this.refresh() ; //trigger when you change this Widget's options
		},
		_addList : function( ev ){
			if ( $.utils.isEnterKey( ev ) ) {
				if ( $.trim( $( ev.target ).val() ) === '' ){
					return ;
				}
				this.options.todoList.push({ 
					value : $( ev.target ).val() ,
					completed : false ,
					uuid : $.utils.uuid()
				}) ;
				this.refresh() ;
				$( ev.target ).val('') ;
			}
		},
		_toggleList : function( ev ){
			var isChecked = $( ev.target ).prop( 'checked' ) ;

			this.options.todoList.forEach(function( thing ){
				thing.completed = isChecked ? true : false ;
			}) ;

			this.refresh() ;
		},
		_changeModel : function( ev ){
			var model = $( ev.target ).attr( 'data-modal' ) ;
			this.options.showModal = model ;
			this.refresh() ;
		},
		_clearList : function(){
			var clearDone = this.options.todoList.filter(function(v){
				if ( v.completed === true ){
					return false ;
				} else {
					return true ;
				}
			}) ; 
			this.options.todoList = clearDone ;
			this.refresh() ;
		},
		refresh : function(){
			var self = this  ;

			var todoList = this.options.todoList ;
			var showModal = this.options.showModal ;

			var isSelectAll = true ;
			var activeCount = 0 ;
			var completedCount = 0 ;
			var count = 0 ;

			todoList.forEach(function( thing ){
				if ( thing.completed ){
					completedCount++ ;
				} else {
					activeCount++ ;
				}

				if ( showModal === 'active' ){
					if ( thing.completed === true ){
						return ;
					}
				} else if ( showModal === 'completed' ){
					if ( thing.completed === false ){
						return ;
					}
				}
				if ( thing.completed === false ){
					isSelectAll = false ;
				}
				self._createList( thing , count++ ) ;
			}) ;		

			self.refreshState( todoList , showModal , activeCount , completedCount , count ,isSelectAll ) ;
		},
		refreshState : function( todoList , modal  , activeCount , completedCount , showCount , isSelectAll ){
			var self = this , $el = this.element ;

			this.element.find( '#main' ).show() ;
			$el.find('#toggle-all').prop( 'checked' , isSelectAll ) ;
			$el.find('#todo-list li').removeClass( 'editing' ) ;

			var todoListLength = todoList.length ; 
			if ( todoListLength === 0 ){
				$el.find( '#todo-list li').remove() ;
				$el.find('#toggle-all').prop('checked',false) ;
				$el.find('#footer').hide() ;
			}else{
				if ( showCount === 0 ){
					$el.find( '#todo-list li' ).remove() ;
				} else {
					$el.find( '#todo-list li:gt(' + ( showCount - 1 ) + ')' ).remove() ;
				}
				$el.find('#todo-count').html('<strong>'+ activeCount +'</strong>&nbsp;' + ( activeCount === 1 ? 'item' : 'items' ) + ' left'  ) ;
				$el.find('#footer li a').removeClass('selected').filter( '.' + self.options.showModal ).addClass('selected') ;
				$el.find('#footer').show() ;
			}	

			if ( completedCount > 0 ){
				$el.find('#clear-completed').show() ;
			} else {
				$el.find('#clear-completed').hide() ;
			}

			$.utils.store('todos-jquery-ui' , self.options );
		},
		_createList : function( thing , index ){
			var $oldList = this.element.find( '#todo-list li' ).eq( index ) ;
			
			if ( $oldList.size() > 0 ){
				$oldList.someThing( thing ).someThing( 'refresh' ) ;
			} else {
				var $li = $( this.options.todoTemplate( thing ) ) ;
				$li.someThing( $.extend( thing , {
					onchange : this.onchange.bind( this )
				} ) ).someThing( 'refresh' ) ;
				this.element.find('#todo-list').append( $li ) ;
			}
		},
		onchange : function( method , opt ){
			this[ method ] && this[ method ]( opt ) ;
		},
		changeValue : function( opt ){
			this.options.todoList.forEach( function(v){
				if ( v.uuid === opt.uuid ){
					( opt.completed !== undefined ) && ( v.completed = opt.completed ) ;
					( opt.value !== undefined ) && ( v.value = opt.value ) ;
				} 
			}) ;
			this.refresh() ;
		},
		destroy : function( opt ){
			var delIndex ;
			this.options.todoList.forEach( function(v,i){
				if ( v.uuid === opt.uuid ){
					delIndex = i ;
				} 	
			}) ;
			this.options.todoList.splice( delIndex , 1 ) ;
			this.refresh() ;
		}
	}) ;

})( window.$ , window.Handlebars ) ;