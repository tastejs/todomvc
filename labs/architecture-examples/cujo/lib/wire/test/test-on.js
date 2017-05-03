define('fixture', function() {
	function Fixture() {
		this.handled = 0;
	}

	Fixture.prototype = {
		handle: function(e) {
			this.handled++;
			this.selectorTarget = e.selectorTarget;
			this.event = e;
		},

		emit: function() {}
	};

	return Fixture;
});

define('transform', function() {
	return function() {
		return 1;
	};
});

function defaultPrevented(e) {
	return typeof e.isDefaultPrevented == 'function'
		? e.isDefaultPrevented()
		: e.defaultPrevented;
}

function fail(dohd) {
	return function(e) {
		console.error(e);
		dohd.errback(e);
	}
}

require(['wire'], function(wire) {
	doh.register(pluginName, [
		function shouldAllowLongFormWithoutSelector(doh) {
			var dohd = new doh.Deferred();

			wire({
				a: {
					create: 'fixture',
					on: {
						button: { click: 'handle' }
					}
				},
				button: { $ref: 'dom!test' },
				plugins: [
					{ module: pluginName },
					{ module: 'wire/dom' }
				]
			}).then(
				function(context) {
					document.getElementById('test').click();
					dohd.callback(context.a.handled === 1);
				},
				fail(dohd)
			);

			return dohd;
		},
		function shouldAllowLongFormWithTransform(doh) {
			var dohd = new doh.Deferred();

			wire({
				a: {
					create: 'fixture',
					on: {
						button: {
							transform: { $ref: 'tx' },
							click: 'handle'
						}
					}
				},
				tx: { module: 'transform' },
				button: { $ref: 'dom!test' },
				plugins: [
					{ module: pluginName },
					{ module: 'wire/dom' }
				]
			}).then(
				function(context) {
					document.getElementById('test').click();
					dohd.callback(context.a.event === 1);
				},
				fail(dohd)
			);

			return dohd;
		},

		function shouldAllowLongFormWithSelector(doh) {
			var dohd = new doh.Deferred();

			wire({
				a: {
					create: 'fixture',
					on: {
						container: {
							'click:.test': 'handle'
						}
					}
				},
				container: { $ref: 'dom!container' },
				plugins: [
					{ module: pluginName },
					{ module: 'wire/dom' }
				]
			}).then(
					function(context) {
						document.getElementById('test').click();
						dohd.callback(context.a.handled === 1);
					},
					fail(dohd)
			);

			return dohd;

		},
		function shouldAllowLongFormWithSelector(doh) {
			var dohd = new doh.Deferred();

			wire({
				tx: { module: 'transform' },
				a: {
					create: 'fixture',
					on: {
						container: {
							'click:.test': 'tx | handle'
						}
					}
				},
				container: { $ref: 'dom!container' },
				plugins: [
					{ module: pluginName },
					{ module: 'wire/dom' }
				]
			}).then(
				function(context) {
					document.getElementById('test').click();
					dohd.callback(context.a.handled === 1);
					dohd.callback(context.a.e === 1);
				},
				fail(dohd)
			);

			return dohd;

		},
		function shouldAllowLongFormWithSelectorAndTransform(doh) {
			var dohd = new doh.Deferred();

			wire({
				a: {
					create: 'fixture',
					on: {
						container: {
							transform: { $ref: 'tx' },
							'click:.test': 'handle'
						}
					}
				},
				tx: { module: 'transform' },
				container: { $ref: 'dom!container' },
				plugins: [
					{ module: pluginName },
					{ module: 'wire/dom' }
				]
			}).then(
				function(context) {
					document.getElementById('test').click();
					dohd.callback(context.a.event === 1);
				},
				fail(dohd)
			);

			return dohd;

		},
		function shouldAllowLongFormWithExplicitSelector(doh) {
			var dohd = new doh.Deferred();

			wire({
				a: {
					create: 'fixture',
					on: {
						container: {
							selector: '.test',
							'click': 'handle'
						}
					}
				},
				container: { $ref: 'dom!container' },
				plugins: [
					{ module: pluginName },
					{ module: 'wire/dom' }
				]
			}).then(
					function(context) {
						document.getElementById('test').click();
						dohd.callback(context.a.handled === 1);
					},
					fail(dohd)
			);

			return dohd;

		},
		function shouldAllowLongFormWithExplicitTransform(doh) {
			var dohd = new doh.Deferred();

			wire({
				a: {
					create: 'fixture',
					on: {
						container: {
							selector: '.test',
							transform: { $ref: 'tx' },
							'click': 'handle'
						}
					}
				},
				tx: { module: 'transform' },
				container: { $ref: 'dom!container' },
				plugins: [
					{ module: pluginName },
					{ module: 'wire/dom' }
				]
			}).then(
				function(context) {
					document.getElementById('test').click();
					dohd.callback(context.a.event === 1);
				},
				fail(dohd)
			);

			return dohd;

		},
		function shouldAllowReverseConnectionsLongForm(doh) {
			var dohd = new doh.Deferred();

			wire({
				a: { create: 'fixture' },
				button: {
					render: {
						template: '<button id="button1"></button>'
					},
					insert: { last: 'dom!container' },
					on: {
						click: { a: 'handle' }
					}
				},
				plugins: [
					{ module: pluginName },
					{ module: 'wire/dom' },
					{ module: 'wire/dom/render' }
				]
			}).then(
					function(context) {
						document.getElementById('button1').click();
						dohd.callback(context.a.handled === 1);
					},
					fail(dohd)
			);

			return dohd;
		},
		function shouldAllowReverseConnectionsTransformedLongForm(doh) {
			var dohd = new doh.Deferred();

			wire({
				a: { create: 'fixture' },
				button: {
					render: {
						template: '<button id="button-t1"></button>'
					},
					insert: { last: 'dom!container' },
					on: {
						click: { a: 'tx | handle' }
					}
				},
				tx: { module: 'transform' },
				plugins: [
					{ module: pluginName },
					{ module: 'wire/dom' },
					{ module: 'wire/dom/render' }
				]
			}).then(
				function(context) {
					document.getElementById('button-t1').click();
					dohd.callback(context.a.event === 1);
				},
				fail(dohd)
			);

			return dohd;

		},
		function shouldAllowReverseConnectionsWithSelectorLongForm(doh) {
			var dohd = new doh.Deferred();

			wire({
				a: { create: 'fixture' },
				buttonContainer: {
					render: {
						template: '<div><button id="button2" class="test"></button></div>'
					},
					insert: { last: 'dom!container' },
					on: {
						'click:.test': { a: 'handle' }
					}
				},
				plugins: [
					{ module: pluginName },
					{ module: 'wire/dom' },
					{ module: 'wire/dom/render' }
				]
			}).then(
					function(context) {
						document.getElementById('button2').click();
						dohd.callback(context.a.handled === 1);
					},
					fail(dohd)
			);

			return dohd;

		},
		function shouldAllowReverseConnectionsShortForm(doh) {
			var dohd = new doh.Deferred();

			wire({
				a: { create: 'fixture' },
				buttonContainer: {
					render: {
						template: '<div><button id="button3"></button></div>'
					},
					insert: { last: 'dom!container' },
					on: {
						click: 'a.handle'
					}
				},
				plugins: [
					{ module: pluginName },
					{ module: 'wire/dom' },
					{ module: 'wire/dom/render' }
				]
			}).then(
					function(context) {
						document.getElementById('button3').click();
						dohd.callback(context.a.handled === 1);
					},
					fail(dohd)
			);

			return dohd;

		},
		function shouldAllowReverseConnectionsShortFormWithSelector(doh) {
			var dohd = new doh.Deferred();

			wire({
				a: { create: 'fixture' },
				buttonContainer: {
					render: {
						template: '<div><button id="button4" class="test"></button></div>'
					},
					insert: { last: 'dom!container' },
					on: {
						'click:.test': 'a.handle'
					}
				},
				plugins: [
					{ module: pluginName },
					{ module: 'wire/dom' },
					{ module: 'wire/dom/render' }
				]
			}).then(
					function(context) {
						document.getElementById('button4').click();
						dohd.callback(context.a.handled === 1);
					},
					fail(dohd)
			);

			return dohd;

		},
		function shouldSetEventSelectorPropertyIfSelector(doh) {
			var dohd = new doh.Deferred();

			wire({
				a: { create: 'fixture' },
				buttonContainer: {
					render: {
						template: '<div><button id="button5" class="test"></button></div>'
					},
					insert: { last: 'dom!container' },
					on: {
						'click:.test': 'a.handle'
					}
				},
				plugins: [
					{ module: pluginName },
					{ module: 'wire/dom' },
					{ module: 'wire/dom/render' }
				]
			}).then(
					function(context) {
						document.getElementById('button5').click();
						dohd.callback(context.a.selectorTarget.nodeName === 'BUTTON');
					},
					fail(dohd)
			);

			return dohd;

		},
		function shouldAllowMultipleEventTypes(doh) {
			var dohd = new doh.Deferred();

			wire({
				a: { create: 'fixture' },
				buttonContainer: {
					render: {
						template: '<div><button id="button6" class="test"></button></div>'
					},
					insert: { last: 'dom!container' },
					on: {
						'click,mouseup,keypress:.test': 'a.handle'
					}
				},
				plugins: [
					{ module: pluginName },
					{ module: 'wire/dom' },
					{ module: 'wire/dom/render' }
				]
			}).then(
					function(context) {
						document.getElementById('button6').click();
						dohd.callback(context.a.selectorTarget.nodeName === 'BUTTON');
					},
					fail(dohd)
			);

			return dohd;

		},
		function shouldAllowMultipleSelectors(doh) {
			var dohd = new doh.Deferred();

			wire({
				a: { create: 'fixture' },
				buttonContainer: {
					render: {
						template: '<div><button id="buttonMultiSelector" class="test"></button></div>'
					},
					insert: { last: 'dom!container' },
					on: {
						'click,mouseup,keypress:.test,button': 'a.handle'
					}
				},
				plugins: [
					{ module: pluginName },
					{ module: 'wire/dom' },
					{ module: 'wire/dom/render' }
				]
			}).then(
					function(context) {
						document.getElementById('buttonMultiSelector').click();
						dohd.callback(context.a.handled === 1);
					},
					fail(dohd)
			);

			return dohd;

		},
		function shouldNotSetEventSelectorPropertyIfNoSelector(doh) {
			var dohd = new doh.Deferred();

			wire({
				a: { create: 'fixture' },
				buttonContainer: {
					render: {
						template: '<div><button id="button7" class="test"></button></div>'
					},
					insert: { last: 'dom!container' },
					on: {
						'click': 'a.handle'
					}
				},
				plugins: [
					{ module: pluginName },
					{ module: 'wire/dom' },
					{ module: 'wire/dom/render' }
				]
			}).then(
					function(context) {
						document.getElementById('button7').click();
						dohd.callback(context.a.selectorTarget == void 0);
					},
					fail(dohd)
			);

			return dohd;

		},
		function shouldPreventDefaultForNavEvents(doh) {
			var dohd = new doh.Deferred(), button;

			wire({
				a: { create: 'fixture' },
				buttonContainer: {
					render: {
						template: '<form><a href="#"></a><button id="buttonInsideForm" type="submit"></button></form>'
					},
					insert: { last: 'dom!container' },
					on: {
						'click': 'a.handle'
					}
				},
				plugins: [
					{ module: pluginName },
					{ module: 'wire/dom' },
					{ module: 'wire/dom/render' }
				]
			}).then(
					function(context) {
						button = document.getElementById('buttonInsideForm');
						// try clicking the submit button and the link
						button.click();
						// test anchor click in browsers that support it:
						var anchor = button.form.firstChild;
						if (anchor.click) anchor.click();
						dohd.callback(defaultPrevented(context.a.event));
					},
					fail(dohd)
			);

			return dohd;

		},
		function shouldPreventDefaultWhenSpecified(doh) {
			var dohd = new doh.Deferred(), button;

			wire({
				a: { create: 'fixture' },
				buttonContainer: {
					render: {
						template: '<button id="buttonOutsideForm"></button>'
					},
					insert: { last: 'dom!container' },
					on: {
						'click': 'a.handle'
					}
				},
				plugins: [
					{ module: pluginName, preventDefault: true },
					{ module: 'wire/dom' },
					{ module: 'wire/dom/render' }
				]
			}).then(
					function(context) {
						button = document.getElementById('buttonOutsideForm');
						// try clicking the submit button
						button.click();
						dohd.callback(defaultPrevented(context.a.event));
					},
					fail(dohd)
			);

			return dohd;

		},
		function shouldNotPreventDefaultWhenSpecified(doh) {
			var dohd = new doh.Deferred(), button;

			wire({
				a: { create: 'fixture' },
				buttonContainer: {
					render: {
						template: '<button id="buttonOutsideForm2"></button>'
					},
					insert: { last: 'dom!container' },
					on: {
						'click': 'a.handle'
					}
				},
				plugins: [
					{ module: pluginName, preventDefault: false },
					{ module: 'wire/dom' },
					{ module: 'wire/dom/render' }
				]
			}).then(
					function(context) {
						button = document.getElementById('buttonOutsideForm2');
						// try clicking the submit button
						button.click();
						dohd.callback(!defaultPrevented(context.a.event));
					},
					fail(dohd)
			);

			return dohd;

		},
		function shouldStopPropagationWhenSpecified(doh) {
			var dohd = new doh.Deferred(), button;

			wire({
				a: { create: 'fixture' },
				buttonContainer: {
					render: {
						template: '<div><button id="buttonOutsideForm"></button></div>'
					},
					insert: { last: 'dom!container' },
					on: {
						'click': 'a.handle'
					}
				},
				plugins: [
					{ module: pluginName, stopPropagation: true },
					{ module: 'wire/dom' },
					{ module: 'wire/dom/render' }
				]
			}).then(
					function(context) {
						button = document.getElementById('buttonOutsideForm');
						// try clicking the submit button
						button.click();
						dohd.callback(context.a.handled == 0);
					},
					fail(dohd)
			);

			return dohd;

		},
		function shouldNotStopPropagationWhenSpecified(doh) {
			var dohd = new doh.Deferred(), button;

			wire({
				a: { create: 'fixture' },
				buttonContainer: {
					render: {
						template: '<div><button id="buttonOutsideForm"></button></div>'
					},
					insert: { last: 'dom!container' },
					on: {
						'click': 'a.handle'
					}
				},
				plugins: [
					{ module: pluginName, stopPropagation: false },
					{ module: 'wire/dom' },
					{ module: 'wire/dom/render' }
				]
			}).then(
					function(context) {
						button = document.getElementById('buttonOutsideForm2');
						// try clicking the submit button
						button.click();
						dohd.callback(!context.a.handled == 1);
					},
					fail(dohd)
			);

			return dohd;

		},
		function shouldCatchDeepEvents(doh) {
			var dohd = new doh.Deferred();

			wire({
				a: { create: 'fixture' },
				buttonContainer: {
					render: {
						// click event is a child of item we targeted with a selector:
						template: '<div><div class="test"><button id="buttonDeep"></button></div></div>'
					},
					insert: { last: 'dom!container' },
					on: {
						'click:.test': { a: 'handle' }
					}
				},
				plugins: [
					{ module: pluginName },
					{ module: 'wire/dom' },
					{ module: 'wire/dom/render' }
				]
			}).then(
					function(context) {
						document.getElementById('buttonDeep').click();
						dohd.callback(context.a.handled === 1);
					},
					fail(dohd)
			);

			return dohd;

		},
		function shouldReturnAFunctionFromOnResolver(doh) {
			var dohd = new doh.Deferred();

			wire({
				resolver1: { $ref: 'on!' },
				resolver2: { $ref: 'on!click:.test' },
				plugins: [
					{ module: pluginName }
				]
			}).then(
				function(context) {
					var success = typeof context.resolver1 == 'function'
						&& typeof context.resolver2 == 'function';
					dohd.callback(success);
				},
				fail(dohd)
			);

			return dohd;

		},
		function shouldFailLoudlyIfDevForgotEvent(doh) {
			var dohd = new doh.Deferred();

			wire({
				resolver2: { $ref: 'on!.test' },
				plugins: [
					{ module: pluginName }
				]
			}).then(
				fail(dohd),
				function () {
					dohd.callback(true);
				}
			);

			return dohd;

		},
		function shouldResolveToAnEventHandler(doh) {
			var dohd = new doh.Deferred();

			wire({
				f: { create: 'fixture' },
				resolver1: { $ref: 'on!' },
				resolver2: { $ref: 'on!click:#container' },
				resolver3: { $ref: 'on!click:.test' },
				plugins: [
					{ module: pluginName }
				]
			}).then(
				function(context) {
					var fixture = context.f;
					context.resolver1(document, 'click', fixture.handle.bind(fixture), '.test');
					context.resolver2(document, fixture.handle.bind(fixture));
					context.resolver3(fixture.handle.bind(fixture));
					document.getElementById('test').click();
					dohd.callback(fixture.handled == 3);
				},
				fail(dohd)
			);

			return dohd;

		}

	]);

	doh.run();
});