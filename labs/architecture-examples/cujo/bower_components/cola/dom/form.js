/** @license MIT License (c) copyright B Cavalier & J Hann */

(function (define) {
define(function () {

	var forEach, slice;

	forEach = Array.prototype.forEach;
	slice = Array.prototype.slice;

	return {
		getValues: formToObject,
		getMultiSelectValue: getMultiSelectValue,
		setValues: objectToForm,
		setElementValue: setElementValue,
		setGroupValue: setGroupValue,
		setMultiSelectValue: setMultiSelectValue,
		isCheckable: isCheckable
	};

	function objectToForm(form, object, filter) {
		var els;

		els = form.elements;
		if(typeof filter !== 'function') {
			filter = alwaysInclude;
		}

		Object.keys(object).forEach(function(name) {

			var el, value;

			value = object[name];
			el = els[name];

			if(!filter(el, name, value)) return;

			if(el.length) {
				setGroupValue(el, value);
			} else {
				setElementValue(el, value);
			}

		});

		return form;
	}

	function setGroupValue(group, value) {
		var getBooleanValue;

		getBooleanValue = Array.isArray(value)
			? function(array, el) { return array.indexOf(el.value) >= 0; }
			: function(value, el) { return el.value == value; };

		forEach.call(group, function(el, i) {
			if(isCheckable(el)) {
				el.checked = getBooleanValue(value, el);
			} else {
				el.value = textValue(value[i]);
			}
		});
	}

	function setElementValue(el, value) {

		if(isCheckable(el)) {

			el.checked = !!value;

		} else if(el.multiple && el.options) {

			if(!Array.isArray(value)) {
				el.value = textValue(value);
			} else {
				setMultiSelectValue(el, value);
			}

		} else {
			el.value = textValue(value);
		}
	}

	function setMultiSelectValue(select, values) {
		var i, option, options;
		options = select.options;
		i = 0;
		while ((option = options[i++])) {
			if(values.indexOf(option.value) >= 0) {
				option.selected = true;
			}
		}
	}

	function textValue(value) {
		return value == null ? '' : value;
	}

	function isCheckable(el) {
		return el.type == 'radio' || el.type == 'checkbox';
	}

	/**
	 * Simple routine to pull input values out of a form.
	 * @param form {HTMLFormElement}
	 * @return {Object} populated object
	 */
	function formToObject (formOrEvent, filter) {
		var obj, form, els, seen, i, el, name, value;

		form = formOrEvent.selectorTarget || formOrEvent.target || formOrEvent;

		if(typeof filter !== 'function') {
			filter = alwaysInclude;
		}

		obj = {};

		els = form.elements;
		seen = {}; // finds checkbox groups
		i = 0;

		while ((el = els[i++])) {
			name = el.name;
			// skip over non-named elements and fieldsets (that have no value)
			if (!name || !('value' in el) || !filter(el)) continue;

			value = el.value;

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
			else if (el.type == 'file') {
				if (!(name in seen)) {
					obj[name] = getFileInputValue(el);
				}
			}
			else if (el.multiple && el.options) {
				// grab all selected options
				obj[name] = getMultiSelectValue(el);
			}
			else {
				obj[name] = value;
			}

			seen[name] = name;
		}

		return obj;
	}

	function getFileInputValue (fileInput) {
		if ('files' in fileInput) {
			return fileInput.multiple ? slice.call(fileInput.files) : fileInput.files[0];
		} else {
			return fileInput.value;
		}
	}

	function getMultiSelectValue (select) {
		var values, options, i, option;
		values = [];
		options = select.options;
		i = 0;
		while ((option = options[i++])) {
			if (option.selected) values.push(option.value);
		}
		return values;
	}

	function alwaysInclude() {
		return true;
	}

});
}(
	typeof define == 'function' && define.amd
		? define
		: function (factory) { module.exports = factory(); }
));