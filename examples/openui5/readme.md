# OpenUI5 • [TodoMVC](http://todomvc.com)
OpenUI5 is an Open Source JavaScript UI library, maintained by SAP and available under the Apache 2.0 license. OpenUI5 lets you build enterprise-ready web applications, responsive to all devices, running on almost any browser of your choice. It’s based on JavaScript, using JQuery as its foundation and follows web standards. It eases your development with a client-side HTML5 rendering library including a rich set of controls and supports data binding to different models (JSON, XML and OData).

## Resources
- [Website](http://openui5.org/)
- [Key Features](http://openui5.org/features.html)
- [Developer Guide](https://openui5.hana.ondemand.com/#docs/guide/Documentation.html)
- [API Reference](https://openui5.hana.ondemand.com/#docs/api/symbols/sap.ui.html)
- [Used by](http://openui5.org/whoUsesUI5.html)
- [Blog](http://openui5.tumblr.com/)
- [FAQ](http://openui5.org/faq.html)
- [Explored App](https://openui5.hana.ondemand.com/explored.html)

### Articles
- [OpenUI5 Intro @ OSCON 2014](https://www.youtube.com/watch?v=y7iR3RBUUpY)
- [Video Tutorial @ The New Stack](http://thenewstack.io/video-tutorial-saps-openui5-an-open-source-javascript-ui-library/)
- [Getting Started](http://openui5.org/getstarted.html)
- [Detailed Walkthrough](https://openui5.hana.ondemand.com/#docs/guide/3da5f4be63264db99f2e5b04c5e853db.html)
- [Further Tutorials on YouTube](https://www.youtube.com/channel/UCOlLpeus2uAJhmxjKHHGTgA)

### Support
- [OpenUI5 on Stack Overflow](http://stackoverflow.com/questions/tagged/sapui5%20or%20openui5)
- [OpenUI5 on SCN](http://scn.sap.com/community/developer-center/front-end/content)
- [OpenUI5 on Twitter](https://twitter.com/OpenUI5)
- [OpenUI5 on GitHub](https://github.com/sap/openui5)

*Let us [know](https://github.com/sap/openui5/issues) if you discover anything worth sharing.*

## Implementation
In order to demonstrate the usage of OpenUI5 in this scenario, a new custom UI control ('js/control/ToDoControl.js') was created and embedded into a greenfield OpenUI5 project. The UI control is purposefully not dealing with persistency to be decoupled from the controller implementation.

### Custom UI Control 'ToDoControl'
The UI control exposes the following API, also referred to as UIControl 'metadata':

Required property declaration:

Property | Details | Type
-------- | ------- | -----
toDosObject | Path to a data-model property | object[] (of JSON objects with 'id', 'title' and 'completed' properties)
filter | String representation of the filtering mode | string (one of: 'all', 'active', or 'completed')

Available events for data persistency tasks:

Event | Details | Parameter
----- | ------- | ---------
addToDoPressed | Fires when a new TODO is added | title (string)
deleteToDoPressed | Fires when an existing TODO is deleted | toDoId (int)
deleteAllCompletedToDosPressed | Fires when 'Clear completed' is pressed | toDoIds (int[])
completedToDoPressed | Fires when TODO completed status was changed | toDoId (int), completed (boolean)
toDoChangedPressed | Fires when TODO title was changed | toDoId (int), title (string)

Here is a plain sample on how to use the UI control:
```js
var newControl = new ToDoControl({

	toDosObject: '{</path_to_object_array_in_model>}',

	filter: '{/<path_to_string_in_model>}',

	addToDoPressed: function (oEvent) {
		// get title: oEvent.getParameter('title')
	},

	deleteToDoPressed: function (oEvent) {
		// get toDoId: oEvent.getParameter('toDoId')
	},

	deleteAllCompletedToDosPressed: function (oEvent) {
		// get toDoId: oEvent.getParameter('toDoIds')
	},

	completedToDoPressed: function (oEvent) {
		// get toDoId: oEvent.getParameter('toDoId')
		// get completed: oEvent.getParameter('completed')
	},

	toDoChangedPressed: function (oEvent) {
		// get toDoId: oEvent.getParameter('toDoId')
		// get title: oEvent.getParameter('title')
	}
});
```

### Persistency
The Home controller implements all necessary methods to persist the TODO objects in the LocalStorage via OpenUI5's wrapper ('jQuery.sap.storage'). A key-value pair with id '0' will be used to persist the last used TODO id.

To ensure that the UI control uses the current data, you have to use OpenUI5's data-binding approach. Hence, you need to create a JSON model and feed the UI control with the path to the TODO json object[] and the filter-mode string as outlined above.

To update the LocalStorage, you need to refresh the data model and store the current data model like this:
```js
// initialization of localStorage and JSON model
var oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local)
var oModel = new sap.ui.model.json.JSONModel({
	allToDos: [],
	filterMode: 'all'
});

...

// Update localStorage and data model
oStorage.put('todos-openui5', oModel.getData());
oModel.refresh(true);
```

Do not forget to bind the data model to either the core or to the view itself in the 'onInit' method of the associated controller.

### App Descriptor (manifest.json)
All app-related configuration settings are stored in the [App Descriptor](https://openui5.hana.ondemand.com/docs/guide/8f93bf2b2b13402e9f035128ce8b495f.html). With this approach, the developed app is enabled to be integrated into (or registered within) the [SAP Fiori](https://experience.sap.com/fiori/) Launchpad. It outlines how re-usable UI5 apps (in that case: components) should be written according to the documentation. The App Descriptor is used to instantiate data models, ResourceModels and Routing during initialization of the app.

#### Routing
Within this app, the routing paradigm of OpenUI5 is used. The App Descriptor configuration ensures that a Router object ('sap.ui.core.routing.Router') is instantiated and pre-configured:
```json
"routing": {
	"config": {
		"routerClass": "sap.m.routing.Router",
		"viewType": "XML",
		"viewPath": "ToDoMVC.view",
		"controlId": "app",
		"controlAggregation": "pages"
	},
	"routes": [{
		"pattern": "",
		"name": "appHome",
		"target": "home"
	}, {
		"pattern": "{filter}",
		"name": "appHomeFilter",
		"target": "home"
		}],
	"targets": {
		"home": {
			"viewName": "Home",
			"viewLevel": 1
		}
	}
}
```

As outlined above, routing is accomplished with two routing pattern, one for the filter mode ('appHomeFilter') and and one ('appHome') for the standard filter mode 'all', without a parameterized route pattern. Within the Home controller, event handlers are assigned to catch the URL. Here's a sample:
```js
// enable routing for filter mode
var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
// handle filter mode
oRouter.getRoute('appHomeFilter').attachPatternMatched(this._onObjectMatched, this);
// handle standard mode
oRouter.getRoute('appHome').attachPatternMatched(this._onObjectMatched, this);
```

Both event handlers fire '_onObjectMatched' in case the routes are matched. Within the fired method, the 'filter' property of the data-model is set, which in turn invalidates the UI5 control and forces a repainting.

#### Internationalization (i18n)
To outline how i18n is applied within OpenUI5, this app is using a ResourceModel, which is instantiated through the App Descriptor configuration in the 'sap.ui5' namespace:
```json
"sap.ui5": {
	"models": {
		"i18n": {
			"type": "sap.ui.model.resource.ResourceModel",
			"settings": {
				"bundleName": "ToDoMVC.i18n.i18n"
			}
		}
	}
}
```

The 'bundleName' references the language file ('js/i18n/i18n.properties') and instantiates a new data model (bound and available within the whole UI5 app) named 'i18n'.

### Component-preload.js (via Grunt)
The whole app is wrapped into an OpenUI5 Component. Grunt is used to create a Component-preload.json file. You can find more information [here](https://www.npmjs.com/package/grunt-openui5). With this [practice](http://pipetree.com/qmacro/blog/2015/07/speeding-up-your-ui5-app-with-a-component-preload-file/), all Component-related files are merged into one preload file to avoid multiple HTTP GETs just for one component.

### Version & 'resources' folder
This app is using the most recent OpenUI5 version, hosted on the [CDN](http://openui5.org/download.html). As of today, this is version 1.32.9 (2015-12-14).

## Credit
Created by [Alexander Graebe](https://github.com/agraebe) & [Alexander Hauck](https://github.com/alexis90)
