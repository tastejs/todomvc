@page jquery.controller.plugin The generated jQuery plugin
@parent jQuery.Controller

When you create a controller, it creates a jQuery plugin that can be
used to:

  - Create controllers on an element or elements
  - Call controller methods
  - Update a controller

For example, the following controller:

    $.Controller("My.Widget",{
      say : function(){
         alert(this.options.message);
      }
    })
    
creates a <code>jQuery.fn.my_widget</code> method that you can use like:

    // create my_widget on each .thing
    $(".thing").my_widget({message : "Hello"}) 
    
    // alerts "Hello"
    $(".thing").my_widget("say");

	// updates the message option
	$(".thing").my_widget({message : "World"});
	
	// alerts "World"
    $(".thing").my_widget("say");
    
Note that in every case, the my_widget plugin
returns the original jQuery collection for chaining (<code>$('.thing')</code>).  If you want to
get a value from a controller, use the [jQuery.fn.controllers] or [jQuery.fn.controller].

## Creating controllers

When a controller's jQuery plugin helper is used on a jQuery collection, it goes to each 
element and tests if it has a controller instance on the element.  If it does not, it creates one.

It calls <code>new YourController</code> with the element and any additional arguments you passed 
to the jQuery plugin helper.  So for example, say there are 2 elements in <code>$('.thing')</code>.

This:

    $(".thing").my_widget({message : "Hello"})
    
Does the exact same thing as:

    var things = $('.thing'),
        options = {message : "Hello"};
    new My.Widget(things[0],options);
    new My.Widget(things[1],options);

Note, when a <code>new Class</code> is created, it calls your 
class's prototype setup and init methods. Read [jQuery.Controller.prototype.setup controller's setup] 
for the details on what happens when a new controller is created.


## Calling methods on controllers

Once a Controller is already on an element, you can call methods on it with the same jQuery
helper.  The first param to the helper is the name of the method, the following params are 
passed to the jQuery function.  For example:

    $.Controller("Adder",{
      sum : function(first, second, third){
         this.element.text(first+second+third);
      }
    })
    
    // add an adder to the page
    $("#myadder").adder()
    
    // show the sum of 1+2+3
    $("#myadder").adder("sum",1,2,3);

## Naming

By default, a controller's jQuery helper is the controller name:

   - [jQuery.String.underscore underscored]
   - "." replaced with "_"
   - with Controllers removed.

Here are some examples:

    $.Controller("Foo")                 // -> .foo()
    $.Controller("Foo.Bar")             // -> .foo_bar()
    $.Controller("Foo.Controllers.Bar") // -> .foo_bar()

You can overwrite the Controller's default name by setting a static pluginName property:

    $.Controller("My.Tabs",
    {
      pluginName: "tabs"
    },
    { ... })
    
    $("#tabs").tabs()
