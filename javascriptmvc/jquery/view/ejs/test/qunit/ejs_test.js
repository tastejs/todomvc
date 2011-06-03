module("jquery/view/ejs, rendering",{
	setup : function(){

		this.animals = ['sloth', 'bear', 'monkey']
		if(!this.animals.each){
			this.animals.each = function(func){
				for(var i =0; i < this.length; i++){
					func(this[i])
				}
			}
		}
		
		this.squareBrackets = "<ul>[% this.animals.each(function(animal){%]" +
		               "<li>[%= animal %]</li>" + 
			      "[%});%]</ul>"
	    this.squareBracketsNoThis = "<ul>[% animals.each(function(animal){%]" +
		               "<li>[%= animal %]</li>" + 
			      "[%});%]</ul>"
	    this.angleBracketsNoThis  = "<ul><% animals.each(function(animal){%>" +
		               "<li><%= animal %></li>" + 
			      "<%});%></ul>";

	}
})
test("render with left bracket", function(){
	var compiled = new $.EJS({text: this.squareBrackets, type: '['}).render({animals: this.animals})
	equals(compiled, "<ul><li>sloth</li><li>bear</li><li>monkey</li></ul>", "renders with bracket")
})
test("render with with", function(){
	var compiled = new $.EJS({text: this.squareBracketsNoThis, type: '['}).render({animals: this.animals}) ;
	equals(compiled, "<ul><li>sloth</li><li>bear</li><li>monkey</li></ul>", "renders bracket with no this")
})
test("default carrot", function(){
	var compiled = new $.EJS({text: this.angleBracketsNoThis}).render({animals: this.animals}) ;

	equals(compiled, "<ul><li>sloth</li><li>bear</li><li>monkey</li></ul>")
})
test("render with double angle", function(){
	var text = "<%% replace_me %>"+
			  "<ul><% animals.each(function(animal){%>" +
	               "<li><%= animal %></li>" + 
		      "<%});%></ul>";
	var compiled = new $.EJS({text: text}).render({animals: this.animals}) ;
	equals(compiled, "<% replace_me %><ul><li>sloth</li><li>bear</li><li>monkey</li></ul>", "works")
});

test("comments", function(){
	var text = "<%# replace_me %>"+
			  "<ul><% animals.each(function(animal){%>" +
	               "<li><%= animal %></li>" + 
		      "<%});%></ul>";
	var compiled = new $.EJS({text: text}).render({animals: this.animals}) ;
	equals(compiled,"<ul><li>sloth</li><li>bear</li><li>monkey</li></ul>" )
});

test("multi line", function(){
	var text = "a \n b \n c",
		result = new $.EJS({text: text}).render({}) ;
		
	equals(result, text)
})

test("escapedContent", function(){
	var text = "<span><%~ tags %></span><label>&amp;</label><input value='<%~ quotes %>'/>";
	var compiled = new $.EJS({text: text}).render({tags: "foo < bar < car > zar > poo",
							quotes : "I use 'quote' fingers \"a lot\""}) ;
	
	var div = $('<div/>').html(compiled)
	equals(div.find('span').text(), "foo < bar < car > zar > poo" );
	equals(div.find('input').val(), "I use 'quote' fingers \"a lot\"" )
	equals(div.find('label').html(), "&amp;" )
	
})
//test("multi line sourc")
