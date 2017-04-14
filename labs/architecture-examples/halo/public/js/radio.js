/*global define*/
'use strict';
define(['jqueryp!'], function ($) {
	// Constructor for switching selection between mutliple items
	function Radio(item) {
		var $item = $(item),
			$radioItems = $item.find('.radio-item'),
			$selectedItem = $radioItems.filter('.selected'),
			radio = this;

		// Save $item and $selectedItem for later
		this.$item = $item;
		this.$radioItems = $radioItems;
		this.$selectedItem = $selectedItem;

		// When a radio-item is clicked, select it
		$item.on('click', '.radio-item', function () {
			radio.select(this);
		});
	}
	Radio.prototype = {
		select: function (item) {
			// If the item is a number, select by index
			if (typeof item === 'number') {
				this.selectByIndex(item);
			} else {
			// Otherwise, select by item
				this.selectByItem(item);
			}
		},
		selectByIndex: function (index) {
			// Grab the target item and select it
			var $item = this.$radioItems.get(index);
			this.selectByItem($item);
		},
		selectByItem: function (item) {
			var $item = $(item),
				$selectedItem = this.$selectedItem;

			// Deselect the last item and fire a deselect event
			$selectedItem.removeClass('selected');
			$selectedItem.trigger('radio-deselect');

			// Select the new item, save it, and fire a select event
			$item.addClass('selected');
			this.$selectedItem = $item;
			$item.trigger('radio-select');

			// Fire an update event
			this.$item.trigger('radio-update');
		}
	};

	// Export Radio to jQuery
	$.exportModule('radio', Radio);

	return $;
});