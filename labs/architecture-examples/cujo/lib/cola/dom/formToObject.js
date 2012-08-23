/** @license MIT License (c) copyright B Cavalier & J Hann */

(function (define) {
define(function () {

	/**
	 * Simple routine to pull input values out of a form.
	 * @param form {HTMLFormElement}
	 * @return {Object} populated object
	 */
	return function formToObject (formOrEvent) {
		var obj, form, els, seen, i, el, name, value;

		form = formOrEvent.selectorTarget || formOrEvent.target || formOrEvent;

		obj = {};

		els = form.elements;
		seen = {}; // finds checkbox groups
		i = 0;

		while ((el = els[i++])) {
			name = el.name;
			value = el.value;

			// skip over non-named elements and fieldsets (that have no value)
			if (!name || !('value' in el)) continue;

			if (el.type == 'radio') {
				// only grab one radio value (to ensure that the property
				// is always set, we set false if none are checked)
				if (el.checked) obj[name] = value;
				else if (!(name in seen)) obj[name] = false;
			}
			else if (el.type == 'checkbox') {
				if (!(name in seen)) {
					// we're going against normal form convention by ensuring
					// the object always has a property of the given name.
					// forms would normally not submit a checkbox if it isn't
					// checked.
					// Note: IE6&7 don't support el.hasAttribute() so we're using el.attributes[]
					obj[name] = el.attributes['value'] ? !!el.checked && value : !!el.checked;
				}
				else if (el.checked) {
					// collect checkbox groups into an array.
					// if we found a false value, none have been checked so far
					obj[name] = (name in obj && obj[name] !== false)
						? [].concat(obj[name], value)
						: [value];
				}
			}
			else if (el.multiple && el.options) {
				// grab all selected options
				obj[name] = multiSelectToValue(el);
			}
			else {
				obj[name] = value;
			}

			seen[name] = name;
		}

		return obj;
	};

	function multiSelectToValue (select) {
		var values, options, i, option;
		values = [];
		options = select.options;
		i = 0;
		while ((option = options[i++])) {
			if (option.selected) values.push(option.value);
		}
		return values;
	}

});
}(
	typeof define == 'function' && define.amd
		? define
		: function (factory) { module.exports = factory(); }
));
