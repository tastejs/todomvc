
steal.plugins('jquery/dom/cur_styles').then(function($) {
/**
 * @page dimensions dimensions
 * @parent dom
 * <h1>jquery/dom/dimensions <span class="Constructor type">Plugin</span></h1>
 * The dimensions plugin adds support for setting+animating inner+outer height and widths.
 * <h3>Quick Examples</h3>
@codestart
$('#foo').outerWidth(100).innerHeight(50);
$('#bar').animate({outerWidth: 500});
@codeend
 * <h2>Use</h2>
 * <p>When writing reusable plugins, you often want to 
 * set or animate an element's width and height that include its padding,
 * border, or margin.  This is especially important in plugins that
 * allow custom styling.
 * The dimensions plugin overwrites [jQuery.fn.outerHeight outerHeight],
 * [jQuery.fn.outerWidth outerWidth], [jQuery.fn.innerHeight innerHeight] 
 * and [jQuery.fn.innerWidth innerWidth]
 * to let you set and animate these properties.
 * </p>
 * <h2>Demo</h2>
 * @demo jquery/dom/dimensions/dimensions.html
 */

var weird = /button|select/i, //margin is inside border
	getBoxes = {},
    checks = {
        width: ["Left", "Right"],
        height: ['Top', 'Bottom'],
        oldOuterHeight: $.fn.outerHeight,
        oldOuterWidth: $.fn.outerWidth,
        oldInnerWidth: $.fn.innerWidth,
        oldInnerHeight: $.fn.innerHeight
    };
/**
 *  @add jQuery.fn
 */
$.each({ 

/*
 * @function outerWidth
 * @parent dimensions
 * Lets you set the outer height on an object
 * @param {Number} [height] 
 * @param {Boolean} [includeMargin]
 */
width: 
/*
 * @function innerWidth
 * @parent dimensions
 * Lets you set the inner height of an object
 * @param {Number} [height] 
 */
"Width", 
/*
 * @function outerHeight
 * @parent dimensions
 * Lets you set the outer height of an object where: <br/> 
 * <code>outerHeight = height + padding + border + (margin)</code>.  
 * @codestart
 * $("#foo").outerHeight(100); //sets outer height
 * $("#foo").outerHeight(100, true); //uses margins
 * $("#foo").outerHeight(); //returns outer height
 * $("#foo").outerHeight(true); //returns outer height with margins
 * @codeend
 * When setting the outerHeight, it adjusts the height of the element.
 * @param {Number|Boolean} [height] If a number is provided -> sets the outer height of the object.<br/>
 * If true is given ->  returns the outer height and includes margins.<br/>
 * If no value is given -> returns the outer height without margin.
 * @param {Boolean} [includeMargin] Makes setting the outerHeight adjust for margin.
 * @return {jQuery|Number} If you are setting the value, returns the jQuery wrapped elements.
 * Otherwise, returns outerHeight in pixels.
 */
height: 
/*
 * @function innerHeight
 * @parent dimensions
 * Lets you set the outer width on an object
 * @param {Number} [height] 
 */
"Height" }, function(lower, Upper) {

    //used to get the padding and border for an element in a given direction
    getBoxes[lower] = function(el, boxes) {
        var val = 0;
        if (!weird.test(el.nodeName)) {
            //make what to check for ....
            var myChecks = [];
            $.each(checks[lower], function() {
                var direction = this;
                $.each(boxes, function(name, val) {
                    if (val)
                        myChecks.push(name + direction+ (name == 'border' ? "Width" : "") );
                })
            })
            $.each($.curStyles(el, myChecks), function(name, value) {
                val += (parseFloat(value) || 0);
            })
        }
        return val;
    }

    //getter / setter
    $.fn["outer" + Upper] = function(v, margin) {
        if (typeof v == 'number') {
            this[lower](v - getBoxes[lower](this[0], {padding: true, border: true, margin: margin}))
            return this;
        } else {
            return checks["oldOuter" + Upper].call(this, v)
        }
    }
    $.fn["inner" + Upper] = function(v) {
        if (typeof v == 'number') {
            this[lower](v - getBoxes[lower](this[0], { padding: true }))
            return this;
        } else {
            return checks["oldInner" + Upper].call(this, v)
        }
    }
    //provides animations
	var animate = function(boxes){
		return function(fx){
			if (fx.state == 0) {
	            fx.start = $(fx.elem)[lower]();
	            fx.end = fx.end - getBoxes[lower](fx.elem,boxes);
	        }
	        fx.elem.style[lower] = (fx.pos * (fx.end - fx.start) + fx.start) + "px"
		}
	}
    $.fx.step["outer" + Upper] = animate({padding: true, border: true})
	
	$.fx.step["outer" + Upper+"Margin"] =  animate({padding: true, border: true, margin: true})
	
	$.fx.step["inner" + Upper] = animate({padding: true})

})

})
