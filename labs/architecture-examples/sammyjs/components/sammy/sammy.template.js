(function (factory) {
  if (typeof define === 'function' && define.amd) {
    define(['jquery', 'sammy'], factory);
  } else {
    (window.Sammy = window.Sammy || {}).Template = factory(window.jQuery, window.Sammy);
  }
}(function ($, Sammy) {

  // Simple JavaScript Templating
  // John Resig - http://ejohn.org/ - MIT Licensed
  // adapted from: http://ejohn.org/blog/javascript-micro-templating/
  // originally $.srender by Greg Borenstein http://ideasfordozens.com in Feb 2009
  // modified for Sammy by Aaron Quint for caching templates by name
  var srender_cache = {};
  var srender = function(name, template, data, options) {
    var fn, escaped_string;
    // target is an optional element; if provided, the result will be inserted into it
    // otherwise the result will simply be returned to the caller
    if (srender_cache[name]) {
      fn = srender_cache[name];
    } else {
      if (typeof template == 'undefined') {
        // was a cache check, return false
        return false;
      }
      // If options escape_html is false, dont escape the contents by default
      if (options && options.escape_html === false) {
        escaped_string = "\",$1,\"";
      } else {
        escaped_string = "\",h($1),\"";
      }
      // Generate a reusable function that will serve as a template
      // generator (and which will be cached).
      fn = srender_cache[name] = new Function("obj",
      "var ___$$$___=[],print=function(){___$$$___.push.apply(___$$$___,arguments);};" +

      // Introduce the data as local variables using with(){}
      "with(obj){___$$$___.push(\"" +

      // Convert the template into pure JavaScript
      String(template)
        .replace(/[\r\t\n]/g, " ")
        .replace(/\"/g, '\\"')
        .split("<%").join("\t")
        .replace(/((^|%>)[^\t]*)/g, "$1\r")
        .replace(/\t=(.*?)%>/g, escaped_string)
        .replace(/\t!(.*?)%>/g, "\",$1,\"")
        .split("\t").join("\");")
        .split("%>").join("___$$$___.push(\"")
        .split("\r").join("")
        + "\");}return ___$$$___.join('');");
    }

    if (typeof data != 'undefined') {
      return fn(data);
    } else {
      return fn;
    }
  };

  // `Sammy.Template` is a simple plugin that provides a way to create
  // and render client side templates. The rendering code is based on John Resig's
  // quick templates and Greg Borenstien's srender plugin.
  // This is also a great template/boilerplate for Sammy plugins.
  //
  // Templates use `<% %>` tags to denote embedded javascript.
  //
  // ### Examples
  //
  // Here is an example template (user.template):
  //
  //       // user.template
  //       <div class="user">
  //         <div class="user-name"><%= user.name %></div>
  //         <% if (user.photo_url) { %>
  //           <div class="photo"><img src="<%= user.photo_url %>" /></div>
  //         <% } %>
  //       </div>
  //
  // Given that is a publicly accesible file, you would render it like:
  //
  //       // app.js
  //       $.sammy(function() {
  //         // include the plugin
  //         this.use('Template');
  //
  //         this.get('#/', function() {
  //           // the template is rendered in the current context.
  //           this.user = {name: 'Aaron Quint'};
  //           // partial calls template() because of the file extension
  //           this.partial('user.template');
  //         })
  //       });
  //
  // You can also pass a second argument to use() that will alias the template
  // method and therefore allow you to use a different extension for template files
  // in <tt>partial()</tt>
  //
  //       // alias to 'tpl'
  //       this.use(Sammy.Template, 'tpl');
  //
  //       // now .tpl files will be run through srender
  //       this.get('#/', function() {
  //         this.partial('myfile.tpl');
  //       });
  //
  // By default, the data passed into the tempalate is passed automatically passed through
  // Sammy's `escapeHTML` method in order to prevent possible XSS attacks. This is
  // a problem though if you're using something like `Sammy.Form` which renders HTML
  // within the templates. You can get around this in two ways. One, you can use the
  // `<%! %>` instead of `<%= %>`. Two, you can pass the `escape_html = false` option
  // when interpolating, i.e:
  //
  //       this.get('#/', function() {
  //         this.template('myform.tpl', {form: "<form></form>"}, {escape_html: false});
  //       });
  //
  Sammy.Template = function(app, method_alias) {

    // *Helper:* Uses simple templating to parse ERB like templates.
    //
    // ### Arguments
    //
    // * `template` A String template. '<% %>' tags are evaluated as Javascript and replaced with the elements in data.
    // * `data` An Object containing the replacement values for the template.
    //   data is extended with the <tt>EventContext</tt> allowing you to call its methods within the template.
    // * `name` An optional String name to cache the template.
    //
    var template = function(template, data, name, options) {
      // use name for caching
      if (typeof name == 'undefined') { name = template; }
      if (typeof options == 'undefined' && typeof name == 'object') {
        options = name; name = template;
      }
      return srender(name, template, $.extend({}, this, data), options);
    };

    // set the default method name/extension
    if (!method_alias) { method_alias = 'template'; }
    // create the helper at the method alias
    app.helper(method_alias, template);

  };

  return Sammy.Template;

}));
