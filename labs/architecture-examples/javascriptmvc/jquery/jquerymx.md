@page jquerymx jQueryMX
@parent index 0
@description jQuery Model View Controller and extensions.

jQueryMX is a collection of useful jQuery libraries that provide 
the missing functionality necessary to 
implement and organize large-scale jQuery applications. 

Every part of jQueryMX can be used stand-alone which keeps your 
app super light.  $.Model, $.View, and $.Controller are only 7kb minified and gzipped.  This
includs their $.String, $.Class, and destroyed-event dependencies.

If you are using [steal], simply steal the plugin you need like:

    steal('jquery/controller', function(){
      $.Controller('Tabs');
    })
    
Or, use the [http://javascriptmvc.com/builder.html download builder] to select 
the files you need.

jQueryMX is divided into four core areas:

  - DOM Helpers
  - Language Helpers
  - Special events
  - Model, View, Controller and Class ( Read [mvc the walkthrough] )
 
The following highlights jQueryMX's functionality.

## DOM Helpers

[dom DOM helpers] extend jQuery with extra functionality for 
manipulating the DOM. For example, [dimensions] lets you set the 
outer width and height of elements like:

    $('#foo').outerWidth(500);
    
THe following are the other dom plugins:

  - [jQuery.cookie Cookie] - Set and get cookie values.
  - [jQuery.fixture Fixture] - Simulate Ajax responses.
  - [jQuery.fn.closest Closest] - Use the open child selector in event delegation.
  - [jQuery.fn.compare Compare] - Compare the location of two elements rapidly.
  - [jQuery.fn.curStyles CurStyles] - Get multiple css properties quickly.
  - [jQuery.fn.formParams FormParams] - Serializes a form into a JSON-like object.
  - [jQuery.fn.selection Selection] - Gets or sets the current text selection.
  - [jQuery.fn.within Within] - Returns elements that have a point within their boundaries.
  - [jQuery.Range Range] - Text range utilities.
  - [jQuery.route] - Routes for history-enabled ajax apps.

## Special Events

jQueryMX comes packed with jQuery [specialevents special events] and event helpers.

  - [jQuery.Drag Drag] - Delegatable drag events.
  - [jQuery.Drop Drop] - Delegatable drop events.
  - [jQuery.Hover Hover] - Delegatable hover events.
  - [jQuery.event.special.destroyed Destroyed] - Know when an element is removed from the page.
  - [jQuery.event.special.resize Resize] - Listen to resize events on any element.
  - [jQuery.event.swipe Swipe] - Delegatable swipe events.
  - [jQuery.Event.prototype.key Key] - Get the character from a key event.
  - [jQuery.event.special.default Default] - Provide default behaviors for events.
  - [jquery.event.pause Pause-Resume] - Pause and resume event propagation.


## Language Helpers

Language helpers make it easy to perform various functions on
JavaScript data.  

  - [jQuery.Object Object] - compare objects and sets
  - [jQuery.Observe Observe] - Listen to changes in JS Objects and Arrays
  - [jQuery.String String] - String helpers
  - [jQuery.toJSON toJSON] - create and convert JSON strings
  - [jQuery.Vector Vector] - vector math

## $.Class

[jQuery.Class $.Class] provides simple prototypal 
inheritance.  It's used by [jQuery.Controller $.Controller] and 
[jQuery.Model $.Model].

    // create a Monster Class
	$.Class("Monster",
	// static methods 
	{
	
	  // a list of all monsters
	  monsters : []
	},
	// prototype methods
	{
	
	  // called when a new monster is created
	  init : function(name){
	  
	    // stores a reference to the name
	    this.name = name;
	    
	    // adds this monster to the collection of monsters
	    this.Class.monsters.push(this);
	  },
	  
	  // a method on monsters
	  speak : function(){
	    alert(this.name + " says hello.");
	  }
	});
	
	// create a monster
    var hydra = new Monster("hydra");	

    // call a method on a monster
	hydra.speak();

## $.Model

[jQuery.Model $.Model] encapsulates the service and data layer.  The following connects to a JSON REST service
and adds a helper to let us know if we can destroy a task:

    $.Model("Task",{
      findAll : "GET /tasks.json",
      findOne : "GET /tasks/{id}.json",
      create  : "POST /tasks.json",
      update  : "PUT /tasks/{id}.json",
      destroy : "DELETE /tasks/{id}.json"
    },{
      canDestroy : function(){
        return this.acl.indexOf('w') > -1
      }
    });

Assuming '/tasks.json' returns a JSON array like ...

    [{
      "id"       : 1,
      "name"     : "take out trash",
      "acl"      : "rw",
      "createdAt": 1303000731164 // April 16 2011
    },
    {
      "id"       : 2,
      "name"     : "do the dishes",
      "acl"      : "r" ,
      "createdAt": 1303087131164 // April 17 2011
    }]

... the following will retrieve all tasks from the server and 
then destroy tasks that the user is able to destroy:

    Task.findAll({}, function(tasks){
      for(var i =0; i < tasks.length; i++){
       
        var task = tasks[i];
        
        if( task.canDestroy() ){
          task.destroy();
        }
      }
    });

Model has a number of other useful features such as:

<ul>
  <li><p>Listening to [jquery.model.events events].</p>
@codestart
// listen to name changes on a task
task.bind("name", function(ev, newName){
   alert('task name = '+newName);
});

//change the task's name
task.attr('name', "laundry");

//listen for Tasks being created:
Task.bind("created", function(ev, newTask){
   // create newTask's html and add it to the page
});
@codeend
</li>
<li><p>[jquery.model.typeconversion Converting] raw data into more useful objects.</p>
@codestart
$.Model('Task', {
  convert  : {
    'date' : function(raw){
      return new Date(raw)
    }
  },
  attributes : {
    'createdAt' : 'date' 
  }
},{});

var task = new Task({ createdAt : 1303087131164});

// createdAt is now a date.
task.createdAt.getFullYear() // -> 2011
@codeend
</li>
<li><p>Methods and utilities on [jQuery.Model.List lists] of instances.</p>
@codestart
// define a task list
$.Model.List('Task.List',{

  // add a helper method to a collection of tasks
  canDestroyAll : function(){
    
    return this.grep(function(task){
      return task.canDestroy();
    }).length === this.length
  }
});

Task.findAll({}, function(tasks){

  //tasks is a Task.List
  tasks.canDestroyAll() //-> boolean
})
@codeend
</li>
<li><p>[http://api.jquery.com/category/deferred-object/ Deferreds]</p>
@codestart
// make 2 requests, and do something when they are 
// both complete

$.when( Task.findAll(), People.findAll() )
  .done(function(tasks, people){

  // do something cool!
})
@codeend
</li>
</ul>
    
## $.View

[jQuery.View $.View] is a template framework.  It allows 
you to use different template engines in the same way.  

The following requests tasks from the model, then
loads a template at <code>"task/views/tasks.ejs"</code>, 
renders it with tasks, and 
inserts the result in the <code>#tasks</code> element.

    Task.findAll( {}, function(tasks){
      
      $('#tasks').html( 'task/views/tasks.ejs', tasks );
    });

<code>tasks.ejs</code> might look like:

    <% $.each(this, function(task){  %>
      <li><%= task.name %></li>
    <% }) %>

$.View understands [http://api.jquery.com/category/deferred-object/ deferreds] so the following does the exact same thing!

     $('#tasks').html( 'task/views/tasks.ejs', Task.findAll() );

Any template engine can be used with $.View.  JavaScriptMVC comes with:

  - [jQuery.EJS]
  - [Jaml]
  - [Micro]
  - [jQuery.tmpl]

## $.Controller

[jQuery.Controller $.Controller] is a jQuery widget factory. The 
following creates a <code>$.fn.list</code> [jquery.controller.plugin plugin] that writes 
a message into an element:

    $.Controller( "List", {
      init: function( ) {
        this.element.text( this.options.message );
      }
    });

	// create the list
	$('#list').list({message: "Hello World"});

$.Controller lets you define [jQuery.Controller.static.defaults default options]:

    $.Controller( "List", {
      defaults: {
        message : "I am list"
      }
    },{
      init: function( ) {
        this.element.text( this.options.message );
      }
    });

    // create's a list that writes "I am list"
	$('#list').list();

Controller's best feature is that it organizes your event handlers, and 
makes [jquery.controller.listening binding and unbinding] event 
handlers extremely easy. The following listens for clicks on an
<code>LI</codE> elements and alerts the element's text:

    $.Controller( "TaskList", {
      init: function(){
        // uses a view to render tasks
        this.element.html( "tasks.ejs", Task.findAll() );
      },
      "li click": function(el){
        alert( el.text() );
      }
    });

Controller makes it easy to parameterize event binding.  The following 
listens for tasks being created and inserts them into the list:

    $.Controller( "TaskList", {
      init: function( ) {
        // uses a view to render tasks
        this.element.html("tasks.ejs", Task.findAll());
      },
      "{Task} created": function( Task, ev, newTask ) {
        this.element.append( "tasks.ejs", [newTask] );
      }
    });

Finally, this makes it very easy to create widgets that work with any model:

    $.Controller( "List", {
      init: function(){
        // uses a view to render tasks
        this.element.html( this.options.view, 
                           this.options.model.findAll( ));
      },
      "{model} created": function( Model, ev, instance ){
        this.element.append( this.options.view, [instance] );
      }
    });
    
    $("#tasks").list({ model: Task, view: 'tasks.ejs' });
    $("#people").list({model: Person, view: 'people.ejs' });




  
  