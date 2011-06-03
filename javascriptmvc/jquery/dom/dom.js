/**
@page dom DOM Helpers
@tag core
JavaScriptMVC adds a bunch of useful 
jQuery extensions for the dom.  Check them out on the left. 

## [dimensions Dimensions]

Set and animate the inner and outer height and width of elements.

    $('#foo').outerWidth(100);
    $('#bar').animate({innerWidth: 500});

This is great when you want to include padding and margin in
setting the dimensions of elements.

## [jQuery.cookie Cookie]

Set and get cookie values:

    $.cookie('cookie','value');
    
## [jQuery.fixture Fixture]

Simulate Ajax responses.

    $.fixture("/services/tasks.php','fixtures/tasks.json');
    
Works with jQuery's Ajax converters!

## [jQuery.fn.compare Compare]

Compare the location of two elements rapidly.

    $('#foo').compare($('#bar')) & 2 // true if #bar is before #foo
    
## [jQuery.fn.curStyles CurStyles]

Get multiple css properties quickly.

    $('#foo').curStyles('left','top') //-> {left:'20px',top:'10px'}

## [jQuery.fn.formParams FormParams]

Serializes a form into a JSON-like object:

    $('form').formParams() //-> {name: 'Justin', favs: ['JS','Ruby']}
    
## [jQuery.fn.selection Selection]

Gets or sets the current text selection.

    // gets selection info
    $('pre').selection() //-> {start: 22, end: 57, range: range}
    
    // sets the selection
    $('div').selection(20,22)

## [jQuery.fn.within Within]

Returns elements that have a point within their boundaries.

    $('.drop').within(200,200) //-> drops that touch 200,200
    
## [jQuery.Range Range]

Text range utilities.

    $('#copy').range() //-> text range that has copy selected
    

*/
steal.plugins('jquery');