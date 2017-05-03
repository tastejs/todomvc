(function (buster, require) {

var assert, refute, undef;

assert = buster.assert;
refute = buster.refute;

var formToObject, fakeForm;

formToObject = require('../../dom/formToObject');

fakeForm = {
	// name, value, type, checked, multiple, options
	elements: [
		{ name: 'text', type: 'text', value: 'text value' },
		{ name: 'checkbox1', type: 'checkbox', value: 'checkbox value 1', checked: true },
		{ name: 'checkbox2', type: 'checkbox', value: 'checkbox value 2', checked: false },
		{ name: 'checkbox3', type: 'checkbox', value: null, checked: false },
		{ name: 'checkbox4', type: 'checkbox', value: null, checked: true },
		{ name: 'radio1', type: 'radio', value: 'radio value 1' },
		{ name: 'radio2', type: 'radio', value: 'radio value 2', checked: true },
		{ name: 'select', value: 'select value' },
		// groups
		{ name: 'radioGroup1', type: 'radio', value: 'rgroup value 1' },
		{ name: 'radioGroup1', type: 'radio', value: 'rgroup value 2', checked: true },
		{ name: 'radioGroup1', type: 'radio', value: 'rgroup value 3' },
		{ name: 'checkboxGroup1', type: 'checkbox', value: 'group value 1' },
		{ name: 'checkboxGroup1', type: 'checkbox', value: 'group value 2', checked: true },
		{ name: 'checkboxGroup1', type: 'checkbox', value: 'group value 3' },
		{ name: 'checkboxGroup2', type: 'checkbox', value: 'group value 1', checked: true },
		{ name: 'checkboxGroup2', type: 'checkbox', value: 'group value 2', checked: true },
		{ name: 'checkboxGroup2', type: 'checkbox', value: 'group value 3' },
		{ name: 'checkboxGroup3', type: 'checkbox', value: 'group value 1' },
		{ name: 'checkboxGroup3', type: 'checkbox', value: 'group value 2', checked: true },
		{ name: 'checkboxGroup3', type: 'checkbox', value: 'group value 3', checked: true },
		// multi-select
		{ name: 'multiselect1', value: 'option value 2', multiple: true, options: [
			{ value: 'option value 1' },
			{ value: 'option value 2', selected: true },
			{ value: 'option value 3' }
		] },
		{ name: 'multiselect2', value: 'option value 2', multiple: true, options: [
			{ value: 'option value 1' },
			{ value: 'option value 2', selected: true },
			{ value: 'option value 3', selected: true }
		] },
		{ name: 'multiselect3', value: 'option value 1', multiple: true, options: [
			{ value: 'option value 1', selected: true },
			{ value: 'option value 2', selected: true },
			{ value: 'option value 3' }
		] },
		// non-form elements
		{ name: 'no-value' },
		{ value: 'no-name' },
		{ name: '', value: 'blank-name' }
	]
};

// add fake attributes collection to each "element" since formToObject uses it
for (var i in fakeForm.elements) (function (el) {
	el.attributes = el;
}(fakeForm.elements[i]));

buster.testCase('cola/dom/formToObject', {

	'formToObject': {
		'should extract values from non-grouped form inputs': function () {
			var obj = formToObject(fakeForm);
			assert.equals('text value', obj.text, 'text input');
			assert.equals('checkbox value 1', obj.checkbox1, 'checked checkbox');
			assert.equals(false, obj.checkbox2, 'unchecked checkbox');
			assert.equals(false, obj.checkbox3, 'unchecked checkbox with no value');
			assert.equals(true, obj.checkbox4, 'checked checkbox with no value');
			assert.equals(false, obj.radio1, 'unchecked radio');
			assert.equals('radio value 2', obj.radio2, 'checked radio');
			assert.equals('select value', obj.select, 'select');
		},
		'should extract arrays from grouped form inputs': function () {
			var obj = formToObject(fakeForm);
			assert.equals('rgroup value 2', obj.radioGroup1, 'radio group');
			assert.equals(['group value 2'], obj.checkboxGroup1, 'checkbox group with one checked');
			assert.equals(['group value 1', 'group value 2'], obj.checkboxGroup2, 'checkbox group with multiple checked A');
			assert.equals(['group value 2', 'group value 3'], obj.checkboxGroup3, 'checkbox group with multiple checked B');
			assert.equals(['option value 2'], obj.multiselect1, 'multiple select with only one item selected');
			assert.equals(['option value 2', 'option value 3'], obj.multiselect2, 'multiple select with many items selected A');
			assert.equals(['option value 1', 'option value 2'], obj.multiselect3, 'multiple select with many items selected B');
		},
		'should skip over un-named and non-value elements': function () {
			var obj = formToObject(fakeForm);
			refute('no-value' in obj);
			refute('no-name' in obj);
			refute('' in obj);
		}
	}

});
})( require('buster'), require );
