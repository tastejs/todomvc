/**
* Handles processing and rendering external XTemplates.
*/
Ext.define('TodoDeftJS.util.TemplateLoader', {

	templateRenderer: function (loader, response, active) {
		var targetComponent, template, templateConfig;
		targetComponent = loader.getTarget();
		templateConfig = {};

		if ((targetComponent.templateConfig != null)) {
			templateConfig = targetComponent.templateConfig;
		}

		template = new Ext.XTemplate(response.responseText, templateConfig);
		targetComponent.tpl = template;
		targetComponent.refresh();
	}

});