# rAppid.js TodoMVC app

> rAppid.js is a declarative JavaScript web application for rapid web application development. It uses XML to define the structure of applications, modules, components and views and JavaScript for the business logic of the application. The XML (xaml) gets translated to javascript components during runtime which will render itself as HTML5 DOM elements. This enables a rapid development of applications.

This example app demonstrates the features and abilities of [rAppid.js](http://www.rappidjs.com)


## Documentation


### index.html

In the index.html the app is bootstrapped by defining our main app file (in this case Todo.xml). Because rAppid.js is a RIA framework, the whole rendering is done by JavaScript.

If you are now thinking "yeah fine, but what about SEO", don't worry, rAppid.js also support Node-Rendering, which can be used for things like SEO.


### Todo.xml

The main view of the app is declarated in Todo.xml. The first tag of the Todo.xml defines the super class of our app and the namespaces used inside the app description.

```xml
<?xml version="1.0"?>
<app:TodoClass xmlns="http://www.w3.org/1999/xhtml" xmlns:js="js.core" xmlns:ui="js.ui" xmlns:app="app" xmlns:view="app.view" xmlns:conf="js.conf">
...
</app:TodoClass>
```

As you can see, the default namespace is `"http://www.w3.org/1999/xhtml"` which allows us to use plain HTML elements to describe our view. The other namespaces are used for custom components.

One example of a custom component is the Router configuration.

```xml
<js:Router cid="router">
	<conf:Route name="default" route="^$" onexec="showAll"/>
	<conf:Route name="active" route="^active$" onexec="showActive"/>
	<conf:Route name="completed" route="^completed$" onexec="showCompleted"/>
</js:Router>
```

All routes of the app are defined inside this declaration. The **route** attribute expects a regular expression, which matches the route. The **onexec** attribute defines the function which will be called, if the route is triggered.

The rest of the markup defines the UI of our app. To connect the view with our app model we use bindings. For example the header:

```html
<header id="header">
	<h1>{i18n.translate('title')}</h1>
	<input id="new-todo" placeholder="{i18n.translate('placeholder')}" onkeyup="addNewTodo" value="{{newTodo.title}}" autofocus="autofocus"/>
</header>
```

The bindings tell the app to hold view and model in sync. If you're interested in more details, checkout the [rAppid.js wiki](http://www.rappidjs.com/#/wiki/Home).


### TodoClass.js

TodoClass.js is the code behind Todo.xml. It initializes the attributes used in this app and it defines the event handlers for routing and UI events. So there is a clean seperation between app code and UI declaration.

In the initialize method inside TodoClass all bound models are created and set as attributes of the app. This is important for resolving the bindings used in the view declaration.


### Todo Model (app/model/Todo.js)

The default attributes for an instance and some methods used inside the app are defined in this model.

It also marks the functions `hasTitle` and `status` as bindable.

 ```javascript
 status: function() {
	return this.$.completed ? 'completed' : '';
 }.onChange('completed'),
 ```

Calling the `onChange()` function tells the app that the binding value of this methods has to be refreshed every time the attributes change. See app/view/TodoView.xml for usage.


### Todo List (app/collection/TodoList.js)

The Todo List is a bindable List which encapsulates some app logic for manipulating the todo instances. It also declares bindable functions, which are used inside the view.


### Todo View (app/view/TodoView.xml)

The Todo view is a custom view for displaying and editing Todo instances. Here we define view logic and view declaration in one file.
