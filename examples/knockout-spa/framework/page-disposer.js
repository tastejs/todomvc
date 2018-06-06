/*! knockout-spa (https://github.com/onlyurei/knockout-spa) * Copyright 2015-2016 Cheng Fan */
/*! MIT Licensed (https://raw.githubusercontent.com/onlyurei/knockout-spa/master/LICENSE) */
define(['ko', 'sugar'], function (ko) {

	var initialValues = {};

	var PageDisposer = {
		init: function (page) {
			initialValues = {};
			Object.each(page, function (key, value) {
				if (ko.isObservable(value) && !ko.isComputed(value)) { /* non-computed observables */
					initialValues[key] = value();
				} else if ((value === null) || (value === undefined) || Object.isString(value) ||
					Object.isNumber(value) || Object.isBoolean(value)) { /* primitives */
					initialValues[key] = value;
				}
			});
		},
		dispose: function (page) {
			Object.each(initialValues, function (key, value) {
				if (page.hasOwnProperty(key)) {
					if (Object.isFunction(page[key])) {
						page[key](value);
					} else {
						page[key] = value;
					}
				}
			});
			initialValues = {};
		}
	};

	return PageDisposer;

});

