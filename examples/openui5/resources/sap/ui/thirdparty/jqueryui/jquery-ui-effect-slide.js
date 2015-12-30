/*!
 * jQuery UI Effects Slide 1.10.4
 * http://jqueryui.com
 *
 * Copyright 2014 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/slide-effect/
 *
 * Depends:
 *	jquery.ui.effect.js
 */
(function($,u){$.effects.effect.slide=function(o,d){var e=$(this),p=["position","top","bottom","left","right","width","height"],m=$.effects.setMode(e,o.mode||"show"),s=m==="show",a=o.direction||"left",r=(a==="up"||a==="down")?"top":"left",b=(a==="up"||a==="left"),c,f={};$.effects.save(e,p);e.show();c=o.distance||e[r==="top"?"outerHeight":"outerWidth"](true);$.effects.createWrapper(e).css({overflow:"hidden"});if(s){e.css(r,b?(isNaN(c)?"-"+c:-c):c);}f[r]=(s?(b?"+=":"-="):(b?"-=":"+="))+c;e.animate(f,{queue:false,duration:o.duration,easing:o.easing,complete:function(){if(m==="hide"){e.hide();}$.effects.restore(e,p);$.effects.removeWrapper(e);d();}});};})(jQuery);
