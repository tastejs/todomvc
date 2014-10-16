/** @license MIT License (c) copyright 2011-2013 original author or authors */

/**
 * trace
 * @author: brian@hovercraftstudios.com
 *
 * @author Brian Cavalier
 * @author John Hann
 */
(function(define) {
define(function(require) {

	var meld, joinpoint, depth, padding, simpleReporter;

	meld = require('../meld');
	joinpoint = meld.joinpoint;

	// Call stack depth tracking for the default reporter
	depth = 0;

	// Padding characters for indenting traces. This will get expanded as needed
	padding =  '................................';

	simpleReporter = {
		onCall: function(info) {
			console.log(indent(++depth) + info.method + ' CALL ', info.args);
		},
		onReturn: function(info) {
			console.log(indent(depth--) + info.method + ' RETURN ', info.result);
		},
		onThrow: function(info) {
			console.log(indent(depth--) + info.method + ' THROW ' + info.exception);
		}
	};

	/**
	 * Creates an aspect that traces method/function calls and reports them
	 * to the supplied reporter.
	 * @param {object} [reporter] optional reporting API to which method call/return/throw
	 *  info will be reported
	 * @param {function} [reporter.onCall] invoked when a method has been called
	 * @param {function} [reporter.onReturn] invoked when a method returns successfully
	 * @param {function} [reporter.onThrow] invoked when a method throws an exception
	 * @return {object} a tracing aspect that can be added with meld.add
	 */
	return function createTraceAspect(reporter) {

		if(!reporter) {
			reporter = simpleReporter;
		}

		return {
			before: function() {
				var jp = joinpoint();
				reporter.onCall && reporter.onCall({ method: jp.method, target: jp.target, args: jp.args.slice() });
			},

			afterReturning: function(result) {
				var jp = joinpoint();
				reporter.onReturn && reporter.onReturn({ method: jp.method, target: jp.target, result: result });
			},

			afterThrowing: function(exception) {
				var jp = joinpoint();
				reporter.onThrow && reporter.onThrow({ method: jp.method, target: jp.target, exception: exception });
			}
		};
	};

	/**
	 * Create indentation padding for tracing info based on the supplied call stack depth
	 * @param {number} depth call stack depth
	 * @return {String} padding that can be used to indent tracing output
	 */
	function indent(depth) {
		if(depth > padding.length) {
			padding += padding;
		}

		return padding.slice(0, depth-1);
	}

});
}(typeof define === 'function' && define.amd ? define : function(factory) { module.exports = factory(require); }));
