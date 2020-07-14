var templateConverter = {};

templateConverter.DOMFragment = function(markup) {
	if (markup.indexOf("<!doctype") > -1) return [new DOMParser().parseFromString(markup, "text/html").childNodes[1]]
	var container = document.createElement("div");
	container.insertAdjacentHTML("beforeend", markup);
	return container.childNodes;
}
templateConverter.VirtualFragment = function recurse(domFragment) {
	var virtualFragment = [];
	for (var i = 0, el; el = domFragment[i]; i++) {
		if (el.nodeType == 3) {
			virtualFragment.push(el.nodeValue);
		}
		else {
			var attrs = {};
			for (var j = 0, attr; attr = el.attributes[j]; j++) {
				attrs[attr.name] = attr.value;
			}
			
			virtualFragment.push({tag: el.tagName.toLowerCase(), attrs: attrs, children: recurse(el.childNodes)});
		}
	}
	return virtualFragment;
}
templateConverter.Template = function recurse() {
	if (Object.prototype.toString.call(arguments[0]) == "[object String]") {
		return new recurse(new templateConverter.VirtualFragment(new templateConverter.DOMFragment(arguments[0])));
	}
	
	var virtualFragment = arguments[0], level = arguments[1]
	if (!level) level = 1;
	
	var tab = "\n" + new Array(level + 1).join("\t");
	var virtuals = [];
	for (var i = 0, el; el = virtualFragment[i]; i++) {
		if (typeof el == "string") {
			if (el.match(/\t| {2,}/g) && el.trim().length == 0) virtuals.indented = true;
			else virtuals.push('"' + el.replace(/"/g, '\\"').replace(/\r/g, "\\r").replace(/\n/g, "\\n") + '"');
		}
		else {
			var virtual = "";
			if (el.tag != "div") virtual += el.tag;
			if (el.attrs["class"]) {
				virtual += "." + el.attrs["class"].replace(/\t+/g, " ").split(" ").join(".");
				delete el.attrs["class"];
			}
			var attrNames = Object.keys(el.attrs).sort()
			for (var j = 0, attrName; attrName = attrNames[j]; j++) {
				if (attrName != "style") virtual += "[" + attrName + "='" + el.attrs[attrName].replace(/'/g, "\\'") + "']";
			}
			virtual = '"' + virtual + '"';
			
			var style = ""
			if (el.attrs.style) {
				virtual += ", {style: " + ("{\"" + el.attrs.style.replace(/:/g, "\": \"").replace(/;/g, "\", \"") + "}").replace(/, "}|"}/, "}") + "}"
			}
			
			if (el.children.length > 0) {
				virtual += ", " + recurse(el.children, level + 1);
			}
			virtual = "m(" + virtual + ")";
			virtuals.push(virtual);
		}
	}
	if (!virtuals.indented) tab = "";
	
	var isInline = virtuals.length == 1 && virtuals[0].charAt(0) == '"';
	var template = isInline ? virtuals.join(", ") : "[" + tab + virtuals.join("," + tab) + tab.slice(0, -1) + "]";
	return new String(template);
}

templateConverter.controller = function() {
	this.source = m.prop("");
	this.output = m.prop("");
	
	this.convert = function() {
		return this.output(new templateConverter.Template(this.source()));
	};
	
};

templateConverter.view = function(ctrl) {
	return [
		m("textarea", {autofocus: true, style: {width:"100%", height: "40%"}, onchange: m.withAttr("value", ctrl.source)}, ctrl.source()),
		m("button", {onclick: ctrl.convert.bind(ctrl)}, "Convert"),
		m("textarea", {style: {width:"100%", height: "40%"}}, ctrl.output())
	];
};