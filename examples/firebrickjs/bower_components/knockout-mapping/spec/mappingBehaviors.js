module('Mapping');

test('ko.mapping.toJS should unwrap observable values', function () {
	var atomicValues = ["hello", 123, true, null, undefined,
	{
		a: 1
	}];
	for (var i = 0; i < atomicValues.length; i++) {
		var data = ko.observable(atomicValues[i]);
		var result = ko.mapping.toJS(data);
		equal(ko.isObservable(result), false);
		deepEqual(result, atomicValues[i]);
	}
});

test('ko.mapping.toJS should unwrap observable properties, including nested ones', function () {
	var data = {
		a: ko.observable(123),
		b: {
			b1: ko.observable(456),
			b2: 789
		}
	};
	var result = ko.mapping.toJS(data);
	equal(result.a, 123);
	equal(result.b.b1, 456);
	equal(result.b.b2, 789);
});

test('ko.mapping.toJS should unwrap observable arrays and things inside them', function () {
	var data = ko.observableArray(['a', 1,
	{
		someProp: ko.observable('Hey')
	}]);
	var result = ko.mapping.toJS(data);
	equal(result.length, 3);
	equal(result[0], 'a');
	equal(result[1], 1);
	equal(result[2].someProp, 'Hey');
});

test('ko.mapping.toJS should ignore specified single property', function() {
	var data = {
		a: "a",
		b: "b"
	};
	
	var result = ko.mapping.toJS(data, { ignore: "b" });
	equal(result.a, "a");
	equal(result.b, undefined);
});

test('ko.mapping.toJS should ignore specified single property on update', function() {
	var data = {
		a: "a",
		b: "b",
		c: "c"
	};
	
	var result = ko.mapping.fromJS(data);
	equal(result.a(), "a");
	equal(result.b(), "b");
	equal(result.c(), "c");
	ko.mapping.fromJS({ a: "a2", b: "b2", c: "c2" }, { ignore: ["b", "c"] }, result);
	equal(result.a(), "a2");
	equal(result.b(), "b");
	equal(result.c(), "c");
});

test('ko.mapping.toJS should ignore specified multiple properties', function() {
	var data = {
		a: { a1: "a1", a2: "a2" },
		b: "b"
	};
	
	var result = ko.mapping.fromJS(data, { ignore: ["a.a1", "b"] });
	equal(result.a.a1, undefined);
	equal(result.a.a2(), "a2");
	equal(result.b, undefined);

    data.a.a1 = "a11";
    data.a.a2 = "a22";
	ko.mapping.fromJS(data, {}, result);
	equal(result.a.a1, undefined);
	equal(result.a.a2(), "a22");
	equal(result.b, undefined);
});

test('ko.mapping.fromJS should ignore specified single property', function() {
	var data = {
		a: "a",
		b: "b"
	};
	
	var result = ko.mapping.fromJS(data, { ignore: "b" });
	equal(result.a(), "a");
	equal(result.b, undefined);
});

test('ko.mapping.fromJS should ignore specified array item', function() {
	var data = {
		a: "a",
		b: [{ b1: "v1" }, { b2: "v2" }] 
	};
	
	var result = ko.mapping.fromJS(data, { ignore: "b[1].b2" });
	equal(result.a(), "a");
	equal(result.b()[0].b1(), "v1");
	equal(result.b()[1].b2, undefined);
});

test('ko.mapping.fromJS should ignore specified single property, also when going back .toJS', function() {
	var data = {
		a: "a",
		b: "b"
	};
	
	var result = ko.mapping.fromJS(data, { ignore: "b" });
	var js = ko.mapping.toJS(result);
	equal(js.a, "a");
	equal(js.b, undefined);
});

test('ko.mapping.fromJS should copy specified single property', function() {
	var data = {
		a: "a",
		b: "b"
	};
	
	var result = ko.mapping.fromJS(data, { copy: "b" });
	equal(result.a(), "a");
	equal(result.b, "b");
});

test('ko.mapping.fromJS should copy specified array', function() {
	var data = {
		a: "a",
		b: ["b1", "b2"]
	};
	
	var result = ko.mapping.fromJS(data, { copy: "b" });
	equal(result.a(), "a");
	deepEqual(result.b, ["b1", "b2"]);
});

test('ko.mapping.fromJS should copy specified array item', function() {
	var data = {
		a: "a",
		b: [{ b1: "v1" }, { b2: "v2" }] 
	};
	
	var result = ko.mapping.fromJS(data, { copy: "b[0].b1" });
	equal(result.a(), "a");
	equal(result.b()[0].b1, "v1");
	equal(result.b()[1].b2(), "v2");
});

test('ko.mapping.fromJS should copy specified single property, also when going back .toJS', function() {
	var data = {
		a: "a",
		b: "b"
	};
	
	var result = ko.mapping.fromJS(data, { copy: "b" });
	var js = ko.mapping.toJS(result);
	equal(js.a, "a");
	equal(js.b, "b");
});

test('ko.mapping.fromJS should copy specified single property, also when going back .toJS, except when overridden', function() {
	var data = {
		a: "a",
		b: "b"
	};
	
	var result = ko.mapping.fromJS(data, { copy: "b" });
	var js = ko.mapping.toJS(result, { ignore: "b" });
	equal(js.a, "a");
	equal(js.b, undefined);
});

test('ko.mapping.toJS should include specified single property', function() {
	var data = {
		a: "a"
	};
	
	var mapped = ko.mapping.fromJS(data);
	mapped.c = 1;
	mapped.d = 2;
	var result = ko.mapping.toJS(mapped, { include: "c" });
	equal(result.a, "a");
	equal(result.c, 1);
	equal(result.d, undefined);
});

test('ko.mapping.toJS should by default ignore the mapping property', function() {
	var data = {
		a: "a",
		b: "b"
	};
	
	var fromJS = ko.mapping.fromJS(data);
	var result = ko.mapping.toJS(fromJS);
	equal(result.a, "a");
	equal(result.b, "b");
	equal(result.__ko_mapping__, undefined);
});

test('ko.mapping.toJS should by default include the _destroy property', function() {
	var data = {
		a: "a"
	};
	
	var fromJS = ko.mapping.fromJS(data);
	fromJS._destroy = true;
	var result = ko.mapping.toJS(fromJS);
	equal(result.a, "a");
	equal(result._destroy, true);
});

