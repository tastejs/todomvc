/*!
 * jQuery UI Effects Pulsate 1.10.4
 * http://jqueryui.com
 *
 * Copyright 2014 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/pulsate-effect/
 *
 * Depends:
 *	jquery.ui.effect.js
 */
(function($,u){$.effects.effect.pulsate=function(o,d){var e=$(this),m=$.effects.setMode(e,o.mode||"show"),s=m==="show",h=m==="hide",a=(s||m==="hide"),b=((o.times||5)*2)+(a?1:0),c=o.duration/b,f=0,q=e.queue(),g=q.length,i;if(s||!e.is(":visible")){e.css("opacity",0).show();f=1;}for(i=1;i<b;i++){e.animate({opacity:f},c,o.easing);f=1-f;}e.animate({opacity:f},c,o.easing);e.queue(function(){if(h){e.hide();}d();});if(g>1){q.splice.apply(q,[1,0].concat(q.splice(g,b+1)));}e.dequeue();};})(jQuery);
