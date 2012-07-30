//steal/js todo/scripts/compress.js

load("steal/rhino/rhino.js");
steal('steal/clean',function(){
	steal.clean('todo/todo.html',{indent_size: 1, indent_char: '\t'});
});
