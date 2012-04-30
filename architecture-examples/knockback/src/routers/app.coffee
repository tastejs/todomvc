class window.AppRouter extends Backbone.Router
	routes:
		"":						"all"
		"active":			"active"
		"completed":	"completed"

	all: 				-> app_settings_view_model.list_filter_mode('')
	active: 		-> app_settings_view_model.list_filter_mode('active')
	completed: 	-> app_settings_view_model.list_filter_mode('completed')