/*global $ */
(function() {
	'use strict';

	// Apps popover
	function hover() {
		$( this ).popover('toggle');
	}

	$('.applist a').each(function() {
		var $this = $( this );
		$this.popover({
			placement: 'in right',
			animation: false,
			title: $this[0].firstChild.textContent + '<a href="' + $this.data('source') + '">Go to site</a>'
		});
	})
	.off()
	.hoverIntent( hover, hover )
	.on('click', '.popover', function( e ) {
		// Prevent click on the popover, but allow links inside
		if ( e.target.nodeName.toLowerCase() !== 'a' ) {
			e.preventDefault();
		}
	});

}());