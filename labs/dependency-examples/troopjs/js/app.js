/*newcap false*/
/*jshint newcap:false*/
require({
	paths: {
		jquery: '../bower_components/jquery/jquery',
		'troopjs-bundle': 'lib/troopjs-bundle'
	}
}, [
	'require',
	'jquery',
	'troopjs-bundle'
], function Deps(parentRequire, $) {
	'use strict';

	// Application and plug-ins
	parentRequire([
		'widget/application',
		'troopjs-jquery/weave',
		'troopjs-jquery/destroy',
		'troopjs-jquery/hashchange',
		'troopjs-jquery/action'
	], function App(Application) {

		// Hook ready
		$(document).ready(function () {
			Application($(this.body), 'app/todos').start();
		});
	});
});
