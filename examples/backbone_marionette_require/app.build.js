({
	baseUrl: "js/",
	mainConfigFile: 'js/main.js',
	out: "js/main.built.js",
	include : 'main',

	optimize: 'uglify',

	uglify: {
		toplevel: true,
		ascii_only: true,
		beautify: false,
		max_line_length: 1000
	},

	inlineText: true,
	useStrict: false,

	skipPragmas: false,
	skipModuleInsertion: false,
	stubModules: ['text'],
	optimizeAllPluginResources: false,
	findNestedDependencies: false,
	removeCombined: false,

	fileExclusionRegExp: /^\./,

	preserveLicenseComments: true,

	logLevel: 0
})
