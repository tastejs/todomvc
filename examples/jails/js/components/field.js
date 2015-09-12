/*global define */
/*jshint unused:false */
define([

	'jails'

], function( jails ){

	'use strict';

	var ENTER_KEY = 13, ESC_KEY = 27;

	return jails.component('field', function(input, anno){

		var cp = this, canceled = false;

		this.init = function(){

			input.on('keyup', onenter);
			input.on('keyup', onescape);
			input.on('blur', onblur);
		};

		function onenter(e){
			var value = e.target.value.trim();
			if( e.keyCode === ENTER_KEY && value ){
				save( value );
			}
		}

		function onescape(e){
			if( e.keyCode === ESC_KEY ){
				canceled = true;
				input.val( input.data('val') );
				cp.emit('cancel');
			}
		}

		function onblur(e){
			var value;

			if( canceled ){
				canceled = false;
				return;
			}

			value = e.target.value.trim();

			if( value ){
				save( value );
			}
		}

		function save( value ){

			cp.emit( anno.edit? 'edit' :'save', value );
			input.val( anno.edit? value : '');
		}

	});
});
