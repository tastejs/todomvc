# PlastronJS #
formerly goog.mvc

I've given the project v1 beta status which means that it's mostly tested but not used in production yet and the existing API is unlikely to change (if it does I'll provide backwards compatability until v2 - if one is ever made, I have some plans for future revisions) and any new additions wil get a .x version number. And bug fixes will get a .x.X version number.

I'm using it as the foundation of Catch.com's new webclient which will be much shinier and more interactive than possible with the old codebase and will move the project to release once the new site is in production (later in 2012).

Please feel free to fork and comment and suggest!

PlastronJS is an MVC library which uses the Google Closure library for use with the Closure Compiler. I've decided to call it Plastron after the name of the underside of the turtle to mimic names of frameworks like Backbone and Spine but also because it's a good base to build upon.

PlastronJS though is not just a MVC framework, it's the start of an application framework. I've decided to include a mediator and a store with the package which will hopefully help in the construction of medium to large size applications.

The source code should be well documented and I plan on including tutorials on my blog at http://rhysbrettbowen.com. Feel free to contact me at rhysbrettbowen@gmail.com if there are any questions

The folder should be put in your project directory and the path passed to the closure compiler. I have my project folder setup like this:

    myApp/
        js/ *<- your main app code here.*
        lib/ *<- libraries you use here.*
            mvc/ *<- PlastronJS here.*
        styles/ *<- CSS/GSS/SASS etc.*
        template/ *<- Soy files here.*

to use a module you'll need to include it

```javascript
goog.require('mvc.Model');
```

I decided to leave the namespace that the project is under at mvc for two reasons. The first is that it's simpler to write than PlastronJS and the second is that it makes more sense in the code.

I'd like to point out that I've spent a lot of time reading the source code of other MVC frameworks, most notably Backbone.js so hopefully it will seem fairly familiar. There are however some notable differences. The closure compiler does not mix dot notation and square bracket notation so a lot of the nice linking to functions based on names was out of the question. I also want this framework to work for larger applications. A lot of people find trouble with the current mvc frameworks because they don't scale well or provide functionality for more complex systems. I'm hoping that I have addressed this. Lastly I developed this MVC to use on the webclient at Catch.com so some of the decisions I made were based on what I needed - but I have also included extra functionality I am not using and this means that some parts are not tested as rigorously. If you do spot any bugs or any features that need fine tuning please let me know or fork the project and make some changes.

If you are new to closure then you need this book http://www.amazon.com/Closure-Definitive-Guide-Michael-Bolin/dp/1449381871

## mvc.Model ##

The model is the main component. It allows you to store data and send out change events when it changes (it extends goog.events.EventTarget). It also communicates with the data store through mvc.Sync

### make a Model ###

You can instantiate a new model directly, or you may wish to create a new type of model that inherits from mvc.Model like so:

```javascript
goog.require('mvc.Model');

/**
 * @constructor
 * @inheritDoc
 */
var Person = function(firstName, lastName) {
    goog.base(this, {attr: {
        'firstName': firstName,
        'lastName': lastName
    }});
    this.meta('name', ['firstName','lastName'], function(firstName, lastName) {
        return lastName + ", " + firstName;
    });
};
goog.inherits(Person, mvc.Model);
```

Another option is to just create a model and differentiate it by a schema:

```javascript
var Rhys = mvc.Model.create({
    'schema': myApp.schema.Person
    });
```

we'll go in to schemas later.

Any setup would go in the constructor function (in the above we used the meta function to create a meta attribute). You can override methods and add new methods of your own.

### new Model options ###

When creating a new model instance, the constructor takes an options object. The options object takes the special keys 'schema', 'sync' and 'attr'. You can put any attributes directly in the object except for the reserved keywords of schema, sync and attr. If you do wish to use these in your model then you can place them under the attr keyword. To be safe it's best to put them all under the attr keyword. So an options object might look a little something like this:

```javascript
var attr = {
  'firstName': 'Rhys',
  'lastName': 'Brett-Bowen'
};
var options = {
  'attr': attr,
  'sync': new mvc.AjaxSync()
};
```

or

```
var options = {
  'firstName': 'Rhys',
  'lastName': 'Brett-Bowen'
};
```

in the second example I put the attributes right in the object. I can do this and mix them with 'schema' and 'sync'. Just remember that 'attr', 'sync' and 'schema' are reserved words, 'attr' is a safe place for attributes and 'sync' and 'schema' are reserved.

You might also noticed that I put quotes around the keys in the object. This is necessary as closure would rename the keys after compilation and that means that shema could become 'c' which would be put in as an attribute. I will point out where you need to use quotes and where they are optional as I go on.

### get and set key/values ###

You should always use the get() and set() functions when dealing with the model's data. These functions take care of saving old data and publishing change events. To get and set data you can do the below:

```javascript
model.get('firstName'); // returns 'Rhys'
model.set('firstName', 'Bruce');
model.get('firstName'); //returns 'Bruce'
```

### customizing get and set ###

You can also manipulate how you get and set the data using these functions by either specifying a schema object (which we'll go in to later) or by using the below functions to modify the model's default schema

The alias function allows you to get a member using a different name

```javascript
model.set('lastName', 'Brett-Bowen');
model.alias('surname', 'lastName');
model.get('surname'); // returns 'Brett-Bowen'
```

The format function allows you to change how the data is presented

```javascript
model.set('now', new Date());
model.format('now', function(now) {return now.toDateString()});
model.get('now'); // returns the set date as a string
```

The meta function is passed the new variable name, an array or attributes to base the data off and the formatting function. To do this you need to pass the new attribute name, the required attributes and the function.

```javascript
model.set({
    'firstName': 'Rhys',
    'lastName': 'Brett-Bowen'
    });
model.meta('name', ['firstName', 'lastName'], function(firstName, lastName) {
    return lastName + ", " + Rhys;
});
model.get('name'); // returns "Brett-Bowen, Rhys"
```

### setting and validation ###

You can also change how you set and validate data by using the setter function. you can do any checks on the data in the function and throw a mvc.Model.ValidateError if it doesn't pass, any other errors are passed up the chain. The validate errors are handled by the model's error handling function. By default it just ignores the error and the value isn't set, but you can override it by:

```javascript
  var errorFn = function(err) {
    alert(err.getMessage());
  };
  model.errorHandler(errorFn);
```

We can then put in a formatting and validating function for our name

```javascript
model.setter('firstName', function(name) {
  name = goog.string.trim(name);
  if (!name.length)
    throw new mvc.Model.ValidateError("name can not be blank");
  return name;
})
```

the above will check to see that a name isn't blank and trim the input.

### Binding & unbinding data ###

the real power in a model comes in binding. You can bind keys, or computed keys to functions. The bind function takes three arguments. The first is the attribute name or an array of attribute names whose changes you want to listen to. The second is a function which will be passed the value of each of the items you are listening to and the model. The final parameter is the object to bind the function to. So you could do this:

```javascript
var task = new mvc.Model({'done':false,'important':false});
var element = document.getElementById('myTask');
var bound = task.bind(['done','important'], function(done, important) {
    this.checked = done;
    this.setProperty('important', important);
  }, element);
// changes to done or important will change the element
task.unbind(bound);
//changes will no longer change the element
```

in the example above we saved a uid in bound that we can use to unbind a listener. All bind functions return a uid that can be used with unbind.

### binding keys to a function ###

the model class comes with a function getBinder that can be used to bind a function to a key. For instance you can use it for convenience methods to get and set keys:

```javascript
var lat = model.getBinder('location:latitude');
lat(3) // sets the location:latitude to 3
lat() // returns 3
```

you can even use this with the bind method above to bind a key with a key from another model

```javascript
// married couple living together
var husband = new mvc.Model({'city':'San Francisco'});
var wife = new mvc.Model({'city':'San Francisco'});
husband.bind('city', wife.getBinder('city'));
husband.set('city', 'New York');
wife.get('city') // returns New York
```

### listening to all changes ###

if you want to listen to any change you can use bindAll and just pass in a function. and an optional handler.

### unload ###

there is also a bindUnload that takes in a function and an optional handler to be fired when the model's dispose() method is called.

### other functions ###

There are also other functions that can take parameters such as the boolean "silent" to suppress change events. The other functions available on a model are:

- toJson: used to return a json model that can be used by mvc.Sync or other objects. You should generally override this method with your own implementation
- setSync(mvc.Sync): will set the sync used by the object
- reset(silent): clears the attributes
- isNew: returns a boolean if an id has been set (rather than just a cid)
- setSchema(Obj): sets the schema
- addSchemaRules(Obj): will extend the schema object with the object passed in
- has(string): whether the model has the key
- unset(string): deletes a key (sets to undefined)
- change: manually fire a change event - handy if you've been using silent for bulk operations
- prev(string): the previous value of an attribute, gets the raw data
- getChanges: tells you what values has changed since the last change event used internally by bind to figure out what to fire change events for
- revert: rolls back to the previous attributes
- fetch(callback, silent): updates the model using it's sync
- save: tells the sync to create/update
- dispose(bool): disposes of the model and all it's listeners. Pass true if you want the model to call the model's sync's delete function

## Schema ##

You can also set a schema for a model. A schema is an object which has a set of keys for which you want getters and setters. Under the key you can put an object with the keys of get, set and require. The get function works much like the meta function above (in fact the meta function is just a nice way to add things to the schema). The function will accept in the values for any attributes you put in the require array. The set function will take the value and should return the data to get set on the model. You can also throw errors to stop the value saving and fire the models handleErr_ function which you should set. an example of a schema:

```javascript
{
    'firstname': {
        set: function(name) {
            if(name.length > 64)
                throw new Error("name is too long");
            return goog.string.trim(name);
        }
    },
    'fullName': {
        get: function(first, last) {
            return last + ", " + first;
        },
        require: ['firstname','lastname']
    }
}
```

the require should be put in for any user defined attributes as the model goes up the require chain to decide when to fire a change event on these attributes.

### comparing ###

A model decides whether it has changed by keeping an unsafe clone of the attributes object form the previous change event. The model will only be able to make comparisons between native types and arrays of native types. Objects such as maps or generated objects will always return as a change unless you set a comparator function in the schema. You can do this by:

```javascript
{
  'user': {
    cmp: function(a, b) {return a.id == b.id;}
  }
}
```

A comparator function is set on the schema under the cmp keyword and should take the form of a function that takes the two objects and returns true if they match or false otherwise. the mvc.Model has some comparison functions already bake in that you can use:

```javascript
// recurse through the object/arrays and compare all primitive values
mvc.Model.Compare.RECURSIVE;
// call the toString() method on the objects and compare
// only use this if you've set a .toString() for the objects
mvc.Model.Compare.STRING;
// serialize the object as json then compare the strings
// uses closures json serializer
mvc.Model.Compare.SERIALIZE;
```

### collection schema ###

If you're using an mvc.Collection then you can also include in a 'models: true' parameter which lets the collection know that the parameter is computed using the model list. This is for computed values that use the list of models. For instance if you have a list of images you may want to get the first image as a thumbnail:

```javascript
{
  'thumbnail': {
    get: function() {
      return this.at(0);
    },
    models: true
  }
}
```

of course you can also still require other attributes to pass in as well.

## mvc.Collection ##

A mvc.Collection extends mvc.Model and so has all of it's properties. Also a collection can contain an array of models that belong to it. A collection can keep these models in an order if given a comparator function.

### Sorting ###

A comparator function works the same as the javascript array.sort function - taking two models and returning -1, 0 or 1 and will also listen to changes and emit a change if any model it contains fires a change event.

### children ###

The mvc.Collection can also take a modelType which works with the newModel method that takes an options map and will create a new model of the type passed in. So you can create new students is a class like this:

```javascript
var student = function(options){
    goog.base(this, options)
};
goog.inherits(student, mvc.Model);
var class = new mvc.Collection({
    'modelType': student,
    'name': 'clodure mvc 101'
});
class.addModel({'name':'Fred'});
// class now has a student called fred
```

### options ###

the options object for a collection is slightly different to that of a model. It has three extra reserved words. 'comparator' which is the comparison function, 'modelType' which is the base model to create when putting in a new child and 'models' which is an array of mvc.Models that should be added to the collection.

### other functions ###

A collection also offers these aditional methods:

- pluck([keys]): returns an array of json models with the keys and values of each model
- setComparator(Function): change the comparator function to keep the models in order
- getLength: number of models contained
- sort(silent): used internally to sort the models
- add(mvc.Model, index, silent): adds a model to the end unless an index is given
- remove(mvc.Model, silent): removes the model
- getById(id): returns a model by it's id
- getModels(Function): returns an array of the models optionally filtered by a function that takes the model and the index and returns true if it should be returned in the filter otherwise false
- at(index): return the model at an index
- clear: clears all the models
- modelChange(function, handler): like bind for model but is bound only on changes to the collections children being sorted or added/removed
- anyModelChange(function, handler): similar to modelChange but will fire when any model is changed regardless of it it updates sort order
- bindAdd(function, handler): function takes the added model as an argument and is run whenever a model is added to the collection
- bindRemove(function, handler): function takes the model and the model's id/cid in case the model is disposed and is run when a model is removed from the collection

## mvc.Store ##

This can be used as a factory and cache for models. Use the get to retrieve models by their ID and if they don't exist they will be created. This is good to make sure your models are unique. If no ID is passed then a new model will be created and you can get the model using it's CID until an ID is set for the model.

```javascript
var store = new mvc.Store();
var a = store.get(111); // store creates a new object with id 12345
                        // it then calls sync to load it
var b = store.get(111);
a == b; //true

a = store.get(); // a is a new model
a.set('id', 12345)
b = store.get(12345);
a == b; // true, store listens to changes on id and sets it when one is set
```

## mvc.Control ##

The mvc.Control inherits from goog.ui.Component and so works in a similar way. You create it's DOM in the createDom method and can make changes to it's dom by setting up listeners in the enterDocument method.

### making a new control ###

adding in a control is the same as adding in a goog.ui.component. The only thing is that you have to pass it a model or collection that it is to be associated with. You'll then be able to access it through the controls getModel() method.

```javascript
var model = new mvc.Model();
var control = new mvc.Control(model);
control.getModel() == model; // true
```

### getting a child element ###

a control has the function getEls(selector) which can find elements in it's DOM for you. All you need to do is pass it a valid selector that can be in the form of:

- ".className"
- "#elementId"
- "tagName[ .className]"

where the square brackets show that it is optional.

### handling events ###

handling events are done slightly different to what you may be used to. A control only has one listener per event type and manually decides which handlers to fire. To listen for an event you just need to do this:

```javascript
control.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');
  this.on(goog.events.EventType.CLICK, function() {
    alert('clicked');
  });
};
```

for clicks there is even a convenience function called .click()

But what if you want to listen for a click on a particular element?

### delegating events ###

You can decide whether or not to fire a handler by either the className of the element (or an array of classNames if it can fire or any of them) or a function that takes the event and returns true if it should be handled. for instance:

```javascript
this.click(function(){alert('click')}, ["star", "unstar"]);
```

will fire for any element that has the class star or unstar. If you want to fine tune it more you could use a function:

```javascript
this.click(function(){alert("click");}, function(e) {return e.clientX<100;});
```

this will fire for clicks in the left 100px of the screen that are on the control.

### handling priorities ###

Because of all this we need finer control over what should fire first. because of this the .on() method can also take a priority. The default priority is 50 and items with the same priority will be executed in the order they are given. You can change this by giving a lower number, which is a higher priority.

```javascript
var a = this.click(function(){alert('a')});
var b = this.click(function(){alert('b')});
// click will alert a the alert b
this.off(a);
this.off(b);
a = this.click(function(){alert('a')});
b = this.click(function(){alert('b')}, undefined, this, 40);
// click will alert b then alert a
```

above the arguments in the last click call are the function, the decider function/classname filter (undefined for no filter so fire on all clicks), the optional handler to bind the function to (it binds to this by default, but putting in this is shorted than undefined) and then the last parameter is the priority which should be a number.

### unhandling ###

you can use the off method like I have above to unbind any handlers just like unbind in models.

### handling notes ###

you can create other convenience functions like click easily using the goog.bind. All you need to do is this:

```javascript
  this.mouseOver = goog.bind(this.on, this, goog.events.EventType.MOUSE_OVER);
```

you can also handle an event only once by using the .once() method

### binding to a model ###

The best place to setup bindings is in the controls enterDocument method. for instance:

```javascript
this.click(function(e) {
  this.getModel().set('star', !this.getModel().get('star'));
  }, "starButton");
this.getModel().bind('star', function(star) {
  if(star)
    goog.dom.classes.add(this.getEls(".starButton")[0], 'star');
  else
    goog.dom.classes.remove(this.getEls(".starButton")[0], 'star');
}, this);
```

now clicking on the star button will change the star attribute and that will in turn change the class on the star Button. There are lots of ways to match up the bindings.

### bind to a model ###

you caninstead of doing this:

```javascript
this.getModel().bind('star', myFunc, this);
```

you should call it directly on the control:

```javascript
this.bind('star', myFunc, this);
```

You can call the bind, bindAll, modelChange, anyModelChange directly on
the control for the model. This makes it easier to access but will also
associate that listener with the control so when the control is disposed
those event listeners will be removed from the model.

You can also unbind directly on the control.

## mvc.Sync ##

This is an interface that should have a custom implementation. Two simple implementations have been given called mvc.AjaxSync and mvc.LocalSync. The purpose of sync is to be the glue between the model and the dataStore.

The AjaxSync can be used and passed an object of functions or strings (with the strings acting much like the router example below) for each of the four methods create, read, update and del. These will be used for the call.

## mvc.Router ##

mvc.Router uses goog.History and hash tokens to hold and manage the state of the application. You can define a route with a regular expression that will fire custom events when a certain route comes on the URL. A route can be defined with a route expression which can take : followed by an attribute, a * to pass the rest of the route and [] for an optional part of the url (which will be passed to the function). For instance:

```javascript
route = "/note=:id[/edit][?*]";
```
should take a function with four attribute:
```javascript
function(id,edit,query,queryVals)
```

so for /note=1234567890/edit?abc=123 will give:

```javascript
function(id,edit,query,queryVals) {
    console.log(id); // 1234567890
    console.log(edit); // /edit
    console.log(query); // ?abc=123
    console.log(queryVals); // abc=123
}
```

## mvc.Mediator ##

mvc.Mediator allows message passing between components. It's most useful as a singleton so you could do this:

```javascript
goog.require('mvc.Mediator');

/**
 * @constructor
 * @extends {mvc.Mediator}
 */
myapp.Mediator=function(){};
goog.inherits(myapp.Mediator, mvc.Mediator);
goog.addSingletonGetter(myapp.Mediator);

// you can then access the mediator anywhere in your app using:
// mvc.Mediator.getInstance();
```

you can then register your object with the mediator and the messages that you may pass. This allows other modules that are listening for a specific message to run some initiation, or dispose when you unregister. You can listen to messages using the on method and stop using the off method. You can even test to see if anyone is listening for a message using the isListened method

## Testing ##

To run tests you need to run plovr. From the root:

    java -jar plovr/plovr.jar serve plovr/test.js

you can then run the tests by going to:

    http://localhost:9810

### changelog ###

### v1.0 beta ###

- more tests
- fix behaviour for prev and revert
- add binding methods and cleanup on mvc.Control
- add in bindAdd and bindRemove on mvc.Collection & Control

### v1.0a ###

- alpha release
- put tests in their own folder (they'll be broken - that's why this is alpha)
- redo the README
- new name
- tests with plovr
- add in comparison ability for schema
- more comments
- fix parsing schema functions
- fix add and remove array of models
- can use - instead of . for classname selector
- added anyModelChange function

#### v0.9 ####

- reworked bind for performance
- schema is now an object
- mvc.Control events can now be given a priority to order them
- more tests
- files pass closure linter in strict mode
- can unbind listeners on collection model change
- getBinder reworked so can use as getter and setters
- control.on accepts a function as well as classname to define see if a handler should run

#### v0.8 ####

- lots of fixes
- can reset models
- passes JSHint
- routes can have square brackets for optional components
- change function to fire change events on mvc.Model
- ajax sync now has urlifyString

#### v0.7 ####

- add in mvc.Mediator
- schema now throws errors and handles them
- fixes

#### v0.6 ####

- split format function up to format, alias and meta
- changes fired for constructed attributes
- change the models constructor arguments to an options object
- store added

#### v0.5 ####

- add in format function on model
- removed dependency on goog.dom from mvc.Model
- put in convenience functions for binding elements with model attributes
- put in convenience function for schema test for type of object

#### v0.4 ####

- added pluck in to mvc.Collection
- fix sorting on models passed in at creation
- added in all_tests.html
- fixed mvc.Router
- tests for mvc.Router

#### v0.3 ####

- add dispose() to mvc.Model
- fix mvc.AjaxSync

#### v0.2 ####

- fix model.Schema
- mvc.Collection now takes optional index for add()
- mvc.Collection.newModel adds a new model to the collection
- mvc.AjaxSync first implementation
- mvc.AjaxSync first implementation

#### v0.1 ####

- initial documentation and versioning
