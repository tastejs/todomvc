/*!
 * jQuery UI Effects Fade 1.10.4
 * http://jqueryui.com
 *
 * Copyright 2014 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/fade-effect/
 *
 * Depends:
 *	jquery.ui.effect.js
 */
(function($,u){$.effects.effect.fade=function(o,d){var e=$(this),m=$.effects.setMode(e,o.mode||"toggle");e.animate({opacity:m},{queue:false,duration:o.duration,easing:o.easing,complete:d});};})(jQuery);
