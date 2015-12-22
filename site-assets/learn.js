/* global _, $ */
(function ($, _) {
	'use strict';
	function redirect() {
		if (location.hostname === 'tastejs.github.io') {
			location.href = location.href.replace('tastejs.github.io/todomvc', 'todomvc.com');
		}
	}

	function findRoot() {
		var base = location.href.indexOf('examples/');
		return location.href.substr(0, base);
	}

	function getFile(file, callback) {
		if (!location.host) {
			return console.info('Miss the info bar? Run TodoMVC from a server to avoid a cross-origin error.');
		}

		var xhr = new XMLHttpRequest();

		xhr.open('GET', findRoot() + file, true);
		xhr.send();

		xhr.onload = function () {
			if (xhr.status === 200 && callback) {
				callback(xhr.responseText);
			}
		};
	}

	function Learn(learnJSON, config) {
		if (!(this instanceof Learn)) {
			return new Learn(learnJSON, config);
		}

		var template;

		if (typeof learnJSON !== 'object') {
			try {
				learnJSON = JSON.parse(learnJSON);
			} catch (e) {
				return;
			}
		}

		if (config) {
			template = config.template;
		}

		if (!template && learnJSON.templates) {
			template = learnJSON.templates['todomvc-home'];
			learnJSON.templates = undefined;
		}

		//transform to list of objects
		this.frameworksList = $.map(learnJSON, function (element, key) {
			var el = $.extend({}, element);
			el.issueLabel = key;
			return el;
		});

		this.contentContainer = document.getElementById('content');
		this.menuDrawer = document.getElementById('menu-drawer');
		this.template = template;
		this.processList();
	}

	Learn.prototype.processList = function () {
		this.frameworksList.forEach((function (el) {
			this.append(el);
		}).bind(this));
	};
	Learn.prototype.append = function (el) {
		var contentSection = document.createElement('div');
		contentSection.id = el.issueLabel;
		var compiled = _.template(this.template);
		contentSection.innerHTML = compiled(el);
		contentSection.className = 'learn';
		var linkToContent = document.createElement('a');
		linkToContent.href = '#' + _.escape(el.issueLabel);
		$(linkToContent).text(el.name);
		// Localize demo links
		var demoLinks = contentSection.querySelectorAll('.demo-link');
		Array.prototype.forEach.call(demoLinks, function (demoLink) {
			if (demoLink.getAttribute('href').substr(0, 4) !== 'http') {
				demoLink.setAttribute('href', findRoot() + demoLink.getAttribute('href'));
			}
		});
		this.contentContainer.appendChild(contentSection);
		this.menuDrawer.appendChild(linkToContent);
	};

	redirect();
	getFile('learn.json', Learn);

	$(window).on('hashchange', function () {
		var hash = location.hash;
		$('nav a').each(function () {
			var element = $(this);
			element[ element.attr('href') === hash ? 'addClass' : 'removeClass' ]('selected');
		});
	});
})($, _);
