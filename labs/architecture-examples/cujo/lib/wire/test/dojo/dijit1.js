define({
	// There is nothing special about this array.  It's just an array of modules
	// whose members happen to be a plugins, but we could define it at the top
	// level or at any depth.  So, the following would work just as well:
	// dom: { module: 'wire/dom' }
	// This seems like it could end up being a reasonable convention, tho.
	plugins: [
		{ module: 'wire/debug', verbose: true, trace: true },
		{ module: 'wire/dojo/dijit', parse: true }, // Calls dojo.parser.parse
		{ module: 'wire/dom', classes: { init: 'loading' } }
	],
	// Create a controller, and inject a dijit.form.TextBox that is also
	// created and wired to a dom node here in the spec.
	controller: {
		create: 'test/test2/Controller',
		properties: {
			// These are both forward references.  These will resolve just
			// fine--order is not important in a wiring spec.
			name: { $ref: 'name' },
			widget: { $ref: 'widget1' }
		},
		init: 'ready', // Called as soon as all properties have been set
		destroy: 'destroy' // Called when the context is destroyed
	},
	name: 'controller1',
	// Create a TextBox dijit "programmatically", i.e. not using dojoType.
	// This can be wired in to other objects by name ({ : "widget1" }),
	// and will be cleaned up by the wire/dojo/dijit plugin when the
	// enclosing context is destroyed.
	widget1: { 
		create: {
			module: 'dijit/form/TextBox',
			args: {}
		},
		properties: {
			value: { $ref: 'initialValue' }
		},
		init: {
			// placeAt will be called once the #container dom node is
			// available, i.e. after domReady.  That happens automatically,
			// and there's no need to specify explicitly when it should
			// happen.
			placeAt: [{ $ref: 'dom!container' }, 'first'],
			focus: []
		}
	},
	// Create a controller, and inject a dijit.form.TextBox that is simply
	// referenced using the dijit resolver.
	controller2: {
		create: 'test/test2/Controller',
		properties: {
			name: "controller2",
			widget: { $ref: 'widget2' }
		},
		init: 'ready', // Called as soon as all properties have been set
		destroy: 'destroy' // Called when the context is destroyed
	},
	widget2: { $ref: 'dijit!widget' },
	nested: {
		widget3: {
			create: 'dijit/form/TextBox',
			properties: {
				value: 'nested worked'
			},
			init: {
				placeAt: [{ $ref: 'dom!container' }, 'last']
			}
		}
	},
	// Wire in a reference to the destroy button.
	destroyButton: { $ref: 'dom!destroy' }
});
