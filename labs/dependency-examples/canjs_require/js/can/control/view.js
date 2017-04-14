/*
* CanJS - 1.1.2 (2012-11-23)
* http://canjs.us/
* Copyright (c) 2012 Bitovi
* Licensed MIT
*/
define(['can/util/library', 'can/control', 'can/view'], function (can) {
	var URI = steal.URI || steal.File;

	can.Control.getFolder = function () {
		return can.underscore(this.fullName.replace(/\./g, "/")).replace("/Controllers", "");
	};

	can.Control._calculatePosition = function (Class, view) {
		var classParts = Class.fullName.split('.'),
			classPartsWithoutPrefix = classParts.slice(0);
		classPartsWithoutPrefix.splice(0, 2), action_name = "init"; // Remove prefix (usually 2 elements)
		var hasControllers = (classParts.length > 2) && classParts[1] == 'Controllers',
			path = hasControllers ? can.underscore(classParts[0]) : can.underscore(classParts.join("/")),
			controller_name = can.underscore(classPartsWithoutPrefix.join('/')).toLowerCase(),
			suffix = (typeof view == "string" && /\.[\w\d]+$/.test(view)) ? "" : can.view.ext;

		//calculate view
		if (typeof view == "string") {
			if (view.substr(0, 2) == "//") { //leave where it is
			} else {
				view = "//" + URI(path).join('views/' + (view.indexOf('/') !== -1 ? view : (hasControllers ? controller_name + '/' : "") + view)) + suffix;
			}
		} else if (!view) {
			view = "//" + URI(path).join('views/' + (hasControllers ? controller_name + '/' : "") + action_name.replace(/\.|#/g, '').replace(/ /g, '_')) + suffix;
		}
		return view;
	};

	var calculateHelpers = function (myhelpers) {
		var helpers = {};
		if (myhelpers) {
			if (can.isArray(myhelpers)) {
				for (var h = 0; h < myhelpers.length; h++) {
					can.extend(helpers, myhelpers[h]);
				}
			}
			else {
				can.extend(helpers, myhelpers);
			}
		} else {
			if (this._default_helpers) {
				helpers = this._default_helpers;
			}

			//load from name
			var current = window;
			var parts = this.constructor.fullName.split(/\./);
			for (var i = 0; i < parts.length; i++) {
				if (current) {
					if (typeof current.Helpers == 'object') {
						can.extend(helpers, current.Helpers);
					}
					current = current[parts[i]];
				}
			}

			if (current && typeof current.Helpers == 'object') {
				can.extend(helpers, current.Helpers);
			}

			this._default_helpers = helpers;
		}
		return helpers;
	};

	can.Control.prototype.view = function (view, data, myhelpers) {
		//shift args if no view is provided
		if (typeof view != "string" && !myhelpers) {
			myhelpers = data;
			data = view;
			view = null;
		}

		//guess from controller name
		view = can.Control._calculatePosition(this.constructor, view, this.called);

		//calculate data
		data = data || this;

		//calculate helpers
		var helpers = calculateHelpers.call(this, myhelpers);

		return can.view(view, data, helpers); //what about controllers in other folders?
	};

	return can;
});