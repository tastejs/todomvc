load('steal/rhino/steal.js')
steal('//steal/test/test', function( s ) {

	//test options
	var res = s.opts("-n abc def -other foo", {
		name: {
			shortcut: "-n",
			args: ["first", "second"]
		},
		other: 1
	})

	s.test.ok(res.name)
	s.test.ok(res.name[0] == "abc")
	s.test.ok(res.name[1] == "def")
})