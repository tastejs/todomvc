// fake plugin

define(function () {

	var plugin;

	plugin = {
		load: function (name, resolver, callback, config) {
			plugin.testValue = config.testValue;
			callback(config.testValue);
		}
	};

	return plugin;

});
