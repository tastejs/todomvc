class window.AppRouter extends Backbone.Router
	routes:
		"":			 "all"
		"active":	 "active"
		"completed": "completed"

	all: -> app.viewmodels.settings.list_filter_mode('')
	active: -> app.viewmodels.settings.list_filter_mode('active')
	completed: -> app.viewmodels.settings.list_filter_mode('completed')
