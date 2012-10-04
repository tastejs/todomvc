@page jquery.controller.listening Listening To Events
@parent jQuery.Controller

Controllers make creating and tearing down event handlers extremely
easy.  The tearingdown of event handlers is especially important
in preventing memory leaks in long lived applications.

## Automatic Binding

When a [jQuery.Controller.prototype.setup new controller is created],
contoller checks its prototype methods for functions that are named like 
event handlers.  It binds these functions to the 
controller's [jQuery.Controller.prototype.element element] with 
event delegation.  When
the controller is destroyed (or it's element is removed from the page), controller
will unbind its event handlers automatically.

For example, each of the following controller's functions will automatically
bound:

    $.Controller("Crazy",{
    
      // listens to all clicks on this element
      "click" : function(el, ev){},
      
      // listens to all mouseovers on 
      // li elements withing this controller
      "li mouseover" : function(el, ev){}
      
      // listens to the window being resized
      "{window} resize" : function(window, ev){}
    })

Controller will bind function names with spaces, standard DOM events, and 
event names in $.event.special.

In general, Controller will know automatically when to bind event handler functions except for 
one case - event names without selectors that are not in $.event.special.

But to correct for this, you just need to add the 
function to the [jQuery.Controller.static.listensTo listensTo] 
property.  Here's how:

	 $.Controller("MyShow",{
	   listensTo: ["show"]
	 },{
	   show: function( el, ev ) {
	     el.show();
	   }
	 })
	 $('.show').my_show().trigger("show");

## Callback parameters

Event handlers bound with controller are called back with the element and the event 
as parameters.  <b>this</b> refers to the controller instance.  For example:

    $.Controller("Tabs",{
    
      // li - the list element that was clicked
      // ev - the click event
      "li click" : function(li, ev){
         this.tab(li).hide()
      },
      tab : function(li){
        return $(li.find("a").attr("href"))
      }
    })

## Templated Event Bindings

One of Controller's most powerful features is templated event 
handlers.  You can parameterize the event name,
the selector, or event the root element.

### Templating event names and selectors:

Often, you want to make a widget's behavior 
configurable. A common example is configuring which event
a menu should show a sub-menu (ex: on click or mouseenter).  The 
following controller lets you configure when a menu should show 
sub-menus:

The following makes two buttons.  One says hello on click, 
the other on a 'tap' event.

    $.Controller("Menu",{
      "li {showEvent}" : function(el){
        el.children('ul').show()
      }
    })
    
    $("#clickMe").menu({showEvent : "click"});
    $("#touchMe").menu({showEvent : "mouseenter"});

$.Controller replaces value in <code>{}</code> with 
values in a 
controller's [jQuery.Controller.prototype.options options]. This means
we can easily provide a default <code>showEvent</code> value and create
a menu without providing a value like:

    $.Controller("Menu",
    {
      defaults : {
        showEvent : "click"
      }
    },
    {
      "li {showEvent}" : function(el){
        el.children('ul').show()
      }
    });
    
    $("#clickMe").menu(); //defaults to using click

Sometimes, we might might want to configure our widget to 
use different elements.  The following makes the menu widget's
<code>button</code> elements configurable:

    $.Controller("Menu",{
      "{button} {showEvent}" : function(el){
        el.children('ul').show()
      }
    })

    $('#buttonMenu').menu({button: "button"});

### Templating the root element.

Finally, controller lets you bind to objects outside 
of the [jQuery.Controller.prototype.element controller's element].

The following listens to clicks on the window:

    $.Controller("HideOnClick",{
      "{window} click" : function(){
        this.element.hide()
      }
    })

The following listens to Todos being created:

    $.Controller("NewTodos",{
      "{App.Models.Todo} created" : function(Todo, ev, newTodo){
        this.element.append("newTodos.ejs", newTodo)
      }
    });

But instead of making NewTodos only work with the Todo model,
we can make it configurable:

    $.Controller("Newbie",{
      "{model} created" : function(Model, ev, newItem){
        this.element.append(this.options.view, newItem)
      }
    });

    $('#newItems').newbie({
      model: App.Models.Todo,
      view: "newTodos.ejs"
    })
    
### How Templated events work

When looking up a value to replace <code>{}</code>,
controller first looks up the item in the options, then it looks
up the value in the window object.  It does not use eval to look up the
object.  Instead it uses [jQuery.String.getObject].


## Subscribing to OpenAjax messages and custom bindings

The jquery/controller/subscribe plugin allows controllers to listen
to OpenAjax.hub messages like:

    $.Controller("Listener",{
      "something.updated subscribe" : function(called, data){
      
      }
    })

You can create your own binders by adding to [jQuery.Controller.static.processors].

## Manually binding to events.

The [jQuery.Controller.prototype.bind] and [jQuery.Controller.prototype.delegate]
methods let you listen to events on other elements.  These event handlers will
be unbound when the controller instance is destroyed.

