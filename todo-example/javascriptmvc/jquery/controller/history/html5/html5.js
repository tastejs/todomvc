steal.plugins('jquery/controller/subscribe').then(function($){

  var hasHistoryManagementSupport = !!(window.history && history.pushState);
  
  if (hasHistoryManagementSupport) {
    steal.dev.log("WARNING: The current browser does not support HTML5 History Management.");
  } else {
    window.onpopstate = function(event) {
      OpenAjax.hub.publish("history."+location.href, (event && event.state) || {});
    };

    setTimeout(function(){
    	window.onpopstate();
    }, 1); // immediately after ready

    $.extend($.Controller.prototype, {
      redirectTo: function(url, data, title) {
        data = data || {};
        window.history.pushState(data, title, url);
        this.publish("history." + url, data);
      }
    });
    
    $.Controller.processors["windowpopstate"] = function(el, event, selector, cb) {
      $(window).bind("popstate", cb);
      return function(){
	      $(window).unbind("popstate", cb);
      }
    };
  }
})
