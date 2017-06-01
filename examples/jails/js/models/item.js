/*global define */
/*jshint unused:false */

define(function(){

	'use strict';

	return function( item, id ){

		return{

			message 	:item.message,
			completed 	:!!item.completed,
			id 			:id,

			checked :function(){
				return this.completed? 'checked' :'';
			},

			state :function(){
				return this.completed? 'completed' : '';
			}
		};
	};
});
