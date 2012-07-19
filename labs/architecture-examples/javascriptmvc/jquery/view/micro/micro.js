steal.plugins('jquery/view').then(function(){
// Simple JavaScript Templating
// John Resig - http://ejohn.org/ - MIT Licensed

  var cache = {};
  /**
   * @function Micro
   * @parent jQuery.View
   * @plugin jquery/view/micro
   * A very lightweight template engine. 
   * Magic tags look like:
   * 
   * @codestart
   * <h3>{%= message %}</h3>
   * @codeend
   * 
   * Micro is integrated in JavaScriptMVC so 
   * you can use it like:
   * 
   * @codestart
   * $("#foo").html('//app/views/bar.micro',{});
   * @codeend
   * 
   * ## Pros
   * 
   *  - Very Lightweight
   *  
   * ## Cons
   * 
   *  - Doesn't handle nested tags.
   *  - Doesn't handle {%= "%}" %}. 
   *  - More difficult to debug.
   *  - Removes newlines and tabs.
   * 
   * ## Use
   * 
   * For more information on micro, see John Resig's
   * [http://ejohn.org/blog/javascript-micro-templating/ write up].
   * 
   * @param {String} str template content.
   * @param {Object} data render's the template with this content.
   */
  function Micro(str, data){
	var body =  
		"var p=[],print=function(){p.push.apply(p,arguments);};" +
        
        // Introduce the data as local variables using with(){}
        "with(obj){p.push('" +
        
        // Convert the template into pure JavaScript
        str.replace(/[\r\t\n]/g, " ")
   .replace(/'(?=[^%]*%})/g,"\t")
   .split("'").join("\\'")
   .split("\t").join("'")
   .replace(/{%=(.+?)%}/g, "',$1,'")
   .split("{%").join("');")
   .split("%}").join("p.push('")+ "');}return p.join('');"
	
    var fn =  new Function("obj",body);
	fn.body = body;
    
    // Provide some basic currying to the user
    return data ? fn( data ) : fn;
  };

	$.View.register({
		suffix : "micro",
		renderer: function( id, text ) {
			var mt = Micro(text)
			return function(data){
				return mt(data)
			}
		},
		script: function( id, str ) {
			return "function(obj){"+Micro(str).body+"}";
		}
	})
	jQuery.View.ext = ".micro"
	

});