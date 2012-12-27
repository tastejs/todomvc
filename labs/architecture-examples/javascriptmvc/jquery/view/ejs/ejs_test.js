steal('funcunit/qunit','jquery/view/ejs', function(){
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
	var text = "<span><%= tags %></span><label>&amp;</label><strong><%= number %></strong><input value='<%= quotes %>'/>";
	var compiled = new $.EJS({text: text}).render({tags: "foo < bar < car > zar > poo",
							quotes : "I use 'quote' fingers \"a lot\"",
							number : 123}) ;
	
	var div = $('<div/>').html(compiled)
	equals(div.find('span').text(), "foo < bar < car > zar > poo" );
	equals(div.find('strong').text(), 123 );
	equals(div.find('input').val(), "I use 'quote' fingers \"a lot\"" );
	equals(div.find('label').html(), "&amp;" );
})

test("unescapedContent", function(){
	var text = "<span><%== tags %></span><div><%= tags %></div><input value='<%== quotes %>'/>";
	var compiled = new $.EJS({text: text}).render({tags: "<strong>foo</strong><strong>bar</strong>",
							quotes : "I use &#39;quote&#39; fingers &quot;a lot&quot;"}) ;
	
	var div = $('<div/>').html(compiled)
	equals(div.find('span').text(), "foobar" );
	equals(div.find('div').text().toLowerCase(), "<strong>foo</strong><strong>bar</strong>" );
	equals(div.find('span').html().toLowerCase(), "<strong>foo</strong><strong>bar</strong>" );
	equals(div.find('input').val(), "I use 'quote' fingers \"a lot\"" );
});

test("returning blocks", function(){
	var somethingHelper = function(cb){
		return cb([1,2,3,4])
	}
	
	var res = $.View("//jquery/view/ejs/test_template.ejs",{something: somethingHelper, 
		items: ['a','b']});
	// make sure expected values are in res
	ok(/\s4\s/.test(res), "first block called" );
	equals(res.match(/ItemsLength4/g).length, 4, "innerBlock and each")
});

test("easy hookup", function(){
	var div = $('<div/>').html("//jquery/view/ejs/easyhookup.ejs",{text: "yes"})
	ok( div.find('div').hasClass('yes'), "has yes" )
});

test("helpers", function() {
	$.EJS.Helpers.prototype.simpleHelper = function()
	{
		return 'Simple';
	}
	
	$.EJS.Helpers.prototype.elementHelper = function()
	{
		return function(el) {
			el.innerHTML = 'Simple';
		}
	}
	
	var text = "<div><%= simpleHelper() %></div>";
	var compiled = new $.EJS({text: text}).render() ;
	equals(compiled, "<div>Simple</div>");
	
	text = "<div id=\"hookup\" <%= elementHelper() %>></div>";
	compiled = new $.EJS({text: text}).render() ;
	$('#qunit-test-area').append($(compiled));
	equals($('#hookup').html(), "Simple");
});

})
