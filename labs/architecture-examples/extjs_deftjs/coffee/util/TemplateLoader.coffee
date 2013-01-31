###*
* Handles processing and rendering external XTemplates.
###
Ext.define( "TodoDeftJS.util.TemplateLoader",


	templateRenderer: ( loader, response, active ) ->
		targetComponent = loader.getTarget()
		templateConfig = {}

		if( targetComponent.templateConfig? )
			templateConfig = targetComponent.templateConfig

		template = new Ext.XTemplate( response.responseText, templateConfig )

		targetComponent.tpl = template
		targetComponent.refresh()

		return

)
