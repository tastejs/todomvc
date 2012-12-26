load('steal/rhino/rhino.js')
steal('steal/test', function( s ) {

	s.test.test("options", function(t){
		
		//test options
		var res = s.opts("-n abc def -other foo", {
			name: {
				shortcut: "-n",
				args: ["first", "second"]
			},
			other: 1
		})
	
		t.ok(res.name)
		t.ok(res.name[0] == "abc")
		t.ok(res.name[1] == "def")
		
	})

})