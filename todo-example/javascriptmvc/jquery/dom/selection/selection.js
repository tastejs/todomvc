steal.plugins('jquery','jquery/dom/range').then(function($){
var convertType = function(type){
	return  type.replace(/([a-z])([a-z]+)/gi, function(all,first,  next){
			  return first+next.toLowerCase()	
			}).replace(/_/g,"");
},
reverse = function(type){
	return type.replace(/^([a-z]+)_TO_([a-z]+)/i, function(all, first, last){
		return last+"_TO_"+first;
	});
},
getWindow = function( element ) {
	return element ? element.ownerDocument.defaultView || element.ownerDocument.parentWindow : window
},
// A helper that uses range to abstract out getting the current start and endPos.
getElementsSelection = function(el, win){
	var current = $.Range.current(el).clone(),
		entireElement = $.Range(el).select(el);
	if(!current.overlaps(entireElement)){
		return null;
	}
	// we need to check if it starts before our element ...
	if(current.compare("START_TO_START", entireElement) < 1){
		startPos = 0;
		// we should move current ...
		current.move("START_TO_START",entireElement);
	}else{
		fromElementToCurrent =entireElement.clone();
		fromElementToCurrent.move("END_TO_START", current);
		startPos = fromElementToCurrent.toString().length
	}
	
	// now we need to make sure current isn't to the right of us ...
	if(current.compare("END_TO_END", entireElement) >= 0){
		endPos = entireElement.toString().length
	}else{
		endPos = startPos+current.toString().length
	}
	return {
		start: startPos,
		end : endPos
	};
},
getSelection = function(el){
	// use selectionStart if we can.
	var win = getWindow(el);
	
	if (el.selectionStart !== undefined) {

		if(document.activeElement 
		 	&& document.activeElement != el 
			&& el.selectionStart == el.selectionEnd 
			&& el.selectionStart == 0){
			return {start: el.value.length, end: el.value.length};
		}
		return  {start: el.selectionStart, end: el.selectionEnd}
	} else if(win.getSelection){
		return getElementsSelection(el, win)
	} else{

		try {
			//try 2 different methods that work differently
			// one should only work for input elements, but sometimes doesn't
			// I don't know why this is, or what to detect
			if (el.nodeName.toLowerCase() == 'input') {
				var real = getWindow(el).document.selection.createRange(), r = el.createTextRange();
				r.setEndPoint("EndToStart", real);
				
				var start = r.text.length
				return {
					start: start,
					end: start + real.text.length
				}
			}
			else {
				var res = getElementsSelection(el,win)
				if(!res){
					return res;
				}
				// we have to clean up for ie's textareas
				var current = $.Range.current().clone(),
					r2 = current.clone().collapse().range,
					r3 = current.clone().collapse(false).range;
				
				r2.moveStart('character', -1)
				r3.moveStart('character', -1)
				// if we aren't at the start, but previous is empty, we are at start of newline
				if (res.startPos != 0 && r2.text == "") {
					res.startPos += 2;
				}
				// do a similar thing for the end of the textarea
				if (res.endPos != 0 && r3.text == "") {
					res.endPos += 2;
				}
				
				return res
			}
		}catch(e){
			return {start: el.value.length, end: el.value.length};
		}
	} 
},
select = function( el, start, end ) {
	var win = getWindow(el)
	if(el.setSelectionRange){
		if(end === undefined){
            el.focus();
            el.setSelectionRange(start, start);
		} else {
			el.select();
			el.selectionStart = start;
			el.selectionEnd = end;
		}
	} else if (el.createTextRange) {
		//el.focus();
		var r = el.createTextRange();
		r.moveStart('character', start);
		end = end || start;
		r.moveEnd('character', end - el.value.length);
		
		r.select();
	} else if(win.getSelection){
		var	doc = win.document,
			sel = win.getSelection(),
			range = doc.createRange(),
			ranges = [start,  end !== undefined ? end : start];
		getCharElement([el],ranges);
		range.setStart(ranges[0].el, ranges[0].count);
		range.setEnd(ranges[1].el, ranges[1].count);
		
		// removeAllRanges is suprisingly necessary for webkit ... BOOO!
        sel.removeAllRanges();
        sel.addRange(range);
		
	} else if(win.document.body.createTextRange){ //IE's weirdness
		var range = document.body.createTextRange();
		range.moveToElementText(el);
		range.collapse()
		range.moveStart('character', start)
		range.moveEnd('character', end !== undefined ? end : start)
        range.select();
	}

},
/*
 * If one of the range values is within start and len, replace the range
 * value with the element and its offset.
 */
replaceWithLess = function(start, len, range, el){
	if(typeof range[0] === 'number' && range[0] < len){
			range[0] = {
				el: el,
				count: range[0] - start
			};
	}
	if(typeof range[1] === 'number' && range[1] <= len){
			range[1] = {
				el: el,
				count: range[1] - start
			};;
	}
},
getCharElement = function( elems , range, len ) {
	var elem,
		start;
	
	len = len || 0;
	for ( var i = 0; elems[i]; i++ ) {
		elem = elems[i];
		// Get the text from text nodes and CDATA nodes
		if ( elem.nodeType === 3 || elem.nodeType === 4 ) {
			start = len
			len += elem.nodeValue.length;
			//check if len is now greater than what's in counts
			replaceWithLess(start, len, range, elem ) 
		// Traverse everything else, except comment nodes
		} else if ( elem.nodeType !== 8 ) {
			len = getCharElement( elem.childNodes, range, len );
		}
	}
	return len;
};
/**
 * @parent dom
 * @tag beta
 * 
 * Gets or sets the current text selection.
 * 
 * ## Getting
 * 
 * Gets the current selection in the context of an element.  For example:
 * 
 *     $('textarea').selection() // -> { .... }
 *     
 * returns an object with:
 * 
 *   - __start__ - The number of characters from the start of the element to the start of the selection.
 *   _ __end__ - The number of characters from teh start of the element to the end of the selection.
 *   _ __range__ - A [jQuery.Range] that represents the current selection.
 * 
 * This lets you do:
 * 
 *     var textarea = $('textarea')
 *       selection = textarea.selection(),
 *       selected = textarea.val().substr(selection.start, selection.end);
 *       
 *     alert('You selected '+selected+'.');
 *     
 * Selection works with all elements.  If you want to get selection information on the page:
 * 
 *     $(document.body).selection();
 *     
 * ## Setting
 * 
 * By providing a start and end offset, you can select text within a given element.
 * 
 *     $('#rte').selection(30, 40)
 * 
 * @param {Number} [start] - Start of the range
 * @param {Number} [end] - End of the range
 * @return {Object|jQuery} - returns the selection information or the jQuery collection for
 * chaining.
 */
$.fn.selection = function(start, end){
	if(start !== undefined){
		return this.each(function(){
			select(this, start, end)
		})
	}else{
		return getSelection(this[0])
	}
};
// for testing
$.fn.selection.getCharElement = getCharElement;

});