test('ko.mapping.toJS should merge the default includes', function() {
	var data = {
		a: "a"
	};
	
	var fromJS = ko.mapping.fromJS(data);
	fromJS.b = "b";
	fromJS._destroy = true;
	var result = ko.mapping.toJS(fromJS, { include: "b" });
	equal(result.a, "a");
	equal(result.b, "b");
	equal(result._destroy, true);
});

test('ko.mapping.toJS should merge the default ignores', function() {
	var data = {
		a: "a",
		b: "b",
		c: "c"
	};
	
	ko.mapping.defaultOptions().ignore = ["a"];
	var fromJS = ko.mapping.fromJS(data);
	var result = ko.mapping.toJS(fromJS, { ignore: "b" });
	equal(result.a, undefined);
	equal(result.b, undefined);
	equal(result.c, "c");
});

test('ko.mapping.defaultOptions should by default include the _destroy property', function() {
	notEqual(ko.utils.arrayIndexOf(ko.mapping.defaultOptions().include, "_destroy"), -1);
});

test('ko.mapping.defaultOptions.include should be an array', function() {
	var didThrow = false;
	try {
		ko.mapping.defaultOptions().include = {};
		ko.mapping.toJS({});
	}
	catch (ex) {
		didThrow = true
	}
	equal(didThrow, true);
});

test('ko.mapping.defaultOptions.ignore should be an array', function() {
	var didThrow = false;
	try {
		ko.mapping.defaultOptions().ignore = {};
		ko.mapping.toJS({});
	}
	catch (ex) {
		didThrow = true
	}
	equal(didThrow, true);
});

test('ko.mapping.defaultOptions can be set', function() {
	var oldOptions = ko.mapping.defaultOptions();
	ko.mapping.defaultOptions({ a: "a" });
	var newOptions = ko.mapping.defaultOptions();
	ko.mapping.defaultOptions(oldOptions);
	equal(newOptions.a, "a");
});

test('recognized root-level options should be moved into a root namespace, leaving other options in place', function() {
	var recognizedRootProperties = ['create', 'update', 'key', 'arrayChanged'];
	
	// Zero out the default options so they don't interfere with this test
	ko.mapping.defaultOptions({});
	
	// Set up a mapping with root and child mappings
	var mapping = {
		ignore: ['a'],
		copy: ['b'],
		include: ['c'],
		create: function(opts) { return opts.data; },
		update: function(opts) { return opts.data; },
		key: function(item) { return ko.utils.unwrapObservable(item.id); },
		arrayChanged: function(event, item) { },
		children: {
			ignore: ['a1'],
			copy: ['b1'],
			include: ['c1'],
			create: function(opts) { return opts.data; },
			update: function(opts) { return opts.data; },
			key: function(item) { return ko.utils.unwrapObservable(item.id); },
			arrayChanged: function(event, item) { }
		}
	};
	
	// Run the mapping through ko.mapping.fromJS
	var resultantMapping = ko.mapping.fromJS({}, mapping).__ko_mapping__;
	
	// Test that the recognized root-level mappings were moved into a root-level namespace
	for(var i=recognizedRootProperties.length-1; i>=0; i--) {
		notDeepEqual(resultantMapping[recognizedRootProperties[i]], mapping[[recognizedRootProperties[i]]]);
		deepEqual(resultantMapping[''][recognizedRootProperties[i]], mapping[[recognizedRootProperties[i]]]);
	};
	
	// Test that the non-recognized root-level and descendant mappings were left in place
	for(property in mapping) {
		window[recognizedRootProperties.indexOf(property) == -1 ? 'deepEqual' : 'notDeepEqual'](resultantMapping[property], mapping[property]);
	};
});

test('ko.mapping.toJS should ignore properties that were not part of the original model', function () {
	var data = {
		a: 123,
		b: {
			b1: 456,
			b2: [
				"b21", "b22"
			],
		}
	};
	
	var mapped = ko.mapping.fromJS(data);
	mapped.extraProperty = ko.observable(333);
	mapped.extraFunction = function() {};
	
	var unmapped = ko.mapping.toJS(mapped);
	equal(unmapped.a, 123);
	equal(unmapped.b.b1, 456);
	equal(unmapped.b.b2[0], "b21");
	equal(unmapped.b.b2[1], "b22");
	equal(unmapped.extraProperty, undefined);
	equal(unmapped.extraFunction, undefined);
	equal(unmapped.__ko_mapping__, undefined);
});

test('ko.mapping.toJS should ignore properties that were not part of the original model when there are no nested create callbacks', function () {
	var data = [
		{
			a: [{ id: "a1.1" }, { id: "a1.2" }]
		}
	];
	
	var mapped = ko.mapping.fromJS(data, {
		create: function(options) {
			return ko.mapping.fromJS(options.data);
		}
	});
	mapped.extraProperty = ko.observable(333);
	mapped.extraFunction = function() {};
	
	var unmapped = ko.mapping.toJS(mapped);
	equal(unmapped[0].a[0].id, "a1.1");
	equal(unmapped[0].a[1].id, "a1.2");
	equal(unmapped.extraProperty, undefined);
	equal(unmapped.extraFunction, undefined);
	equal(unmapped.__ko_mapping__, undefined);
});

test('ko.mapping.toJS should ignore properties that were not part of the original model when there are nested create callbacks', function () {
	var data = [
		{
			a: [{ id: "a1.1" }, { id: "a1.2" }]
		}
	];
	
	var nestedMappingOptions = {
		a: {
			create: function(options) {
				return ko.mapping.fromJS(options.data);
			}
		}
	};
	
	var mapped = ko.mapping.fromJS(data, {
		create: function(options) {
			return ko.mapping.fromJS(options.data, nestedMappingOptions);
		}
	});
	mapped.extraProperty = ko.observable(333);
	mapped.extraFunction = function() {};
	
	var unmapped = ko.mapping.toJS(mapped);
	equal(unmapped[0].a[0].id, "a1.1");
	equal(unmapped[0].a[1].id, "a1.2");
	equal(unmapped.extraProperty, undefined);
	equal(unmapped.extraFunction, undefined);
	equal(unmapped.__ko_mapping__, undefined);
});

