@page view.deferreds Using Deferreds with Views
@parent jQuery.View 1

jQuery 1.6 brought [http://api.jquery.com/category/deferred-object/ Deferred] support.  They are a great feature that promise to make a lot of asynchronous functionality easier to write and manage. jQuery.View uses Deferreds to simplify a common but annoying task into a one-liner: loading data and a template and rendering the result into an element.

## Templates Consume Deferreds

Here's what rendering templates looks like with deferreds:

    $('#todos').html('temps/todos.ejs', $.get('/todos',{},'json') );
    
This will make two parallel ajax requests.  One request 
is made for the template at `temps/todos.ejs`:

<pre><code>&lt;% for(var i =0; i &lt; this.length; i++) { %>
  &lt;li>&lt;%= this[i].name %>&lt;/li>
&lt;% } %>
</code></pre>

The second request for `/todos` might respond with a JSON array:

    [
        {"id" : 1, "name": "Take out the Trash"},
        {"id" : 2, "name": "Do the Laundry"}
    ]

When both have been loaded, the template is rendered with the todos data.  The resulting HTML is placed in the `#todos` element.

This is fab fast! The AJAX and template request are made in parallel and rendered
when both are complete. Before deferreds, this was a lot uglier:

    var template,
    	data,
        done = function(){ 
           if( template && data ) { 
             var html = new EJS({text: template})
                                    .render(data);
             $('#todos').html( html )
           }
        }
    $.get('temps/todos.ejs', function(text){
      template = text;
      done();
    },'text')
    $.get('/todos',{}, function(json){
      data = json
      done();
    },'json')
    
## Models Return Deferreds

Model AJAX functions now return deferreds.  Creating models like:

    $.Model('User',{
      findAll: '/users'
    },{});
    
    $.Model('Todo',{
      findAll: '/todos'
    },{})
    
Lets you request todos and users and get back a deferred that can be 
used in functions that accept deferreds like $.when:

    $.when( User.findAll(), 
            Todo.findAll() )

Or $.View:

    $('#content').html('temps/content.ejs',{
      users : User.findAll(),
      todos: Todo.findAll()
    })