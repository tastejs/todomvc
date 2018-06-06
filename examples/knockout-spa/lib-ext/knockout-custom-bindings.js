define(['knockout'], function (ko) {

	ko.bindingHandlers.focus = {
		init: function (element) {
			element.focus();
		}
	};

	return ko;

});
