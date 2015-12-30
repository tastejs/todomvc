/*!
 * jQuery UI Effects Fold 1.10.4
 * http://jqueryui.com
 *
 * Copyright 2014 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/fold-effect/
 *
 * Depends:
 *	jquery.ui.effect.js
 */
(function($,u){$.effects.effect.fold=function(o,d){var e=$(this),p=["position","top","bottom","left","right","height","width"],m=$.effects.setMode(e,o.mode||"hide"),s=m==="show",h=m==="hide",a=o.size||15,b=/([0-9]+)%/.exec(a),c=!!o.horizFirst,w=s!==c,r=w?["width","height"]:["height","width"],f=o.duration/2,g,i,j={},k={};$.effects.save(e,p);e.show();g=$.effects.createWrapper(e).css({overflow:"hidden"});i=w?[g.width(),g.height()]:[g.height(),g.width()];if(b){a=parseInt(b[1],10)/100*i[h?0:1];}if(s){g.css(c?{height:0,width:a}:{height:a,width:0});}j[r[0]]=s?i[0]:a;k[r[1]]=s?i[1]:0;g.animate(j,f,o.easing).animate(k,f,o.easing,function(){if(h){e.hide();}$.effects.restore(e,p);$.effects.removeWrapper(e);d();});};})(jQuery);
