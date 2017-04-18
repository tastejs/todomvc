/*global jQuery, Handlebars */
jQuery(function ($) {
	'use strict';

	var defaultValue = $.utils.store('todos-jquery-ui') ;

	//app start
	$( '#todoapp' ).todoMVC(
		defaultValue ||  {
			todoList : [] ,
			showModal : 'All' 
		}
	) ;

});


(function($){
	'use strict' ;

	$.utils = {
		uuid : function(){
			var i ,random;
			var uuid = '' ;
			for ( i = 0 ; i < 32 ; i++ ){
				random = Math.random() * 16 | 0 ;
				if (i === 8 || i === 12 || i === 16 || i === 20) {
						uuid += '-';
					}
					uuid += (i === 12 ? 4 : (i === 16 ? (random & 3 | 8) : random)).toString(16);
			}
			return uuid ;
		},
		isEnterKey : function( ev ){
			return ev && ( ev.which === 13 ) ;
		},
		isEscapeKey : function( ev ){
			return ev && ( ev.which === 27 ) ;
		},
		store: function (namespace, data) {
			if (arguments.length > 1) {
				return localStorage.setItem(namespace, JSON.stringify(data));
			} else {
				var store = localStorage.getItem(namespace);
				return (store && JSON.parse(store)) || [];
			}
		}
	} ;

})( $ ) ;