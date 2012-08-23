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

		return this.each(function() {
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


	$.fn.quote = function( data ) {
		var $this = this;

		function update() {
			var el = data[ Math.floor( Math.random() * data.length ) ];

			$this.children('p').text( el.quote );
			$this.find('a').text( el.person.name );
			$this.find('a').attr( 'href', el.person.link );
			$this.find('img').attr( 'src', el.person.gravatar );
			setTimeout( update, 25000 );
		}

		update();
	};

	// Apps popover
	$('.applist a').persistantPopover();

	// Quotes
	$('.quote').quote([{
		quote: 'TodoMVC is a godsend for helping developers find what well-developed frameworks match their mental model of application architecture.',
		person: {
			name: 'Paul Irish',
			gravatar: 'http://gravatar.com/avatar/ffe68d6f71b225f7661d33f2a8908281?s=40',
			link: 'https://github.com/paulirish'
		}
	},{
		quote: 'Modern JavaScript developers realise an MVC framework is essential for managing the complexity of their apps. TodoMVC is a fabulous community contribution that helps developers compare frameworks on the basis of actual project code, not just claims and anecdotes.',
		person: {
			name: 'Michael Mahemoff',
			gravatar: 'http://gravatar.com/avatar/cabf735ce7b8b4471ef46ea54f71832d?s=40',
			link: 'https://github.com/mahemoff'
		}
	},{
		quote: 'TodoMVC is an immensely valuable attempt at a difficult problem - providing a structured way of comparing JS libraries and frameworks. TodoMVC is a lone data point in a sea of conjecture and opinion.',
		person: {
			name: 'Justin Meyer',
			gravatar: 'http://gravatar.com/avatar/70ee60f32937b52758869488d5753259?s=40',
			link: 'https://github.com/justinbmeyer'
		}
	},{
		quote: 'It can be hard to make the leap from hacking together code that works to writing code that`s organized, maintainable, reusable, and a joy to work on. The TodoMVC project does a great job of introducing developers to different approaches to code organization, and to the various libraries that can help them along the way. If you`re trying to get your bearings in the world of client-side application development, the TodoMVC project is a great place to get started.',
		person: {
			name: 'Rebecca Murphey',
			gravatar: 'http://gravatar.com/avatar/0177cdce6af15e10db15b6bf5dc4e0b0?s=40',
			link: 'https://github.com/rmurphey'
		}
	}]);

}());
