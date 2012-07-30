steal("jquery/view").then(function(){
	


/**
 * @class Jaml
 * @plugin jquery/view/jaml
 * @parent jQuery.View
 * @author Ed Spencer (http://edspencer.net)
 * Jaml is a simple JavaScript library which makes 
 * HTML generation easy and pleasurable.
 * 
 * Instead of magic tags, Jaml is pure JS.  It looks like:
 * 
 * @codestart
 * function(data) {
 *   h3(data.message);
 * }
 * @codeend
 * 
 * Jaml is integrated into jQuery.View so you can use it like:
 * 
 * @codestart
 * $("#foo").html('//app/views/template.jaml',{});
 * @codeend
 * 
 * ## Use
 * 
 * For more info check out:
 * 
 *  - [http://edspencer.net/2009/11/jaml-beautiful-html-generation-for-javascript.html introduction]
 *  - [http://edspencer.github.com/jaml examples]
 * 
 */
Jaml = function() {
  return {
    templates: {},
    helpers  : {},
    
    /**
     * Registers a template by name
     * @param {String} name The name of the template
     * @param {Function} template The template function
     */
    register: function(name, template ) {
      this.templates[name] = template;
    },
    
    /**
     * Renders the given template name with an optional data object
     * @param {String} name The name of the template to render
     * @param {Object} data Optional data object
     */
    render: function(name, data ) {
      var template = this.templates[name],
          renderer = new Jaml.Template(template);
          
      return renderer.render(data);
    },
    
    /**
     * Registers a helper function
     * @param {String} name The name of the helper
     * @param {Function} helperFn The helper function
     */
    registerHelper: function(name, helperFn ) {
      this.helpers[name] = helperFn;
    }
  };
}();



/**
 * @class
 * @constructor
 * @param {String} tagName The tag name this node represents (e.g. 'p', 'div', etc)
 */
Jaml.Node = function(tagName) {
  /**
   * @attribute tagName
   * @type String
   * This node's current tag
   */
  this.tagName = tagName;
  
  /**
   * @attribute attributes
   * @type Object
   * Sets of attributes on this node (e.g. 'cls', 'id', etc)
   */
  this.attributes = {};
  
  /**
   * @attribute children
   * @type Array
   * Array of rendered child nodes that will be steald as this node's innerHTML
   */
  this.children = [];
};

Jaml.Node.prototype = {
  /**
   * Adds attributes to this node
   * @param {Object} attrs Object containing key: value pairs of node attributes
   */
  setAttributes: function(attrs ) {
    for (var key in attrs) {
      //convert cls to class
      var mappedKey = key == 'cls' ? 'class' : key;
      
      this.attributes[mappedKey] = attrs[key];
    }
  },
  
  /**
   * Adds a child string to this node. This can be called as often as needed to add children to a node
   * @param {String} childText The text of the child node
   */
  addChild: function(childText ) {
    this.children.push(childText);
  },
  
  /**
   * Renders this node with its attributes and children
   * @param {Number} lpad Amount of whitespace to add to the left of the string (defaults to 0)
   * @return {String} The rendered node
   */
  render: function(lpad ) {
    lpad = lpad || 0;
    
    var node      = [],
        attrs     = [],
        textnode  = (this instanceof Jaml.TextNode),
        multiline = this.multiLineTag();
    
    for (var key in this.attributes) {
      attrs.push(key + '=' + this.attributes[key]);
    }
    
    //add any left padding
    if (!textnode) node.push(this.getPadding(lpad));
    
    //open the tag
    node.push("<" + this.tagName);
    
    //add any tag attributes
    for (var key in this.attributes) {
      node.push(" " + key + "=\"" + this.attributes[key] + "\"");
    }
    
    if (this.isSelfClosing()) {
      node.push(" />\n");
    } else {
      node.push(">");
      
      if (multiline) node.push("\n");
      
      for (var i=0; i < this.children.length; i++) {
        node.push(this.children[i].render(lpad + 2));
      }
      
      if (multiline) node.push(this.getPadding(lpad));
      node.push("</", this.tagName, ">\n");
    }
    
    return node.join("");
  },
  
  /**
   * Returns true if this tag should be rendered with multiple newlines (e.g. if it contains child nodes)
   * @return {Boolean} True to render this tag as multi-line
   */
  multiLineTag: function() {
    var childLength = this.children.length,
        multiLine   = childLength > 0;
    
    if (childLength == 1 && this.children[0] instanceof Jaml.TextNode) multiLine = false;
    
    return multiLine;
  },
  
  /**
   * Returns a string with the given number of whitespace characters, suitable for padding
   * @param {Number} amount The number of whitespace characters to add
   * @return {String} A padding string
   */
  getPadding: function(amount ) {
    return new Array(amount + 1).join(" ");
  },
  
  /**
   * Returns true if this tag should close itself (e.g. no </tag> element)
   * @return {Boolean} True if this tag should close itself
   */
  isSelfClosing: function() {
    var selfClosing = false;
    
    for (var i = this.selfClosingTags.length - 1; i >= 0; i--){
      if (this.tagName == this.selfClosingTags[i]) selfClosing = true;
    }
    
    return selfClosing;
  },
  
  /**
   * @attribute selfClosingTags
   * @type Array
   * An array of all tags that should be self closing
   */
  selfClosingTags: ['img', 'meta', 'br', 'hr']
};

Jaml.TextNode = function(text) {
  this.text = text;
};

Jaml.TextNode.prototype = {
  render: function() {
    return this.text;
  }
};

/**
 * Represents a single registered template. Templates consist of an arbitrary number
 * of trees (e.g. there may be more than a single root node), and are not compiled.
 * When a template is rendered its node structure is computed with any provided template
 * data, culminating in one or more root nodes.  The root node(s) are then joined together
 * and returned as a single output string.
 * 
 * The render process uses two dirty but necessary hacks.  First, the template function is
 * decompiled into a string (but is not modified), so that it can be eval'ed within the scope
 * of Jaml.Template.prototype. This allows the second hack, which is the use of the 'with' keyword.
 * This allows us to keep the pretty DSL-like syntax, though is not as efficient as it could be.
 */
Jaml.Template = function(tpl) {
  /**
   * @attribute tpl
   * @type Function
   * The function this template was created from
   */
  this.tpl = tpl;
  
  this.nodes = [];
};

Jaml.Template.prototype = {
  /**
   * Renders this template given the supplied data
   * @param {Object} data Optional data object
   * @return {String} The rendered HTML string
   */
  render: function(data ) {
    data = data || {};
    
    //the 'data' argument can come in two flavours - array or non-array. Normalise it
    //here so that it always looks like an array.
    if (data.constructor.toString().indexOf("Array") == -1) {
      data = [data];
    }
    
    with(this) {
      for (var i=0; i < data.length; i++) {
        eval("(" + this.tpl.toString() + ")(data[i])");
      };
    }
    
    var roots  = this.getRoots(),
        output = "";
    
    for (var i=0; i < roots.length; i++) {
      output += roots[i].render();
    };
    
    return output;
  },
  
  /**
   * Returns all top-level (root) nodes in this template tree.
   * Templates are tree structures, but there is no guarantee that there is a
   * single root node (e.g. a single DOM element that all other elements nest within)
   * @return {Array} The array of root nodes
   */
  getRoots: function() {
    var roots = [];
    
    for (var i=0; i < this.nodes.length; i++) {
      var node = this.nodes[i];
      
      if (node.parent == undefined) roots.push(node);
    };
    
    return roots;
  },
  
  tags: [
    "html", "head", "body", "script", "meta", "title", "link", "script",
    "div", "p", "span", "a", "img", "br", "hr",
    "table", "tr", "th", "td", "thead", "tbody",
    "ul", "ol", "li", 
    "dl", "dt", "dd",
    "h1", "h2", "h3", "h4", "h5", "h6", "h7",
    "form", "input", "label"
  ]
};

/**
 * Adds a function for each tag onto Template's prototype
 */
(function() {
  var tags = Jaml.Template.prototype.tags;
  
  for (var i = tags.length - 1; i >= 0; i--){
    var tagName = tags[i];
    
    /**
     * This function is created for each tag name and assigned to Template's
     * prototype below
     */
    var fn = function(tagName) {
      return function(attrs) {
        var node = new Jaml.Node(tagName);
        
        var firstArgIsAttributes =  (typeof attrs == 'object')
                                 && !(attrs instanceof Jaml.Node)
                                 && !(attrs instanceof Jaml.TextNode);

        if (firstArgIsAttributes) node.setAttributes(attrs);

        var startIndex = firstArgIsAttributes ? 1 : 0;

        for (var i=startIndex; i < arguments.length; i++) {
          var arg = arguments[i];

          if (typeof arg == "string" || arg == undefined) {
            arg = new Jaml.TextNode(arg || "");
          }
          
          if (arg instanceof Jaml.Node || arg instanceof Jaml.TextNode) {
            arg.parent = node;
          }

          node.addChild(arg);
        };
        
        this.nodes.push(node);
        
        return node;
      };
    };
    
    Jaml.Template.prototype[tagName] = fn(tagName);
  };
})();

$.View.register({
	suffix : "jaml",
	script: function(id, str ) {
		return "((function(){ Jaml.register("+id+", "+str+"); return function(data){return Jaml.render("+id+", data)} })())"
	},
	renderer: function(id, text ) {
		var func;
		eval("func = ("+text+")");
		Jaml.register(id, func);
		return function(data){
			return Jaml.render(id, data)
		}
	}
})


});