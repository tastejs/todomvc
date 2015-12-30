/*!
 * jQuery UI Effects Explode 1.10.4
 * http://jqueryui.com
 *
 * Copyright 2014 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/explode-effect/
 *
 * Depends:
 *	jquery.ui.effect.js
 */
(function($,u){$.effects.effect.explode=function(o,d){var r=o.pieces?Math.round(Math.sqrt(o.pieces)):3,c=r,e=$(this),m=$.effects.setMode(e,o.mode||"hide"),s=m==="show",a=e.show().css("visibility","hidden").offset(),w=Math.ceil(e.outerWidth()/c),h=Math.ceil(e.outerHeight()/r),p=[],i,j,l,t,b,f;function g(){p.push(this);if(p.length===r*c){k();}}for(i=0;i<r;i++){t=a.top+i*h;f=i-(r-1)/2;for(j=0;j<c;j++){l=a.left+j*w;b=j-(c-1)/2;e.clone().appendTo("body").wrap("<div></div>").css({position:"absolute",visibility:"visible",left:-j*w,top:-i*h}).parent().addClass("ui-effects-explode").css({position:"absolute",overflow:"hidden",width:w,height:h,left:l+(s?b*w:0),top:t+(s?f*h:0),opacity:s?0:1}).animate({left:l+(s?0:b*w),top:t+(s?0:f*h),opacity:s?1:0},o.duration||500,o.easing,g);}}function k(){e.css({visibility:"visible"});$(p).remove();if(!s){e.hide();}d();}};})(jQuery);
