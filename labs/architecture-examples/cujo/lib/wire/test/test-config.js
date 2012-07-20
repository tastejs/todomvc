(function(global, undef) {

	function noop() {}

    // Fake console if we need to
   	if (typeof global.console === undef) {
   		global.console = { log: noop, error: noop };
   	}

	var doc, head, scripts, script, i, baseUrl, baseUrlSuffix,
		selfName, selfRegex, loaders, loader, loaderName, loaderPath, loaderConfig;

    loaderName = 'curl';

    // Try to get loader name from location hash
    try {
        loaderName = (global.location.hash).slice(1) || loaderName;
    } catch(e) {
    }

	selfName = 'test-config.js';
	selfRegex = new RegExp(selfName + '$');

	baseUrlSuffix = '../';

    loaders = {
        curl: {
            script: 'test/curl/src/curl',
            mixin: {
                apiName: 'require',
                pluginPath: 'curl/plugin',
                paths: {
					'jquery': 'test/lib/jquery'
//                    'wire/domReady': 'test/curl/src/curl/domReady'
                },
                preloads: [
                    'curl/shim/dojo16'
                ]
            }
        },
        requirejs: {
            script: 'test/requirejs/require',
            mixin: {
                paths: {
					'jquery': 'test/lib/jquery',
//                    'wire/domReady': 'test/requirejs/domReady'
                    domReady: 'test/requirejs/domReady'
                }
            }
        }
    };
    
    function addPackage(pkgInfo) {
        var cfg;
        
        if(!loaderConfig.packages) loaderConfig.packages = [];
        
        cfg = loaderConfig.packages;
        pkgInfo.main = pkgInfo.main || pkgInfo.name;
        cfg.push(pkgInfo);
    }

    loader = loaders[loaderName];
    
	loaderPath = loader.script;

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

	// Setup loader config
	global[loaderName] = loaderConfig = {
		baseUrl: baseUrl,
		paths: {}
	};
    
    for(var m in loader.mixin) {
        loaderConfig[m] = loader.mixin[m];
    }

    addPackage({ name: 'dojo', location: 'test/lib/dojo17/dojo' });
//	addPackage({ name: 'dijit', location: 'test/lib/dojo17/dijit', main: 'main' });
//	addPackage({ name: 'dojo', location: 'test/lib/dojo16/dojo', main: 'lib/main-browser' });
//    addPackage({ name: 'dijit', location: 'test/lib/dojo16/dijit', main: 'lib/main' });
    addPackage({ name: 'sizzle', location: 'support/sizzle' });
    addPackage({ name: 'aop', location: 'support/aop' });
    addPackage({ name: 'when', location: 'support/when' });
    // This is needed because we're running unit tests from *within* the wire dir
    addPackage({ name: 'wire', location: '.' });

	// Other loaders may not need this
	loaderConfig.paths[loaderName] = loaderPath;

	// That's right y'all, document.write FTW
	if(typeof console == 'undefined' || typeof console.log != 'function') {
		doc.write('<script src="' + baseUrl + 'test/firebug-lite/build/firebug-lite.js#startOpened' + '"></script>');
	}
	doc.write('<script src="' + baseUrl + 'test/util/doh/runner.js"></script>');
	doc.write('<script src="' + baseUrl + loaderPath + '.js' + '"></script>');

})(window);