test('ko.mapping.toJS should ignore specified properties', function() {
	var data = {
		a: "a",
		b: "b",
		c: "c"
	};
	
	var result = ko.mapping.toJS(data, { ignore: ["b", "c"] });
	equal(result.a, "a");
	equal(result.b, undefined);
	equal(result.c, undefined);
});

test('ko.mapping.toJSON should ignore specified properties', function() {
	var data = {
		a: "a",
		b: "b",
		c: "c"
	};
	
	var result = ko.mapping.toJSON(data, { ignore: ["b", "c"] });
	equal(result, "{\"a\":\"a\"}");
});

test('ko.mapping.toJSON should unwrap everything and then stringify', function () {
	var data = ko.observableArray(['a', 1,
	{
		someProp: ko.observable('Hey')
	}]);
	var result = ko.mapping.toJSON(data);

	// Check via parsing so the specs are independent of browser-specific JSON string formatting
	equal(typeof result, 'string');
	var parsedResult = ko.utils.parseJson(result);
	equal(parsedResult.length, 3);
	equal(parsedResult[0], 'a');
	equal(parsedResult[1], 1);
	equal(parsedResult[2].someProp, 'Hey');
});

test('ko.mapping.fromJS should require a parameter', function () {
	var didThrow = false;
	try {
		ko.mapping.fromJS()
	}
	catch (ex) {
		didThrow = true
	}
	equal(didThrow, true);
});

test('ko.mapping.fromJS should return an observable if you supply an atomic value', function () {
	var atomicValues = ["hello", 123, true, null, undefined];
	for (var i = 0; i < atomicValues.length; i++) {
		var result = ko.mapping.fromJS(atomicValues[i]);
		equal(ko.isObservable(result), true);
		equal(result(), atomicValues[i]);
	}
});

test('ko.mapping.fromJS should be able to map into an existing object', function () {
	var existingObj = {
		a: "a"
	};
	
	var obj = {
		b: "b"
	};
	
	ko.mapping.fromJS(obj, {}, existingObj);
	
	equal(ko.isObservable(existingObj.a), false);
	equal(ko.isObservable(existingObj.b), true);
	equal(existingObj.a, "a");
	equal(existingObj.b(), "b");
});

test('ko.mapping.fromJS should return an observableArray if you supply an array, but should not wrap its entries in further observables', function () {
	var sampleArray = ["a", "b"];
	var result = ko.mapping.fromJS(sampleArray);
	equal(typeof result.destroyAll, 'function'); // Just an example of a function on ko.observableArray but not on Array
	equal(result().length, 2);
	equal(result()[0], "a");
	equal(result()[1], "b");
});

test('ko.mapping.fromJS should return an observableArray if you supply an array, and leave entries as observables if there is a create mapping that does that', function () {
        var sampleArray = {array: ["a", "b"]};
        var result = ko.mapping.fromJS(sampleArray, {
                array: {
                        create: function(options) {
                                return new ko.observable(options.data);
                        }
                }
        });
        equal(result.array().length, 2);
        equal(ko.isObservable(result.array()[0]),true);
        equal(ko.isObservable(result.array()[1]),true);
        equal(result.array()[0](), "a");
        equal(result.array()[1](), "b");
});

test('ko.mapping.fromJS should not return an observable if you supply an object that could have properties', function () {
	equal(ko.isObservable(ko.mapping.fromJS({})), false);
});

test('ko.mapping.fromJS should not wrap functions in an observable', function () {
	var result = ko.mapping.fromJS({}, {
		create: function(model) {
			return {
				myFunc: function() {
					return 123;
				}
			}
		}
	});
	equal(result.myFunc(), 123);
});

test('ko.mapping.fromJS update callbacks should pass in a non-observable', function () {
	var result = ko.mapping.fromJS({
		obj: { a: "a" }
	}, {
		obj: {
			update: function(options) {
				equal(options.observable, undefined);
				return { b: "b" };
			}
		}
	});
	equal(result.obj.b, "b");
});

test('ko.mapping.fromJS update callbacks should pass in an observable, when original is also observable', function () {
	var result = ko.mapping.fromJS({
		obj: ko.observable("a")
	}, {
		obj: {
			update: function(options) {
				return options.observable() + "ab";
			}
		}
	});
	equal(result.obj(), "aab");
});

test('ko.mapping.fromJS update callbacks should pass in an observable, when original is not observable', function () {
	var result = ko.mapping.fromJS({
		obj: "a"
	}, {
		obj: {
			update: function(options) {
				return options.observable() + "ab";
			}
		}
	});
	equal(result.obj(), "aab");
});

test('ko.mapping.fromJS should map the top-level atomic properties on the supplied object as observables', function () {
	var result = ko.mapping.fromJS({
		a: 123,
		b: 'Hello',
		c: true
	});
	equal(ko.isObservable(result.a), true);
	equal(ko.isObservable(result.b), true);
	equal(ko.isObservable(result.c), true);
	equal(result.a(), 123);
	equal(result.b(), 'Hello');
	equal(result.c(), true);
});

test('ko.mapping.fromJS should not map the top-level non-atomic properties on the supplied object as observables', function () {
	var result = ko.mapping.fromJS({
		a: {
			a1: "Hello"
		}
	});
	equal(ko.isObservable(result.a), false);
	equal(ko.isObservable(result.a.a1), true);
	equal(result.a.a1(), 'Hello');
});

test('ko.mapping.fromJS should not map the top-level non-atomic properties on the supplied overriden model as observables', function () {
	var result = ko.mapping.fromJS({
		a: {
			a2: "a2"
		}
	}, {
		create: function(model) {
			return {
				a: {
					a1: "a1"
				}
			};
		}
	});
	equal(ko.isObservable(result.a), false);
	equal(ko.isObservable(result.a.a1), false);
	equal(result.a.a2, undefined);
	equal(result.a.a1, 'a1');
});

