/*global $ */
(function() {
	'use strict';

	$.fn.persistantPopover = function() {
		var popoverTimeout;

		function delay() {
			popoverTimeout = setTimeout(function() {
				$('.popover').hide();
			}, 100);
		}

		this.each(function() {
			var $this = $( this );
			$this.popover({
				trigger: 'manual',
				placement: 'right',
				animation: false,
				title: this.firstChild.textContent + '<a href="' + $this.data('source') + '">Website</a>'
			});
		})
		.mouseenter(function() {
			clearTimeout( popoverTimeout );
			$('.popover').remove();
			$( this ).popover('show');
		})
		.mouseleave(function() {
			delay();
			$('.popover').mouseenter(function() {
				clearTimeout( popoverTimeout ) ;
			}).mouseleave(function() {
				delay();
			});
		});
	};

	// Apps popover
	$('.applist a').persistantPopover();

}());