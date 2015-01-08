define([
	'intern!bdd',
	'intern/chai!expect',
	'dojo/_base/lang',
	'dojox/mvc/at',
	'dojox/mvc/getStateful',
	'todo/computed',
	'../handleCleaner'
], function (bdd, expect, lang, at, getStateful, computed, handleCleaner) {
	'use strict';

	// For supporting Intern's true/false check
	/*jshint -W030*/
	bdd.describe('Test todo/computed', function () {
		var handles = [];
		bdd.afterEach(handleCleaner(handles));

		bdd.it('Check parameters', function () {
			var throwCount = 0;
			try {
				computed(undefined, 'foo');
			} catch (e) {
				++throwCount;
			}
			try {
				computed(null, 'foo');
			} catch (e) {
				++throwCount;
			}
			try {
				computed({}, '*');
			} catch (e) {
				++throwCount;
			}
			try {
				computed({}, 'foo', function () {}, at({}, '*'));
			} catch (e) {
				++throwCount;
			}
			expect(throwCount).to.equal(4);
		});

		bdd.it('Computed property - Observable', function () {
			var count = 0;
			var stateful = getStateful({
				first: 'John',
				last: 'Doe'
			});

			handles.push(computed(stateful, 'name', function (first, last) {
				return first + ' ' + last;
			}, at(stateful, 'first'), at(stateful, 'last')));

			handles.push(computed(stateful, 'nameLength', function (name) {
				return name.length;
			}, at(stateful, 'name')));

			handles.push(stateful.watch('name', function (name, old, current) {
				expect(current).to.equal('Ben Doe');
				expect(old).to.equal('John Doe');
				count++;
			}));

			handles.push(stateful.watch('nameLength', function (name, old, current) {
				expect(current).to.equal(7);
				expect(old).to.equal(8);
				count++;
			}));

			expect(stateful.get('name')).to.equal('John Doe');
			expect(stateful.get('nameLength')).to.equal(8);

			stateful.set('first', 'Ben');
			expect(count).to.equal(2);
		});

		bdd.it('Computed property - Non-observable', function () {
			var o = {
				first: 'John',
				last: 'Doe'
			};

			handles.push(computed(o, 'name', function (first, last) {
				return first + ' ' + last;
			}, at(o, 'first'), at(o, 'last')));

			handles.push(computed(o, 'nameLength', function (name) {
				return name.length;
			}, at(o, 'name')));

			expect(o.name).to.equal('John Doe');
			expect(o.nameLength).to.equal(8);
		});

		bdd.it('Computed array - Observable', function () {
			var count = 0;
			var stateful = getStateful({
				items: [
					{name: 'Anne Ackerman'},
					{name: 'Ben Beckham'},
					{name: 'Chad Chapman'},
					{name: 'Irene Ira'}
				],
				countShortLessThanFour: true
			});

			var callbacks = [
				function (length, oldLength) {
					expect(length).to.equal(57);
					expect(oldLength).to.equal(45);
					stateful.items[4].set('name', 'John Doe');
				},
				function (length, oldLength) {
					expect(length).to.equal(53);
					expect(oldLength).to.equal(57);
					stateful.set('countShortLessThanFour', false);
				},
				function (length, oldLength) {
					expect(length).to.equal(42);
					expect(oldLength).to.equal(53);
				}
			];

			handles.push(computed(stateful, 'totalNameLength', function (a, countShortLessThanFour) {
				var total = 0;
				for (var i = 0; i < a.length; i++) {
					var first = a[i].split(' ')[0];
					total += (countShortLessThanFour || first.length >= 4 ? a[i].length : 0);
				}
				return total;
			}, lang.mixin(at(stateful.items, 'name'), {each: true}), at(stateful, 'countShortLessThanFour')));

			handles.push(stateful.watch('totalNameLength', function (name, old, current) {
				callbacks[count++](current, old);
			}));

			expect(stateful.get('totalNameLength')).to.equal(45);

			stateful.items.push(getStateful({name: 'John Jacklin'}));
			expect(count).to.equal(3);
		});

		bdd.it('Computed array - Non-observable', function () {
			var o = {
				items: [
					{name: 'Anne Ackerman'},
					{name: 'Ben Beckham'},
					{name: 'Chad Chapman'},
					{name: 'Irene Ira'}
				],
				countShortLessThanFour: true
			};

			handles.push(computed(o, 'totalNameLength', function (a, countShortLessThanFour) {
				var total = 0;
				for (var i = 0; i < a.length; i++) {
					var first = a[i].split(' ')[0];
					total += (countShortLessThanFour || first.length >= 4 ? a[i].length : 0);
				}
				return total;
			}, lang.mixin(at(o.items, 'name'), {each: true}), at(o, 'countShortLessThanFour')));

			expect(o.totalNameLength).to.equal(45);
		});

		bdd.it('Computed property in array', function () {
			var called;
			var statefulArray = getStateful([
				'foo'
			]);

			handles.push(computed(statefulArray, 1, function (foo) {
				return '*' + foo + '*';
			}, at(statefulArray, 0)));

			handles.push(statefulArray.watch(1, function (name, old, current) {
				expect(current).to.equal('*bar*');
				expect(old).to.equal('*foo*');
				called = true;
			}));

			expect(statefulArray[1]).to.equal('*foo*');

			statefulArray.set(0, 'bar');
			expect(called).to.be.true;
		});

		bdd.it('Error in computed property callback', function () {
			var count = 0;
			var stateful = getStateful({
				first: 'John',
				last: 'Doe'
			});

			handles.push(computed(stateful, 'name', function (first, last) {
				if (first === 'John') {
					throw undefined;
				}
				return first + ' ' + last;
			}, at(stateful, 'first'), at(stateful, 'last')));

			handles.push(computed(stateful, 'nameLength', function (name) {
				return name.length;
			}, at(stateful, 'name')));

			handles.push(stateful.watch('name', function (name, old, current) {
				expect(current).to.equal('Ben Doe');
				expect(old).to.be.undefined;
				count++;
			}));

			handles.push(stateful.watch('nameLength', function (name, old, current) {
				expect(current).to.equal(7);
				expect(old).to.be.undefined;
				count++;
			}));

			expect(stateful.get('name')).to.be.undefined;
			expect(stateful.get('nameLength')).to.be.undefined;

			stateful.set('first', 'Ben');
			expect(count).to.equal(2);
		});

		bdd.it('Checking for same value', function () {
			var dfd = this.async(1000);
			var shouldChange = true;
			var count = 0;
			var stateful = getStateful({
				foo: NaN
			});
			handles.push(computed(stateful, 'computed', dfd.rejectOnError(function (foo) {
				if (!shouldChange) {
					throw new Error('Change is detected even though there is no actual change.');
				}
				++count;
				return foo;
			}), at(stateful, 'foo')));
			shouldChange = false;
			stateful.set('foo', NaN);
			shouldChange = true;
			stateful.set('foo', -0);
			stateful.set('foo', +0);
			expect(count).to.equal(3);
			dfd.resolve(1);
		});

		bdd.it('Cleaning up computed properties/arrays', function () {
			var stateful = getStateful({
				first: 'John',
				last: 'Doe',
				items: [
					{name: 'Anne Ackerman'},
					{name: 'Ben Beckham'},
					{name: 'Chad Chapman'},
					{name: 'Irene Ira'}
				]
			});

			var computeHandleName = computed(stateful, 'name', function (first, last) {
				return first + ' ' + last;
			}, at(stateful, 'first'), at(stateful, 'last'));
			handles.push(computeHandleName);

			var computeHandleTotalNameLength = computed(stateful, 'totalNameLength', function (names) {
				var total = 0;
				for (var i = 0; i < names.length; i++) {
					total += names[i].length;
				}
				return total;
			}, lang.mixin(at(stateful.items, 'name'), {each: true}));
			handles.push(computeHandleTotalNameLength);

			handles.push(stateful.watch('nameLength', function () {
				throw new Error('Watch callback shouldn\'t be called for removed computed property.');
			}));

			handles.push(stateful.watch('totalNameLength', function () {
				throw new Error('Watch callback shouldn\'t be called for removed computed array.');
			}));

			computeHandleName.remove();
			computeHandleTotalNameLength.remove();

			stateful.set('first', 'Ben');
			stateful.items.push({name: 'John Jacklin'});
		});
	});
});
