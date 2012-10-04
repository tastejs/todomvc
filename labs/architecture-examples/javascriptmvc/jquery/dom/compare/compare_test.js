steal("jquery/dom/compare")  //load your app
 .then('funcunit/qunit').then(function(){

module("jquery/dom/compare")
test("Compare cases", function(){
    $(document.body).append("<div id='outer'><div class='first'></div><div class='second'></div>")
    var outer = $("#outer"), 
		first= outer.find(".first"), second = outer.find('.second')
    equals(outer.compare(outer) , 0, "identical elements")
    var outside = document.createElement("div")
    ok(outer.compare(outside) & 1, "different documents")
    
    equals(outer.compare(first), 20, "A container element");
    equals(outer.compare(second), 20, "A container element");
    
    equals(first.compare(outer), 10, "A parent element");
    equals(second.compare(outer), 10, "A parent element");
    
    equals(first.compare(second), 4, "A sibling elements");
    equals(second.compare(first), 2, "A sibling elements");
    outer.remove()
});

});