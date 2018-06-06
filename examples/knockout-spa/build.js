({
	appDir: '.',
	baseUrl: '.',
	dir: './build',
	skipDirOptimize: false,
	generateSourceMaps: false,
	mainConfigFile: 'common.js',
	optimize: 'uglify2',
	optimizeCss: 'standard',
	pragmasOnSave: {
		excludeRequireCss: false
	},
	modules: [
		{
			name: 'common',
			include: [
				'app/shared/root-bindings',
				'framework/router',
				'framework/page',
				'text',
				'css',
				'jsface'
			]
		},
		{
			name: 'app/error/error',
			exclude: ['common']
		},
		{
			name: 'app/home/home',
			exclude: ['common']
		},
		{
			name: 'component/todo-item/todo-item',
			exclude: ['common']
		},
		{
			name: 'component/todo-item-edit/todo-item-edit',
			exclude: ['common']
		},
		{
			name: 'component/todo-list/todo-list',
			exclude: ['common']
		}
	],
	paths: {}
})
