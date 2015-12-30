/*!
 * jQuery UI Effects Shake 1.10.4
 * http://jqueryui.com
 *
 * Copyright 2014 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/shake-effect/
 *
 * Depends:
 *	jquery.ui.effect.js
 */
(function($,u){$.effects.effect.shake=function(o,d){var e=$(this),p=["position","top","bottom","left","right","height","width"],m=$.effects.setMode(e,o.mode||"effect"),a=o.direction||"left",b=o.distance||20,t=o.times||3,c=t*2+1,s=Math.round(o.duration/c),r=(a==="up"||a==="down")?"top":"left",f=(a==="up"||a==="left"),g={},h={},j={},i,q=e.queue(),k=q.length;$.effects.save(e,p);e.show();$.effects.createWrapper(e);g[r]=(f?"-=":"+=")+b;h[r]=(f?"+=":"-=")+b*2;j[r]=(f?"-=":"+=")+b*2;e.animate(g,s,o.easing);for(i=1;i<t;i++){e.animate(h,s,o.easing).animate(j,s,o.easing);}e.animate(h,s,o.easing).animate(g,s/2,o.easing).queue(function(){if(m==="hide"){e.hide();}$.effects.restore(e,p);$.effects.removeWrapper(e);d();});if(k>1){q.splice.apply(q,[1,0].concat(q.splice(k,c+1)));}e.dequeue();};})(jQuery);
