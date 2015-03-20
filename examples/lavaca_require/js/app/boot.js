require.config({
	baseUrl: 'js',
	paths: {
		$: '../node_modules/jquery/dist/jquery',
		jquery: '../node_modules/jquery/dist/jquery',
		mout: '../node_modules/mout/src',
		dust: '../node_modules/dustjs-linkedin/dist/dust-full',
		'dust-helpers': '../node_modules/dustjs-helpers/dist/dust-helpers',
		rdust: 'libs/require-dust',
		lavaca: 'Lavaca',
		Lavaca: 'lavaca'
	},
	shim: {
		$: {
			exports: '$'
		},
		jquery: {
			exports: '$'
		},
		dust: {
			exports: 'dust'
		},
		'dust-helpers': {
			deps: ['dust']
		},
		templates: {
			deps: ['dust']
		}
	}
});
require(['app/app']);
