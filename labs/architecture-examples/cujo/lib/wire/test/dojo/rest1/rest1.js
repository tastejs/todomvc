define({
	plugins: [
		{ module: 'wire/debug' },
		{ module: 'wire/dom' },
		{ module: 'wire/dojo/store' }
	],
	// These two constrollers are equivalent.  The resource! resolver makes life easier.
	controller: {
		create: 'test/dojo/rest1/View',
		properties: {
			itemTemplate: { module: 'text!test/dojo/rest1/person-template1.html' },
			template: { module: 'text!test/dojo/rest1/container-template1.html' },
			container: { $ref: 'dom!container1' },
			store: { $ref: 'resource!people/' }
		},
		init: 'ready'
	},
	controller2: {
		create: 'test/dojo/rest1/View',
		properties: {
			itemTemplate: { module: 'text!test/dojo/rest1/person-template2.html' },
			template: { module: 'text!test/dojo/rest1/container-template2.html' },
			container: { $ref: 'dom!container2' },
			store: {
				create: {
					module: 'dojo/store/JsonRest',
					args: { target: 'people/' }
				}
			}
		},
		init: 'ready'
	},
	person: { $ref: 'resource!people/', get: 1, wait: true },
	personPromise: { $ref: 'resource!people/', get: 1 },
	people: { $ref: 'resource!people/', query: { name: "Sergei" }, wait: true},
	peoplePromise: { $ref: 'resource!people/', query: { name: "Sergei" }}
});