test('ko.mapping.fromJS should not map top-level objects on the supplied overriden model as observables', function () {
	var dummyObject = function (options) {
		this.a1 = options.a1;
		return this;
	}

	var result = ko.mapping.fromJS({}, {
		create: function(model) {
			return {
				a: new dummyObject({
					a1: "Hello"
				})
			};
		}
	});
	equal(ko.isObservable(result.a), false);
	equal(ko.isObservable(result.a.a1), false);
	equal(result.a.a1, 'Hello');
});

test('ko.mapping.fromJS should allow non-unique atomic properties', function () {
	var vm = ko.mapping.fromJS({
		a: [1, 2, 1]
	});

	deepEqual(vm.a(), [1, 2, 1]);
});
/* speed optimizations don't allow this anymore...
test('ko.mapping.fromJS should not allow non-unique non-atomic properties', function () {
	var options = {
		key: function(item) { return ko.utils.unwrapObservable(item.id); }
	};

	var didThrow = false;
	try {
		ko.mapping.fromJS([
			{ id: "a1" },
			{ id: "a2" },
			{ id: "a1" }
		], options);
	}
	catch (ex) {
		didThrow = true
	}
	equal(didThrow, true);
});
*/
test('ko.mapping.fromJS should map descendant properties on the supplied object as observables', function () {
	var result = ko.mapping.fromJS({
		a: {
			a1: 'a1value',
			a2: {
				a21: 'a21value',
				a22: 'a22value'
			}
		},
		b: {
			b1: null,
			b2: undefined
		}
	});
	equal(result.a.a1(), 'a1value');
	equal(result.a.a2.a21(), 'a21value');
	equal(result.a.a2.a22(), 'a22value');
	equal(result.b.b1(), null);
	equal(result.b.b2(), undefined);
});

test('ko.mapping.fromJS should map observable properties, but without adding a further observable wrapper', function () {
	var result = ko.mapping.fromJS({
		a: ko.observable('Hey')
	});
	equal(result.a(), 'Hey');
});

test('ko.mapping.fromJS should escape from reference cycles', function () {
	var obj = {};
	obj.someProp = {
		owner: obj
	};
	var result = ko.mapping.fromJS(obj);
	equal(result.someProp.owner === result, true);
});

test('ko.mapping.fromJS should send relevant create callbacks', function () {
	var items = [];
	var index = 0;
	var result = ko.mapping.fromJS({
		a: "hello"
	}, {
		create: function (model) {
			index++;
			return model;
		}
	});
	equal(index, 1);
});

test('ko.mapping.fromJS should send relevant create callbacks when mapping arrays', function () {
	var items = [];
	var index = 0;
	var result = ko.mapping.fromJS([
		"hello"
	], {
		create: function (model) {
			index++;
			return model;
		}
	});
	equal(index, 1);
});

test('ko.mapping.fromJS should send parent along to create callback when creating an object', function() {
	var obj = {
		a: "a",
		b: {
			b1: "b1"
		}
	};
	
	var result = ko.mapping.fromJS(obj, {
		"b": {
			create: function(options) {
				equal(ko.isObservable(options.parent.a), true);
				equal(options.parent.a(), "a");
			}
		}
	});
});

test('ko.mapping.fromJS should send parent along to create callback when creating an array item inside an object', function() {
	var obj = {
		a: "a",
		b: [
			{ id: 1 },
			{ id: 2 }
		]
	};
	
	var target = {};
	var numCreated = 0;
	var result = ko.mapping.fromJS(obj, {
		"b": {
			create: function(options) {
				equal(ko.isObservable(options.parent), false);
				equal(options.parent, target);
				numCreated++;
			}
		}
	}, target);
	
	equal(numCreated, 2);
});

test('ko.mapping.fromJS should send parent along to create callback when creating an array item inside an array', function() {
	// parent is the array
	
	var obj = [
		{ id: 1 },
		{ id: 2 }
	];
	
	var target = [];
	var numCreated = 0;
	var result = ko.mapping.fromJS(obj, {
		create: function(options) {
			equal(ko.isObservable(options.parent), true);
			numCreated++;
		}
	}, target);
	
	equal(numCreated, 2);
});

test('ko.mapping.fromJS should update objects in arrays that were specified in the overriden model in the create callback', function () {
	var options = {
		create: function(options) {
			return ko.mapping.fromJS(options.data);
		}
	}
	
	var result = ko.mapping.fromJS([], options);
	ko.mapping.fromJS([{
		a: "a",
		b: "b"
	}], {}, result);

	equal(ko.isObservable(result), true);
	equal(ko.isObservable(result()[0].a), true);
	equal(result()[0].a(), "a");
	equal(ko.isObservable(result()[0].b), true);
	equal(result()[0].b(), "b");
});

test('ko.mapping.fromJS should use the create callback to update objects in arrays', function () {
	var created = [];
	var arrayEvents = 0;
	
	var options = {
		key: function(item) { return ko.utils.unwrapObservable(item.id); },
		create: function(options) {
			created.push(options.data.id);
			return ko.mapping.fromJS(options.data);
		},
		arrayChanged: function(event, item) {
			arrayEvents++;
		}
	}
	
	var result = ko.mapping.fromJS([
		{ id: "a" }
	], options);
	
	ko.mapping.fromJS([
		{ id: "a" },
		{ id: "b" }
	], {}, result);

	equal(created[0], "a");
	equal(created[1], "b");
	equal(result()[0].id(), "a");
	equal(result()[1].id(), "b");
	equal(arrayEvents, 3); // added, retained, added
});

test('ko.mapping.fromJS should not call the create callback for existing objects', function () {
	var numCreate = 0;
	var options = {
		create: function (model) {
			numCreate++;
			var overridenModel = {};
			return overridenModel;
		}
	};
	
	var items = [];
	var index = 0;
	var result = ko.mapping.fromJS({
		a: "hello"
	}, options);

	ko.mapping.fromJS({
		a: "bye"
	}, {}, result);

	equal(numCreate, 1);
});

test('ko.mapping.fromJS should not overwrite the existing observable array', function () {
	var result = ko.mapping.fromJS({
		a: [1]
	});
	
	var resultA = result.a;

	ko.mapping.fromJS({
		a: [1]
	}, result);
	
	equal(resultA, result.a);
});

