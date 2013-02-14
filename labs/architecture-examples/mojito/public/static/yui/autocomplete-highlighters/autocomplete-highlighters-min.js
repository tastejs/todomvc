/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
YUI.add("autocomplete-highlighters",function(e,t){var n=e.Array,r=e.Highlight,i=e.mix(e.namespace("AutoCompleteHighlighters"),{charMatch:function(e,t,i){var s=n.unique((i?e:e.toLowerCase()).split(""));return n.map(t,function(e){return r.all(e.text,s,{caseSensitive:i})})},charMatchCase:function(e,t){return i.charMatch(e,t,!0)},phraseMatch:function(e,t,i){return n.map(t,function(t){return r.all(t.text,[e],{caseSensitive:i})})},phraseMatchCase:function(e,t){return i.phraseMatch(e,t,!0)},startsWith:function(e,t,i){return n.map(t,function(t){return r.all(t.text,[e],{caseSensitive:i,startsWith:!0})})},startsWithCase:function(e,t){return i.startsWith(e,t,!0)},subWordMatch:function(t,i,s){var o=e.Text.WordBreak.getUniqueWords(t,{ignoreCase:!s});return n.map(i,function(e){return r.all(e.text,o,{caseSensitive:s})})},subWordMatchCase:function(e,t){return i.subWordMatch(e,t,!0)},wordMatch:function(e,t,i){return n.map(t,function(t){return r.words(t.text,e,{caseSensitive:i})})},wordMatchCase:function(e,t){return i.wordMatch(e,t,!0)}})},"3.7.3",{requires:["array-extras","highlight-base"]});
