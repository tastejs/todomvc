(function( $ ){	
	'use strict' ;

	//widget register
	$.widget( 'ui.someThing' , {
		options : {
			value : '' , 
			completed : false , 
			uuid : ''
		},
		_create : function(){
			var $el = this.element ;

			$el.find('input.toggle').on( 'click' , this._checked.bind( this ) ) ;
			$el.find('button.destroy').on( 'click' , this._destory.bind( this ) ) ;
			$el.on( 'dblclick' , 'label' ,this._edit.bind( this ) ) ;
			$el.on( 'keyup' , '.edit' ,this._editKeyup.bind( this ) ) ;
			$el.on( 'focusout' , '.edit' ,this._editUpdate.bind( this ) ) ;
		},
		_checked : function( ev ){
			this.options.completed = $( ev.target ).prop( 'checked' ) ;
			this.onchange( 'changeValue' , {
				completed : this.options.completed ,
				uuid : this.options.uuid
			} ) ;
		},	
		_destory : function(){
			this.onchange( 'destroy' , {
				uuid : this.options.uuid
			}) ;
		},
		_edit : function( ev ){
			var $input = $( ev.target ).closest( 'li' ).addClass( 'editing' ).find( '.edit' ) ;
			$input.val( $input.val() ).focus() ; 
		},
		_editKeyup : function( ev ){
			if ( $.utils.isEnterKey( ev ) ){
				ev.target.blur() ;
			} 
			if ( $.utils.isEscapeKey( ev ) ){
				$( ev.target ).data( 'abort' , true ).blur() ;
			}
		}, 
		_editUpdate : function( ev ){
			var val = $( ev.target ).val().trim() ;

			if ( !val ){
				this.onchange( 'destroy' , {
					uuid : this.options.uuid 
				} ) ;
				return ;
			} 
			if ( $( ev.target ).data('abort') ){
				$( ev.target ).data('abort', false) ;
			} else {
				this.onchange( 'changeValue' , {
					uuid : this.options.uuid ,
					value : val 
				}) ;
			}
		},
		refresh : function(){
			var opt = this.options ;

			this.value && this.value( opt.value ) ;
			this.completed && this.completed( opt.completed ) ;
			this.uuid_ && this.uuid_( opt.uuid ) ;
		},
		onchange : function( method , opt ){
			this.options.onchange( method , opt ) ; //this function create form Widget todoMVC
		},
		value : function( value ){
			if ( value === undefined ){
				return this.options.value ;
			} else {
				this.options.value = value ;
				this.element.find( 'label' ).text( value )  ;
			}
		},
		completed : function( completed ){
			if ( completed === undefined ){
				return this.options.completed ;
			} else {
				this.options.completed = completed ;
				if ( completed ){
					this.element.addClass( 'completed' ) ;
				} else {
					this.element.removeClass( 'completed' ) ;
				}
				this.element.find('input.toggle').prop('checked',completed) ;
			}
		},
		uuid_ : function( uuid ){
			if ( uuid === undefined ){
				return this.options.uuid ;
			} else {
				this.options.uuid = uuid ;
				this.element.attr( 'data-id' , uuid ) ;
			}
		}
	}) ;

})( window.$ ) ;