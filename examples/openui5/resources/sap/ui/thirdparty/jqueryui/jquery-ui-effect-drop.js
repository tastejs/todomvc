/*!
 * jQuery UI Effects Drop 1.10.4
 * http://jqueryui.com
 *
 * Copyright 2014 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/drop-effect/
 *
 * Depends:
 *	jquery.ui.effect.js
 */
(function($,u){$.effects.effect.drop=function(o,d){var e=$(this),p=["position","top","bottom","left","right","opacity","height","width"],m=$.effects.setMode(e,o.mode||"hide"),s=m==="show",a=o.direction||"left",r=(a==="up"||a==="down")?"top":"left",b=(a==="up"||a==="left")?"pos":"neg",c={opacity:s?1:0},f;$.effects.save(e,p);e.show();$.effects.createWrapper(e);f=o.distance||e[r==="top"?"outerHeight":"outerWidth"](true)/2;if(s){e.css("opacity",0).css(r,b==="pos"?-f:f);}c[r]=(s?(b==="pos"?"+=":"-="):(b==="pos"?"-=":"+="))+f;e.animate(c,{queue:false,duration:o.duration,easing:o.easing,complete:function(){if(m==="hide"){e.hide();}$.effects.restore(e,p);$.effects.removeWrapper(e);d();}});};})(jQuery);
