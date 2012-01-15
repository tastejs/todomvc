/*
@page jquery.model.events Events
@parent jQuery.Model

Models produce events that you can listen to.  This is
useful when there are multiple representations of the same instance on the page.
If one representation is updated, the other representation 
should be updated.
   
Events also provide a more traditional MVC approach.  View-Controllers
bind to a specific property.  If that property changes, the
View-Controller updates itself.

Model provides two ways to listen for events on model instances:

## Way 1: Bind

You can [jQuery.Model.prototype.bind bind] to attribute changes in a model instance
just like you would with events in jQuery.

The following listens for contact birthday changes.

@codestart
contact.bind("birthday", function(ev, birthday){
  // do something
})
@codeend

The 'birthday' event is triggered whenever an attribute is
successfully changed:

@codestart
contact.attr('birthday', "10-20-1982");
@codeend

Bind is the prefered approach if you're favoring a more
traditional MVC architecture.  However, this can sometimes
be more complex than the subscribe method because of
maintaining additional event handlers.

## Way 2: Subscribe

If OpenAjax.hub is available, Models also publish events when 
an instance is created, updated, or destroyed.

You can subscribe to these events with OpenAjax.hub like:

@codestart
OpenAjax.hub.subscribe(
  "contact.updated", 
  function(called, contact){
    //do something ...
})
@codeend

Typically, you'll subscribe with the
<code>jquery/controller/subscribe</code> plugin like:

@codestart
$.Controller.extend("Subscriber",{
  
  ...
  
  "todo.destroyed subscribe" : function(called, todo){
    
    //find the contact in this widget:
    var el = todo.elements(this.element)
	
    //remove element
    el.remove();
  },
  
  ...
})
@codeend


 */