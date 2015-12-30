/*!
 * jQuery UI Effects Highlight 1.10.4
 * http://jqueryui.com
 *
 * Copyright 2014 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/highlight-effect/
 *
 * Depends:
 *	jquery.ui.effect.js
 */
(function($,u){$.effects.effect.highlight=function(o,d){var e=$(this),p=["backgroundImage","backgroundColor","opacity"],m=$.effects.setMode(e,o.mode||"show"),a={backgroundColor:e.css("backgroundColor")};if(m==="hide"){a.opacity=0;}$.effects.save(e,p);e.show().css({backgroundImage:"none",backgroundColor:o.color||"#ffff99"}).animate(a,{queue:false,duration:o.duration,easing:o.easing,complete:function(){if(m==="hide"){e.hide();}$.effects.restore(e,p);d();}});};})(jQuery);
