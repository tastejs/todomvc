require.config
	paths:
		'jquery':                '../../../../assets/jquery.min'
		'backbone':              'lib/backbone-min'
		'localstorage':          'lib/backbone.localStorage-min'
		'backboneEventStreams':  'lib/backbone.eventstreams.min'
		'underscore':            'lib/underscore-min'
		'bacon':                 'lib/bacon.min'
		'transparency':          'lib/transparency.min'

	shim:
		backbone:
			deps: ['underscore']
			exports: 'Backbone'
		underscore: exports: '_'
		backboneEventStreams: deps: ['backbone', 'bacon']

require ['jquery', 'transparency', 'backbone', 'underscore', 'app', 'backboneEventStreams'],
	($, Transparency, Backbone, _, TodoApp) ->

		# Register Transparency as a jQuery plugin
		Transparency.register $

		$ -> new TodoApp(el: $('#todoapp'))
