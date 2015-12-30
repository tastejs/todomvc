/*!
 * jQuery UI Effects Transfer 1.10.4
 * http://jqueryui.com
 *
 * Copyright 2014 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/transfer-effect/
 *
 * Depends:
 *	jquery.ui.effect.js
 */
(function($,u){$.effects.effect.transfer=function(o,d){var e=$(this),t=$(o.to),a=t.css("position")==="fixed",b=$("body"),f=a?b.scrollTop():0,c=a?b.scrollLeft():0,g=t.offset(),h={top:g.top-f,left:g.left-c,height:t.innerHeight(),width:t.innerWidth()},s=e.offset(),i=$("<div class='ui-effects-transfer'></div>").appendTo(document.body).addClass(o.className).css({top:s.top-f,left:s.left-c,height:e.innerHeight(),width:e.innerWidth(),position:a?"fixed":"absolute"}).animate(h,o.duration,o.easing,function(){i.remove();d();});};})(jQuery);
