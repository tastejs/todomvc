(function() {
var generateProxyTests = function(useComputed) {
	var moduleName = useComputed ? 'ProxyComputed' : 'ProxyDependentObservable';
	module(moduleName);

	var func = function() {
		var result;
		result = useComputed ? ko.computed.apply(null, arguments) : ko.dependentObservable.apply(null, arguments);
		return result;
	};

	testStart[moduleName] = function() {
		test = {
			evaluationCount: 0,
			writeEvaluationCount: 0
		};
		test.create = function(createOptions) {
			var obj = {
				a: "b"
			};

			var mapping = {
				a: {
					create: function(options) {
						createOptions = createOptions || {};
						var mapped = ko.mapping.fromJS(options.data, mapping);
						
						var DOdata = function() {
							test.evaluationCount++;
							return "test";
						};
						if (createOptions.useReadCallback) {
							mapped.DO = func({
								read: DOdata,
								deferEvaluation: !!createOptions.deferEvaluation
							}, mapped);
						}
						else if (createOptions.useWriteCallback) {
							mapped.DO = func({
								read: DOdata,
								write: function(value) { test.written = value; test.writeEvaluationCount++; },
								deferEvaluation: !!createOptions.deferEvaluation
							}, mapped);
						}
						else {
							mapped.DO = func(DOdata, mapped, {
								deferEvaluation: !!createOptions.deferEvaluation
							});
						}
						
						return mapped;
					}
				}
			};
			
			return ko.mapping.fromJS(obj, mapping);
		};
	};

	test('ko.mapping.fromJS should handle interdependent dependent observables in objects', function() {
		var obj = {
			a: { a1: "a1" },
			b: { b1: "b1" }
		}
		
		var dependencyInvocations = [];
		
		var result = ko.mapping.fromJS(obj, {
			a: {
				create: function(options) {
					return {
						a1: ko.observable(options.data.a1),
						observeB: func(function() {
							dependencyInvocations.push("a");
							return options.parent.b.b1();
						})
					}
				}
			},
			b: {
				create: function(options) {
					return {
						b1: ko.observable(options.data.b1),
						observeA: func(function() {
							dependencyInvocations.push("b");
							return options.parent.a.a1();
						})
					}
				},
			}
		});
		
		equal("b1", result.a.observeB());
		equal("a1", result.b.observeA());
	});

	test('ko.mapping.fromJS should handle interdependent dependent observables with read/write callbacks in objects', function() {
		var obj = {
			a: { a1: "a1" },
			b: { b1: "b1" }
		}
		
		var dependencyInvocations = [];
		
		var result = ko.mapping.fromJS(obj, {
			a: {
				create: function(options) {
					return {
						a1: ko.observable(options.data.a1),
						observeB: func({
							read: function() {
								dependencyInvocations.push("a");
								return options.parent.b.b1();
							},
							write: function(value) {
								options.parent.b.b1(value);
							}
						})
					}
				}
			},
			b: {
				create: function(options) {
					return {
						b1: ko.observable(options.data.b1),
						observeA: func({
							read: function() {
								dependencyInvocations.push("b");
								return options.parent.a.a1();
							},
							write: function(value) {
								options.parent.a.a1(value);
							}
						})
					}
				},
			}
		});
		
		equal(result.a.observeB(), "b1");
		equal(result.b.observeA(), "a1");
		
		result.a.observeB("b2");
		result.b.observeA("a2");
		equal(result.a.observeB(), "b2");
		equal(result.b.observeA(), "a2");
	});

	test('ko.mapping.fromJS should handle dependent observables in arrays', function() {
		var obj = {
			items: [
				{ id: "a" },
				{ id: "b" }
			]
		}
		
		var dependencyInvocations = 0;
		
		var result = ko.mapping.fromJS(obj, {
			"items": {
				create: function(options) {
					return {
						id: ko.observable(options.data.id),
						observeParent: func(function() {
							dependencyInvocations++;
							return options.parent.items().length;
						})
					}
				}
			}
		});
		
		equal(result.items()[0].observeParent(), 2);
		equal(result.items()[1].observeParent(), 2);
	});

	test('dependentObservables with a write callback are passed through', function() {
		var mapped = test.create({ useWriteCallback: true });
		
		mapped.a.DO("hello");
		equal(test.written, "hello");
		equal(test.writeEvaluationCount, 1);
	});
	
	asyncTest('throttleEvaluation is correctly applied', function() {
		var obj = {
			a: "hello"
		};
	
		var dependency = ko.observable(0);
		var mapped = ko.mapping.fromJS(obj, {
			a: {
				create: function() {
					var f = func(function() {
						dependency(dependency() + 1);
						return dependency();
					});
					var ex = f.extend({ throttle: 1 });
					return ex;
				}
			}
		});
		
		// Even though the dependency updates many times, it should be throttled to only one update
		dependency.valueHasMutated();
		dependency.valueHasMutated();
		dependency.valueHasMutated();
		dependency.valueHasMutated();
		
		window.setTimeout(function() {
			start();
			equal(mapped.a(), 1);
		}, 1);
	});
	
	test('dependentObservables without a write callback do not get a write callback', function() {
		var mapped = test.create({ useWriteCallback: false });
		
		var caught = false;
		try {
			mapped.a.DO("hello");
		} catch(e) {
			caught = true;
		}
		equal(caught, true);
	});
	
	asyncTest('undeferred dependentObservables that are NOT used immediately SHOULD be auto-evaluated after mapping', function() {
		var mapped = test.create();
		window.setTimeout(function() {
			start();
			equal(test.evaluationCount, 1);
		}, 0);
	});

	asyncTest('undeferred dependentObservables that ARE used immediately should NOT be auto-evaluated after mapping', function() {
		var mapped = test.create();
		equal(ko.utils.unwrapObservable(mapped.a.DO), "test");
		window.setTimeout(function() {
			start();
			equal(test.evaluationCount, 1);
		}, 0);
	});

	asyncTest('deferred dependentObservables should NOT be auto-evaluated after mapping', function() {
		var mapped = test.create({ deferEvaluation: true });
		window.setTimeout(function() {
			start();
			equal(test.evaluationCount, 0);
		}, 0);
	});

	asyncTest('undeferred dependentObservables with read callback that are NOT used immediately SHOULD be auto-evaluated after mapping', function() {
		var mapped = test.create({ useReadCallback: true });
		window.setTimeout(function() {
			start();
			equal(test.evaluationCount, 1);
		}, 0);
	});

	asyncTest('undeferred dependentObservables with read callback that ARE used immediately should NOT be auto-evaluated after mapping', function() {
		var mapped = test.create({ useReadCallback: true });
		equal(ko.utils.unwrapObservable(mapped.a.DO), "test");
		window.setTimeout(function() {
			start();
			equal(test.evaluationCount, 1);
		}, 0);
	});

	asyncTest('deferred dependentObservables with read callback should NOT be auto-evaluated after mapping', function() {
		var mapped = test.create({ deferEvaluation: true, useReadCallback: true });
		window.setTimeout(function() {
			start();
			equal(test.evaluationCount, 0);
		}, 0);
	});

	test('can subscribe to proxy dependentObservable', function() {
		expect(0);
		var mapped = test.create({ deferEvaluation: true, useReadCallback: true });
		var subscriptionTriggered = false;
		mapped.a.DO.subscribe(function() {
		});
	});

	test('can subscribe to nested proxy dependentObservable', function() {
		var obj = {
			a: { b: null }
		};

		var DOsubscribedVal ;
		var mapping = {
			a: {
				create: function(options) {
					var mappedB = ko.mapping.fromJS(options.data, {
						create: function(options) {
							//In KO writable computed observables have to be backed by an observable
							//otherwise they won't be notified they need updating. see: http://jsfiddle.net/drdamour/9Pz4m/ 
							var DOval = ko.observable(undefined);
							
							var m = {};
							m.myValue = ko.observable("myValue");
							m.DO = func({
								read: function() {
									return DOval();
								},
								write: function(val) {
									DOval(val);
								}
							});
							m.readOnlyDO = func(function() {
								return m.myValue();
							});
							return m;
						}
					});
					mappedB.DO.subscribe(function(val) {
						DOsubscribedVal = val;
					});
					return mappedB;
				}
			}
		};
		
		var mapped = ko.mapping.fromJS(obj, mapping);
		mapped.a.DO("bob");
		equal(ko.utils.unwrapObservable(mapped.a.readOnlyDO), "myValue");
		equal(ko.utils.unwrapObservable(mapped.a.DO), "bob");
		equal(DOsubscribedVal, "bob");
	});
	

	test('dependentObservable dependencies trigger subscribers', function() {
		var obj = {
			inner: {
				dependency: 1
			}
		};
		
		var inner = function(data) {
			var _this = this;
			ko.mapping.fromJS(data, {}, _this);
			
			_this.DO = func(function() {
				_this.dependency();
			});

			_this.evaluationCount = 0;
			_this.DO.subscribe(function() {
				_this.evaluationCount++;
			});
		};
		
		var mapping = {
			inner: {
				create: function(options) {
					return new inner(options.data);
				}
			}
		};
		
		var mapped = ko.mapping.fromJS(obj, mapping);
		var i = mapped.inner;
		equal(i.evaluationCount, 1); //it's evaluated once prior to fromJS returning

		// change the dependency
		i.dependency(2);
			
		// should also have re-evaluated
		equal(i.evaluationCount, 2);
	});


	//taken from outline defined at https://github.com/SteveSanderson/knockout.mapping/issues/95#issuecomment-12275070
	test('dependentObservable evaluation is defferred until mapping takes place', function() {
		var model = {
			a: { name: "a" },
  			b: { name: "b" }
		};
		
		var MyClassA = function(data, parent) {
			var _this = this;

			ko.mapping.fromJS(data, {}, _this);

			_this.DO = func(function() {
				//Depends on b, which may not be there yet
				return _this.name() + parent.b.name(); 
			});
		};

		var MyClassB = function(data, parent) {
			var _this = this;

			ko.mapping.fromJS(data, {}, _this);

			_this.DO = func(function() {
				//depends on a, which may not be there yet
				return _this.name() + parent.a.name(); 
			});
		};


		var mapping = {
			a: {
				create: function(options) {
					return new MyClassA(options.data, options.parent);
				}
			},
			b: {
				create: function(options) {
					return new MyClassB(options.data, options.parent);
				}
			}
		}


		
		var mappedVM = ko.mapping.fromJS(model, mapping);


		equal(mappedVM.a.DO(), "ab");
		equal(mappedVM.b.DO(), "ba");
	});
	
	test('dependentObservable mappingNesting is reset after exception', function() {
		var model = {
			a: { name: "a" }
		};

		//First we throw a custom exception in the nested create and make sure it does throw
		function CustomError( message ) {
    		this.message = message;
  		}
  		CustomError.prototype.toString = function() {
    		return this.message;
  		};

		throws( 
			function()
			{
				ko.mapping.fromJS(model, {
					create:function(){ throw new CustomError("Create Threw");}
				});
			},
			CustomError ,
			"fromJS throws correct 'CustomError' error type"
		);


		//Second make sure mappingNesting was reset.
		//if mappingNesting wasn't reset the DO wouldn't have been evaluated before fromJS returning
		var obj = {
			inner: {
				dependency: 1
			}
		};
		
		var inner = function(data) {
			var _this = this;
			ko.mapping.fromJS(data, {}, _this);
			
			_this.DO = func(function() {
				_this.dependency();
			});

			_this.evaluationCount = 0;
			_this.DO.subscribe(function() {
				_this.evaluationCount++;
			});
		};
		
		var mapping = {
			inner: {
				create: function(options) {
					return new inner(options.data);
				}
			}
		};
		
		var mapped = ko.mapping.fromJS(obj, mapping);
		var i = mapped.inner;
		equal(i.evaluationCount, 1); //it's evaluated once prior to fromJS returning

	});

	test('dependentObservable evaluation for nested is defferred until after mapping takes place', function() {
		var model = {
			a: { 
				name: "a", 
  				c : {name: "c"} //nested 
			},
  			b: { 
  				name: "b"
  			}
		};
		
		var MyClassA = function(data, parent) {
			var _this = this;

			var mapping = {
				c: {
					create: function(options) {
						return new MyClassC(options.data, options.parent, parent); //last param parent here is C's grandparent
					}
				}
			};

			ko.mapping.fromJS(data, mapping, _this);

			_this.DO = func(function() {
				//Depends on b, which may not be there yet
				return _this.name() + parent.b.name(); 
			});
		};

		var MyClassB = function(data, parent) {
			var _this = this;

			ko.mapping.fromJS(data, {}, _this);

			_this.DO = func(function() {
				//depends on a, which may not be there yet
				return _this.name() + parent.a.name(); 
			});
		};

		var MyClassC = function(data, parent, grandparent) {
			var _this = this;

			ko.mapping.fromJS(data, {}, _this);

			_this.DO = func(function() {
				//depends on a, which may not be there yet
				return _this.name() + parent.name() + grandparent.a.name() + grandparent.b.name() ; 
			});
		};


		var mapping = {
			a: {
				create: function(options) {
					return new MyClassA(options.data, options.parent);
				}
			},
			b: {
				create: function(options) {
					return new MyClassB(options.data, options.parent);
				}
			},
			c: {
				create: function(options) {
					return new MyClassC(options.data, options.parent);
				}

			}
		}

		var mappedVM = ko.mapping.fromJS(model, mapping);


		equal(mappedVM.a.DO(), "ab");
		equal(mappedVM.b.DO(), "ba");
		equal(mappedVM.a.c.DO(), "caab");
	});


	test('dependentObservable.fn extensions are not missing during mapping', function() {
		var obj = {
			x: 1
		};

		var model = function(data) {
			var _this = this;

			ko.mapping.fromJS(data, {}, _this);
			
			_this.DO = func(_this.x);
		};

		var mapping = {
			create: function(options) {
				return new model(options.data);
			}
		};
		
		ko.dependentObservable.fn.myExtension = true;
		
		var mapped = ko.mapping.fromJS(obj, mapping);
		
		equal(mapped.DO.myExtension, true)
	});
	
	test('Dont wrap dependent observables if already marked as deferEvaluation', function() {
		var obj = {
			x: 1
		};

		var model = function(data) {
			var _this = this;

			ko.mapping.fromJS(data, {}, _this);
			
			_this.DO1 = func(_this.x, null, {deferEvaluation: true});
			_this.DO2 = func({read: _this.x, deferEvaluation: true});
			_this.DO3 = func(_this.x);
		};

		var mapping = {
			create: function(options) {
				return new model(options.data);
			}
		};
		
		var mapped = ko.mapping.fromJS(obj, mapping);
		
		equal(mapped.DO1._wrapper, undefined);
		equal(mapped.DO2._wrapper, undefined);
		equal(mapped.DO3._wrapper, true);
	});
	
	test('ko.mapping.updateViewModel should allow for the avoidance of adding an item to its parent observableArray', function() {
		var obj = {
			items: [
				{ id: "a" },
				{ id: "b" }
			]
		}
		
		var dependencyInvocations = 0;
		
		var result = ko.mapping.fromJS(obj, {
			"items": {
				create: function(options) {
					if (options.data.id == "b")
						return options.data;
					else 
						return options.skip;
				}
			}
		});
		
		
		equal(result.items().length, 1);
		equal(result.items()[0].id, "b");
		
	});

	//unit test for updating existing arrays (e.g. first item is retained, second item is skipped and the third item gets added)?
	test('ko.mapping.updateViewModel skipping an item should retain all other items', function() {
		var obj = {
			items: [
				{ id: "a" },
				{ id: "b" },
				{ id: "c" }
			]
		}
		
		var dependencyInvocations = 0;
		
		var result = ko.mapping.fromJS(obj, {
			"items": {
				create: function(options) {
					if (options.data.id == "b")
						return options.skip;
					else 
						return options.data;
				}
			}
		});
		
		
		equal(result.items().length, 2);
		equal(result.items()[0].id, "a");
		equal(result.items()[1].id, "c");
		
	});
};

generateProxyTests(false);
generateProxyTests(true);
})();
