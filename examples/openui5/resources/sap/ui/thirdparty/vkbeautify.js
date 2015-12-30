/**
* vkBeautify - javascript plugin to pretty-print or minify text in XML, JSON, CSS and SQL formats.
*  
* Version - 0.99.00.beta 
* Copyright (c) 2012 Vadim Kiryukhin
* vkiryukhin @ gmail.com
* http://www.eslinstructor.net/vkbeautify/
* 
* Dual licensed under the MIT and GPL licenses:
*   http://www.opensource.org/licenses/mit-license.php
*   http://www.gnu.org/licenses/gpl.html
*
*   Pretty print
*
*        vkbeautify.xml(text [,indent_pattern]);
*        vkbeautify.json(text [,indent_pattern]);
*        vkbeautify.css(text [,indent_pattern]);
*        vkbeautify.sql(text [,indent_pattern]);
*
*        @text - String; text to beatufy;
*        @indent_pattern - Integer | String;
*                Integer:  number of white spaces;
*                String:   character string to visualize indentation ( can also be a set of white spaces )
*   Minify
*
*        vkbeautify.xmlmin(text [,preserve_comments]);
*        vkbeautify.jsonmin(text);
*        vkbeautify.cssmin(text [,preserve_comments]);
*        vkbeautify.sqlmin(text);
*
*        @text - String; text to minify;
*        @preserve_comments - Bool; [optional];
*                Set this flag to true to prevent removing comments from @text ( minxml and mincss functions only. )
*
*   Examples:
*        vkbeautify.xml(text); // pretty print XML
*        vkbeautify.json(text, 4 ); // pretty print JSON
*        vkbeautify.css(text, '. . . .'); // pretty print CSS
*        vkbeautify.sql(text, '----'); // pretty print SQL
*
*        vkbeautify.xmlmin(text, true);// minify XML, preserve comments
*        vkbeautify.jsonmin(text);// minify JSON
*        vkbeautify.cssmin(text);// minify CSS, remove comments ( default )
*        vkbeautify.sqlmin(text);// minify SQL
*
*/
(function(){function c(a){var b='    ';if(isNaN(parseInt(a))){b=a;}else{switch(a){case 1:b=' ';break;case 2:b='  ';break;case 3:b='   ';break;case 4:b='    ';break;case 5:b='     ';break;case 6:b='      ';break;case 7:b='       ';break;case 8:b='        ';break;case 9:b='         ';break;case 10:b='          ';break;case 11:b='           ';break;case 12:b='            ';break;}}var d=['\n'];for(ix=0;ix<100;ix++){d.push(d[ix]+b);}return d;}function v(){this.step='    ';this.shift=c(this.step);};v.prototype.xml=function(t,a){var b=t.replace(/>\s{0,}</g,"><").replace(/</g,"~::~<").replace(/\s*xmlns\:/g,"~::~xmlns:").replace(/\s*xmlns\=/g,"~::~xmlns=").split('~::~'),l=b.length,d=false,e=0,f='',g=0,h=a?c(a):this.shift;for(g=0;g<l;g++){if(b[g].search(/<!/)>-1){f+=h[e]+b[g];d=true;if(b[g].search(/-->/)>-1||b[g].search(/\]>/)>-1||b[g].search(/!DOCTYPE/)>-1){d=false;}}else if(b[g].search(/-->/)>-1||b[g].search(/\]>/)>-1){f+=b[g];d=false;}else if(/^<\w/.exec(b[g-1])&&/^<\/\w/.exec(b[g])&&/^<[\w:\-\.\,]+/.exec(b[g-1])==/^<\/[\w:\-\.\,]+/.exec(b[g])[0].replace('/','')){f+=b[g];if(!d)e--;}else if(b[g].search(/<\w/)>-1&&b[g].search(/<\//)==-1&&b[g].search(/\/>/)==-1){f=!d?f+=h[e++]+b[g]:f+=b[g];}else if(b[g].search(/<\w/)>-1&&b[g].search(/<\//)>-1){f=!d?f+=h[e]+b[g]:f+=b[g];}else if(b[g].search(/<\//)>-1){f=!d?f+=h[--e]+b[g]:f+=b[g];}else if(b[g].search(/\/>/)>-1){f=!d?f+=h[e]+b[g]:f+=b[g];}else if(b[g].search(/<\?/)>-1){f+=h[e]+b[g];}else if(b[g].search(/xmlns\:/)>-1||b[g].search(/xmlns\=/)>-1){f+=h[e]+b[g];}else{f+=b[g];}}return(f[0]=='\n')?f.slice(1):f;};v.prototype.json=function(t,a){var a=a?a:this.step;if(typeof JSON==='undefined')return t;if(typeof t==="string")return JSON.stringify(JSON.parse(t),null,a);if(typeof t==="object")return JSON.stringify(t,null,a);return t;};v.prototype.css=function(t,a){var b=t.replace(/\s{1,}/g,' ').replace(/\{/g,"{~::~").replace(/\}/g,"~::~}~::~").replace(/\;/g,";~::~").replace(/\/\*/g,"~::~/*").replace(/\*\//g,"*/~::~").replace(/~::~\s{0,}~::~/g,"~::~").split('~::~'),l=b.length,d=0,e='',f=0,g=a?c(a):this.shift;for(f=0;f<l;f++){if(/\{/.exec(b[f])){e+=g[d++]+b[f];}else if(/\}/.exec(b[f])){e+=g[--d]+b[f];}else if(/\*\\/.exec(b[f])){e+=g[d]+b[f];}else{e+=g[d]+b[f];}}return e.replace(/^\n{1,}/,'');};function i(a,p){return p-(a.replace(/\(/g,'').length-a.replace(/\)/g,'').length)}function s(a,t){return a.replace(/\s{1,}/g," ").replace(/ AND /ig,"~::~"+t+t+"AND ").replace(/ BETWEEN /ig,"~::~"+t+"BETWEEN ").replace(/ CASE /ig,"~::~"+t+"CASE ").replace(/ ELSE /ig,"~::~"+t+"ELSE ").replace(/ END /ig,"~::~"+t+"END ").replace(/ FROM /ig,"~::~FROM ").replace(/ GROUP\s{1,}BY/ig,"~::~GROUP BY ").replace(/ HAVING /ig,"~::~HAVING ").replace(/ IN /ig," IN ").replace(/ JOIN /ig,"~::~JOIN ").replace(/ CROSS~::~{1,}JOIN /ig,"~::~CROSS JOIN ").replace(/ INNER~::~{1,}JOIN /ig,"~::~INNER JOIN ").replace(/ LEFT~::~{1,}JOIN /ig,"~::~LEFT JOIN ").replace(/ RIGHT~::~{1,}JOIN /ig,"~::~RIGHT JOIN ").replace(/ ON /ig,"~::~"+t+"ON ").replace(/ OR /ig,"~::~"+t+t+"OR ").replace(/ ORDER\s{1,}BY/ig,"~::~ORDER BY ").replace(/ OVER /ig,"~::~"+t+"OVER ").replace(/\(\s{0,}SELECT /ig,"~::~(SELECT ").replace(/\)\s{0,}SELECT /ig,")~::~SELECT ").replace(/ THEN /ig," THEN~::~"+t+"").replace(/ UNION /ig,"~::~UNION~::~").replace(/ USING /ig,"~::~USING ").replace(/ WHEN /ig,"~::~"+t+"WHEN ").replace(/ WHERE /ig,"~::~WHERE ").replace(/ WITH /ig,"~::~WITH ").replace(/ ALL /ig," ALL ").replace(/ AS /ig," AS ").replace(/ ASC /ig," ASC ").replace(/ DESC /ig," DESC ").replace(/ DISTINCT /ig," DISTINCT ").replace(/ EXISTS /ig," EXISTS ").replace(/ NOT /ig," NOT ").replace(/ NULL /ig," NULL ").replace(/ LIKE /ig," LIKE ").replace(/\s{0,}SELECT /ig,"SELECT ").replace(/\s{0,}UPDATE /ig,"UPDATE ").replace(/ SET /ig," SET ").replace(/~::~{1,}/g,"~::~").split('~::~');}v.prototype.sql=function(t,a){var b=t.replace(/\s{1,}/g," ").replace(/\'/ig,"~::~\'").split('~::~'),l=b.length,d=[],e=0,f=this.step,g=true,h=false,p=0,j='',k=0,m=a?c(a):this.shift;;for(k=0;k<l;k++){if(k%2){d=d.concat(b[k]);}else{d=d.concat(s(b[k],f));}}l=d.length;for(k=0;k<l;k++){p=i(d[k],p);if(/\s{0,}\s{0,}SELECT\s{0,}/.exec(d[k])){d[k]=d[k].replace(/\,/g,",\n"+f+f+"")}if(/\s{0,}\s{0,}SET\s{0,}/.exec(d[k])){d[k]=d[k].replace(/\,/g,",\n"+f+f+"")}if(/\s{0,}\(\s{0,}SELECT\s{0,}/.exec(d[k])){e++;j+=m[e]+d[k];}else if(/\'/.exec(d[k])){if(p<1&&e){e--;}j+=d[k];}else{j+=m[e]+d[k];if(p<1&&e){e--;}}var n=0;}j=j.replace(/^\n{1,}/,'').replace(/\n{1,}/g,"\n");return j;};v.prototype.xmlmin=function(t,p){var a=p?t:t.replace(/\<![ \r\n\t]*(--([^\-]|[\r\n]|-[^\-])*--[ \r\n\t]*)\>/g,"").replace(/[ \r\n\t]{1,}xmlns/g,' xmlns');return a.replace(/>\s{0,}</g,"><");};v.prototype.jsonmin=function(t){if(typeof JSON==='undefined')return t;return JSON.stringify(JSON.parse(t),null,0);};v.prototype.cssmin=function(t,p){var a=p?t:t.replace(/\/\*([^*]|[\r\n]|(\*+([^*\/]|[\r\n])))*\*+\//g,"");return a.replace(/\s{1,}/g,' ').replace(/\{\s{1,}/g,"{").replace(/\}\s{1,}/g,"}").replace(/\;\s{1,}/g,";").replace(/\/\*\s{1,}/g,"/*").replace(/\*\/\s{1,}/g,"*/");};v.prototype.sqlmin=function(t){return t.replace(/\s{1,}/g," ").replace(/\s{1,}\(/,"(").replace(/\s{1,}\)/,")");};window.vkbeautify=new v();})();
