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

	var quotes = {};
	quotes.build = function (quotes, template) {
		var quoteContainer = $('<q>'),
			quoteElemCount = 0,
			quoteCount = quotes.length;
		return (function createQuoteElems(){
			var quote = quotes[quoteElemCount],
				el = $(template).hide(),
				text = el.children('p')[0],
				link = el.find('a')[0],
				img = el.find('img')[0];

			text.innerText = quote.quote;
			link.innerText = quote.person.name;
			link.setAttribute('href', quote.link);
			img.setAttribute('src', quote.person.gravatar);

			quoteContainer.append(el);

			if (quoteCount > ++quoteElemCount) createQuoteElems();
			
			return quoteContainer[0].innerHTML;
		})();
	};

	quotes.animate = function (container) {
		var quotes = container.children(),
			quoteElems = [],
			activeQuote = 0,
			quoteCount = quotes.length,
			prevQuote = $(quotes.get(0));
		return (function swap(){
			var quoteElem = quoteElems[activeQuote] || (quoteElems.push( $(quotes.get(activeQuote)) ), quoteElems[activeQuote]);
			
			prevQuote.fadeOut(500, function() {
				quoteElem.fadeIn(500, function(){
					window.setTimeout(swap, 25000);
				});
			});

			++activeQuote < quoteCount? activeQuote : activeQuote = 0;
			prevQuote = quoteElem;
		})();
	};

	$.fn.quote = function(quoteObjects) {
		var container = this.parent(),
			template = this[0].outerHTML;
	
		container[0].innerHTML = quotes.build(quoteObjects, template);

		quotes.animate(container);
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