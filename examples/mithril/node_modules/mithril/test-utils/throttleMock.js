"use strict"

module.exports = function() {
	var queue = []
	return {
		schedule: function(fn) {
			queue.push(fn)
		},
		fire: function() {
			var tasks = queue
			queue = []
			tasks.forEach(function(fn) {fn()})
		},
		queueLength: function(){
			return queue.length
		}
	}
}
