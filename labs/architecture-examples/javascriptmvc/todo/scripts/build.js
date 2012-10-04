//steal/js todo/scripts/compress.js

load("steal/rhino/rhino.js");
steal('steal/build','steal/build/scripts','steal/build/styles',function(){
	steal.build('todo/scripts/build.html',{to: 'todo'});
});
