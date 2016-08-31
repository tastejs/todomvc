define([
	'jquery', 'sugar',
	'css!../../node_modules/todomvc-app-css/index.css'
	/* TODO: add other common dependencies and root bindings most pages need (this module is required by all pages).
	 E.g.: include CSS framework such as Bootstrap, Foundation, etc.
	 Access root bindings in various templates using $root.<propertyNameOnRootObject>), e.g. $root.title */
], function () {

	// This object will be merged into the object exposed from /framework/page.js and override it
	return {
		initExtra: function (pageName, pageData, pagePath, pageController) {//useful for common init tasks for all pages
			/* TODO: modify to cater your app's needs (called on every page after the page's init handler) */
		},
		title: function () {
			var title = this.page.data.title;
			return title ? (Object.isFunction(title) ? title.call(this.page.data) : title) : this.page.name.titleize();
		}
	};

});