test('ko.mapping.fromJS should send an added callback for every array item that is added to a previously non-existent array', function () {
	var added = [];

	var options = {
		"a" : {
			arrayChanged: function (event, newValue) {
				if (event === "added") added.push(newValue);
			}
		}
	};
	var result = ko.mapping.fromJS({}, options);
	ko.mapping.fromJS({
		a: [1, 2]
	}, {}, result);
	equal(added.length, 2);
	equal(added[0], 1);
	equal(added[1], 2);
});

test('ko.mapping.fromJS should send an added callback for every array item that is added to a previously empty array', function () {
	var added = [];

	var options = {
		"a": {
			arrayChanged: function (event, newValue) {
				if (event === "added") added.push(newValue);
			}
		}
	};
	var result = ko.mapping.fromJS({ a: [] }, options);
	ko.mapping.fromJS({
		a: [1, 2]
	}, {}, result);
	equal(added.length, 2);
	equal(added[0], 1);
	equal(added[1], 2);
});

test('ko.mapping.fromJS should not make observable anything that is not in the js object', function () {
	var result = ko.mapping.fromJS({});
	result.a = "a";
	equal(ko.isObservable(result.a), false);
	
	ko.mapping.fromJS({
		b: "b"
	}, {}, result);
	
	equal(ko.isObservable(result.a), false);
	equal(ko.isObservable(result.b), true);
	equal(result.a, "a");
	equal(result.b(), "b");
});

test('ko.mapping.fromJS should not make observable anything that is not in the js object when overriding the model', function () {
	var options = {
		create: function(model) {
			return {
				a: "a"
			}
		}
	};

	var result = ko.mapping.fromJS({}, options);
	ko.mapping.fromJS({
		b: "b"
	}, {}, result);
	
	equal(ko.isObservable(result.a), false);
	equal(ko.isObservable(result.b), true);
	equal(result.a, "a");
	equal(result.b(), "b");
});

test('ko.mapping.fromJS should send an added callback for every array item that is added', function () {
	var added = [];

	var options = {
		"a": {
			arrayChanged: function (event, newValue) {
				if (event === "added") added.push(newValue);
			}
		}
	};
	var result = ko.mapping.fromJS({
		a: []
	}, options);
	ko.mapping.fromJS({
		a: [1, 2]
	}, {}, result);
	equal(added.length, 2);
	equal(added[0], 1);
	equal(added[1], 2);
});

test('ko.mapping.fromJS should send an added callback for every array item that is added', function () {
	var added = [];

	var result = ko.mapping.fromJS({
		a: [1, 2]
	}, {
		"a": {
			arrayChanged: function (event, newValue) {
				if (event === "added") added.push(newValue);
			}
		}
	});
	equal(added.length, 2);
	equal(added[0], 1);
	equal(added[1], 2);
});

test('ko.mapping.fromJSON should parse and then map in the same way', function () {
	var jsonString = ko.utils.stringifyJson({ // Note that "undefined" property values are omitted by the stringifier, so not testing those
		a: {
			a1: 'a1value',
			a2: {
				a21: 'a21value',
				a22: 'a22value'
			}
		},
		b: {
			b1: null
		}
	});
	var result = ko.mapping.fromJSON(jsonString);
	equal(result.a.a1(), 'a1value');
	equal(result.a.a2.a21(), 'a21value');
	equal(result.a.a2.a22(), 'a22value');
	equal(result.b.b1(), null);
});

test('ko.mapping.fromJS should be able to map empty object structures', function () {
	var obj = {
		someProp: undefined,
		a: []
	};
	var result = ko.mapping.fromJS(obj);
	equal(ko.isObservable(result.someProp), true);
	equal(ko.isObservable(result.a), true);
	equal(ko.isObservable(result.unknownProperty), false);
});

test('ko.mapping.fromJS should send create callbacks when atomic items are constructed', function () {
	var atomicValues = ["hello", 123, true, null, undefined];
	var callbacksReceived = 0;
	for (var i = 0; i < atomicValues.length; i++) {
		var result = ko.mapping.fromJS(atomicValues[i], {
			create: function (item) {
				callbacksReceived++;
				return item;
			}
		});
	}
	equal(callbacksReceived, 5);
});

test('ko.mapping.fromJS should send callbacks when atomic array elements are constructed', function () {
	var oldItems = {
		array: []
	};
	var newItems = {
		array: [{
			id: 1
		},
		{
			id: 2
		}]
	};

	var items = [];
	var result = ko.mapping.fromJS(oldItems, {
		"array": {
			arrayChanged: function (event, item) {
				if (event == "added")
					items.push(item);
			}
		}
	});
	ko.mapping.fromJS(newItems, {}, result);
	equal(items.length, 2);
});

test('ko.mapping.fromJS should not send callbacks containing parent names when descendant objects are constructed', function () {
	var obj = {
		a: {
			a1: "hello",
			a2: 234,
			a3: {
				a31: null
			}
		}
	};
	var parents = [];
	var pushParent = function (item, parent) {
		parents.push(parent);
		return item;
	};
	var result = ko.mapping.fromJS(obj, {
		create: pushParent
	});
	equal(parents.length, 1);
	equal(parents[0], undefined);
});

test('ko.mapping.fromJS should create instead of update, on empty objects', function () {
	var obj = {
		a: ["a1", "a2"]
	};

	var result;
	result = ko.mapping.fromJS({});
	ko.mapping.fromJS(obj, {}, result);
	equal(result.a().length, 2);
	equal(result.a()[0], "a1");
	equal(result.a()[1], "a2");
});

test('ko.mapping.fromJS should update atomic observables', function () {
	var atomicValues = ["hello", 123, true, null, undefined];
	var atomicValues2 = ["hello2", 124, false, "not null", "defined"];

	for (var i = 0; i < atomicValues.length; i++) {
		var result = ko.mapping.fromJS(atomicValues[i]);
		ko.mapping.fromJS(atomicValues2[i], {}, result);
		equal(ko.isObservable(result), true);
		equal(result(), atomicValues2[i]);
	}
});

test('ko.mapping.fromJS should update objects', function () {
	var obj = {
		a: "prop",
		b: {
			b1: null,
			b2: "b2"
		}
	}

	var obj2 = {
		a: "prop2",
		b: {
			b1: 124,
			b2: "b22"
		}
	}

	var result = ko.mapping.fromJS(obj);
	ko.mapping.fromJS(obj2, {}, result);
	equal(result.a(), "prop2");
	equal(result.b.b1(), 124);
	equal(result.b.b2(), "b22");
});

