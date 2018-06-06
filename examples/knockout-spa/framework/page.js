/*! knockout-spa (https://github.com/onlyurei/knockout-spa) * Copyright 2015-2016 Cheng Fan
 *   MIT Licensed (https://raw.githubusercontent.com/onlyurei/knockout-spa/master/LICENSE) */
define(['app/shared/root-bindings', 'framework/page-disposer', 'ko', 'sugar'], function (
	RootBindings, PageDisposer, ko) {

	var initialRun = true;

	var Page = ko.observe({
		init: function (name, data, path, controller) {
			this.loading = false;

			name = name.toLowerCase();

			if ((this.page.name == name) && (this.page.data == data)) {
				if (controller) {
					controller(data);
				}

				document.title = this.title();

				this.initExtra &&
				this.initExtra.apply(this, Array.prototype.slice.call(arguments, 0));

				return data;
			}

			var autoDispose = this.page.data.dispose && this.page.data.dispose(this);
			if (!initialRun && (autoDispose !== false)) {
				// auto-dispose page's exposed observables and primitive properties to
				// initial values. if not desired, return false in dispose function to
				// suppress auto-disposal for all public properties of the page, or make
				// the particular properties private
				PageDisposer.dispose(this.page.data);
			}

			PageDisposer.init(data); //store initial observable and primitive properties values of the page
			var initialized = data.init && data.init(this);
			if (initialized === false) {
				return false; // stop initialization if page's init function return false (access control, etc.)
			}
			if (controller) {
				controller(data);
			}

			this.pageClass = [name,
				('ontouchstart' in document.documentElement) ? 'touch' : 'no-touch'].join(
				' ');
			this.page = {
				name: name,
				data: data,
				path: path
			}; // to test if template finished rendering, use afterRender binding in the template binding

			document.title = this.title();

			this.initExtra &&
			this.initExtra.apply(this, Array.prototype.slice.call(arguments, 0));

			if (initialRun) {
				ko.applyBindings(this, document.getElementsByTagName('html')[0]);
				initialRun = false;
			}

			return data;
		},
		page: {
			name: '', // name of the page - auto-set by the framework, no need to worry
			data: {} // init, afterRender, controllers, dispose
		},
		pageClass: '',
		loading: false,
		title: function () {
			return this.page.name.titleize(); // override in RootBindings as needed
		}
	});

	Object.merge(Page, RootBindings); // additional root bindings as needed by the app

	return Page;

});
