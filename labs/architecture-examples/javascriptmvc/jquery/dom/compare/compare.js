/**
 *  @add jQuery.fn
 */
steal('jquery/dom').then(function($){
/**
 * @function compare
 * @parent dom
 * @download http://jmvcsite.heroku.com/pluginify?plugins[]=jquery/dom/compare/compare.js 
 * 
 * Compares the position of two nodes and returns a bitmask detailing how they are positioned 
 * relative to each other.  
 * 
 *     $('#foo').compare($('#bar')) //-> Number
 * 
 * You can expect it to return the same results as 
 * [http://www.w3.org/TR/DOM-Level-3-Core/core.html#Node3-compareDocumentPosition | compareDocumentPosition].
 * Parts of this documentation and source come from [http://ejohn.org/blog/comparing-document-position | John Resig].
 * 
 * ## Demo
 * @demo jquery/dom/compare/compare.html
 * @test jquery/dom/compare/qunit.html
 * @plugin dom/compare
 * 
 * 
 * @param {HTMLElement|jQuery}  element an element or jQuery collection to compare against.
 * @return {Number} A bitmap number representing how the elements are positioned from each other.
 * 
 * If the code looks like:
 * 
 *     $('#foo').compare($('#bar')) //-> Number
 * 
 * Number is a bitmap with with the following values:
 * <table class='options'>
 *     <tr><th>Bits</th><th>Number</th><th>Meaning</th></tr>
 *     <tr><td>000000</td><td>0</td><td>Elements are identical.</td></tr>
 *     <tr><td>000001</td><td>1</td><td>The nodes are in different 
 *     				documents (or one is outside of a document).</td></tr>
 *     <tr><td>000010</td><td>2</td><td>#bar precedes #foo.</td></tr>
 *     <tr><td>000100</td><td>4</td><td>#foo precedes #bar.</td></tr>
 *     <tr><td>001000</td><td>8</td><td>#bar contains #foo.</td></tr>
 *     <tr><td>010000</td><td>16</td><td>#foo contains #bar.</td></tr>
 * </table>
 */
jQuery.fn.compare = function(element){ //usually 
	//element is usually a relatedTarget, but element/c it is we have to avoid a few FF errors
	
	try{ //FF3 freaks out with XUL
		element = element.jquery ? element[0] : element;
	}catch(e){
		return null;
	}
	if (window.HTMLElement) { //make sure we aren't coming from XUL element

		var s = HTMLElement.prototype.toString.call(element)
		if (s == '[xpconnect wrapped native prototype]' || s == '[object XULElement]' || s === '[object Window]') {
			return null;
		}

	}
	if(this[0].compareDocumentPosition){
		return this[0].compareDocumentPosition(element);
	}
	if(this[0] == document && element != document) return 8;
	var number = (this[0] !== element && this[0].contains(element) && 16) + (this[0] != element && element.contains(this[0]) && 8),
		docEl = document.documentElement;
	if(this[0].sourceIndex){
		number += (this[0].sourceIndex < element.sourceIndex && 4)
		number += (this[0].sourceIndex > element.sourceIndex && 2)
		number += (this[0].ownerDocument !== element.ownerDocument ||
			(this[0] != docEl && this[0].sourceIndex <= 0 ) ||
			(element != docEl && element.sourceIndex <= 0 )) && 1
	}else{
		var range = document.createRange(), 
			sourceRange = document.createRange(),
			compare;
		range.selectNode(this[0]);
		sourceRange.selectNode(element);
		compare = range.compareBoundaryPoints(Range.START_TO_START, sourceRange);
		
	}

	return number;
}

});