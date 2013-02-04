require({
	'paths': {
		'jquery': '../../../../assets/jquery.min',
		'troopjs-bundle': 'lib/troopjs-bundle.min'
	}
}, [ 'require', 'jquery', 'troopjs-bundle' ], function Deps(parentRequire, jQuery) {

	// Application and plug-ins
	parentRequire([
		'widget/application',
		'troopjs-jquery/weave',
		'troopjs-jquery/destroy',
		'troopjs-jquery/hashchange',
		'troopjs-jquery/action' ], function App(Application) {

		// Hook ready
		jQuery(document).ready(function ready($) {
			Application($(this.body), 'app/todos').start();
		});
	});
});
