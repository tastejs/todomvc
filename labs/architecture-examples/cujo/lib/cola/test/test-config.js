(function(global, undef) {

	function noop() {}

	// Fake console if we need to
	if (typeof global.console === undef) {
		global.console = { log: noop, error: noop };
	}

	var doc, head, scripts, script, i, baseUrl, baseUrlSuffix,
		selfName, selfRegex, loaders, loader, loaderName, loaderPath, loaderConfig;

	selfName = 'test-config.js';
	selfRegex = new RegExp(selfName + '$');

	baseUrlSuffix = '../';

	loaderPath = 'test/curl/src/curl';

	function addPackage(pkgInfo) {
		var cfg;

		if(!loaderConfig.packages) loaderConfig.packages = [];

		cfg = loaderConfig.packages;
		pkgInfo.main = pkgInfo.main || pkgInfo.name;
		cfg.push(pkgInfo);
	}

	doc = global.document;
	head = doc.head || doc.getElementsByTagName('head')[0];

	// Find self script tag, use it to construct baseUrl
	i = 0;
	scripts = head.getElementsByTagName('script');
	while((script = scripts[i++]) && !baseUrl) {
		if(selfRegex.test(script.src)) {
			baseUrl = script.src.replace(selfName, '') + baseUrlSuffix;
		}
	}

	// dojo configuration, in case we need it
	global.djConfig = {
		baseUrl: baseUrl
	};

	loaderConfig = global.curl = {
		apiName: 'require', // friggin doh needs this
		baseUrl: baseUrl,
		paths: {
			curl: loaderPath
		},
//		pluginPath: 'curl/plugin',
		preload: [
		]
	};

	addPackage({ name: 'cola', location: '.', main: 'cola' });
	addPackage({ name: 'dojo', location: 'test/lib/dojo', main: 'lib/main-browser' });
//	addPackage({ name: 'dijit', location: 'test/lib/dijit', main: 'lib/main' });
//	addPackage({ name: 'sizzle', location: 'support/sizzle' });
//	addPackage({ name: 'aop', location: 'support/aop' });
	addPackage({ name: 'when', location: 'test/when', main: 'when' });

	// That's right y'all, document.write FTW
	doc.write('<script src="' + baseUrl + loaderPath + '.js' + '"></script>');

})(window);