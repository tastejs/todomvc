define(['knockout', 'knockout-amd-helpers', 'knockout-es5-option4', 'lib-ext/knockout-custom-bindings'], function (ko) {

	//TODO: turn off if it breaks your existing code, see http://knockoutjs.com/documentation/deferred-updates.html
	ko.options.deferUpdates = true;

	//TODO: change to your template folder path and suffix if needed
	ko.amdTemplateEngine.defaultPath = '';
	ko.amdTemplateEngine.defaultSuffix = '.html';

	//TODO: change the following ko component convention as needed
	//this allows the usage of custom elements (http://knockoutjs.com/documentation/component-custom-elements.html)
	//without having to explicitly register them beforehand
	//the catch is that if unrecognized HTML tags are found, and they are not custom elements, error will be thrown
	ko.components.getComponentNameForNode = function (node) {
		var tagNameLower = node.tagName && node.tagName.toLowerCase(node);
		// Try to determine that this node can be considered a *custom* element; see
		// https://github.com/knockout/knockout/issues/1603
		if (!node.hasAttribute('data-bind')) {
			if ((tagNameLower.indexOf('-') != -1) || (String(node) == '[object HTMLUnknownElement]') ||
				((ko.utils.ieVersion <= 8) && (node.tagName === tagNameLower))) {
				return tagNameLower;
			}
		}
	};

	//TODO: change the following ko component convention as needed
	//establish a component AMD path convention for the configuration of component/custom elements
	//each component should be a file with the corresponding filename under /component/ folder
	//http://knockoutjs.com/documentation/component-loaders.html#getconfigname-callback
	//http://knockoutjs.com/documentation/component-registration.html#a-recommended-amd-module-pattern
	ko.components.loaders.push({
		getConfig: function (name, callback) {
			callback({ require: 'component/' + name + '/' + name });
		}
	});

	return ko;
});
