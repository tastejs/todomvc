/*!
 * jQuery UI Effects Bounce 1.10.4
 * http://jqueryui.com
 *
 * Copyright 2014 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/bounce-effect/
 *
 * Depends:
 *	jquery.ui.effect.js
 */
(function($,u){$.effects.effect.bounce=function(o,d){var e=$(this),p=["position","top","bottom","left","right","height","width"],m=$.effects.setMode(e,o.mode||"effect"),h=m==="hide",s=m==="show",a=o.direction||"up",b=o.distance,t=o.times||5,c=t*2+(s||h?1:0),f=o.duration/c,g=o.easing,r=(a==="up"||a==="down")?"top":"left",j=(a==="up"||a==="left"),i,k,l,q=e.queue(),n=q.length;if(s||h){p.push("opacity");}$.effects.save(e,p);e.show();$.effects.createWrapper(e);if(!b){b=e[r==="top"?"outerHeight":"outerWidth"]()/3;}if(s){l={opacity:1};l[r]=0;e.css("opacity",0).css(r,j?-b*2:b*2).animate(l,f,g);}if(h){b=b/Math.pow(2,t-1);}l={};l[r]=0;for(i=0;i<t;i++){k={};k[r]=(j?"-=":"+=")+b;e.animate(k,f,g).animate(l,f,g);b=h?b*2:b/2;}if(h){k={opacity:0};k[r]=(j?"-=":"+=")+b;e.animate(k,f,g);}e.queue(function(){if(h){e.hide();}$.effects.restore(e,p);$.effects.removeWrapper(e);d();});if(n>1){q.splice.apply(q,[1,0].concat(q.splice(n,c+1)));}e.dequeue();};})(jQuery);
