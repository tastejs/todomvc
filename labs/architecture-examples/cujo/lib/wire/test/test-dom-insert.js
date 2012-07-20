
define('NodeFactory', function () {
	return function NodeFactory (node) {
		return node;
	}
});

require(['wire'], function (wire) {
	var wired, undef;

	wired = wire({
		plugins: [
//			{ module: 'wire/debug' },
			{ module: pluginName }
		],
		parentNode: {
			$ref: 'dom!target'
		},
		parentNode2: {
			$ref: 'dom!target2'
		},
		firstNode: {
			create: {
				module: 'NodeFactory',
				args: { $ref: 'dom!first' }
			},
			insert: {
				first: 'parentNode'
			}
		},
		lastNode: {
			create: {
				module: 'NodeFactory',
				args: { $ref: 'dom!last' }
			},
			insert: {
				last: 'parentNode'
			}
		},
		middleNode: {
			create: {
				module: 'NodeFactory',
				args: { $ref: 'dom!middle' }
			},
			insert: {
				2: 'parentNode'
			}
		},
		afterNode: {
			create: {
				module: 'NodeFactory',
				args: { $ref: 'dom!after' }
			},
			insert: {
				after: 'parentNode'
			}
		},
		beforeNode: {
			create: {
				module: 'NodeFactory',
				args: { $ref: 'dom!before' }
			},
			insert: {
				before: 'parentNode'
			}
		},
		zeroNode: {
			create: {
				module: 'NodeFactory',
				args: { $ref: 'dom!zero' }
			},
			insert: {
				0: 'parentNode2'
			}
		},
		oneNode: {
			create: {
				module: 'NodeFactory',
				args: { $ref: 'dom!one' }
			},
			insert: {
				1: 'parentNode2'
			}
		},
		twoNode: {
			create: {
				module: 'NodeFactory',
				args: { $ref: 'dom!two' }
			},
			insert: {
				2: 'parentNode2'
			}
		},
		nineTnineNode: {
			create: {
				module: 'NodeFactory',
				args: { $ref: 'dom!nineTnine' }
			},
			insert: {
				99: 'parentNode2'
			}
		},
		negativeNode: {
			create: {
				module: 'NodeFactory',
				args: { $ref: 'dom!negative' }
			},
			insert: {
				"-1": 'parentNode2'
			}
		}
	});

	doh.register('word locations', [
		function insertFirst(doh) {
			var dohd = new doh.Deferred();
			wired.then(
				function(context) {
					dohd.callback(context.firstNode == context.parentNode.firstChild);
				},
				function(e) {
					dohd.errback(e);
				}
			);
			return dohd;
		},
		function insertLast(doh) {
			var dohd = new doh.Deferred();
			wired.then(
				function(context) {
					dohd.callback(context.lastNode == context.parentNode.lastChild);
				},
				function(e) {
					dohd.errback(e);
				}
			);
			return dohd;
		},
		function insertMiddle(doh) {
			var dohd = new doh.Deferred();
			wired.then(
				function(context) {
					var children = context.parentNode.childNodes;
					dohd.callback(context.middleNode == children[(children.length - 1) / 2]);
				},
				function(e) {
					dohd.errback(e);
				}
			);
			return dohd;
		},
		function insertBefore(doh) {
			var dohd = new doh.Deferred();
			wired.then(
				function(context) {
					dohd.callback(context.beforeNode == context.parentNode.previousSibling);
				},
				function(e) {
					dohd.errback(e);
				}
			);
			return dohd;
		},
		function insertAfter(doh) {
			var dohd = new doh.Deferred();
			wired.then(
				function(context) {
					dohd.callback(context.afterNode == context.parentNode.nextSibling);
				},
				function(e) {
					dohd.errback(e);
				}
			);
			return dohd;
		}
	]);

	doh.register('number locations', [
		function insert0(doh) {
		   var dohd = new doh.Deferred();
		   wired.then(
			   function(context) {
					dohd.callback(context.zeroNode == context.parentNode2.childNodes[1]);
			   },
			   function(e) {
				   dohd.errback(e);
			   }
		   );
		   return dohd;
		},
		function insert1(doh) {
		   var dohd = new doh.Deferred();
		   wired.then(
			   function(context) {
					dohd.callback(context.oneNode == context.parentNode2.childNodes[2]);
			   },
			   function(e) {
				   dohd.errback(e);
			   }
		   );
		   return dohd;
		},
		function insert2(doh) {
		   var dohd = new doh.Deferred();
		   wired.then(
			   function(context) {
					dohd.callback(context.twoNode == context.parentNode2.childNodes[3]);
			   },
			   function(e) {
				   dohd.errback(e);
			   }
		   );
		   return dohd;
		},
		function insert99(doh) {
		   var dohd = new doh.Deferred();
		   wired.then(
			   function(context) {
					dohd.callback(context.nineTnineNode == context.parentNode2.lastChild);
			   },
			   function(e) {
				   dohd.errback(e);
			   }
		   );
		   return dohd;
		},
		function insertNeg(doh) {
		   var dohd = new doh.Deferred();
		   wired.then(
			   function(context) {
					dohd.callback(context.negativeNode == context.parentNode2.firstChild);
			   },
			   function(e) {
				   dohd.errback(e);
			   }
		   );
		   return dohd;
		}
	]);

		  doh.run();
	  });
