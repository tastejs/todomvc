/*!
 * Mobiscroll v2.9.0
 * http://mobiscroll.com
 *
 * Copyright 2010-2013, Acid Media
 * Licensed under the MIT license.
 *
 */
(function($){function t(p){var i;for(i in p){if(m[p[i]]!==undefined){return true;}}return false;}function a(){var c=['Webkit','Moz','O','ms'],p;for(p in c){if(t([c[p]+'Transform'])){return'-'+c[p].toLowerCase()+'-';}}return'';}function g(e,c){var o=e.originalEvent,i=e.changedTouches;return i||(o&&o.changedTouches)?(o?o.changedTouches[0]['page'+c]:i[0]['page'+c]):e['page'+c];}function b(c,o,e){var i=c;if(typeof o==='object'){return c.each(function(){if(!this.id){this.id='mobiscroll'+(++f);}if(j[this.id]){j[this.id].destroy();}new $.mobiscroll.classes[o.component||'Scroller'](this,o);});}if(typeof o==='string'){c.each(function(){var r,p=j[this.id];if(p&&p[o]){r=p[o].apply(this,Array.prototype.slice.call(e,1));if(r!==undefined){i=r;return false;}}});}return i;}function d(e){if(e.type=='touchstart'){h[e.target]=true;}else if(h[e.target]){delete h[e.target];return false;}return true;}var f=+new Date,h={},j={},k=$.extend,m=document.createElement('modernizr').style,l=t(['perspectiveProperty','WebkitPerspective','MozPerspective','OPerspective','msPerspective']),n=a(),q=n.replace(/^\-/,'').replace(/\-$/,'').replace('moz','Moz');$.fn.mobiscroll=function(c){k(this,$.mobiscroll.components);return b(this,c,arguments);};$.mobiscroll=$.mobiscroll||{util:{prefix:n,jsPrefix:q,has3d:l,getCoord:g,testTouch:d},presets:{},themes:{},i18n:{},instances:j,classes:{},components:{},defaults:{},setDefaults:function(o){k(defaults,o);},presetShort:function(e,c){this.components[e]=function(s){return b(this,k(s,{component:c,preset:e}),arguments);};}};$.scroller=$.scroller||$.mobiscroll;$.fn.scroller=$.fn.scroller||$.fn.mobiscroll;})(jQuery);
