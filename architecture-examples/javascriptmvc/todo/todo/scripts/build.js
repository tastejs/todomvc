//steal/js todo/scripts/compress.js

load("steal/rhino/steal.js");
steal.plugins('steal/build','steal/build/scripts','steal/build/styles',function(){
	steal.build('todo/todo/scripts/build.html',{to: 'todo/todo'});
});
