## 3.1 Backlog - Deferreds

jQuery 1.6 brought Deferred support.  They are a great feature
that promise to make a lot of asynchronous functionality 
easier to write and manage. But, many people struggle 
with uses other than 'waiting for a bunch of Ajax requests to complete'. For 3.1, we 
identified an extremely common, but annoying, practice that becomes
a one-liner with deferreds: loading data and a template and rendering the
result into an element.

## Templates Consume Deferreds

Here's what that looks like in 3.1:

    $('#todos').html('temps/todos.ejs', $.get('/todos',{},'json') );
    
This will make two parallel ajax requests.  One request 
is made for the template at `temps/todos.ejs` which might look like:

<pre><code>&lt;% for(var i =0; i< this.length; i++) { %>
  &lt;li>&lt;%= this[i].name %>&lt;/li>
&lt;% } %>
</code></pre>

The second request loads `/todos` which might look like:

    [
        {"id" : 1, "name": "Take out the Trash"},
        {"id" : 2, "name": "Do the Laundry"}
    ]

When both have been loaded, the template is rendered with the todos data and
the result set as the `#todos` element's innerHTML.  

This is fab fast! The AJAX and template request are made in parallel and rendered
when both are complete.  I am too lazy to write 
out what this would look like before deferreds.  Actually, I'm not too lazy:

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

## Conclusion

Despite using templates, this is 
still 'waiting for a bunch of Ajax requests to complete'.  Does 
anyone have other good uses for deferreds?
