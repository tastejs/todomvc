/*global $ */
(function() {
	'use strict';

	// Demos popover
	function hover() {
		$( this ).popover('toggle');
	}

	$('#demos li a').each(function() {
		var $this = $( this );
		$this.popover({
			placement: 'in right',
			title: $this.text() + '<a href="' + $this.data('source') + '">Go to site</a>'
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

})();