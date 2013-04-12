/*global $ */
(function () {
	'use strict';

	$.fn.persistantPopover = function () {
		var popoverTimeout;

		function delay() {
			popoverTimeout = setTimeout(function () {
				$('.popover').hide();
			}, 100);
		}

		return this.each(function () {
			var $this = $(this);
			$this.popover({
				trigger: 'manual',
				placement: 'right',
				animation: false,
				title: this.firstChild.textContent + '<a href="' + $this.data('source') + '">Website</a>'
			});
		})
		.mouseenter(function () {
			clearTimeout(popoverTimeout);
			$('.popover').remove();
			$(this).popover('show');
		})
		.mouseleave(function () {
			delay();
			$('.popover').mouseenter(function () {
				clearTimeout(popoverTimeout);
			}).mouseleave(function () {
				delay();
			});
		});
	};

	function redirect() {
		if (location.hostname === 'addyosmani.github.io') {
			location.href = location.href.replace('addyosmani.github.io/todomvc', 'todomvc.com');
		}
	}

	var Quotes = {};
	Quotes.build = function (quotes, template) {
		var quoteContainer = document.createElement('q');
		var quoteElemCount = 0;
		var quoteCount = quotes.length;

		var createQuoteElems = function () {
			var quote = quotes[quoteElemCount];
			var el = $(template).hide();

			el.children('p').text(quote.quote);
			el.find('a').text(quote.person.name).attr('href', quote.person.link);
			el.find('img').attr('src', quote.person.gravatar);

			quoteContainer.appendChild(el[0]);

			if (quoteCount > ++quoteElemCount) {
				createQuoteElems();
			}

			return quoteContainer.innerHTML;
		};
		return createQuoteElems();
	};

	Quotes.random = function (quotes) {
		var quoteCount = quotes.length;
		var randomQuotes = [];

		var randomQuote = function () {
			var randomQuoteIndex = Math.floor(Math.random() * quoteCount);

			if ($.inArray(randomQuoteIndex, randomQuotes) > -1) {
				return randomQuote();
			}

			if (randomQuotes.length === quoteCount - 1) {
				randomQuotes = [];
			}

			randomQuotes.push(randomQuoteIndex);

			return randomQuoteIndex;
		};
		return randomQuote;
	};

	Quotes.animate = function (container, animSpeed) {
		var fader = function (fadeOut, fadeIn) {
			var fadeOutCallback = function () {
				fadeIn.fadeIn(500, fadeInCallback);
			};

			var fadeInCallback = function () {
				window.setTimeout(swap, animSpeed);
			};

			fadeOut.fadeOut(500, fadeOutCallback);
		};

		var quotes = container.children();
		var selectRandomQuoteIndex = Quotes.random(quotes);
		var quoteElems = {};
		var activeQuoteIndex = selectRandomQuoteIndex();
		var prevQuoteElem = $(quotes[activeQuoteIndex]);

		var swap = function () {
			if (!quoteElems[activeQuoteIndex]) {
				quoteElems[activeQuoteIndex] = $(quotes[activeQuoteIndex]);
			}

			var activeQuoteElem = quoteElems[activeQuoteIndex];

			fader(prevQuoteElem, activeQuoteElem);

			activeQuoteIndex = selectRandomQuoteIndex();
			prevQuoteElem = activeQuoteElem;
		};
		return swap();
	};

	Quotes.init = function (quotes) {
		var container = $(this);
		var template = $(this).html();
		var quotesHTML = Quotes.build(quotes, template);

		container.html(quotesHTML);

		Quotes.animate(container, 25000);
	};

	$.fn.quote = function (quotes) {
		return this.each(function () {
			Quotes.init.call(this, quotes);
		});
	};

	// Redirect if not on main site.
	redirect();

	// Apps popover
	$('.applist a').persistantPopover();

	// Quotes
	$('.quotes').quote([{
		quote: 'TodoMVC is a godsend for helping developers find what well-developed frameworks match their mental model of application architecture.',
		person: {
			name: 'Paul Irish',
			gravatar: 'http://gravatar.com/avatar/ffe68d6f71b225f7661d33f2a8908281?s=40',
			link: 'https://github.com/paulirish'
		}
	}, {
		quote: 'Modern JavaScript developers realise an MVC framework is essential for managing the complexity of their apps. TodoMVC is a fabulous community contribution that helps developers compare frameworks on the basis of actual project code, not just claims and anecdotes.',
		person: {
			name: 'Michael Mahemoff',
			gravatar: 'http://gravatar.com/avatar/cabf735ce7b8b4471ef46ea54f71832d?s=40',
			link: 'https://github.com/mahemoff'
		}
	}, {
		quote: 'TodoMVC is an immensely valuable attempt at a difficult problem - providing a structured way of comparing JS libraries and frameworks. TodoMVC is a lone data point in a sea of conjecture and opinion.',
		person: {
			name: 'Justin Meyer',
			gravatar: 'http://gravatar.com/avatar/70ee60f32937b52758869488d5753259?s=40',
			link: 'https://github.com/justinbmeyer'
		}
	}, {
		quote: 'It can be hard to make the leap from hacking together code that works to writing code that`s organized, maintainable, reusable, and a joy to work on. The TodoMVC project does a great job of introducing developers to different approaches to code organization, and to the various libraries that can help them along the way. If you`re trying to get your bearings in the world of client-side application development, the TodoMVC project is a great place to get started.',
		person: {
			name: 'Rebecca Murphey',
			gravatar: 'http://gravatar.com/avatar/0177cdce6af15e10db15b6bf5dc4e0b0?s=40',
			link: 'https://github.com/rmurphey'
		}
	}]);

}());
