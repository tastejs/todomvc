#import('dart:html');

int ENTER_KEY = 13;

void main() {
  Todo todo = new Todo();
  todo.done = true;
  todo.content = "test";

  final node = new Element.html('''
    <div class="todo ${todo.done ? 'done' : ''}">
      <div class="display">
        <input class="check" type="checkbox" ${todo.done ? 'checked="checked"' : ''}/>
        <label class="todo-content">${todo.content}</label>
        <span class="todo-destroy"></span>
      </div>
      <div class="edit">
        <input class="todo-input" type="text" value="${todo.content}" />
      </div>
    </div>
  ''');
  
  query("#new-todo").on.keyPress.add((KeyboardEvent e) {
    if(e.keyIdentifier == KeyName.ENTER) {
      document.body.nodes.add(node);
    }
  });
}

/*
<% if (total) { %>
<span class="todo-count">
<span class="number"><%= remaining %></span>
<span class="word"><%= remaining == 1 ? 'item' : 'items' %></span> left.
    </span>
<% } %>
<% if (done) { %>
<span class="todo-clear">
<a href="#">
Clear <span class="number-done"><%= done %></span>
completed <span class="word-done"><%= done == 1 ? 'item' : 'items' %></span>
</a>
</span>
<% } %>
*/

class Todo {
  String content;
  bool done;
  
  void toggle() {
    done = !done;
  }
}