test('ko.mapping.fromJS should update initially empty objects', function () {
	var obj = {
		a: undefined,
		b: []
	}

	var obj2 = {
		a: "prop2",
		b: ["b1", "b2"]
	}

	var result = ko.mapping.fromJS(obj);
	ko.mapping.fromJS(obj2, {}, result);
	equal(result.a(), "prop2");
	equal(result.b()[0], "b1");
	equal(result.b()[1], "b2");
});

test('ko.mapping.fromJS should update arrays containing atomic types', function () {
	var obj = ["a1", "a2", 6];
	var obj2 = ["a3", "a4", 7];

	var result = ko.mapping.fromJS(obj);

	ko.mapping.fromJS(obj2, {}, result);
	equal(result().length, 3);
	equal(result()[0], "a3");
	equal(result()[1], "a4");
	equal(result()[2], 7);
});

test('ko.mapping.fromJS should update arrays containing objects', function () {
	var obj = {
		a: [{
			id: 1,
			value: "a1"
		},
		{
			id: 2,
			value: "a2"
		}]
	}

	var obj2 = {
		a: [{
			id: 1,
			value: "a1"
		},
		{
			id: 3,
			value: "a3"
		}]
	}

	var options = {
		"a": {
			key: function (item) {
				return item.id;
			}
		}
	};
	var result = ko.mapping.fromJS(obj, options);

	ko.mapping.fromJS(obj2, {}, result);
	equal(result.a().length, 2);
	equal(result.a()[0].value(), "a1");
	equal(result.a()[1].value(), "a3");
});

test('ko.mapping.fromJS should send a callback when adding new objects to an array', function () {
	var obj = [{
		id: 1
	}];
	var obj2 = [{
		id: 1
	},
	{
		id: 2
	}];

	var mappedItems = [];

	var options = {
		key: function(item) {
			return item.id;
		},
		arrayChanged: function (event, item) {
			if (event == "added") mappedItems.push(item);
		}
	};
	var result = ko.mapping.fromJS(obj, options);
	ko.mapping.fromJS(obj2, {}, result);
	equal(mappedItems.length, 2);
	equal(mappedItems[0].id(), 1);
	equal(mappedItems[1].id(), 2);
});

test('ko.mapping.fromJS should be able to update from an observable source', function () {
	var obj = [{
		id: 1
	}];
	var obj2 = ko.mapping.fromJS([{
		id: 1
	},
	{
		id: 2
	}]);

	var result = ko.mapping.fromJS(obj);
	ko.mapping.fromJS(obj2, {}, result);
	equal(result().length, 2);
	equal(result()[0].id(), 1);
	equal(result()[1].id(), 2);
});

test('ko.mapping.fromJS should send a deleted callback when an item was deleted from an array', function () {
	var obj = [1, 2];
	var obj2 = [1];

	var items = [];

	var options = {
		arrayChanged: function (event, item) {
			if (event == "deleted") items.push(item);
		}
	};
	var result = ko.mapping.fromJS(obj, options);
	ko.mapping.fromJS(obj2, {}, result);
	equal(items.length, 1);
	equal(items[0], 2);
});

test('ko.mapping.fromJS should reuse options that were added in ko.mapping.fromJS', function() {
	var viewModelMapping = {
		key: function(data) {
			return ko.utils.unwrapObservable(data.id);
		},
		create: function(options) {
			return new viewModel(options);
		}
	};
	
	var viewModel = function(options) {
		var mapping = {
			entries: viewModelMapping
		};

		ko.mapping.fromJS(options.data, mapping, this);

		this.func = function() { return true; };
	};
	
	var model = ko.mapping.fromJS([], viewModelMapping);
	
	var data = [{
		"id": 1,
		"entries": [{
			"id": 2,
			"entries": [{
				"id": 3,
				"entries": []
			}]
		}]
	}];
	
	ko.mapping.fromJS(data, {}, model);
	ko.mapping.fromJS(data, {}, model);
	
	equal(model()[0].func(), true);
	equal(model()[0].entries()[0].func(), true);
	equal(model()[0].entries()[0].entries()[0].func(), true);
});

test('ko.mapping.toJS should not change the mapped object', function() {
	var obj = {
		a: "a"
	}
	
	var result = ko.mapping.fromJS(obj);
	result.b = ko.observable(123);
	var toJS = ko.mapping.toJS(result);
	
	equal(ko.isObservable(result.b), true);
	equal(result.b(), 123);
	equal(toJS.b, undefined);
});

test('ko.mapping.toJS should not change the mapped array', function() {
	var obj = [{
		a: 50
	}]
	
	var result = ko.mapping.fromJS(obj);
	result()[0].b = ko.observable(123);
	var toJS = ko.mapping.toJS(result);
	
	equal(ko.isObservable(result()[0].b), true);
	equal(result()[0].b(), 123);
});

test('observableArray.mappedRemove should use key callback if available', function() {
	var obj = [
		{ id : 1 },
		{ id : 2 }
	]
	
	var result = ko.mapping.fromJS(obj, {
		key: function(item) {
			return ko.utils.unwrapObservable(item.id);
		}
	});
	result.mappedRemove({ id : 2 });
	equal(result().length, 1);
});

test('observableArray.mappedRemove with predicate should use key callback if available', function() {
	var obj = [
		{ id : 1 },
		{ id : 2 }
	]
	
	var result = ko.mapping.fromJS(obj, {
		key: function(item) {
			return ko.utils.unwrapObservable(item.id);
		}
	});
	result.mappedRemove(function(key) {
		return key == 2;
	});
	equal(result().length, 1);
});

test('observableArray.mappedRemoveAll should use key callback if available', function() {
	var obj = [
		{ id : 1 },
		{ id : 2 }
	]
	
	var result = ko.mapping.fromJS(obj, {
		key: function(item) {
			return ko.utils.unwrapObservable(item.id);
		}
	});
	result.mappedRemoveAll([{ id : 2 }]);
	equal(result().length, 1);
});

