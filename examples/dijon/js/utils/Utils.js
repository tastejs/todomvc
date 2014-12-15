/*global dijondemo */
/**
 * @author Camille Reynders
 * Date: 03/02/12
 * Time: 14:34
 */
(function( ns ) {
	'use strict';

	ns.utils.Utils = {
		// https://gist.github.com/1308368
		uuid: function( a, b ) {
			for ( b = a = '' ; a++ < 36 ; b += a * 51 & 52 ? (a ^ 15 ? 8 ^ Math.random() * (a ^ 20 ? 16 : 4) : 4).toString( 16 ) : '_' );
			return b;
		},
		pluralize: function( count, word ) {
			return count === 1 ? word : word + 's';
		}
	};

}( dijondemo ));
