module('Integration tests');

test('Store', function() {
	function Product(data) {
		
		var viewModel = {
			guid: ko.observable(),
			name : ko.observable()
		};
		
		ko.mapping.fromJS(data, {}, viewModel);
		
		return viewModel;
	}

	Store = function(data) {
		data = data || {};
		var mapping = {
				Products: {
					key: function(data) {
						return ko.utils.unwrapObservable(data.guid);
					},
					create: function(options) {
						return new Product(options.data);
					}
				},
			
				Selected: {
					update: function(options) {
						return ko.utils.arrayFirst(viewModel.Products(), function(p) {
							return p.guid() == options.data.guid;
						});
					}
				}
			};

		var viewModel = {
			Products: ko.observableArray(),
			Selected : ko.observable()
		};

		ko.mapping.fromJS(data, mapping, viewModel);
		
		return viewModel;
	};

	var jsData = {
		"Products": [
			{ "guid": "01", "name": "Product1" },
			{ "guid": "02", "name": "Product2" },
			{ "guid": "03", "name": "Product3" }
		],
		"Selected": { "guid": "02" }
	};
	var viewModel = new Store(jsData);
	equal(viewModel.Selected().name(), "Product2");
});

//https://github.com/SteveSanderson/knockout.mapping/issues/34
test('Issue #34', function() {
	var importData = function(dataArray, target) {
		var mapping = {
			"create": function( options ) {
				return options.data;
			}
		};

		return ko.mapping.fromJS(dataArray, mapping, target);
	};

	var viewModel = {
		things: ko.observableArray( [] ),
		load: function() {
			var rows = [
				{ id: 1 }
			];
	
			importData(rows, viewModel.things);
		}
	};
	
	viewModel.load();
	viewModel.load();
	viewModel.load();

	deepEqual(viewModel.things(), [{"id":1}]);
});

test('Adding large amounts of items to array is slow', function() {
	expect(0);

	var numItems = 5000;
	var data = [];
	for (var t=0;t<numItems;t++) {
		data.push({ id: t });
	}
	
	var mapped = ko.mapping.fromJS(data, {
		key: function(data) {
			return ko.utils.unwrapObservable(data).id;
		}
	});
});

test('Issue #87', function() {
	var Item = function(data) {
		var _this = this;

		var mapping = {
			include: ["name"]
		};

		data = data || {};
		_this.name = ko.observable(data.name || "c");

		ko.mapping.fromJS(data, mapping, _this);
	};

	var Container = function(data) {
		var _this = this;

		var mapping = {
			items: {
				create: function(options) {
					return new Item(options.data);
				}
			}
		};

		_this.addItem = function() {
			_this.items.push(new Item());
		};

		ko.mapping.fromJS(data, mapping, _this);
	};

	var data = {
		items: [
			{ name: "a" },
			{ name: "b" }
		]
	};

	var mapped = new Container(data);

	mapped.addItem();
	equal(mapped.items().length, 3);
	equal(mapped.items()[0].name(), "a");
	equal(mapped.items()[1].name(), "b");
	equal(mapped.items()[2].name(), "c");

	var unmapped = ko.mapping.toJS(mapped);
	equal(unmapped.items.length, 3);
	equal(unmapped.items[0].name, "a");
	equal(unmapped.items[1].name, "b");
	equal(unmapped.items[2].name, "c");
});

test('Issue #88', function() {
	var ViewModel = function(data) {
	    ko.mapping.fromJS(data, {
	        copy: ["id"]
	    }, this);

	    this.reference = ko.observable(this);
	};

	var viewModel = new ViewModel({"id":123, "name":"Alice"});
	var unmapped;

	unmapped = ko.mapping.toJS(viewModel);
	equal(unmapped.id, 123);
	equal(unmapped.name, "Alice");

	unmapped = ko.mapping.toJS(viewModel.reference);
	equal(unmapped.id, 123);
	equal(unmapped.name, "Alice");

	unmapped = ko.mapping.toJS(viewModel.reference());
	equal(unmapped.id, 123);
	equal(unmapped.name, "Alice");
});

test('Issue #94', function() {
	var model = { 
	    prop: "original",
	    obj: { 
	        prop: "original", 
	        obj: { 
	            prop: "original" 
	        } 
	    }
	};
	var viewModel = ko.mapping.fromJS(model);

	var modelUpdate = { 
	    prop: "edit",
	    obj: { 
	        prop: "edit",
	        obj: { 
	            prop: "edit" 
	        }
	    }            
	};
	ko.mapping.fromJS(modelUpdate, { ignore: ["obj.prop", "obj.obj"] }, viewModel);

	equal(viewModel.prop(), "edit");
	equal(viewModel.obj.prop(), "original");
	equal(viewModel.obj.obj.prop(), "original");
});

asyncTest('Issue #99', function() {
	var a = {
		x : ko.observable().extend({ throttle: 1 })
	};

	var receivedValue;
	a.x.subscribe(function(value) {
		receivedValue = value;
	});

	ko.mapping.fromJS({ x: 3 }, {}, a);
	window.setTimeout(function() {
		equal(receivedValue, 3);
		start();
	}, 2);
});

test('Issue #33', function() {
	var mapping = {
	    'items': {
	        key: function(data) {
	            return ko.utils.unwrapObservable(data.id);
	        },
	        create: function(options) {
	            var o = (new(function() {
	                this._remove = function() {
	                    options.parent.items.mappedRemove(options.data);
	                };
	                ko.mapping.fromJS(options.data, {}, this);
	            })());
	            return o;
	        }
	    }
	};

	var i = 0;
	var vm = ko.mapping.fromJS({
	    'items': [{
	        id: ++i}]
	}, mapping);

    vm.items.mappedCreate({
        id: ++i
    });

    equal(vm.items().length, 2);
	vm.items()[1]._remove();

	equal(vm.items().length, 1);
	vm.items()[0]._remove();

	equal(vm.items().length, 0);
});

test('Issue #86', function() {
	var ViewModel = function() {
		var _this = this;
		this.filters = new FilterModel();
		this.update = function(data) {
			var mapping = {
				filters: {
					update: function(options) {
						return options.target.update(options.data);
					}
				}
			};

			ko.mapping.fromJS(data, mapping, _this);
			return _this;
		};
	};

	var FilterModel = function() {
		var _this = this;
		this.a = ko.observable();
		this.update = function(data) {
			debugger;
			var mapping = {
				a: {
					update: function(options) {
						debugger;
						return options.data + " modified";
					}
				}
			};
			ko.mapping.fromJS(data, mapping, _this);
			return _this;
		};
	};

	var model = new ViewModel();
	model.update({ filters: { a: "a1" }});
	equal(model.filters.a(), "a1 modified");
});

//https://github.com/SteveSanderson/knockout.mapping/issues/107
test('Issue #107', function () {
	var model = ko.mapping.fromJS({ foo: 'bar' }, {
		fiz: 'applesauce'
	});

	ko.mapping.fromJS({ foo: 'baz' }, model);

	equal(model.foo(), "baz");
});