test('observableArray.mappedDestroy should use key callback if available', function() {
	var obj = [
		{ id : 1 },
		{ id : 2 }
	]
	
	var result = ko.mapping.fromJS(obj, {
		key: function(item) {
			return ko.utils.unwrapObservable(item.id);
		}
	});
	result.mappedDestroy({ id : 2 });
	equal(result()[0]._destroy, undefined);
	equal(result()[1]._destroy, true);
});

test('observableArray.mappedDestroy with predicate should use key callback if available', function() {
	var obj = [
		{ id : 1 },
		{ id : 2 }
	]
	
	var result = ko.mapping.fromJS(obj, {
		key: function(item) {
			return ko.utils.unwrapObservable(item.id);
		}
	});
	result.mappedDestroy(function(key) {
		return key == 2;
	});
	equal(result()[0]._destroy, undefined);
	equal(result()[1]._destroy, true);
});
	
test('observableArray.mappedDestroyAll should use key callback if available', function() {
	var obj = [
		{ id : 1 },
		{ id : 2 }
	]
	
	var result = ko.mapping.fromJS(obj, {
		key: function(item) {
			return ko.utils.unwrapObservable(item.id);
		}
	});
	result.mappedDestroyAll([{ id : 2 }]);
	equal(result()[0]._destroy, undefined);
	equal(result()[1]._destroy, true);
});

test('observableArray.mappedIndexOf should use key callback if available', function() {
	var obj = [
		{ id : 1 },
		{ id : 2 }
	]
	
	var result = ko.mapping.fromJS(obj, {
		key: function(item) {
			return ko.utils.unwrapObservable(item.id);
		}
	});
	equal(result.mappedIndexOf({ id : 1 }), 0);
	equal(result.mappedIndexOf({ id : 2 }), 1);
	equal(result.mappedIndexOf({ id : 3 }), -1);
});

test('observableArray.mappedCreate should use key callback if available and not allow duplicates', function() {
	var obj = [
		{ id : 1 },
		{ id : 2 }
	]
	
	var result = ko.mapping.fromJS(obj, {
		key: function(item) {
			return ko.utils.unwrapObservable(item.id);
		}
	});		
	
	var caught = false;
	try {
		result.mappedCreate({ id : 1 });
	}		
	catch(e) {
		caught = true;
	}
	
	equal(caught, true);
	equal(result().length, 2);	
});

test('observableArray.mappedCreate should use create callback if available', function() {
	var obj = [ 
		{ id : 1 },
		{ id : 2 }
	]
	
	var childModel = function(data){			
		ko.mapping.fromJS(data, {}, this);
		this.Hello = ko.observable("hello");
	}
	
	var result = ko.mapping.fromJS(obj, {
		key: function(item) {
			return ko.utils.unwrapObservable(item.id);
		},
		create: function(options){
			return new childModel(options.data);
		}
	});
			
	result.mappedCreate({ id: 3 });
	var index = result.mappedIndexOf({ id : 3 });
	equal(index, 2);				
	equal(result()[index].Hello(), "hello");
});

test('observableArray.mappedCreate should use update callback if available', function() {
	var obj = [
		{ id : 1 },
		{ id : 2 }
	]

	var childModel = function(data){
		ko.mapping.fromJS(data, {}, this);
	}

	var result = ko.mapping.fromJS(obj, {
		key: function(item) {
			return ko.utils.unwrapObservable(item.id);
		},
		create: function(options){
			return new childModel(options.data);
		},
		update: function(options){
			return {
				bla: options.data.id * 10
			};
		}
	});

	result.mappedCreate({ id: 3 });
	equal(result()[0].bla, 10);
	equal(result()[2].bla, 30);
});

test('ko.mapping.fromJS should merge options from subsequent calls', function() {
	var obj = ['a'];
	
	var result = ko.mapping.fromJS(obj, { dummyOption1: 1 });
	ko.mapping.fromJS({}, { dummyOption2: 2 }, result);
	
	equal(result.__ko_mapping__.dummyOption1, 1);
	equal(result.__ko_mapping__.dummyOption2, 2);
});

test('ko.mapping.fromJS should correctly handle falsey values', function () {
	var obj = [false, ""];

	var result = ko.mapping.fromJS(obj);
	
	equal(result()[0] === false, true);
	equal(result()[1] === "", true);
});

test('ko.mapping.fromJS should correctly handle falsey values in keys', function () {
	var created = [];
	var gotDeletedEvent = false;
	
	var options = {
		key: function(item) { return ko.utils.unwrapObservable(item.id); },
		arrayChanged: function(event, item) {
			if (event === "deleted") gotDeletedEvent = true;
		}
	}
	
	var result = ko.mapping.fromJS([
		{ id: 0 }
	], options);
	
	ko.mapping.fromJS([
		{ id: 0 },
		{ id: 1 }
	], {}, result);
	
	equal(gotDeletedEvent, false);
});

test('ko.mapping.fromJS should allow duplicate atomic items in arrays', function () {
	var result = ko.mapping.fromJS([
		"1", "1", "2"
	]);
	
	equal(result().length, 3);
	equal(result()[0], "1");
	equal(result()[1], "1");
	equal(result()[2], "2");
	
	ko.mapping.fromJS([
		"1", "1", "1", "2"
	], {}, result);
	
	equal(result().length, 4);
	equal(result()[0], "1");
	equal(result()[1], "1");
	equal(result()[2], "1");
	equal(result()[3], "2");
});

test('when doing ko.mapping.fromJS on an already mapped object, the new options should combine with the old', function() {
	var dataA = {
		a: "a"
	};
	var dataB = {
		b: "b"
	};
	
	var mapped = {};
	ko.mapping.fromJS(dataA, {}, mapped);
	ko.mapping.fromJS(dataB, {}, mapped);
	equal(mapped.__ko_mapping__.mappedProperties.a, true);
	equal(mapped.__ko_mapping__.mappedProperties.b, true);
});

test('ko.mapping.fromJS should merge options from subsequent calls', function() {
	var obj = ['a'];
	
	var result = ko.mapping.fromJS(obj, { dummyOption1: 1 });
	ko.mapping.fromJS(['b'], { dummyOption2: 2 }, result);
	
	equal(result.__ko_mapping__.dummyOption1, 1);
	equal(result.__ko_mapping__.dummyOption2, 2);
});

