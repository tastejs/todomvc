/*global define*/
/*jshint newcap:false*/
define([
	'troopjs-core/widget/application',
	'troopjs-core/route/router',
	'jquery'
], function ApplicationModule(Application, Router, $) {
	'use strict';

	function Forward(signal, deferred) {
		var services = $.map(this.services, function map(service) {
			return $.Deferred(function deferredSignal(deferSignal) {
				service.signal(signal, deferSignal);
			});
		});

		if (deferred) {
			$.when.apply($, services).then(deferred.resolve, deferred.reject);
		}
	}

	return Application.extend({
		'sig/initialize': Forward,
		'sig/finalize': Forward,
		'sig/start': Forward,
		'sif/stop': Forward,

		services: [Router($(window))]
	});
});
