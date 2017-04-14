/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
YUI.add("autocomplete-filters-accentfold",function(e,t){var n=e.Text.AccentFold,r=e.Text.WordBreak,i=e.Array,s=e.Object;e.mix(e.namespace("AutoCompleteFilters"),{charMatchFold:function(e,t){if(!e)return t;var r=i.unique(n.fold(e).split(""));return i.filter(t,function(e){var t=n.fold(e.text);return i.every(r,function(e){return t.indexOf(e)!==-1})})},phraseMatchFold:function(e,t){return e?(e=n.fold(e),i.filter(t,function(t){return n.fold(t.text).indexOf(e)!==-1})):t},startsWithFold:function(e,t){return e?(e=n.fold(e),i.filter(t,function(t){return n.fold(t.text).indexOf(e)===0})):t},subWordMatchFold:function(e,t){if(!e)return t;var s=r.getUniqueWords(n.fold(e));return i.filter(t,function(e){var t=n.fold(e.text);return i.every(s,function(e){return t.indexOf(e)!==-1})})},wordMatchFold:function(e,t){if(!e)return t;var o=r.getUniqueWords(n.fold(e));return i.filter(t,function(e){var t=i.hash(r.getUniqueWords(n.fold(e.text)));return i.every(o,function(e){return s.owns(t,e)})})}})},"3.7.3",{requires:["array-extras","text-accentfold","text-wordbreak"]});
