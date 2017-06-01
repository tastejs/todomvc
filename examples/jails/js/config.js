require.config({

	baseUrl :'js',
	deps    :['jquery', 'jails', global.page],
	paths   :{
		mods		:'../node_modules/jails-modules/',
		comps		:'../node_modules/jails-components/',
		jails		:'../node_modules/jails-js/source/jails.min',
		jquery 		:'../node_modules/jquery/dist/jquery.min',
		mustache  	:'../node_modules/mustache/mustache.min'
	},

	callback :function( jquery, jails ){
		jails.start({ base :jquery });
	}
});
