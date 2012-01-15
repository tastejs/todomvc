module("todo test", { 
	setup: function(){
		S.open("//todo/todo.html");
	}
});

test("created a todo", function(){
    S("#todos input.create").click()
        .type('take out trash\r');
    S("#list li.todo").visible(function(val){
        equal(S('#list span:eq(0)').text(), "take out trash", "todo created");
    }); 
})
