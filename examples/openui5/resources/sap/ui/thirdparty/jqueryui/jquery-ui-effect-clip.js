/*!
 * jQuery UI Effects Clip 1.10.4
 * http://jqueryui.com
 *
 * Copyright 2014 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/clip-effect/
 *
 * Depends:
 *	jquery.ui.effect.js
 */
(function($,u){$.effects.effect.clip=function(o,d){var e=$(this),p=["position","top","bottom","left","right","height","width"],m=$.effects.setMode(e,o.mode||"hide"),s=m==="show",a=o.direction||"vertical",v=a==="vertical",b=v?"height":"width",c=v?"top":"left",f={},w,g,h;$.effects.save(e,p);e.show();w=$.effects.createWrapper(e).css({overflow:"hidden"});g=(e[0].tagName==="IMG")?w:e;h=g[b]();if(s){g.css(b,0);g.css(c,h/2);}f[b]=s?h:0;f[c]=s?0:h/2;g.animate(f,{queue:false,duration:o.duration,easing:o.easing,complete:function(){if(!s){e.hide();}$.effects.restore(e,p);$.effects.removeWrapper(e);d();}});};})(jQuery);
