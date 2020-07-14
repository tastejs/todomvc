/*
Compiles Mithril templates

Requires sweet.js (https://github.com/mozilla/sweet.js)
Installation: npm install -g sweet.js
Usage: sjs --module /mithril.compile.sjs --output <output-filename>.js <input-filename>.js
*/

macro m {
	case { _ ($selector) } => {
		return #{m($selector, {}, [])};
	}
	case { _ ($selector, $partial) } => {
		var partialSyntax = #{$partial};
		var partial = unwrapSyntax(partialSyntax);
		return partial.value == "{}" ? #{m($selector, $partial, [])} : #{m($selector, {}, partial)};
	}
	case { _ ($selector, $dynAttrs, $children) } => { 
		var selectorSyntax = #{$selector};
		var selector = unwrapSyntax(selectorSyntax);
		
		var dynAttrsSyntax = #{$dynAttrs};
		var dynAttrs = unwrapSyntax(dynAttrsSyntax);
		
		var parser = /(?:(^|#|\.)([^#\.\[\]]+))|(\[.+?\])/g;
		var attrParser = /\[(.+?)=("|'|)(.+?)\2\]/;
		var _match = null;
		var classes = [];
		var cell = {tag: "div", attrs: {}, children: []};
		
		while (_match = parser.exec(selector)) {
			if (_match[1] == "") cell.tag = _match[2];
			else if (_match[1] == "#") cell.attrs.id = _match[2];
			else if (_match[1] == ".") classes.push(_match[2]);
			else if (_match[3][0] == "[") {
				var pair = attrParser.exec(_match[3]);
				cell.attrs[pair[1]] = pair[3];
			}
		}
		if (classes.length > 0) cell.attrs["class"] = classes.join(" ");
		
		var tag = makeValue(cell.tag, #{here});
		var attrsBody = Object.keys(cell.attrs).reduce(function(memo, attrName) {
			return memo.concat([
				makeValue(attrName, #{here}),
				makePunc(":", #{here}),
				makeValue(cell.attrs[attrName], #{here}),
				makePunc(",", #{here})
			]);
		}, []).concat(dynAttrs.inner);
		var attrs = [makeDelim("{}", attrsBody, #{here})];
		var children = cell.children.map(function(child) {
			return makeValue(child, #{here});
		})
		letstx $tag = [tag], $attrs = attrs;
		
		return #{ ({tag: $tag, attrs: $attrs , children: $children}) };
	}
	case { _ } => {
		return #{Mithril};
	}
}

export m;