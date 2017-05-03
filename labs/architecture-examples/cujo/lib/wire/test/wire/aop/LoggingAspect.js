 /**
 * @license Copyright (c) 2010-2011 Brian Cavalier
 * LICENSE: see the LICENSE.txt file. If file is missing, this file is subject
 * to the MIT License at: http://www.opensource.org/licenses/mit-license.php.
 */

define([], function() {
	function makeAdvice(type) {
		return function() {
			console.log("LOGGER " + type, arguments);
		}
	}

	return {
		pointcut:       /^doSomething/,
		before:         makeAdvice('before'),
		afterReturning: makeAdvice('afterReturning'),
		afterThrowing:  makeAdvice('afterThrowing'),
		around: function(joinpoint) {
			try {
				return joinpoint.proceed();
			} catch(e) {
				console.log("LOGGER joinpoint exception", e)
			}
		}
	};
});