test('ko.mapping.fromJS should work on unmapped objects', function() {
	var obj = ko.observableArray(['a']);
	
	ko.mapping.fromJS(['b'], {}, obj);
	
	equal(obj()[0], 'b');
});

test('ko.mapping.fromJS should update an array only once', function() {
	var obj = {
		a: ko.observableArray()
	};
	
	var updateCount = 0;
	obj.a.subscribe(function() {
		updateCount++;
	});
	
	ko.mapping.fromJS({ a: [1, 2, 3] }, {}, obj);
	
	equal(updateCount, 1);
});

test('ko.mapping.fromJSON should merge options from subsequent calls', function() {
	var obj = ['a'];
	
	var result = ko.mapping.fromJS(obj, { dummyOption1: 1 });
	ko.mapping.fromJSON('["b"]', { dummyOption2: 2 }, result);
	
	equal(result.__ko_mapping__.dummyOption1, 1);
	equal(result.__ko_mapping__.dummyOption2, 2);
});

test('ko.mapping.fromJS should be able to update observables not created by fromJS', function() {
	var existing = {
		a: ko.observable(),
		d: ko.observableArray()
	};
	
	ko.mapping.fromJS({
		a: {
			b: "b!"
		},
		d: [2]
	}, {}, existing);
	
	equal(existing.a().b(), "b!");
	equal(existing.d().length, 1);
	equal(existing.d()[0], 2);
});

test('ko.mapping.fromJS should accept an already mapped object as the second parameter', function() {
	var mapped = ko.mapping.fromJS({ a: "a" });
	ko.mapping.fromJS({ a: "b" }, mapped);
	equal(mapped.a(), "b");
});

test('ko.mapping.fromJS should properly map objects that appear in multiple places', function() {
	var obj = { title: "Lorem ipsum" }, obj2 = { title: "Lorem ipsum 2" };
	var x = [obj,obj2];
	var y = { o: obj, x: x };

	var z = ko.mapping.fromJS(y);

	equal(y.x[0].title, "Lorem ipsum");
	equal(z.x()[0].title(), "Lorem ipsum");
});

test('ko.mapping.fromJS should properly update arrays containing a NULL key', function() {
	var data = [1,2,3,null];
	var model=ko.mapping.fromJS(data);
	
	deepEqual(model(), [1,2,3,null]);

	data = [null,1,2,3];
	ko.mapping.fromJS(data, {}, model);

	deepEqual(model(), [null,1,2,3]);
});

test('ko.mapping.visitModel will pass in correct parent names', function() {
	var data = { a: { a2: "a2value" } };
	var parents = [];
	ko.mapping.visitModel(data, function(obj, parent) {
		parents.push(parent);
	});
	equal(parents.length, 3);
	equal(parents[0], undefined);
	equal(parents[1], "a");
	equal(parents[2], "a.a2");
});

test('ko.mapping.toJS should merge the default observe', function() {
	var data = {
		a: "a",
		b: "b",
		c: "c"
	};
	
	ko.mapping.defaultOptions().observe = ["a"];
	var result  = ko.mapping.fromJS(data, { observe: "b" });
	equal(ko.isObservable(result.a), true);
	equal(ko.isObservable(result.b), true);
	equal(ko.isObservable(result.c), false);	
});

test('ko.mapping.fromJS should observe specified single property', function() {
	var data = {
		a: "a",
		b: "b"
	};
	
	var result = ko.mapping.fromJS(data, { observe: "a" });
	equal(result.a(), "a");
	equal(result.b, "b");
});

test('ko.mapping.fromJS should observe specified array', function() {
	var data = {
		a: "a",
		b: ["b1", "b2"]
	};
	
	var result = ko.mapping.fromJS(data, { observe: "b" });
	equal(result.a, "a");
	equal(ko.isObservable(result.b), true);	
});

test('ko.mapping.fromJS should observe specified array item', function() {
	var data = {
		a: "a",
		b: [{ b1: "v1" }, { b2: "v2" }] 
	};
	
	var result = ko.mapping.fromJS(data, { observe: "b[0].b1" });
	equal(result.a, "a");
	equal(result.b[0].b1(), "v1");
	equal(result.b[1].b2, "v2");
});

test('ko.mapping.fromJS should observe specified array but not the children', function() {
	var data = {
		a: "a",
		b: [{ b1: "v1" }, { b2: "v2" }] 
	};
	
	var result = ko.mapping.fromJS(data, { observe: "b" });
	equal(result.a, "a");
	equal(result.b()[0].b1, "v1");
	equal(result.b()[1].b2, "v2");
});

test('ko.mapping.fromJS should observe specified single property, also when going back .toJS', function() {
	var data = {
		a: "a",
		b: "b"
	};
	
	var result = ko.mapping.fromJS(data, { observe: "b" });
	var js = ko.mapping.toJS(result);
	equal(js.a, "a");
	equal(js.b, "b");
});

test('ko.mapping.fromJS should copy specified single property, also when going back .toJS, except when overridden', function() {
	var data = {
		a: "a",
		b: "b"
	};
	
	var result = ko.mapping.fromJS(data, { observe: "b" });
	var js = ko.mapping.toJS(result, { ignore: "b" });
	equal(js.a, "a");
	equal(js.b, undefined);
});

test('ko.mapping.fromJS explicit declared none observable members should not be mapped to an observable', function() {
	var data = {
		a: "a",
		b: "b",
        c: "c"
	};
	
    var ViewModel = function() {
        this.a = ko.observable();
        this.b = null;
    };

	var result = ko.mapping.fromJS(data, {}, new ViewModel());
    equal(ko.isObservable(result.a), true);
    equal(ko.isObservable(result.b), false);
    equal(ko.isObservable(result.c), true);
    equal(result.b, data.b);
});

test('ko.mapping.toJS explicit declared none observable members should be mapped toJS correctly', function() {
	var data = {
		a: "a",
	};
	
    var ViewModel = function() {
        this.a = null;
    };

	var result = ko.mapping.fromJS(data, {}, new ViewModel());
    var js = ko.mapping.toJS(result);

    equal(js.b, data.b);
});

