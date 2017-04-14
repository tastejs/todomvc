/*global define*/
'use strict';
define(['jqueryp!'], function ($) {
	// Constructor for toggling between editable label and input
	function Editable(item) {
		var $item = $(item),
			$edit = $item.find('.edit'),
			edit = this;

		// Save $item and $edit for later
		this.$item = $item;
		this.$edit = $edit;

		// When a toggle item is dblclicked, go into editing mode
		$item.on('dblclick', '.editable-toggle', function () {
			edit.start();

			// When the .edit field loses focus, stop editing
			$edit.one('blur', function () {
				edit.stop();
			});
		});
	}
	Editable.prototype = {
		start: function () {
			// Enter editing mode
			var $item = this.$item;
			$item.addClass('editing');

			// Focus the edit field
			this.$edit.focus();

			// Fire a begin edit event
			$item.trigger('editable-start');
		},
		stop: function () {
			// Leave editing mode
			var $item = this.$item;
			$item.removeClass('editing');

			// and fire an update event
			$item.trigger('editable-stop');
		},
		val: function () {
			return this.$edit.val();
		}
	};

	// Export Editable to jQuery
	$.exportModule('editable', Editable);

	return $;
});