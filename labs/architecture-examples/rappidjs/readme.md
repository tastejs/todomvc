# Simple Todo App build with rAppid.js

This example app demonstrates the features and abilities of rAppid.js

## Documentation


### The index.html

In the index.html the application is bootStrapped by defining our main application file 
(in this case Todo.xml). Because rAppid.js is a RIA framework, the whole rendering is done by javascript.

If you are now thinking 'yeah fine, but what about SEO ', don't worry, rAppid.js also support Node-Rendering, which can be used for things like SEO.

### The application file Todo.xml

The main view of the application is declarated in Todo.xml. The first tag of the Todo.xml defines the super class of our application and the namespaces used inside the application description. 

```xml
<?xml version="1.0"?>
<app:TodoClass xmlns="http://www.w3.org/1999/xhtml"
               xmlns:js="js.core" xmlns:ui="js.ui" xmlns:app="app" xmlns:view="app.view" xmlns:conf="js.conf">
   ...
</app:TodoClass>
```
As you can see, the default namespace is `"http://www.w3.org/1999/xhtml"` which allows us to use plain HTML elements to describe our view.
The other namespaces are used for custom components.

One example of a custom component is the Router configuration.
```xml
<js:Router cid="router">
        <conf:Route name="default" route="^$" onexec="showAll"/>
        <conf:Route name="active" route="^active$" onexec="showActive"/>
        <conf:Route name="completed" route="^completed$" onexec="showCompleted"/>

</js:Router>
```
Inside this declaration all routes of the application are defined. The **route** attribute expects a regular expression, which matches the route. 
The **onexec** attribute defines the function which will be called, if the route is triggered.

The rest of the markup defines the UI of our application. 
To connect the view with our application model we use bindings. For example the header:

```html
<header id="header">
            <h1>{i18n.translate('title')}</h1>
            <input id="new-todo" placeholder="{i18n.translate('placeholder')}" type="text" onkeyup="addNewTodo"
                   value="{{newTodo.title}}" autofocus="autofocus"/>
        </header>
```
The bindings tell the application to hold view and model in sync. If you're interested in more details, checkout the rAppid.js wiki.


### The code behind file TodoClass.js
The TodoClass.js is the code behind file for Todo.xml. It initializes the attributes used in this application and it defines the event handlers for routing and ui events.
So there is a clean seperation between application code and ui declaration.

In the initialize method inside TodoClass all binded models are created and set as attributes of the application. This is important for resolving the bindings used in the view declaration.


### The Todo Model (app/model/Todo.js)

In this model, the default attributes for an instance and some methods used inside the application are defined.
 
It also marks the functions `hasTitle` and `status` as bindable.
 
 ```javascript
 status: function () {
   return this.$.completed ? "done" : '';
 }.onChange("completed"),
 ```
 
Calling the `onChange(...)` function tells the application that the binding value of this methods has to be refreshed everytime the attributes change. 
See app/view/TodoView.xml for usage.
 

### The Todo List (app/collection/TodoList.js)

The Todo List is a bindable List which encapsulates some application logic for manipulating the todo instances.
It also declares bindable functions, which are used inside the view ...

### The Todo View (app/view/TodoView.xml)
 The Todo view is a custom view for displaying and editing Todo instances.
 Here we define view logic and view declaration in one file.
 
 
 
 
 
 
