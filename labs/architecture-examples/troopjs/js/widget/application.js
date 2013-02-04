define( [ 'troopjs-core/widget/application', 'troopjs-core/route/router', 'jquery' ], function ApplicationModule(Application, Router, $) {

	function forward(signal, deferred) {
		var services = $.map(this.services, function map(service, index) {
			return $.Deferred(function deferredSignal(deferSignal) {
				service.signal(signal, deferSignal);
			});
		});

		if (deferred) {
			$.when.apply($, services).then(deferred.resolve, deferred.reject);
		}
	}

	return Application.extend({
		'sig/initialize': forward,
		'sig/finalize': forward,
		'sig/start': forward,
		'sif/stop': forward,

		services: [ Router($(window)) ]
	});
});
