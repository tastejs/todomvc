/*! URI.js v1.12.0 http://medialize.github.com/URI.js/ */
/* build contains: IPv6.js, punycode.js, SecondLevelDomains.js, URI.js, URI.fragmentQuery.js */
(function(e,k){"object"===typeof exports?module.exports=k():"function"===typeof define&&define.amd?define(k):e.IPv6=k(e)})(this,function(e){var k=e&&e.IPv6;return{best:function(e){e=e.toLowerCase().split(":");var k=e.length,d=8;""===e[0]&&""===e[1]&&""===e[2]?(e.shift(),e.shift()):""===e[0]&&""===e[1]?e.shift():""===e[k-1]&&""===e[k-2]&&e.pop();k=e.length;-1!==e[k-1].indexOf(".")&&(d=7);var g;for(g=0;g<k&&""!==e[g];g++);if(g<d)for(e.splice(g,1,"0000");e.length<d;)e.splice(g,0,"0000");for(g=0;g<d;g++){for(var k=
e[g].split(""),q=0;3>q;q++)if("0"===k[0]&&1<k.length)k.splice(0,1);else break;e[g]=k.join("")}var k=-1,l=q=0,r=-1,z=!1;for(g=0;g<d;g++)z?"0"===e[g]?l+=1:(z=!1,l>q&&(k=r,q=l)):"0"==e[g]&&(z=!0,r=g,l=1);l>q&&(k=r,q=l);1<q&&e.splice(k,q,"");k=e.length;d="";""===e[0]&&(beststr=":");for(g=0;g<k;g++){d+=e[g];if(g===k-1)break;d+=":"}""===e[k-1]&&(d+=":");return d},noConflict:function(){e.IPv6===this&&(e.IPv6=k);return this}}});
(function(e){function k(a){throw RangeError(p[a]);}function u(a,b){for(var c=a.length;c--;)a[c]=b(a[c]);return a}function m(a,b){return u(a.split(h),b).join(".")}function d(a){for(var b=[],c=0,d=a.length,h,p;c<d;)h=a.charCodeAt(c++),55296<=h&&56319>=h&&c<d?(p=a.charCodeAt(c++),56320==(p&64512)?b.push(((h&1023)<<10)+(p&1023)+65536):(b.push(h),c--)):b.push(h);return b}function g(a){return u(a,function(a){var b="";65535<a&&(a-=65536,b+=x(a>>>10&1023|55296),a=56320|a&1023);return b+=x(a)}).join("")}function q(a,
b){return a+22+75*(26>a)-((0!=b)<<5)}function l(a,b,c){var d=0;a=c?A(a/H):a>>1;for(a+=A(a/b);a>n*y>>1;d+=s)a=A(a/n);return A(d+(n+1)*a/(a+I))}function r(b){var c=[],d=b.length,h,p=0,e=F,f=G,n,x,q,t,m;n=b.lastIndexOf(a);0>n&&(n=0);for(x=0;x<n;++x)128<=b.charCodeAt(x)&&k("not-basic"),c.push(b.charCodeAt(x));for(n=0<n?n+1:0;n<d;){x=p;h=1;for(q=s;;q+=s){n>=d&&k("invalid-input");t=b.charCodeAt(n++);t=10>t-48?t-22:26>t-65?t-65:26>t-97?t-97:s;(t>=s||t>A((w-p)/h))&&k("overflow");p+=t*h;m=q<=f?v:q>=f+y?y:
q-f;if(t<m)break;t=s-m;h>A(w/t)&&k("overflow");h*=t}h=c.length+1;f=l(p-x,h,0==x);A(p/h)>w-e&&k("overflow");e+=A(p/h);p%=h;c.splice(p++,0,e)}return g(c)}function z(b){var c,h,p,e,f,n,g,m,r,t=[],B,u,z;b=d(b);B=b.length;c=F;h=0;f=G;for(n=0;n<B;++n)r=b[n],128>r&&t.push(x(r));for((p=e=t.length)&&t.push(a);p<B;){g=w;for(n=0;n<B;++n)r=b[n],r>=c&&r<g&&(g=r);u=p+1;g-c>A((w-h)/u)&&k("overflow");h+=(g-c)*u;c=g;for(n=0;n<B;++n)if(r=b[n],r<c&&++h>w&&k("overflow"),r==c){m=h;for(g=s;;g+=s){r=g<=f?v:g>=f+y?y:g-f;
if(m<r)break;z=m-r;m=s-r;t.push(x(q(r+z%m,0)));m=A(z/m)}t.push(x(q(m,0)));f=l(h,u,p==e);h=0;++p}++h;++c}return t.join("")}var D="object"==typeof exports&&exports,E="object"==typeof module&&module&&module.exports==D&&module,C="object"==typeof global&&global;if(C.global===C||C.window===C)e=C;var f,w=2147483647,s=36,v=1,y=26,I=38,H=700,G=72,F=128,a="-",b=/^xn--/,c=/[^ -~]/,h=/\x2E|\u3002|\uFF0E|\uFF61/g,p={overflow:"Overflow: input needs wider integers to process","not-basic":"Illegal input >= 0x80 (not a basic code point)",
"invalid-input":"Invalid input"},n=s-v,A=Math.floor,x=String.fromCharCode,B;f={version:"1.2.3",ucs2:{decode:d,encode:g},decode:r,encode:z,toASCII:function(a){return m(a,function(a){return c.test(a)?"xn--"+z(a):a})},toUnicode:function(a){return m(a,function(a){return b.test(a)?r(a.slice(4).toLowerCase()):a})}};if("function"==typeof define&&"object"==typeof define.amd&&define.amd)define(function(){return f});else if(D&&!D.nodeType)if(E)E.exports=f;else for(B in f)f.hasOwnProperty(B)&&(D[B]=f[B]);else e.punycode=
f})(this);
(function(e,k){"object"===typeof exports?module.exports=k():"function"===typeof define&&define.amd?define(k):e.SecondLevelDomains=k(e)})(this,function(e){var k=e&&e.SecondLevelDomains,u=Object.prototype.hasOwnProperty,m={list:{ac:"com|gov|mil|net|org",ae:"ac|co|gov|mil|name|net|org|pro|sch",af:"com|edu|gov|net|org",al:"com|edu|gov|mil|net|org",ao:"co|ed|gv|it|og|pb",ar:"com|edu|gob|gov|int|mil|net|org|tur",at:"ac|co|gv|or",au:"asn|com|csiro|edu|gov|id|net|org",ba:"co|com|edu|gov|mil|net|org|rs|unbi|unmo|unsa|untz|unze",bb:"biz|co|com|edu|gov|info|net|org|store|tv",
bh:"biz|cc|com|edu|gov|info|net|org",bn:"com|edu|gov|net|org",bo:"com|edu|gob|gov|int|mil|net|org|tv",br:"adm|adv|agr|am|arq|art|ato|b|bio|blog|bmd|cim|cng|cnt|com|coop|ecn|edu|eng|esp|etc|eti|far|flog|fm|fnd|fot|fst|g12|ggf|gov|imb|ind|inf|jor|jus|lel|mat|med|mil|mus|net|nom|not|ntr|odo|org|ppg|pro|psc|psi|qsl|rec|slg|srv|tmp|trd|tur|tv|vet|vlog|wiki|zlg",bs:"com|edu|gov|net|org",bz:"du|et|om|ov|rg",ca:"ab|bc|mb|nb|nf|nl|ns|nt|nu|on|pe|qc|sk|yk",ck:"biz|co|edu|gen|gov|info|net|org",cn:"ac|ah|bj|com|cq|edu|fj|gd|gov|gs|gx|gz|ha|hb|he|hi|hl|hn|jl|js|jx|ln|mil|net|nm|nx|org|qh|sc|sd|sh|sn|sx|tj|tw|xj|xz|yn|zj",
co:"com|edu|gov|mil|net|nom|org",cr:"ac|c|co|ed|fi|go|or|sa",cy:"ac|biz|com|ekloges|gov|ltd|name|net|org|parliament|press|pro|tm","do":"art|com|edu|gob|gov|mil|net|org|sld|web",dz:"art|asso|com|edu|gov|net|org|pol",ec:"com|edu|fin|gov|info|med|mil|net|org|pro",eg:"com|edu|eun|gov|mil|name|net|org|sci",er:"com|edu|gov|ind|mil|net|org|rochest|w",es:"com|edu|gob|nom|org",et:"biz|com|edu|gov|info|name|net|org",fj:"ac|biz|com|info|mil|name|net|org|pro",fk:"ac|co|gov|net|nom|org",fr:"asso|com|f|gouv|nom|prd|presse|tm",
gg:"co|net|org",gh:"com|edu|gov|mil|org",gn:"ac|com|gov|net|org",gr:"com|edu|gov|mil|net|org",gt:"com|edu|gob|ind|mil|net|org",gu:"com|edu|gov|net|org",hk:"com|edu|gov|idv|net|org",id:"ac|co|go|mil|net|or|sch|web",il:"ac|co|gov|idf|k12|muni|net|org","in":"ac|co|edu|ernet|firm|gen|gov|i|ind|mil|net|nic|org|res",iq:"com|edu|gov|i|mil|net|org",ir:"ac|co|dnssec|gov|i|id|net|org|sch",it:"edu|gov",je:"co|net|org",jo:"com|edu|gov|mil|name|net|org|sch",jp:"ac|ad|co|ed|go|gr|lg|ne|or",ke:"ac|co|go|info|me|mobi|ne|or|sc",
kh:"com|edu|gov|mil|net|org|per",ki:"biz|com|de|edu|gov|info|mob|net|org|tel",km:"asso|com|coop|edu|gouv|k|medecin|mil|nom|notaires|pharmaciens|presse|tm|veterinaire",kn:"edu|gov|net|org",kr:"ac|busan|chungbuk|chungnam|co|daegu|daejeon|es|gangwon|go|gwangju|gyeongbuk|gyeonggi|gyeongnam|hs|incheon|jeju|jeonbuk|jeonnam|k|kg|mil|ms|ne|or|pe|re|sc|seoul|ulsan",kw:"com|edu|gov|net|org",ky:"com|edu|gov|net|org",kz:"com|edu|gov|mil|net|org",lb:"com|edu|gov|net|org",lk:"assn|com|edu|gov|grp|hotel|int|ltd|net|ngo|org|sch|soc|web",
lr:"com|edu|gov|net|org",lv:"asn|com|conf|edu|gov|id|mil|net|org",ly:"com|edu|gov|id|med|net|org|plc|sch",ma:"ac|co|gov|m|net|org|press",mc:"asso|tm",me:"ac|co|edu|gov|its|net|org|priv",mg:"com|edu|gov|mil|nom|org|prd|tm",mk:"com|edu|gov|inf|name|net|org|pro",ml:"com|edu|gov|net|org|presse",mn:"edu|gov|org",mo:"com|edu|gov|net|org",mt:"com|edu|gov|net|org",mv:"aero|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro",mw:"ac|co|com|coop|edu|gov|int|museum|net|org",mx:"com|edu|gob|net|org",my:"com|edu|gov|mil|name|net|org|sch",
nf:"arts|com|firm|info|net|other|per|rec|store|web",ng:"biz|com|edu|gov|mil|mobi|name|net|org|sch",ni:"ac|co|com|edu|gob|mil|net|nom|org",np:"com|edu|gov|mil|net|org",nr:"biz|com|edu|gov|info|net|org",om:"ac|biz|co|com|edu|gov|med|mil|museum|net|org|pro|sch",pe:"com|edu|gob|mil|net|nom|org|sld",ph:"com|edu|gov|i|mil|net|ngo|org",pk:"biz|com|edu|fam|gob|gok|gon|gop|gos|gov|net|org|web",pl:"art|bialystok|biz|com|edu|gda|gdansk|gorzow|gov|info|katowice|krakow|lodz|lublin|mil|net|ngo|olsztyn|org|poznan|pwr|radom|slupsk|szczecin|torun|warszawa|waw|wroc|wroclaw|zgora",
pr:"ac|biz|com|edu|est|gov|info|isla|name|net|org|pro|prof",ps:"com|edu|gov|net|org|plo|sec",pw:"belau|co|ed|go|ne|or",ro:"arts|com|firm|info|nom|nt|org|rec|store|tm|www",rs:"ac|co|edu|gov|in|org",sb:"com|edu|gov|net|org",sc:"com|edu|gov|net|org",sh:"co|com|edu|gov|net|nom|org",sl:"com|edu|gov|net|org",st:"co|com|consulado|edu|embaixada|gov|mil|net|org|principe|saotome|store",sv:"com|edu|gob|org|red",sz:"ac|co|org",tr:"av|bbs|bel|biz|com|dr|edu|gen|gov|info|k12|name|net|org|pol|tel|tsk|tv|web",tt:"aero|biz|cat|co|com|coop|edu|gov|info|int|jobs|mil|mobi|museum|name|net|org|pro|tel|travel",
tw:"club|com|ebiz|edu|game|gov|idv|mil|net|org",mu:"ac|co|com|gov|net|or|org",mz:"ac|co|edu|gov|org",na:"co|com",nz:"ac|co|cri|geek|gen|govt|health|iwi|maori|mil|net|org|parliament|school",pa:"abo|ac|com|edu|gob|ing|med|net|nom|org|sld",pt:"com|edu|gov|int|net|nome|org|publ",py:"com|edu|gov|mil|net|org",qa:"com|edu|gov|mil|net|org",re:"asso|com|nom",ru:"ac|adygeya|altai|amur|arkhangelsk|astrakhan|bashkiria|belgorod|bir|bryansk|buryatia|cbg|chel|chelyabinsk|chita|chukotka|chuvashia|com|dagestan|e-burg|edu|gov|grozny|int|irkutsk|ivanovo|izhevsk|jar|joshkar-ola|kalmykia|kaluga|kamchatka|karelia|kazan|kchr|kemerovo|khabarovsk|khakassia|khv|kirov|koenig|komi|kostroma|kranoyarsk|kuban|kurgan|kursk|lipetsk|magadan|mari|mari-el|marine|mil|mordovia|mosreg|msk|murmansk|nalchik|net|nnov|nov|novosibirsk|nsk|omsk|orenburg|org|oryol|penza|perm|pp|pskov|ptz|rnd|ryazan|sakhalin|samara|saratov|simbirsk|smolensk|spb|stavropol|stv|surgut|tambov|tatarstan|tom|tomsk|tsaritsyn|tsk|tula|tuva|tver|tyumen|udm|udmurtia|ulan-ude|vladikavkaz|vladimir|vladivostok|volgograd|vologda|voronezh|vrn|vyatka|yakutia|yamal|yekaterinburg|yuzhno-sakhalinsk",
rw:"ac|co|com|edu|gouv|gov|int|mil|net",sa:"com|edu|gov|med|net|org|pub|sch",sd:"com|edu|gov|info|med|net|org|tv",se:"a|ac|b|bd|c|d|e|f|g|h|i|k|l|m|n|o|org|p|parti|pp|press|r|s|t|tm|u|w|x|y|z",sg:"com|edu|gov|idn|net|org|per",sn:"art|com|edu|gouv|org|perso|univ",sy:"com|edu|gov|mil|net|news|org",th:"ac|co|go|in|mi|net|or",tj:"ac|biz|co|com|edu|go|gov|info|int|mil|name|net|nic|org|test|web",tn:"agrinet|com|defense|edunet|ens|fin|gov|ind|info|intl|mincom|nat|net|org|perso|rnrt|rns|rnu|tourism",tz:"ac|co|go|ne|or",
ua:"biz|cherkassy|chernigov|chernovtsy|ck|cn|co|com|crimea|cv|dn|dnepropetrovsk|donetsk|dp|edu|gov|if|in|ivano-frankivsk|kh|kharkov|kherson|khmelnitskiy|kiev|kirovograd|km|kr|ks|kv|lg|lugansk|lutsk|lviv|me|mk|net|nikolaev|od|odessa|org|pl|poltava|pp|rovno|rv|sebastopol|sumy|te|ternopil|uzhgorod|vinnica|vn|zaporizhzhe|zhitomir|zp|zt",ug:"ac|co|go|ne|or|org|sc",uk:"ac|bl|british-library|co|cym|gov|govt|icnet|jet|lea|ltd|me|mil|mod|national-library-scotland|nel|net|nhs|nic|nls|org|orgn|parliament|plc|police|sch|scot|soc",
us:"dni|fed|isa|kids|nsn",uy:"com|edu|gub|mil|net|org",ve:"co|com|edu|gob|info|mil|net|org|web",vi:"co|com|k12|net|org",vn:"ac|biz|com|edu|gov|health|info|int|name|net|org|pro",ye:"co|com|gov|ltd|me|net|org|plc",yu:"ac|co|edu|gov|org",za:"ac|agric|alt|bourse|city|co|cybernet|db|edu|gov|grondar|iaccess|imt|inca|landesign|law|mil|net|ngo|nis|nom|olivetti|org|pix|school|tm|web",zm:"ac|co|com|edu|gov|net|org|sch"},has_expression:null,is_expression:null,has:function(d){return!!d.match(m.has_expression)},
is:function(d){return!!d.match(m.is_expression)},get:function(d){return(d=d.match(m.has_expression))&&d[1]||null},noConflict:function(){e.SecondLevelDomains===this&&(e.SecondLevelDomains=k);return this},init:function(){var d="",e;for(e in m.list)u.call(m.list,e)&&(d+="|("+("("+m.list[e]+")."+e)+")");m.has_expression=RegExp("\\.("+d.substr(1)+")$","i");m.is_expression=RegExp("^("+d.substr(1)+")$","i")}};m.init();return m});
(function(e,k){"object"===typeof exports?module.exports=k(require("./punycode"),require("./IPv6"),require("./SecondLevelDomains")):"function"===typeof define&&define.amd?define(["./punycode","./IPv6","./SecondLevelDomains"],k):e.URI=k(e.punycode,e.IPv6,e.SecondLevelDomains,e)})(this,function(e,k,u,m){function d(a,b){if(!(this instanceof d))return new d(a,b);void 0===a&&(a="undefined"!==typeof location?location.href+"":"");this.href(a);return void 0!==b?this.absoluteTo(b):this}function g(a){return a.replace(/([.*+?^=!:${}()|[\]\/\\])/g,
"\\$1")}function q(a){return void 0===a?"Undefined":String(Object.prototype.toString.call(a)).slice(8,-1)}function l(a){return"Array"===q(a)}function r(a,b){var c,d;if(l(b)){c=0;for(d=b.length;c<d;c++)if(!r(a,b[c]))return!1;return!0}var p=q(b);c=0;for(d=a.length;c<d;c++)if("RegExp"===p){if("string"===typeof a[c]&&a[c].match(b))return!0}else if(a[c]===b)return!0;return!1}function z(a,b){if(!l(a)||!l(b)||a.length!==b.length)return!1;a.sort();b.sort();for(var c=0,d=a.length;c<d;c++)if(a[c]!==b[c])return!1;
return!0}function D(a){return escape(a)}function E(a){return encodeURIComponent(a).replace(/[!'()*]/g,D).replace(/\*/g,"%2A")}var C=m&&m.URI;d.version="1.12.0";var f=d.prototype,w=Object.prototype.hasOwnProperty;d._parts=function(){return{protocol:null,username:null,password:null,hostname:null,urn:null,port:null,path:null,query:null,fragment:null,duplicateQueryParameters:d.duplicateQueryParameters,escapeQuerySpace:d.escapeQuerySpace}};d.duplicateQueryParameters=!1;d.escapeQuerySpace=!0;d.protocol_expression=
/^[a-z][a-z0-9.+-]*$/i;d.idn_expression=/[^a-z0-9\.-]/i;d.punycode_expression=/(xn--)/i;d.ip4_expression=/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/;d.ip6_expression=/^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$/;
d.find_uri_expression=/\b((?:[a-z][\w-]+:(?:\/{1,3}|[a-z0-9%])|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?\u00ab\u00bb\u201c\u201d\u2018\u2019]))/ig;d.findUri={start:/\b(?:([a-z][a-z0-9.+-]*:\/\/)|www\.)/gi,end:/[\s\r\n]|$/,trim:/[`!()\[\]{};:'".,<>?\u00ab\u00bb\u201c\u201d\u201e\u2018\u2019]+$/};d.defaultPorts={http:"80",https:"443",ftp:"21",gopher:"70",ws:"80",wss:"443"};d.invalid_hostname_characters=
/[^a-zA-Z0-9\.-]/;d.domAttributes={a:"href",blockquote:"cite",link:"href",base:"href",script:"src",form:"action",img:"src",area:"href",iframe:"src",embed:"src",source:"src",track:"src",input:"src"};d.getDomAttribute=function(a){if(a&&a.nodeName){var b=a.nodeName.toLowerCase();return"input"===b&&"image"!==a.type?void 0:d.domAttributes[b]}};d.encode=E;d.decode=decodeURIComponent;d.iso8859=function(){d.encode=escape;d.decode=unescape};d.unicode=function(){d.encode=E;d.decode=decodeURIComponent};d.characters=
{pathname:{encode:{expression:/%(24|26|2B|2C|3B|3D|3A|40)/ig,map:{"%24":"$","%26":"&","%2B":"+","%2C":",","%3B":";","%3D":"=","%3A":":","%40":"@"}},decode:{expression:/[\/\?#]/g,map:{"/":"%2F","?":"%3F","#":"%23"}}},reserved:{encode:{expression:/%(21|23|24|26|27|28|29|2A|2B|2C|2F|3A|3B|3D|3F|40|5B|5D)/ig,map:{"%3A":":","%2F":"/","%3F":"?","%23":"#","%5B":"[","%5D":"]","%40":"@","%21":"!","%24":"$","%26":"&","%27":"'","%28":"(","%29":")","%2A":"*","%2B":"+","%2C":",","%3B":";","%3D":"="}}}};d.encodeQuery=
function(a,b){var c=d.encode(a+"");return b?c.replace(/%20/g,"+"):c};d.decodeQuery=function(a,b){a+="";try{return d.decode(b?a.replace(/\+/g,"%20"):a)}catch(c){return a}};d.recodePath=function(a){a=(a+"").split("/");for(var b=0,c=a.length;b<c;b++)a[b]=d.encodePathSegment(d.decode(a[b]));return a.join("/")};d.decodePath=function(a){a=(a+"").split("/");for(var b=0,c=a.length;b<c;b++)a[b]=d.decodePathSegment(a[b]);return a.join("/")};var s={encode:"encode",decode:"decode"},v,y=function(a,b){return function(c){return d[b](c+
"").replace(d.characters[a][b].expression,function(c){return d.characters[a][b].map[c]})}};for(v in s)d[v+"PathSegment"]=y("pathname",s[v]);d.encodeReserved=y("reserved","encode");d.parse=function(a,b){var c;b||(b={});c=a.indexOf("#");-1<c&&(b.fragment=a.substring(c+1)||null,a=a.substring(0,c));c=a.indexOf("?");-1<c&&(b.query=a.substring(c+1)||null,a=a.substring(0,c));"//"===a.substring(0,2)?(b.protocol=null,a=a.substring(2),a=d.parseAuthority(a,b)):(c=a.indexOf(":"),-1<c&&(b.protocol=a.substring(0,
c)||null,b.protocol&&!b.protocol.match(d.protocol_expression)?b.protocol=void 0:"file"===b.protocol?a=a.substring(c+3):"//"===a.substring(c+1,c+3)?(a=a.substring(c+3),a=d.parseAuthority(a,b)):(a=a.substring(c+1),b.urn=!0)));b.path=a;return b};d.parseHost=function(a,b){var c=a.indexOf("/"),d;-1===c&&(c=a.length);"["===a.charAt(0)?(d=a.indexOf("]"),b.hostname=a.substring(1,d)||null,b.port=a.substring(d+2,c)||null):a.indexOf(":")!==a.lastIndexOf(":")?(b.hostname=a.substring(0,c)||null,b.port=null):(d=
a.substring(0,c).split(":"),b.hostname=d[0]||null,b.port=d[1]||null);b.hostname&&"/"!==a.substring(c).charAt(0)&&(c++,a="/"+a);return a.substring(c)||"/"};d.parseAuthority=function(a,b){a=d.parseUserinfo(a,b);return d.parseHost(a,b)};d.parseUserinfo=function(a,b){var c=a.indexOf("/"),h=-1<c?a.lastIndexOf("@",c):a.indexOf("@");-1<h&&(-1===c||h<c)?(c=a.substring(0,h).split(":"),b.username=c[0]?d.decode(c[0]):null,c.shift(),b.password=c[0]?d.decode(c.join(":")):null,a=a.substring(h+1)):(b.username=null,
b.password=null);return a};d.parseQuery=function(a,b){if(!a)return{};a=a.replace(/&+/g,"&").replace(/^\?*&*|&+$/g,"");if(!a)return{};for(var c={},h=a.split("&"),p=h.length,n,e,f=0;f<p;f++)n=h[f].split("="),e=d.decodeQuery(n.shift(),b),n=n.length?d.decodeQuery(n.join("="),b):null,c[e]?("string"===typeof c[e]&&(c[e]=[c[e]]),c[e].push(n)):c[e]=n;return c};d.build=function(a){var b="";a.protocol&&(b+=a.protocol+":");a.urn||!b&&!a.hostname||(b+="//");b+=d.buildAuthority(a)||"";"string"===typeof a.path&&
("/"!==a.path.charAt(0)&&"string"===typeof a.hostname&&(b+="/"),b+=a.path);"string"===typeof a.query&&a.query&&(b+="?"+a.query);"string"===typeof a.fragment&&a.fragment&&(b+="#"+a.fragment);return b};d.buildHost=function(a){var b="";if(a.hostname)d.ip6_expression.test(a.hostname)?b=a.port?b+("["+a.hostname+"]:"+a.port):b+a.hostname:(b+=a.hostname,a.port&&(b+=":"+a.port));else return"";return b};d.buildAuthority=function(a){return d.buildUserinfo(a)+d.buildHost(a)};d.buildUserinfo=function(a){var b=
"";a.username&&(b+=d.encode(a.username),a.password&&(b+=":"+d.encode(a.password)),b+="@");return b};d.buildQuery=function(a,b,c){var h="",p,e,f,k;for(e in a)if(w.call(a,e)&&e)if(l(a[e]))for(p={},f=0,k=a[e].length;f<k;f++)void 0!==a[e][f]&&void 0===p[a[e][f]+""]&&(h+="&"+d.buildQueryParameter(e,a[e][f],c),!0!==b&&(p[a[e][f]+""]=!0));else void 0!==a[e]&&(h+="&"+d.buildQueryParameter(e,a[e],c));return h.substring(1)};d.buildQueryParameter=function(a,b,c){return d.encodeQuery(a,c)+(null!==b?"="+d.encodeQuery(b,
c):"")};d.addQuery=function(a,b,c){if("object"===typeof b)for(var h in b)w.call(b,h)&&d.addQuery(a,h,b[h]);else if("string"===typeof b)void 0===a[b]?a[b]=c:("string"===typeof a[b]&&(a[b]=[a[b]]),l(c)||(c=[c]),a[b]=a[b].concat(c));else throw new TypeError("URI.addQuery() accepts an object, string as the name parameter");};d.removeQuery=function(a,b,c){var h;if(l(b))for(c=0,h=b.length;c<h;c++)a[b[c]]=void 0;else if("object"===typeof b)for(h in b)w.call(b,h)&&d.removeQuery(a,h,b[h]);else if("string"===
typeof b)if(void 0!==c)if(a[b]===c)a[b]=void 0;else{if(l(a[b])){h=a[b];var p={},e,f;if(l(c))for(e=0,f=c.length;e<f;e++)p[c[e]]=!0;else p[c]=!0;e=0;for(f=h.length;e<f;e++)void 0!==p[h[e]]&&(h.splice(e,1),f--,e--);a[b]=h}}else a[b]=void 0;else throw new TypeError("URI.addQuery() accepts an object, string as the first parameter");};d.hasQuery=function(a,b,c,h){if("object"===typeof b){for(var e in b)if(w.call(b,e)&&!d.hasQuery(a,e,b[e]))return!1;return!0}if("string"!==typeof b)throw new TypeError("URI.hasQuery() accepts an object, string as the name parameter");
switch(q(c)){case "Undefined":return b in a;case "Boolean":return a=Boolean(l(a[b])?a[b].length:a[b]),c===a;case "Function":return!!c(a[b],b,a);case "Array":return l(a[b])?(h?r:z)(a[b],c):!1;case "RegExp":return l(a[b])?h?r(a[b],c):!1:Boolean(a[b]&&a[b].match(c));case "Number":c=String(c);case "String":return l(a[b])?h?r(a[b],c):!1:a[b]===c;default:throw new TypeError("URI.hasQuery() accepts undefined, boolean, string, number, RegExp, Function as the value parameter");}};d.commonPath=function(a,b){var c=
Math.min(a.length,b.length),d;for(d=0;d<c;d++)if(a.charAt(d)!==b.charAt(d)){d--;break}if(1>d)return a.charAt(0)===b.charAt(0)&&"/"===a.charAt(0)?"/":"";if("/"!==a.charAt(d)||"/"!==b.charAt(d))d=a.substring(0,d).lastIndexOf("/");return a.substring(0,d+1)};d.withinString=function(a,b,c){c||(c={});var h=c.start||d.findUri.start,e=c.end||d.findUri.end,f=c.trim||d.findUri.trim,k=/[a-z0-9-]=["']?$/i;for(h.lastIndex=0;;){var g=h.exec(a);if(!g)break;g=g.index;if(c.ignoreHtml){var l=a.slice(Math.max(g-3,0),
g);if(l&&k.test(l))continue}var l=g+a.slice(g).search(e),q=a.slice(g,l).replace(f,"");c.ignore&&c.ignore.test(q)||(l=g+q.length,q=b(q,g,l,a),a=a.slice(0,g)+q+a.slice(l),h.lastIndex=g+q.length)}h.lastIndex=0;return a};d.ensureValidHostname=function(a){if(a.match(d.invalid_hostname_characters)){if(!e)throw new TypeError("Hostname '"+a+"' contains characters other than [A-Z0-9.-] and Punycode.js is not available");if(e.toASCII(a).match(d.invalid_hostname_characters))throw new TypeError("Hostname '"+
a+"' contains characters other than [A-Z0-9.-]");}};d.noConflict=function(a){if(a)return a={URI:this.noConflict()},URITemplate&&"function"==typeof URITemplate.noConflict&&(a.URITemplate=URITemplate.noConflict()),k&&"function"==typeof k.noConflict&&(a.IPv6=k.noConflict()),SecondLevelDomains&&"function"==typeof SecondLevelDomains.noConflict&&(a.SecondLevelDomains=SecondLevelDomains.noConflict()),a;m.URI===this&&(m.URI=C);return this};f.build=function(a){if(!0===a)this._deferred_build=!0;else if(void 0===
a||this._deferred_build)this._string=d.build(this._parts),this._deferred_build=!1;return this};f.clone=function(){return new d(this)};f.valueOf=f.toString=function(){return this.build(!1)._string};s={protocol:"protocol",username:"username",password:"password",hostname:"hostname",port:"port"};y=function(a){return function(b,c){if(void 0===b)return this._parts[a]||"";this._parts[a]=b||null;this.build(!c);return this}};for(v in s)f[v]=y(s[v]);s={query:"?",fragment:"#"};y=function(a,b){return function(c,
d){if(void 0===c)return this._parts[a]||"";null!==c&&(c+="",c.charAt(0)===b&&(c=c.substring(1)));this._parts[a]=c;this.build(!d);return this}};for(v in s)f[v]=y(v,s[v]);s={search:["?","query"],hash:["#","fragment"]};y=function(a,b){return function(c,d){var e=this[a](c,d);return"string"===typeof e&&e.length?b+e:e}};for(v in s)f[v]=y(s[v][1],s[v][0]);f.pathname=function(a,b){if(void 0===a||!0===a){var c=this._parts.path||(this._parts.hostname?"/":"");return a?d.decodePath(c):c}this._parts.path=a?d.recodePath(a):
"/";this.build(!b);return this};f.path=f.pathname;f.href=function(a,b){var c;if(void 0===a)return this.toString();this._string="";this._parts=d._parts();var h=a instanceof d,e="object"===typeof a&&(a.hostname||a.path||a.pathname);a.nodeName&&(e=d.getDomAttribute(a),a=a[e]||"",e=!1);!h&&e&&void 0!==a.pathname&&(a=a.toString());if("string"===typeof a)this._parts=d.parse(a,this._parts);else if(h||e)for(c in h=h?a._parts:a,h)w.call(this._parts,c)&&(this._parts[c]=h[c]);else throw new TypeError("invalid input");
this.build(!b);return this};f.is=function(a){var b=!1,c=!1,h=!1,e=!1,f=!1,g=!1,k=!1,l=!this._parts.urn;this._parts.hostname&&(l=!1,c=d.ip4_expression.test(this._parts.hostname),h=d.ip6_expression.test(this._parts.hostname),b=c||h,f=(e=!b)&&u&&u.has(this._parts.hostname),g=e&&d.idn_expression.test(this._parts.hostname),k=e&&d.punycode_expression.test(this._parts.hostname));switch(a.toLowerCase()){case "relative":return l;case "absolute":return!l;case "domain":case "name":return e;case "sld":return f;
case "ip":return b;case "ip4":case "ipv4":case "inet4":return c;case "ip6":case "ipv6":case "inet6":return h;case "idn":return g;case "url":return!this._parts.urn;case "urn":return!!this._parts.urn;case "punycode":return k}return null};var I=f.protocol,H=f.port,G=f.hostname;f.protocol=function(a,b){if(void 0!==a&&a&&(a=a.replace(/:(\/\/)?$/,""),!a.match(d.protocol_expression)))throw new TypeError("Protocol '"+a+"' contains characters other than [A-Z0-9.+-] or doesn't start with [A-Z]");return I.call(this,
a,b)};f.scheme=f.protocol;f.port=function(a,b){if(this._parts.urn)return void 0===a?"":this;if(void 0!==a&&(0===a&&(a=null),a&&(a+="",":"===a.charAt(0)&&(a=a.substring(1)),a.match(/[^0-9]/))))throw new TypeError("Port '"+a+"' contains characters other than [0-9]");return H.call(this,a,b)};f.hostname=function(a,b){if(this._parts.urn)return void 0===a?"":this;if(void 0!==a){var c={};d.parseHost(a,c);a=c.hostname}return G.call(this,a,b)};f.host=function(a,b){if(this._parts.urn)return void 0===a?"":this;
if(void 0===a)return this._parts.hostname?d.buildHost(this._parts):"";d.parseHost(a,this._parts);this.build(!b);return this};f.authority=function(a,b){if(this._parts.urn)return void 0===a?"":this;if(void 0===a)return this._parts.hostname?d.buildAuthority(this._parts):"";d.parseAuthority(a,this._parts);this.build(!b);return this};f.userinfo=function(a,b){if(this._parts.urn)return void 0===a?"":this;if(void 0===a){if(!this._parts.username)return"";var c=d.buildUserinfo(this._parts);return c.substring(0,
c.length-1)}"@"!==a[a.length-1]&&(a+="@");d.parseUserinfo(a,this._parts);this.build(!b);return this};f.resource=function(a,b){var c;if(void 0===a)return this.path()+this.search()+this.hash();c=d.parse(a);this._parts.path=c.path;this._parts.query=c.query;this._parts.fragment=c.fragment;this.build(!b);return this};f.subdomain=function(a,b){if(this._parts.urn)return void 0===a?"":this;if(void 0===a){if(!this._parts.hostname||this.is("IP"))return"";var c=this._parts.hostname.length-this.domain().length-
1;return this._parts.hostname.substring(0,c)||""}c=this._parts.hostname.length-this.domain().length;c=this._parts.hostname.substring(0,c);c=RegExp("^"+g(c));a&&"."!==a.charAt(a.length-1)&&(a+=".");a&&d.ensureValidHostname(a);this._parts.hostname=this._parts.hostname.replace(c,a);this.build(!b);return this};f.domain=function(a,b){if(this._parts.urn)return void 0===a?"":this;"boolean"===typeof a&&(b=a,a=void 0);if(void 0===a){if(!this._parts.hostname||this.is("IP"))return"";var c=this._parts.hostname.match(/\./g);
if(c&&2>c.length)return this._parts.hostname;c=this._parts.hostname.length-this.tld(b).length-1;c=this._parts.hostname.lastIndexOf(".",c-1)+1;return this._parts.hostname.substring(c)||""}if(!a)throw new TypeError("cannot set domain empty");d.ensureValidHostname(a);!this._parts.hostname||this.is("IP")?this._parts.hostname=a:(c=RegExp(g(this.domain())+"$"),this._parts.hostname=this._parts.hostname.replace(c,a));this.build(!b);return this};f.tld=function(a,b){if(this._parts.urn)return void 0===a?"":
this;"boolean"===typeof a&&(b=a,a=void 0);if(void 0===a){if(!this._parts.hostname||this.is("IP"))return"";var c=this._parts.hostname.lastIndexOf("."),c=this._parts.hostname.substring(c+1);return!0!==b&&u&&u.list[c.toLowerCase()]?u.get(this._parts.hostname)||c:c}if(a)if(a.match(/[^a-zA-Z0-9-]/))if(u&&u.is(a))c=RegExp(g(this.tld())+"$"),this._parts.hostname=this._parts.hostname.replace(c,a);else throw new TypeError("TLD '"+a+"' contains characters other than [A-Z0-9]");else{if(!this._parts.hostname||
this.is("IP"))throw new ReferenceError("cannot set TLD on non-domain host");c=RegExp(g(this.tld())+"$");this._parts.hostname=this._parts.hostname.replace(c,a)}else throw new TypeError("cannot set TLD empty");this.build(!b);return this};f.directory=function(a,b){if(this._parts.urn)return void 0===a?"":this;if(void 0===a||!0===a){if(!this._parts.path&&!this._parts.hostname)return"";if("/"===this._parts.path)return"/";var c=this._parts.path.length-this.filename().length-1,c=this._parts.path.substring(0,
c)||(this._parts.hostname?"/":"");return a?d.decodePath(c):c}c=this._parts.path.length-this.filename().length;c=this._parts.path.substring(0,c);c=RegExp("^"+g(c));this.is("relative")||(a||(a="/"),"/"!==a.charAt(0)&&(a="/"+a));a&&"/"!==a.charAt(a.length-1)&&(a+="/");a=d.recodePath(a);this._parts.path=this._parts.path.replace(c,a);this.build(!b);return this};f.filename=function(a,b){if(this._parts.urn)return void 0===a?"":this;if(void 0===a||!0===a){if(!this._parts.path||"/"===this._parts.path)return"";
var c=this._parts.path.lastIndexOf("/"),c=this._parts.path.substring(c+1);return a?d.decodePathSegment(c):c}c=!1;"/"===a.charAt(0)&&(a=a.substring(1));a.match(/\.?\//)&&(c=!0);var h=RegExp(g(this.filename())+"$");a=d.recodePath(a);this._parts.path=this._parts.path.replace(h,a);c?this.normalizePath(b):this.build(!b);return this};f.suffix=function(a,b){if(this._parts.urn)return void 0===a?"":this;if(void 0===a||!0===a){if(!this._parts.path||"/"===this._parts.path)return"";var c=this.filename(),h=c.lastIndexOf(".");
if(-1===h)return"";c=c.substring(h+1);c=/^[a-z0-9%]+$/i.test(c)?c:"";return a?d.decodePathSegment(c):c}"."===a.charAt(0)&&(a=a.substring(1));if(c=this.suffix())h=a?RegExp(g(c)+"$"):RegExp(g("."+c)+"$");else{if(!a)return this;this._parts.path+="."+d.recodePath(a)}h&&(a=d.recodePath(a),this._parts.path=this._parts.path.replace(h,a));this.build(!b);return this};f.segment=function(a,b,c){var d=this._parts.urn?":":"/",e=this.path(),f="/"===e.substring(0,1),e=e.split(d);void 0!==a&&"number"!==typeof a&&
(c=b,b=a,a=void 0);if(void 0!==a&&"number"!==typeof a)throw Error("Bad segment '"+a+"', must be 0-based integer");f&&e.shift();0>a&&(a=Math.max(e.length+a,0));if(void 0===b)return void 0===a?e:e[a];if(null===a||void 0===e[a])if(l(b)){e=[];a=0;for(var g=b.length;a<g;a++)if(b[a].length||e.length&&e[e.length-1].length)e.length&&!e[e.length-1].length&&e.pop(),e.push(b[a])}else{if(b||"string"===typeof b)""===e[e.length-1]?e[e.length-1]=b:e.push(b)}else b||"string"===typeof b&&b.length?e[a]=b:e.splice(a,
1);f&&e.unshift("");return this.path(e.join(d),c)};f.segmentCoded=function(a,b,c){var e,f;"number"!==typeof a&&(c=b,b=a,a=void 0);if(void 0===b){a=this.segment(a,b,c);if(l(a))for(e=0,f=a.length;e<f;e++)a[e]=d.decode(a[e]);else a=void 0!==a?d.decode(a):void 0;return a}if(l(b))for(e=0,f=b.length;e<f;e++)b[e]=d.decode(b[e]);else b="string"===typeof b?d.encode(b):b;return this.segment(a,b,c)};var F=f.query;f.query=function(a,b){if(!0===a)return d.parseQuery(this._parts.query,this._parts.escapeQuerySpace);
if("function"===typeof a){var c=d.parseQuery(this._parts.query,this._parts.escapeQuerySpace),e=a.call(this,c);this._parts.query=d.buildQuery(e||c,this._parts.duplicateQueryParameters,this._parts.escapeQuerySpace);this.build(!b);return this}return void 0!==a&&"string"!==typeof a?(this._parts.query=d.buildQuery(a,this._parts.duplicateQueryParameters,this._parts.escapeQuerySpace),this.build(!b),this):F.call(this,a,b)};f.setQuery=function(a,b,c){var e=d.parseQuery(this._parts.query,this._parts.escapeQuerySpace);
if("object"===typeof a)for(var f in a)w.call(a,f)&&(e[f]=a[f]);else if("string"===typeof a)e[a]=void 0!==b?b:null;else throw new TypeError("URI.addQuery() accepts an object, string as the name parameter");this._parts.query=d.buildQuery(e,this._parts.duplicateQueryParameters,this._parts.escapeQuerySpace);"string"!==typeof a&&(c=b);this.build(!c);return this};f.addQuery=function(a,b,c){var e=d.parseQuery(this._parts.query,this._parts.escapeQuerySpace);d.addQuery(e,a,void 0===b?null:b);this._parts.query=
d.buildQuery(e,this._parts.duplicateQueryParameters,this._parts.escapeQuerySpace);"string"!==typeof a&&(c=b);this.build(!c);return this};f.removeQuery=function(a,b,c){var e=d.parseQuery(this._parts.query,this._parts.escapeQuerySpace);d.removeQuery(e,a,b);this._parts.query=d.buildQuery(e,this._parts.duplicateQueryParameters,this._parts.escapeQuerySpace);"string"!==typeof a&&(c=b);this.build(!c);return this};f.hasQuery=function(a,b,c){var e=d.parseQuery(this._parts.query,this._parts.escapeQuerySpace);
return d.hasQuery(e,a,b,c)};f.setSearch=f.setQuery;f.addSearch=f.addQuery;f.removeSearch=f.removeQuery;f.hasSearch=f.hasQuery;f.normalize=function(){return this._parts.urn?this.normalizeProtocol(!1).normalizeQuery(!1).normalizeFragment(!1).build():this.normalizeProtocol(!1).normalizeHostname(!1).normalizePort(!1).normalizePath(!1).normalizeQuery(!1).normalizeFragment(!1).build()};f.normalizeProtocol=function(a){"string"===typeof this._parts.protocol&&(this._parts.protocol=this._parts.protocol.toLowerCase(),
this.build(!a));return this};f.normalizeHostname=function(a){this._parts.hostname&&(this.is("IDN")&&e?this._parts.hostname=e.toASCII(this._parts.hostname):this.is("IPv6")&&k&&(this._parts.hostname=k.best(this._parts.hostname)),this._parts.hostname=this._parts.hostname.toLowerCase(),this.build(!a));return this};f.normalizePort=function(a){"string"===typeof this._parts.protocol&&this._parts.port===d.defaultPorts[this._parts.protocol]&&(this._parts.port=null,this.build(!a));return this};f.normalizePath=
function(a){if(this._parts.urn||!this._parts.path||"/"===this._parts.path)return this;var b,c=this._parts.path,e="",f,g;"/"!==c.charAt(0)&&(b=!0,c="/"+c);c=c.replace(/(\/(\.\/)+)|(\/\.$)/g,"/").replace(/\/{2,}/g,"/");b&&(e=c.substring(1).match(/^(\.\.\/)+/)||"")&&(e=e[0]);for(;;){f=c.indexOf("/..");if(-1===f)break;else if(0===f){c=c.substring(3);continue}g=c.substring(0,f).lastIndexOf("/");-1===g&&(g=f);c=c.substring(0,g)+c.substring(f+3)}b&&this.is("relative")&&(c=e+c.substring(1));c=d.recodePath(c);
this._parts.path=c;this.build(!a);return this};f.normalizePathname=f.normalizePath;f.normalizeQuery=function(a){"string"===typeof this._parts.query&&(this._parts.query.length?this.query(d.parseQuery(this._parts.query,this._parts.escapeQuerySpace)):this._parts.query=null,this.build(!a));return this};f.normalizeFragment=function(a){this._parts.fragment||(this._parts.fragment=null,this.build(!a));return this};f.normalizeSearch=f.normalizeQuery;f.normalizeHash=f.normalizeFragment;f.iso8859=function(){var a=
d.encode,b=d.decode;d.encode=escape;d.decode=decodeURIComponent;this.normalize();d.encode=a;d.decode=b;return this};f.unicode=function(){var a=d.encode,b=d.decode;d.encode=E;d.decode=unescape;this.normalize();d.encode=a;d.decode=b;return this};f.readable=function(){var a=this.clone();a.username("").password("").normalize();var b="";a._parts.protocol&&(b+=a._parts.protocol+"://");a._parts.hostname&&(a.is("punycode")&&e?(b+=e.toUnicode(a._parts.hostname),a._parts.port&&(b+=":"+a._parts.port)):b+=a.host());
a._parts.hostname&&a._parts.path&&"/"!==a._parts.path.charAt(0)&&(b+="/");b+=a.path(!0);if(a._parts.query){for(var c="",f=0,g=a._parts.query.split("&"),k=g.length;f<k;f++){var l=(g[f]||"").split("="),c=c+("&"+d.decodeQuery(l[0],this._parts.escapeQuerySpace).replace(/&/g,"%26"));void 0!==l[1]&&(c+="="+d.decodeQuery(l[1],this._parts.escapeQuerySpace).replace(/&/g,"%26"))}b+="?"+c.substring(1)}return b+=d.decodeQuery(a.hash(),!0)};f.absoluteTo=function(a){var b=this.clone(),c=["protocol","username",
"password","hostname","port"],e,f;if(this._parts.urn)throw Error("URNs do not have any generally defined hierarchical components");a instanceof d||(a=new d(a));b._parts.protocol||(b._parts.protocol=a._parts.protocol);if(this._parts.hostname)return b;for(e=0;f=c[e];e++)b._parts[f]=a._parts[f];b._parts.path?".."===b._parts.path.substring(-2)&&(b._parts.path+="/"):(b._parts.path=a._parts.path,b._parts.query||(b._parts.query=a._parts.query));"/"!==b.path().charAt(0)&&(a=a.directory(),b._parts.path=(a?
a+"/":"")+b._parts.path,b.normalizePath());b.build();return b};f.relativeTo=function(a){var b=this.clone().normalize(),c,e,f,g;if(b._parts.urn)throw Error("URNs do not have any generally defined hierarchical components");a=(new d(a)).normalize();c=b._parts;e=a._parts;f=b.path();g=a.path();if("/"!==f.charAt(0))throw Error("URI is already relative");if("/"!==g.charAt(0))throw Error("Cannot calculate a URI relative to another relative URI");c.protocol===e.protocol&&(c.protocol=null);if(c.username===
e.username&&c.password===e.password&&null===c.protocol&&null===c.username&&null===c.password&&c.hostname===e.hostname&&c.port===e.port)c.hostname=null,c.port=null;else return b.build();if(f===g)return c.path="",b.build();a=d.commonPath(b.path(),a.path());if(!a)return b.build();e=e.path.substring(a.length).replace(/[^\/]*$/,"").replace(/.*?\//g,"../");c.path=e+c.path.substring(a.length);return b.build()};f.equals=function(a){var b=this.clone();a=new d(a);var c={},e={},f={},g;b.normalize();a.normalize();
if(b.toString()===a.toString())return!0;c=b.query();e=a.query();b.query("");a.query("");if(b.toString()!==a.toString()||c.length!==e.length)return!1;c=d.parseQuery(c,this._parts.escapeQuerySpace);e=d.parseQuery(e,this._parts.escapeQuerySpace);for(g in c)if(w.call(c,g)){if(!l(c[g])){if(c[g]!==e[g])return!1}else if(!z(c[g],e[g]))return!1;f[g]=!0}for(g in e)if(w.call(e,g)&&!f[g])return!1;return!0};f.duplicateQueryParameters=function(a){this._parts.duplicateQueryParameters=!!a;return this};f.escapeQuerySpace=
function(a){this._parts.escapeQuerySpace=!!a;return this};return d});
(function(e,k){"object"===typeof exports?module.exports=k(require("./URI")):"function"===typeof define&&define.amd?define(["./URI"],k):k(e.URI)})(this,function(e){var k=e.prototype,u=k.fragment;e.fragmentPrefix="?";var m=e._parts;e._parts=function(){var d=m();d.fragmentPrefix=e.fragmentPrefix;return d};k.fragmentPrefix=function(d){this._parts.fragmentPrefix=d;return this};k.fragment=function(d,g){var k=this._parts.fragmentPrefix,l=this._parts.fragment||"";return!0===d?l.substring(0,k.length)!==k?
{}:e.parseQuery(l.substring(k.length)):void 0!==d&&"string"!==typeof d?(this._parts.fragment=k+e.buildQuery(d),this.build(!g),this):u.call(this,d,g)};k.addFragment=function(d,g,k){var l=this._parts.fragmentPrefix,m=e.parseQuery((this._parts.fragment||"").substring(l.length));e.addQuery(m,d,g);this._parts.fragment=l+e.buildQuery(m);"string"!==typeof d&&(k=g);this.build(!k);return this};k.removeFragment=function(d,g,k){var l=this._parts.fragmentPrefix,m=e.parseQuery((this._parts.fragment||"").substring(l.length));
e.removeQuery(m,d,g);this._parts.fragment=l+e.buildQuery(m);"string"!==typeof d&&(k=g);this.build(!k);return this};k.addHash=k.addFragment;k.removeHash=k.removeFragment;return{}});
;/*global unescape, module, define, window, global*/

/*
 UriTemplate Copyright (c) 2012-2013 Franz Antesberger. All Rights Reserved.
 Available via the MIT license.
*/

(function (exportCallback) {
    "use strict";

var UriTemplateError = (function () {

    function UriTemplateError (options) {
        this.options = options;
    }

    UriTemplateError.prototype.toString = function () {
        if (JSON && JSON.stringify) {
            return JSON.stringify(this.options);
        }
        else {
            return this.options;
        }
    };

    return UriTemplateError;
}());

var objectHelper = (function () {
    function isArray (value) {
        return Object.prototype.toString.apply(value) === '[object Array]';
    }

    function isString (value) {
        return Object.prototype.toString.apply(value) === '[object String]';
    }
    
    function isNumber (value) {
        return Object.prototype.toString.apply(value) === '[object Number]';
    }
    
    function isBoolean (value) {
        return Object.prototype.toString.apply(value) === '[object Boolean]';
    }
    
    function join (arr, separator) {
        var
            result = '',
            first = true,
            index;
        for (index = 0; index < arr.length; index += 1) {
            if (first) {
                first = false;
            }
            else {
                result += separator;
            }
            result += arr[index];
        }
        return result;
    }

    function map (arr, mapper) {
        var
            result = [],
            index = 0;
        for (; index < arr.length; index += 1) {
            result.push(mapper(arr[index]));
        }
        return result;
    }

    function filter (arr, predicate) {
        var
            result = [],
            index = 0;
        for (; index < arr.length; index += 1) {
            if (predicate(arr[index])) {
                result.push(arr[index]);
            }
        }
        return result;
    }

    function deepFreezeUsingObjectFreeze (object) {
        if (typeof object !== "object" || object === null) {
            return object;
        }
        Object.freeze(object);
        var property, propertyName;
        for (propertyName in object) {
            if (object.hasOwnProperty(propertyName)) {
                property = object[propertyName];
                // be aware, arrays are 'object', too
                if ((typeof property === "object") && !(property instanceof RegExp)) {
                    deepFreeze(property);
                }
            }
        }
        return object;
    }

    function deepFreeze (object) {
        if (typeof Object.freeze === 'function') {
            return deepFreezeUsingObjectFreeze(object);
        }
        return object;
    }


    return {
        isArray: isArray,
        isString: isString,
        isNumber: isNumber,
        isBoolean: isBoolean,
        join: join,
        map: map,
        filter: filter,
        deepFreeze: deepFreeze
    };
}());

var charHelper = (function () {

    function isAlpha (chr) {
        return (chr >= 'a' && chr <= 'z') || ((chr >= 'A' && chr <= 'Z'));
    }

    function isDigit (chr) {
        return chr >= '0' && chr <= '9';
    }

    function isHexDigit (chr) {
        return isDigit(chr) || (chr >= 'a' && chr <= 'f') || (chr >= 'A' && chr <= 'F');
    }

    return {
        isAlpha: isAlpha,
        isDigit: isDigit,
        isHexDigit: isHexDigit
    };
}());

var pctEncoder = (function () {
    var utf8 = {
        encode: function (chr) {
            // see http://ecmanaut.blogspot.de/2006/07/encoding-decoding-utf8-in-javascript.html
            return unescape(encodeURIComponent(chr));
        },
        numBytes: function (firstCharCode) {
            if (firstCharCode <= 0x7F) {
                return 1;
            }
            else if (0xC2 <= firstCharCode && firstCharCode <= 0xDF) {
                return 2;
            }
            else if (0xE0 <= firstCharCode && firstCharCode <= 0xEF) {
                return 3;
            }
            else if (0xF0 <= firstCharCode && firstCharCode <= 0xF4) {
                return 4;
            }
            // no valid first octet
            return 0;
        },
        isValidFollowingCharCode: function (charCode) {
            return 0x80 <= charCode && charCode <= 0xBF;
        }
    };

    /**
     * encodes a character, if needed or not.
     * @param chr
     * @return pct-encoded character
     */
    function encodeCharacter (chr) {
        var
            result = '',
            octets = utf8.encode(chr),
            octet,
            index;
        for (index = 0; index < octets.length; index += 1) {
            octet = octets.charCodeAt(index);
            result += '%' + (octet < 0x10 ? '0' : '') + octet.toString(16).toUpperCase();
        }
        return result;
    }

    /**
     * Returns, whether the given text at start is in the form 'percent hex-digit hex-digit', like '%3F'
     * @param text
     * @param start
     * @return {boolean|*|*}
     */
    function isPercentDigitDigit (text, start) {
        return text.charAt(start) === '%' && charHelper.isHexDigit(text.charAt(start + 1)) && charHelper.isHexDigit(text.charAt(start + 2));
    }

    /**
     * Parses a hex number from start with length 2.
     * @param text a string
     * @param start the start index of the 2-digit hex number
     * @return {Number}
     */
    function parseHex2 (text, start) {
        return parseInt(text.substr(start, 2), 16);
    }

    /**
     * Returns whether or not the given char sequence is a correctly pct-encoded sequence.
     * @param chr
     * @return {boolean}
     */
    function isPctEncoded (chr) {
        if (!isPercentDigitDigit(chr, 0)) {
            return false;
        }
        var firstCharCode = parseHex2(chr, 1);
        var numBytes = utf8.numBytes(firstCharCode);
        if (numBytes === 0) {
            return false;
        }
        for (var byteNumber = 1; byteNumber < numBytes; byteNumber += 1) {
            if (!isPercentDigitDigit(chr, 3*byteNumber) || !utf8.isValidFollowingCharCode(parseHex2(chr, 3*byteNumber + 1))) {
                return false;
            }
        }
        return true;
    }

    /**
     * Reads as much as needed from the text, e.g. '%20' or '%C3%B6'. It does not decode!
     * @param text
     * @param startIndex
     * @return the character or pct-string of the text at startIndex
     */
    function pctCharAt(text, startIndex) {
        var chr = text.charAt(startIndex);
        if (!isPercentDigitDigit(text, startIndex)) {
            return chr;
        }
        var utf8CharCode = parseHex2(text, startIndex + 1);
        var numBytes = utf8.numBytes(utf8CharCode);
        if (numBytes === 0) {
            return chr;
        }
        for (var byteNumber = 1; byteNumber < numBytes; byteNumber += 1) {
            if (!isPercentDigitDigit(text, startIndex + 3 * byteNumber) || !utf8.isValidFollowingCharCode(parseHex2(text, startIndex + 3 * byteNumber + 1))) {
                return chr;
            }
        }
        return text.substr(startIndex, 3 * numBytes);
    }

    return {
        encodeCharacter: encodeCharacter,
        isPctEncoded: isPctEncoded,
        pctCharAt: pctCharAt
    };
}());

var rfcCharHelper = (function () {

    /**
     * Returns if an character is an varchar character according 2.3 of rfc 6570
     * @param chr
     * @return (Boolean)
     */
    function isVarchar (chr) {
        return charHelper.isAlpha(chr) || charHelper.isDigit(chr) || chr === '_' || pctEncoder.isPctEncoded(chr);
    }

    /**
     * Returns if chr is an unreserved character according 1.5 of rfc 6570
     * @param chr
     * @return {Boolean}
     */
    function isUnreserved (chr) {
        return charHelper.isAlpha(chr) || charHelper.isDigit(chr) || chr === '-' || chr === '.' || chr === '_' || chr === '~';
    }

    /**
     * Returns if chr is an reserved character according 1.5 of rfc 6570
     * or the percent character mentioned in 3.2.1.
     * @param chr
     * @return {Boolean}
     */
    function isReserved (chr) {
        return chr === ':' || chr === '/' || chr === '?' || chr === '#' || chr === '[' || chr === ']' || chr === '@' || chr === '!' || chr === '$' || chr === '&' || chr === '(' ||
            chr === ')' || chr === '*' || chr === '+' || chr === ',' || chr === ';' || chr === '=' || chr === "'";
    }

    return {
        isVarchar: isVarchar,
        isUnreserved: isUnreserved,
        isReserved: isReserved
    };

}());

/**
 * encoding of rfc 6570
 */
var encodingHelper = (function () {

    function encode (text, passReserved) {
        var
            result = '',
            index,
            chr = '';
        if (typeof text === "number" || typeof text === "boolean") {
            text = text.toString();
        }
        for (index = 0; index < text.length; index += chr.length) {
            chr = text.charAt(index);
            result += rfcCharHelper.isUnreserved(chr) || (passReserved && rfcCharHelper.isReserved(chr)) ? chr : pctEncoder.encodeCharacter(chr);
        }
        return result;
    }

    function encodePassReserved (text) {
        return encode(text, true);
    }

    function encodeLiteralCharacter (literal, index) {
        var chr = pctEncoder.pctCharAt(literal, index);
        if (chr.length > 1) {
            return chr;
        }
        else {
            return rfcCharHelper.isReserved(chr) || rfcCharHelper.isUnreserved(chr) ? chr : pctEncoder.encodeCharacter(chr);
        }
    }

    function encodeLiteral (literal) {
        var
            result = '',
            index,
            chr = '';
        for (index = 0; index < literal.length; index += chr.length) {
            chr = pctEncoder.pctCharAt(literal, index);
            if (chr.length > 1) {
                result += chr;
            }
            else {
                result += rfcCharHelper.isReserved(chr) || rfcCharHelper.isUnreserved(chr) ? chr : pctEncoder.encodeCharacter(chr);
            }
        }
        return result;
    }

    return {
        encode: encode,
        encodePassReserved: encodePassReserved,
        encodeLiteral: encodeLiteral,
        encodeLiteralCharacter: encodeLiteralCharacter
    };

}());


// the operators defined by rfc 6570
var operators = (function () {

    var
        bySymbol = {};

    function create (symbol) {
        bySymbol[symbol] = {
            symbol: symbol,
            separator: (symbol === '?') ? '&' : (symbol === '' || symbol === '+' || symbol === '#') ? ',' : symbol,
            named: symbol === ';' || symbol === '&' || symbol === '?',
            ifEmpty: (symbol === '&' || symbol === '?') ? '=' : '',
            first: (symbol === '+' ) ? '' : symbol,
            encode: (symbol === '+' || symbol === '#') ? encodingHelper.encodePassReserved : encodingHelper.encode,
            toString: function () {
                return this.symbol;
            }
        };
    }

    create('');
    create('+');
    create('#');
    create('.');
    create('/');
    create(';');
    create('?');
    create('&');
    return {
        valueOf: function (chr) {
            if (bySymbol[chr]) {
                return bySymbol[chr];
            }
            if ("=,!@|".indexOf(chr) >= 0) {
                return null;
            }
            return bySymbol[''];
        }
    };
}());


/**
 * Detects, whether a given element is defined in the sense of rfc 6570
 * Section 2.3 of the RFC makes clear defintions:
 * * undefined and null are not defined.
 * * the empty string is defined
 * * an array ("list") is defined, if it is not empty (even if all elements are not defined)
 * * an object ("map") is defined, if it contains at least one property with defined value
 * @param object
 * @return {Boolean}
 */
function isDefined (object) {
    var
        propertyName;
    if (object === null || object === undefined) {
        return false;
    }
    if (objectHelper.isArray(object)) {
        // Section 2.3: A variable defined as a list value is considered undefined if the list contains zero members
        return object.length > 0;
    }
    if (typeof object === "string" || typeof object === "number" || typeof object === "boolean") {
        // falsy values like empty strings, false or 0 are "defined"
        return true;
    }
    // else Object
    for (propertyName in object) {
        if (object.hasOwnProperty(propertyName) && isDefined(object[propertyName])) {
            return true;
        }
    }
    return false;
}

var LiteralExpression = (function () {
    function LiteralExpression (literal) {
        this.literal = encodingHelper.encodeLiteral(literal);
    }

    LiteralExpression.prototype.expand = function () {
        return this.literal;
    };

    LiteralExpression.prototype.toString = LiteralExpression.prototype.expand;

    return LiteralExpression;
}());

var parse = (function () {

    function parseExpression (expressionText) {
        var
            operator,
            varspecs = [],
            varspec = null,
            varnameStart = null,
            maxLengthStart = null,
            index,
            chr = '';

        function closeVarname () {
            var varname = expressionText.substring(varnameStart, index);
            if (varname.length === 0) {
                throw new UriTemplateError({expressionText: expressionText, message: "a varname must be specified", position: index});
            }
            varspec = {varname: varname, exploded: false, maxLength: null};
            varnameStart = null;
        }

        function closeMaxLength () {
            if (maxLengthStart === index) {
                throw new UriTemplateError({expressionText: expressionText, message: "after a ':' you have to specify the length", position: index});
            }
            varspec.maxLength = parseInt(expressionText.substring(maxLengthStart, index), 10);
            maxLengthStart = null;
        }

        operator = (function (operatorText) {
            var op = operators.valueOf(operatorText);
            if (op === null) {
                throw new UriTemplateError({expressionText: expressionText, message: "illegal use of reserved operator", position: index, operator: operatorText});
            }
            return op;
        }(expressionText.charAt(0)));
        index = operator.symbol.length;

        varnameStart = index;

        for (; index < expressionText.length; index += chr.length) {
            chr = pctEncoder.pctCharAt(expressionText, index);

            if (varnameStart !== null) {
                // the spec says: varname =  varchar *( ["."] varchar )
                // so a dot is allowed except for the first char
                if (chr === '.') {
                    if (varnameStart === index) {
                        throw new UriTemplateError({expressionText: expressionText, message: "a varname MUST NOT start with a dot", position: index});
                    }
                    continue;
                }
                if (rfcCharHelper.isVarchar(chr)) {
                    continue;
                }
                closeVarname();
            }
            if (maxLengthStart !== null) {
                if (index === maxLengthStart && chr === '0') {
                    throw new UriTemplateError({expressionText: expressionText, message: "A :prefix must not start with digit 0", position: index});
                }
                if (charHelper.isDigit(chr)) {
                    if (index - maxLengthStart >= 4) {
                        throw new UriTemplateError({expressionText: expressionText, message: "A :prefix must have max 4 digits", position: index});
                    }
                    continue;
                }
                closeMaxLength();
            }
            if (chr === ':') {
                if (varspec.maxLength !== null) {
                    throw new UriTemplateError({expressionText: expressionText, message: "only one :maxLength is allowed per varspec", position: index});
                }
                if (varspec.exploded) {
                    throw new UriTemplateError({expressionText: expressionText, message: "an exploeded varspec MUST NOT be varspeced", position: index});
                }
                maxLengthStart = index + 1;
                continue;
            }
            if (chr === '*') {
                if (varspec === null) {
                    throw new UriTemplateError({expressionText: expressionText, message: "exploded without varspec", position: index});
                }
                if (varspec.exploded) {
                    throw new UriTemplateError({expressionText: expressionText, message: "exploded twice", position: index});
                }
                if (varspec.maxLength) {
                    throw new UriTemplateError({expressionText: expressionText, message: "an explode (*) MUST NOT follow to a prefix", position: index});
                }
                varspec.exploded = true;
                continue;
            }
            // the only legal character now is the comma
            if (chr === ',') {
                varspecs.push(varspec);
                varspec = null;
                varnameStart = index + 1;
                continue;
            }
            throw new UriTemplateError({expressionText: expressionText, message: "illegal character", character: chr, position: index});
        } // for chr
        if (varnameStart !== null) {
            closeVarname();
        }
        if (maxLengthStart !== null) {
            closeMaxLength();
        }
        varspecs.push(varspec);
        return new VariableExpression(expressionText, operator, varspecs);
    }

    function escape_regexp_string(string) {
      // http://simonwillison.net/2006/Jan/20/escape/
      return string.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&");
    }

    function parse (uriTemplateText) {
        // assert filled string
        var
            index,
            chr,
            expressions = [],
            expression,
            braceOpenIndex = null,
            regexp_string = '',
            can_match = true,
            literalStart = 0;
        for (index = 0; index < uriTemplateText.length; index += 1) {
            chr = uriTemplateText.charAt(index);
            if (literalStart !== null) {
                if (chr === '}') {
                    throw new UriTemplateError({templateText: uriTemplateText, message: "unopened brace closed", position: index});
                }
                if (chr === '{') {
                    if (literalStart < index) {
                        expression = new LiteralExpression(uriTemplateText.substring(literalStart, index));
                        expressions.push(expression);
                        regexp_string += escape_regexp_string(
                            expression.literal);
                    }
                    literalStart = null;
                    braceOpenIndex = index;
                }
                continue;
            }

            if (braceOpenIndex !== null) {
                // here just { is forbidden
                if (chr === '{') {
                    throw new UriTemplateError({templateText: uriTemplateText, message: "brace already opened", position: index});
                }
                if (chr === '}') {
                    if (braceOpenIndex + 1 === index) {
                        throw new UriTemplateError({templateText: uriTemplateText, message: "empty braces", position: braceOpenIndex});
                    }
                    try {
                        expression = parseExpression(uriTemplateText.substring(braceOpenIndex + 1, index));
                    }
                    catch (error) {
                        if (error.prototype === UriTemplateError.prototype) {
                            throw new UriTemplateError({templateText: uriTemplateText, message: error.options.message, position: braceOpenIndex + error.options.position, details: error.options});
                        }
                        throw error;
                    }
                    expressions.push(expression);
                    if (expression.operator.symbol.length === 0) {
                      regexp_string += "([^/]+)";
                    } else {
                      can_match = false;
                    }
                    braceOpenIndex = null;
                    literalStart = index + 1;
                }
                continue;
            }
            throw new Error('reached unreachable code');
        }
        if (braceOpenIndex !== null) {
            throw new UriTemplateError({templateText: uriTemplateText, message: "unclosed brace", position: braceOpenIndex});
        }
        if (literalStart < uriTemplateText.length) {
            expression = new LiteralExpression(uriTemplateText.substring(literalStart));
            expressions.push(expression);
            regexp_string += escape_regexp_string(expression.literal);
        }
        if (can_match === false) {
          regexp_string = undefined;
        }
        return new UriTemplate(uriTemplateText, expressions, regexp_string);
    }

    return parse;
}());

var VariableExpression = (function () {
    // helper function if JSON is not available
    function prettyPrint (value) {
        return (JSON && JSON.stringify) ? JSON.stringify(value) : value;
    }

    function isEmpty (value) {
        if (!isDefined(value)) {
            return true;
        }
        if (objectHelper.isString(value)) {
            return value === '';
        }
        if (objectHelper.isNumber(value) || objectHelper.isBoolean(value)) {
            return false;
        }
        if (objectHelper.isArray(value)) {
            return value.length === 0;
        }
        for (var propertyName in value) {
            if (value.hasOwnProperty(propertyName)) {
                return false;
            }
        }
        return true;
    }

    function propertyArray (object) {
        var
            result = [],
            propertyName;
        for (propertyName in object) {
            if (object.hasOwnProperty(propertyName)) {
                result.push({name: propertyName, value: object[propertyName]});
            }
        }
        return result;
    }

    function VariableExpression (templateText, operator, varspecs) {
        this.templateText = templateText;
        this.operator = operator;
        this.varspecs = varspecs;
    }

    VariableExpression.prototype.toString = function () {
        return this.templateText;
    };

    function expandSimpleValue(varspec, operator, value) {
        var result = '';
        value = value.toString();
        if (operator.named) {
            result += encodingHelper.encodeLiteral(varspec.varname);
            if (value === '') {
                result += operator.ifEmpty;
                return result;
            }
            result += '=';
        }
        if (varspec.maxLength !== null) {
            value = value.substr(0, varspec.maxLength);
        }
        result += operator.encode(value);
        return result;
    }

    function valueDefined (nameValue) {
        return isDefined(nameValue.value);
    }

    function expandNotExploded(varspec, operator, value) {
        var
            arr = [],
            result = '';
        if (operator.named) {
            result += encodingHelper.encodeLiteral(varspec.varname);
            if (isEmpty(value)) {
                result += operator.ifEmpty;
                return result;
            }
            result += '=';
        }
        if (objectHelper.isArray(value)) {
            arr = value;
            arr = objectHelper.filter(arr, isDefined);
            arr = objectHelper.map(arr, operator.encode);
            result += objectHelper.join(arr, ',');
        }
        else {
            arr = propertyArray(value);
            arr = objectHelper.filter(arr, valueDefined);
            arr = objectHelper.map(arr, function (nameValue) {
                return operator.encode(nameValue.name) + ',' + operator.encode(nameValue.value);
            });
            result += objectHelper.join(arr, ',');
        }
        return result;
    }

    function expandExplodedNamed (varspec, operator, value) {
        var
            isArray = objectHelper.isArray(value),
            arr = [];
        if (isArray) {
            arr = value;
            arr = objectHelper.filter(arr, isDefined);
            arr = objectHelper.map(arr, function (listElement) {
                var tmp = encodingHelper.encodeLiteral(varspec.varname);
                if (isEmpty(listElement)) {
                    tmp += operator.ifEmpty;
                }
                else {
                    tmp += '=' + operator.encode(listElement);
                }
                return tmp;
            });
        }
        else {
            arr = propertyArray(value);
            arr = objectHelper.filter(arr, valueDefined);
            arr = objectHelper.map(arr, function (nameValue) {
                var tmp = encodingHelper.encodeLiteral(nameValue.name);
                if (isEmpty(nameValue.value)) {
                    tmp += operator.ifEmpty;
                }
                else {
                    tmp += '=' + operator.encode(nameValue.value);
                }
                return tmp;
            });
        }
        return objectHelper.join(arr, operator.separator);
    }

    function expandExplodedUnnamed (operator, value) {
        var
            arr = [],
            result = '';
        if (objectHelper.isArray(value)) {
            arr = value;
            arr = objectHelper.filter(arr, isDefined);
            arr = objectHelper.map(arr, operator.encode);
            result += objectHelper.join(arr, operator.separator);
        }
        else {
            arr = propertyArray(value);
            arr = objectHelper.filter(arr, function (nameValue) {
                return isDefined(nameValue.value);
            });
            arr = objectHelper.map(arr, function (nameValue) {
                return operator.encode(nameValue.name) + '=' + operator.encode(nameValue.value);
            });
            result += objectHelper.join(arr, operator.separator);
        }
        return result;
    }


    VariableExpression.prototype.expand = function (variables) {
        var
            expanded = [],
            index,
            varspec,
            value,
            valueIsArr,
            oneExploded = false,
            operator = this.operator;

        // expand each varspec and join with operator's separator
        for (index = 0; index < this.varspecs.length; index += 1) {
            varspec = this.varspecs[index];
            value = variables[varspec.varname];
            // if (!isDefined(value)) {
            // if (variables.hasOwnProperty(varspec.name)) {
            if (value === null || value === undefined) {
                continue;
            }
            if (varspec.exploded) {
                oneExploded = true;
            }
            valueIsArr = objectHelper.isArray(value);
            if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
                expanded.push(expandSimpleValue(varspec, operator, value));
            }
            else if (varspec.maxLength && isDefined(value)) {
                // 2.4.1 of the spec says: "Prefix modifiers are not applicable to variables that have composite values."
                throw new Error('Prefix modifiers are not applicable to variables that have composite values. You tried to expand ' + this + " with " + prettyPrint(value));
            }
            else if (!varspec.exploded) {
                if (operator.named || !isEmpty(value)) {
                    expanded.push(expandNotExploded(varspec, operator, value));
                }
            }
            else if (isDefined(value)) {
                if (operator.named) {
                    expanded.push(expandExplodedNamed(varspec, operator, value));
                }
                else {
                    expanded.push(expandExplodedUnnamed(operator, value));
                }
            }
        }

        if (expanded.length === 0) {
            return "";
        }
        else {
            return operator.first + objectHelper.join(expanded, operator.separator);
        }
    };

    return VariableExpression;
}());

var UriTemplate = (function () {
    function UriTemplate (templateText, expressions, regexp_string) {
        this.templateText = templateText;
        this.expressions = expressions;

        if (regexp_string !== undefined) {
          this.regexp = new RegExp("^" + regexp_string + "$");
        }

        objectHelper.deepFreeze(this);
    }

    UriTemplate.prototype.toString = function () {
        return this.templateText;
    };

    UriTemplate.prototype.expand = function (variables) {
        // this.expressions.map(function (expression) {return expression.expand(variables);}).join('');
        var
            index,
            result = '';
        for (index = 0; index < this.expressions.length; index += 1) {
            result += this.expressions[index].expand(variables);
        }
        return result;
    };

    UriTemplate.prototype.extract = function (text) {
      var expression_index,
          extracted_index = 1,
          expression,
          varspec,
          matched = true,
          variables = {},
          result;

      if ((this.regexp !== undefined) && (this.regexp.test(text))) {
        result = this.regexp.exec(text);
        for (expression_index = 0; expression_index < this.expressions.length; expression_index += 1) {
          expression = this.expressions[expression_index];
          if (expression.literal === undefined) {
            if ((expression.operator !== undefined) && (expression.operator.symbol.length === 0) && (expression.varspecs.length === 1)) {
              varspec = expression.varspecs[0];
              if ((varspec.exploded === false) && (varspec.maxLength === null)) {
                if (result[extracted_index].indexOf(',') === -1) {
                  variables[varspec.varname] = decodeURIComponent(result[extracted_index]);
                  extracted_index += 1;
                } else {
                  matched = false;
                }
              } else {
                matched = false;
              }
            } else {
              matched = false;
            }
          }
        }
        if (matched) {
          return variables;
        }
      }
      return false;
    };

    UriTemplate.parse = parse;
    UriTemplate.UriTemplateError = UriTemplateError;
    return UriTemplate;
}());

    exportCallback(UriTemplate);

}(function (UriTemplate) {
        "use strict";
        // export UriTemplate, when module is present, or pass it to window or global
        if (typeof module !== "undefined") {
            module.exports = UriTemplate;
        }
        else if (typeof define === "function") {
            define([],function() {
                return UriTemplate;
            });
        }
        else if (typeof window !== "undefined") {
            window.UriTemplate = UriTemplate;
        }
        else {
            global.UriTemplate = UriTemplate;
        }
    }
));
;// Copyright (c) 2013 Pieroxy <pieroxy@pieroxy.net>
// This work is free. You can redistribute it and/or modify it
// under the terms of the WTFPL, Version 2
// For more information see LICENSE.txt or http://www.wtfpl.net/
//
// For more information, the home page:
// http://pieroxy.net/blog/pages/lz-string/testing.html
//
// LZ-based compression algorithm, version 1.4.4
var LZString = (function() {

// private property
var f = String.fromCharCode;
var keyStrBase64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
var keyStrUriSafe = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-$";
var baseReverseDic = {};

function getBaseValue(alphabet, character) {
  if (!baseReverseDic[alphabet]) {
    baseReverseDic[alphabet] = {};
    for (var i=0 ; i<alphabet.length ; i++) {
      baseReverseDic[alphabet][alphabet.charAt(i)] = i;
    }
  }
  return baseReverseDic[alphabet][character];
}

var LZString = {
  compressToBase64 : function (input) {
    if (input == null) return "";
    var res = LZString._compress(input, 6, function(a){return keyStrBase64.charAt(a);});
    switch (res.length % 4) { // To produce valid Base64
    default: // When could this happen ?
    case 0 : return res;
    case 1 : return res+"===";
    case 2 : return res+"==";
    case 3 : return res+"=";
    }
  },

  decompressFromBase64 : function (input) {
    if (input == null) return "";
    if (input == "") return null;
    return LZString._decompress(input.length, 32, function(index) { return getBaseValue(keyStrBase64, input.charAt(index)); });
  },

  compressToUTF16 : function (input) {
    if (input == null) return "";
    return LZString._compress(input, 15, function(a){return f(a+32);}) + " ";
  },

  decompressFromUTF16: function (compressed) {
    if (compressed == null) return "";
    if (compressed == "") return null;
    return LZString._decompress(compressed.length, 16384, function(index) { return compressed.charCodeAt(index) - 32; });
  },

  //compress into uint8array (UCS-2 big endian format)
  compressToUint8Array: function (uncompressed) {
    var compressed = LZString.compress(uncompressed);
    var buf=new Uint8Array(compressed.length*2); // 2 bytes per character

    for (var i=0, TotalLen=compressed.length; i<TotalLen; i++) {
      var current_value = compressed.charCodeAt(i);
      buf[i*2] = current_value >>> 8;
      buf[i*2+1] = current_value % 256;
    }
    return buf;
  },

  //decompress from uint8array (UCS-2 big endian format)
  decompressFromUint8Array:function (compressed) {
    if (compressed===null || compressed===undefined){
        return LZString.decompress(compressed);
    } else {
        var buf=new Array(compressed.length/2); // 2 bytes per character
        for (var i=0, TotalLen=buf.length; i<TotalLen; i++) {
          buf[i]=compressed[i*2]*256+compressed[i*2+1];
        }

        var result = [];
        buf.forEach(function (c) {
          result.push(f(c));
        });
        return LZString.decompress(result.join(''));

    }

  },


  //compress into a string that is already URI encoded
  compressToEncodedURIComponent: function (input) {
    if (input == null) return "";
    return LZString._compress(input, 6, function(a){return keyStrUriSafe.charAt(a);});
  },

  //decompress from an output of compressToEncodedURIComponent
  decompressFromEncodedURIComponent:function (input) {
    if (input == null) return "";
    if (input == "") return null;
    input = input.replace(/ /g, "+");
    return LZString._decompress(input.length, 32, function(index) { return getBaseValue(keyStrUriSafe, input.charAt(index)); });
  },

  compress: function (uncompressed) {
    return LZString._compress(uncompressed, 16, function(a){return f(a);});
  },
  _compress: function (uncompressed, bitsPerChar, getCharFromInt) {
    if (uncompressed == null) return "";
    var i, value,
        context_dictionary= {},
        context_dictionaryToCreate= {},
        context_c="",
        context_wc="",
        context_w="",
        context_enlargeIn= 2, // Compensate for the first entry which should not count
        context_dictSize= 3,
        context_numBits= 2,
        context_data=[],
        context_data_val=0,
        context_data_position=0,
        ii;

    for (ii = 0; ii < uncompressed.length; ii += 1) {
      context_c = uncompressed.charAt(ii);
      if (!Object.prototype.hasOwnProperty.call(context_dictionary,context_c)) {
        context_dictionary[context_c] = context_dictSize++;
        context_dictionaryToCreate[context_c] = true;
      }

      context_wc = context_w + context_c;
      if (Object.prototype.hasOwnProperty.call(context_dictionary,context_wc)) {
        context_w = context_wc;
      } else {
        if (Object.prototype.hasOwnProperty.call(context_dictionaryToCreate,context_w)) {
          if (context_w.charCodeAt(0)<256) {
            for (i=0 ; i<context_numBits ; i++) {
              context_data_val = (context_data_val << 1);
              if (context_data_position == bitsPerChar-1) {
                context_data_position = 0;
                context_data.push(getCharFromInt(context_data_val));
                context_data_val = 0;
              } else {
                context_data_position++;
              }
            }
            value = context_w.charCodeAt(0);
            for (i=0 ; i<8 ; i++) {
              context_data_val = (context_data_val << 1) | (value&1);
              if (context_data_position == bitsPerChar-1) {
                context_data_position = 0;
                context_data.push(getCharFromInt(context_data_val));
                context_data_val = 0;
              } else {
                context_data_position++;
              }
              value = value >> 1;
            }
          } else {
            value = 1;
            for (i=0 ; i<context_numBits ; i++) {
              context_data_val = (context_data_val << 1) | value;
              if (context_data_position ==bitsPerChar-1) {
                context_data_position = 0;
                context_data.push(getCharFromInt(context_data_val));
                context_data_val = 0;
              } else {
                context_data_position++;
              }
              value = 0;
            }
            value = context_w.charCodeAt(0);
            for (i=0 ; i<16 ; i++) {
              context_data_val = (context_data_val << 1) | (value&1);
              if (context_data_position == bitsPerChar-1) {
                context_data_position = 0;
                context_data.push(getCharFromInt(context_data_val));
                context_data_val = 0;
              } else {
                context_data_position++;
              }
              value = value >> 1;
            }
          }
          context_enlargeIn--;
          if (context_enlargeIn == 0) {
            context_enlargeIn = Math.pow(2, context_numBits);
            context_numBits++;
          }
          delete context_dictionaryToCreate[context_w];
        } else {
          value = context_dictionary[context_w];
          for (i=0 ; i<context_numBits ; i++) {
            context_data_val = (context_data_val << 1) | (value&1);
            if (context_data_position == bitsPerChar-1) {
              context_data_position = 0;
              context_data.push(getCharFromInt(context_data_val));
              context_data_val = 0;
            } else {
              context_data_position++;
            }
            value = value >> 1;
          }


        }
        context_enlargeIn--;
        if (context_enlargeIn == 0) {
          context_enlargeIn = Math.pow(2, context_numBits);
          context_numBits++;
        }
        // Add wc to the dictionary.
        context_dictionary[context_wc] = context_dictSize++;
        context_w = String(context_c);
      }
    }

    // Output the code for w.
    if (context_w !== "") {
      if (Object.prototype.hasOwnProperty.call(context_dictionaryToCreate,context_w)) {
        if (context_w.charCodeAt(0)<256) {
          for (i=0 ; i<context_numBits ; i++) {
            context_data_val = (context_data_val << 1);
            if (context_data_position == bitsPerChar-1) {
              context_data_position = 0;
              context_data.push(getCharFromInt(context_data_val));
              context_data_val = 0;
            } else {
              context_data_position++;
            }
          }
          value = context_w.charCodeAt(0);
          for (i=0 ; i<8 ; i++) {
            context_data_val = (context_data_val << 1) | (value&1);
            if (context_data_position == bitsPerChar-1) {
              context_data_position = 0;
              context_data.push(getCharFromInt(context_data_val));
              context_data_val = 0;
            } else {
              context_data_position++;
            }
            value = value >> 1;
          }
        } else {
          value = 1;
          for (i=0 ; i<context_numBits ; i++) {
            context_data_val = (context_data_val << 1) | value;
            if (context_data_position == bitsPerChar-1) {
              context_data_position = 0;
              context_data.push(getCharFromInt(context_data_val));
              context_data_val = 0;
            } else {
              context_data_position++;
            }
            value = 0;
          }
          value = context_w.charCodeAt(0);
          for (i=0 ; i<16 ; i++) {
            context_data_val = (context_data_val << 1) | (value&1);
            if (context_data_position == bitsPerChar-1) {
              context_data_position = 0;
              context_data.push(getCharFromInt(context_data_val));
              context_data_val = 0;
            } else {
              context_data_position++;
            }
            value = value >> 1;
          }
        }
        context_enlargeIn--;
        if (context_enlargeIn == 0) {
          context_enlargeIn = Math.pow(2, context_numBits);
          context_numBits++;
        }
        delete context_dictionaryToCreate[context_w];
      } else {
        value = context_dictionary[context_w];
        for (i=0 ; i<context_numBits ; i++) {
          context_data_val = (context_data_val << 1) | (value&1);
          if (context_data_position == bitsPerChar-1) {
            context_data_position = 0;
            context_data.push(getCharFromInt(context_data_val));
            context_data_val = 0;
          } else {
            context_data_position++;
          }
          value = value >> 1;
        }


      }
      context_enlargeIn--;
      if (context_enlargeIn == 0) {
        context_enlargeIn = Math.pow(2, context_numBits);
        context_numBits++;
      }
    }

    // Mark the end of the stream
    value = 2;
    for (i=0 ; i<context_numBits ; i++) {
      context_data_val = (context_data_val << 1) | (value&1);
      if (context_data_position == bitsPerChar-1) {
        context_data_position = 0;
        context_data.push(getCharFromInt(context_data_val));
        context_data_val = 0;
      } else {
        context_data_position++;
      }
      value = value >> 1;
    }

    // Flush the last char
    while (true) {
      context_data_val = (context_data_val << 1);
      if (context_data_position == bitsPerChar-1) {
        context_data.push(getCharFromInt(context_data_val));
        break;
      }
      else context_data_position++;
    }
    return context_data.join('');
  },

  decompress: function (compressed) {
    if (compressed == null) return "";
    if (compressed == "") return null;
    return LZString._decompress(compressed.length, 32768, function(index) { return compressed.charCodeAt(index); });
  },

  _decompress: function (length, resetValue, getNextValue) {
    var dictionary = [],
        next,
        enlargeIn = 4,
        dictSize = 4,
        numBits = 3,
        entry = "",
        result = [],
        i,
        w,
        bits, resb, maxpower, power,
        c,
        data = {val:getNextValue(0), position:resetValue, index:1};

    for (i = 0; i < 3; i += 1) {
      dictionary[i] = i;
    }

    bits = 0;
    maxpower = Math.pow(2,2);
    power=1;
    while (power!=maxpower) {
      resb = data.val & data.position;
      data.position >>= 1;
      if (data.position == 0) {
        data.position = resetValue;
        data.val = getNextValue(data.index++);
      }
      bits |= (resb>0 ? 1 : 0) * power;
      power <<= 1;
    }

    switch (next = bits) {
      case 0:
          bits = 0;
          maxpower = Math.pow(2,8);
          power=1;
          while (power!=maxpower) {
            resb = data.val & data.position;
            data.position >>= 1;
            if (data.position == 0) {
              data.position = resetValue;
              data.val = getNextValue(data.index++);
            }
            bits |= (resb>0 ? 1 : 0) * power;
            power <<= 1;
          }
        c = f(bits);
        break;
      case 1:
          bits = 0;
          maxpower = Math.pow(2,16);
          power=1;
          while (power!=maxpower) {
            resb = data.val & data.position;
            data.position >>= 1;
            if (data.position == 0) {
              data.position = resetValue;
              data.val = getNextValue(data.index++);
            }
            bits |= (resb>0 ? 1 : 0) * power;
            power <<= 1;
          }
        c = f(bits);
        break;
      case 2:
        return "";
    }
    dictionary[3] = c;
    w = c;
    result.push(c);
    while (true) {
      if (data.index > length) {
        return "";
      }

      bits = 0;
      maxpower = Math.pow(2,numBits);
      power=1;
      while (power!=maxpower) {
        resb = data.val & data.position;
        data.position >>= 1;
        if (data.position == 0) {
          data.position = resetValue;
          data.val = getNextValue(data.index++);
        }
        bits |= (resb>0 ? 1 : 0) * power;
        power <<= 1;
      }

      switch (c = bits) {
        case 0:
          bits = 0;
          maxpower = Math.pow(2,8);
          power=1;
          while (power!=maxpower) {
            resb = data.val & data.position;
            data.position >>= 1;
            if (data.position == 0) {
              data.position = resetValue;
              data.val = getNextValue(data.index++);
            }
            bits |= (resb>0 ? 1 : 0) * power;
            power <<= 1;
          }

          dictionary[dictSize++] = f(bits);
          c = dictSize-1;
          enlargeIn--;
          break;
        case 1:
          bits = 0;
          maxpower = Math.pow(2,16);
          power=1;
          while (power!=maxpower) {
            resb = data.val & data.position;
            data.position >>= 1;
            if (data.position == 0) {
              data.position = resetValue;
              data.val = getNextValue(data.index++);
            }
            bits |= (resb>0 ? 1 : 0) * power;
            power <<= 1;
          }
          dictionary[dictSize++] = f(bits);
          c = dictSize-1;
          enlargeIn--;
          break;
        case 2:
          return result.join('');
      }

      if (enlargeIn == 0) {
        enlargeIn = Math.pow(2, numBits);
        numBits++;
      }

      if (dictionary[c]) {
        entry = dictionary[c];
      } else {
        if (c === dictSize) {
          entry = w + w.charAt(0);
        } else {
          return null;
        }
      }
      result.push(entry);

      // Add w+entry[0] to the dictionary.
      dictionary[dictSize++] = w + entry.charAt(0);
      enlargeIn--;

      w = entry;

      if (enlargeIn == 0) {
        enlargeIn = Math.pow(2, numBits);
        numBits++;
      }

    }
  }
};
  return LZString;
})();

if (typeof define === 'function' && define.amd) {
  define(function () { return LZString; });
} else if( typeof module !== 'undefined' && module != null ) {
  module.exports = LZString
}
;//! moment.js
//! version : 2.13.0
//! authors : Tim Wood, Iskren Chernev, Moment.js contributors
//! license : MIT
//! momentjs.com

;(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    global.moment = factory()
}(this, function () { 'use strict';

    var hookCallback;

    function utils_hooks__hooks () {
        return hookCallback.apply(null, arguments);
    }

    // This is done to register the method called with moment()
    // without creating circular dependencies.
    function setHookCallback (callback) {
        hookCallback = callback;
    }

    function isArray(input) {
        return input instanceof Array || Object.prototype.toString.call(input) === '[object Array]';
    }

    function isDate(input) {
        return input instanceof Date || Object.prototype.toString.call(input) === '[object Date]';
    }

    function map(arr, fn) {
        var res = [], i;
        for (i = 0; i < arr.length; ++i) {
            res.push(fn(arr[i], i));
        }
        return res;
    }

    function hasOwnProp(a, b) {
        return Object.prototype.hasOwnProperty.call(a, b);
    }

    function extend(a, b) {
        for (var i in b) {
            if (hasOwnProp(b, i)) {
                a[i] = b[i];
            }
        }

        if (hasOwnProp(b, 'toString')) {
            a.toString = b.toString;
        }

        if (hasOwnProp(b, 'valueOf')) {
            a.valueOf = b.valueOf;
        }

        return a;
    }

    function create_utc__createUTC (input, format, locale, strict) {
        return createLocalOrUTC(input, format, locale, strict, true).utc();
    }

    function defaultParsingFlags() {
        // We need to deep clone this object.
        return {
            empty           : false,
            unusedTokens    : [],
            unusedInput     : [],
            overflow        : -2,
            charsLeftOver   : 0,
            nullInput       : false,
            invalidMonth    : null,
            invalidFormat   : false,
            userInvalidated : false,
            iso             : false,
            parsedDateParts : [],
            meridiem        : null
        };
    }

    function getParsingFlags(m) {
        if (m._pf == null) {
            m._pf = defaultParsingFlags();
        }
        return m._pf;
    }

    var some;
    if (Array.prototype.some) {
        some = Array.prototype.some;
    } else {
        some = function (fun) {
            var t = Object(this);
            var len = t.length >>> 0;

            for (var i = 0; i < len; i++) {
                if (i in t && fun.call(this, t[i], i, t)) {
                    return true;
                }
            }

            return false;
        };
    }

    function valid__isValid(m) {
        if (m._isValid == null) {
            var flags = getParsingFlags(m);
            var parsedParts = some.call(flags.parsedDateParts, function (i) {
                return i != null;
            });
            m._isValid = !isNaN(m._d.getTime()) &&
                flags.overflow < 0 &&
                !flags.empty &&
                !flags.invalidMonth &&
                !flags.invalidWeekday &&
                !flags.nullInput &&
                !flags.invalidFormat &&
                !flags.userInvalidated &&
                (!flags.meridiem || (flags.meridiem && parsedParts));

            if (m._strict) {
                m._isValid = m._isValid &&
                    flags.charsLeftOver === 0 &&
                    flags.unusedTokens.length === 0 &&
                    flags.bigHour === undefined;
            }
        }
        return m._isValid;
    }

    function valid__createInvalid (flags) {
        var m = create_utc__createUTC(NaN);
        if (flags != null) {
            extend(getParsingFlags(m), flags);
        }
        else {
            getParsingFlags(m).userInvalidated = true;
        }

        return m;
    }

    function isUndefined(input) {
        return input === void 0;
    }

    // Plugins that add properties should also add the key here (null value),
    // so we can properly clone ourselves.
    var momentProperties = utils_hooks__hooks.momentProperties = [];

    function copyConfig(to, from) {
        var i, prop, val;

        if (!isUndefined(from._isAMomentObject)) {
            to._isAMomentObject = from._isAMomentObject;
        }
        if (!isUndefined(from._i)) {
            to._i = from._i;
        }
        if (!isUndefined(from._f)) {
            to._f = from._f;
        }
        if (!isUndefined(from._l)) {
            to._l = from._l;
        }
        if (!isUndefined(from._strict)) {
            to._strict = from._strict;
        }
        if (!isUndefined(from._tzm)) {
            to._tzm = from._tzm;
        }
        if (!isUndefined(from._isUTC)) {
            to._isUTC = from._isUTC;
        }
        if (!isUndefined(from._offset)) {
            to._offset = from._offset;
        }
        if (!isUndefined(from._pf)) {
            to._pf = getParsingFlags(from);
        }
        if (!isUndefined(from._locale)) {
            to._locale = from._locale;
        }

        if (momentProperties.length > 0) {
            for (i in momentProperties) {
                prop = momentProperties[i];
                val = from[prop];
                if (!isUndefined(val)) {
                    to[prop] = val;
                }
            }
        }

        return to;
    }

    var updateInProgress = false;

    // Moment prototype object
    function Moment(config) {
        copyConfig(this, config);
        this._d = new Date(config._d != null ? config._d.getTime() : NaN);
        // Prevent infinite loop in case updateOffset creates new moment
        // objects.
        if (updateInProgress === false) {
            updateInProgress = true;
            utils_hooks__hooks.updateOffset(this);
            updateInProgress = false;
        }
    }

    function isMoment (obj) {
        return obj instanceof Moment || (obj != null && obj._isAMomentObject != null);
    }

    function absFloor (number) {
        if (number < 0) {
            return Math.ceil(number);
        } else {
            return Math.floor(number);
        }
    }

    function toInt(argumentForCoercion) {
        var coercedNumber = +argumentForCoercion,
            value = 0;

        if (coercedNumber !== 0 && isFinite(coercedNumber)) {
            value = absFloor(coercedNumber);
        }

        return value;
    }

    // compare two arrays, return the number of differences
    function compareArrays(array1, array2, dontConvert) {
        var len = Math.min(array1.length, array2.length),
            lengthDiff = Math.abs(array1.length - array2.length),
            diffs = 0,
            i;
        for (i = 0; i < len; i++) {
            if ((dontConvert && array1[i] !== array2[i]) ||
                (!dontConvert && toInt(array1[i]) !== toInt(array2[i]))) {
                diffs++;
            }
        }
        return diffs + lengthDiff;
    }

    function warn(msg) {
        if (utils_hooks__hooks.suppressDeprecationWarnings === false &&
                (typeof console !==  'undefined') && console.warn) {
            console.warn('Deprecation warning: ' + msg);
        }
    }

    function deprecate(msg, fn) {
        var firstTime = true;

        return extend(function () {
            if (utils_hooks__hooks.deprecationHandler != null) {
                utils_hooks__hooks.deprecationHandler(null, msg);
            }
            if (firstTime) {
                warn(msg + '\nArguments: ' + Array.prototype.slice.call(arguments).join(', ') + '\n' + (new Error()).stack);
                firstTime = false;
            }
            return fn.apply(this, arguments);
        }, fn);
    }

    var deprecations = {};

    function deprecateSimple(name, msg) {
        if (utils_hooks__hooks.deprecationHandler != null) {
            utils_hooks__hooks.deprecationHandler(name, msg);
        }
        if (!deprecations[name]) {
            warn(msg);
            deprecations[name] = true;
        }
    }

    utils_hooks__hooks.suppressDeprecationWarnings = false;
    utils_hooks__hooks.deprecationHandler = null;

    function isFunction(input) {
        return input instanceof Function || Object.prototype.toString.call(input) === '[object Function]';
    }

    function isObject(input) {
        return Object.prototype.toString.call(input) === '[object Object]';
    }

    function locale_set__set (config) {
        var prop, i;
        for (i in config) {
            prop = config[i];
            if (isFunction(prop)) {
                this[i] = prop;
            } else {
                this['_' + i] = prop;
            }
        }
        this._config = config;
        // Lenient ordinal parsing accepts just a number in addition to
        // number + (possibly) stuff coming from _ordinalParseLenient.
        this._ordinalParseLenient = new RegExp(this._ordinalParse.source + '|' + (/\d{1,2}/).source);
    }

    function mergeConfigs(parentConfig, childConfig) {
        var res = extend({}, parentConfig), prop;
        for (prop in childConfig) {
            if (hasOwnProp(childConfig, prop)) {
                if (isObject(parentConfig[prop]) && isObject(childConfig[prop])) {
                    res[prop] = {};
                    extend(res[prop], parentConfig[prop]);
                    extend(res[prop], childConfig[prop]);
                } else if (childConfig[prop] != null) {
                    res[prop] = childConfig[prop];
                } else {
                    delete res[prop];
                }
            }
        }
        return res;
    }

    function Locale(config) {
        if (config != null) {
            this.set(config);
        }
    }

    var keys;

    if (Object.keys) {
        keys = Object.keys;
    } else {
        keys = function (obj) {
            var i, res = [];
            for (i in obj) {
                if (hasOwnProp(obj, i)) {
                    res.push(i);
                }
            }
            return res;
        };
    }

    // internal storage for locale config files
    var locales = {};
    var globalLocale;

    function normalizeLocale(key) {
        return key ? key.toLowerCase().replace('_', '-') : key;
    }

    // pick the locale from the array
    // try ['en-au', 'en-gb'] as 'en-au', 'en-gb', 'en', as in move through the list trying each
    // substring from most specific to least, but move to the next array item if it's a more specific variant than the current root
    function chooseLocale(names) {
        var i = 0, j, next, locale, split;

        while (i < names.length) {
            split = normalizeLocale(names[i]).split('-');
            j = split.length;
            next = normalizeLocale(names[i + 1]);
            next = next ? next.split('-') : null;
            while (j > 0) {
                locale = loadLocale(split.slice(0, j).join('-'));
                if (locale) {
                    return locale;
                }
                if (next && next.length >= j && compareArrays(split, next, true) >= j - 1) {
                    //the next array item is better than a shallower substring of this one
                    break;
                }
                j--;
            }
            i++;
        }
        return null;
    }

    function loadLocale(name) {
        var oldLocale = null;
        // TODO: Find a better way to register and load all the locales in Node
        if (!locales[name] && (typeof module !== 'undefined') &&
                module && module.exports) {
            try {
                oldLocale = globalLocale._abbr;
                require('./locale/' + name);
                // because defineLocale currently also sets the global locale, we
                // want to undo that for lazy loaded locales
                locale_locales__getSetGlobalLocale(oldLocale);
            } catch (e) { }
        }
        return locales[name];
    }

    // This function will load locale and then set the global locale.  If
    // no arguments are passed in, it will simply return the current global
    // locale key.
    function locale_locales__getSetGlobalLocale (key, values) {
        var data;
        if (key) {
            if (isUndefined(values)) {
                data = locale_locales__getLocale(key);
            }
            else {
                data = defineLocale(key, values);
            }

            if (data) {
                // moment.duration._locale = moment._locale = data;
                globalLocale = data;
            }
        }

        return globalLocale._abbr;
    }

    function defineLocale (name, config) {
        if (config !== null) {
            config.abbr = name;
            if (locales[name] != null) {
                deprecateSimple('defineLocaleOverride',
                        'use moment.updateLocale(localeName, config) to change ' +
                        'an existing locale. moment.defineLocale(localeName, ' +
                        'config) should only be used for creating a new locale');
                config = mergeConfigs(locales[name]._config, config);
            } else if (config.parentLocale != null) {
                if (locales[config.parentLocale] != null) {
                    config = mergeConfigs(locales[config.parentLocale]._config, config);
                } else {
                    // treat as if there is no base config
                    deprecateSimple('parentLocaleUndefined',
                            'specified parentLocale is not defined yet');
                }
            }
            locales[name] = new Locale(config);

            // backwards compat for now: also set the locale
            locale_locales__getSetGlobalLocale(name);

            return locales[name];
        } else {
            // useful for testing
            delete locales[name];
            return null;
        }
    }

    function updateLocale(name, config) {
        if (config != null) {
            var locale;
            if (locales[name] != null) {
                config = mergeConfigs(locales[name]._config, config);
            }
            locale = new Locale(config);
            locale.parentLocale = locales[name];
            locales[name] = locale;

            // backwards compat for now: also set the locale
            locale_locales__getSetGlobalLocale(name);
        } else {
            // pass null for config to unupdate, useful for tests
            if (locales[name] != null) {
                if (locales[name].parentLocale != null) {
                    locales[name] = locales[name].parentLocale;
                } else if (locales[name] != null) {
                    delete locales[name];
                }
            }
        }
        return locales[name];
    }

    // returns locale data
    function locale_locales__getLocale (key) {
        var locale;

        if (key && key._locale && key._locale._abbr) {
            key = key._locale._abbr;
        }

        if (!key) {
            return globalLocale;
        }

        if (!isArray(key)) {
            //short-circuit everything else
            locale = loadLocale(key);
            if (locale) {
                return locale;
            }
            key = [key];
        }

        return chooseLocale(key);
    }

    function locale_locales__listLocales() {
        return keys(locales);
    }

    var aliases = {};

    function addUnitAlias (unit, shorthand) {
        var lowerCase = unit.toLowerCase();
        aliases[lowerCase] = aliases[lowerCase + 's'] = aliases[shorthand] = unit;
    }

    function normalizeUnits(units) {
        return typeof units === 'string' ? aliases[units] || aliases[units.toLowerCase()] : undefined;
    }

    function normalizeObjectUnits(inputObject) {
        var normalizedInput = {},
            normalizedProp,
            prop;

        for (prop in inputObject) {
            if (hasOwnProp(inputObject, prop)) {
                normalizedProp = normalizeUnits(prop);
                if (normalizedProp) {
                    normalizedInput[normalizedProp] = inputObject[prop];
                }
            }
        }

        return normalizedInput;
    }

    function makeGetSet (unit, keepTime) {
        return function (value) {
            if (value != null) {
                get_set__set(this, unit, value);
                utils_hooks__hooks.updateOffset(this, keepTime);
                return this;
            } else {
                return get_set__get(this, unit);
            }
        };
    }

    function get_set__get (mom, unit) {
        return mom.isValid() ?
            mom._d['get' + (mom._isUTC ? 'UTC' : '') + unit]() : NaN;
    }

    function get_set__set (mom, unit, value) {
        if (mom.isValid()) {
            mom._d['set' + (mom._isUTC ? 'UTC' : '') + unit](value);
        }
    }

    // MOMENTS

    function getSet (units, value) {
        var unit;
        if (typeof units === 'object') {
            for (unit in units) {
                this.set(unit, units[unit]);
            }
        } else {
            units = normalizeUnits(units);
            if (isFunction(this[units])) {
                return this[units](value);
            }
        }
        return this;
    }

    function zeroFill(number, targetLength, forceSign) {
        var absNumber = '' + Math.abs(number),
            zerosToFill = targetLength - absNumber.length,
            sign = number >= 0;
        return (sign ? (forceSign ? '+' : '') : '-') +
            Math.pow(10, Math.max(0, zerosToFill)).toString().substr(1) + absNumber;
    }

    var formattingTokens = /(\[[^\[]*\])|(\\)?([Hh]mm(ss)?|Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Qo?|YYYYYY|YYYYY|YYYY|YY|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|kk?|mm?|ss?|S{1,9}|x|X|zz?|ZZ?|.)/g;

    var localFormattingTokens = /(\[[^\[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g;

    var formatFunctions = {};

    var formatTokenFunctions = {};

    // token:    'M'
    // padded:   ['MM', 2]
    // ordinal:  'Mo'
    // callback: function () { this.month() + 1 }
    function addFormatToken (token, padded, ordinal, callback) {
        var func = callback;
        if (typeof callback === 'string') {
            func = function () {
                return this[callback]();
            };
        }
        if (token) {
            formatTokenFunctions[token] = func;
        }
        if (padded) {
            formatTokenFunctions[padded[0]] = function () {
                return zeroFill(func.apply(this, arguments), padded[1], padded[2]);
            };
        }
        if (ordinal) {
            formatTokenFunctions[ordinal] = function () {
                return this.localeData().ordinal(func.apply(this, arguments), token);
            };
        }
    }

    function removeFormattingTokens(input) {
        if (input.match(/\[[\s\S]/)) {
            return input.replace(/^\[|\]$/g, '');
        }
        return input.replace(/\\/g, '');
    }

    function makeFormatFunction(format) {
        var array = format.match(formattingTokens), i, length;

        for (i = 0, length = array.length; i < length; i++) {
            if (formatTokenFunctions[array[i]]) {
                array[i] = formatTokenFunctions[array[i]];
            } else {
                array[i] = removeFormattingTokens(array[i]);
            }
        }

        return function (mom) {
            var output = '', i;
            for (i = 0; i < length; i++) {
                output += array[i] instanceof Function ? array[i].call(mom, format) : array[i];
            }
            return output;
        };
    }

    // format date using native date object
    function formatMoment(m, format) {
        if (!m.isValid()) {
            return m.localeData().invalidDate();
        }

        format = expandFormat(format, m.localeData());
        formatFunctions[format] = formatFunctions[format] || makeFormatFunction(format);

        return formatFunctions[format](m);
    }

    function expandFormat(format, locale) {
        var i = 5;

        function replaceLongDateFormatTokens(input) {
            return locale.longDateFormat(input) || input;
        }

        localFormattingTokens.lastIndex = 0;
        while (i >= 0 && localFormattingTokens.test(format)) {
            format = format.replace(localFormattingTokens, replaceLongDateFormatTokens);
            localFormattingTokens.lastIndex = 0;
            i -= 1;
        }

        return format;
    }

    var match1         = /\d/;            //       0 - 9
    var match2         = /\d\d/;          //      00 - 99
    var match3         = /\d{3}/;         //     000 - 999
    var match4         = /\d{4}/;         //    0000 - 9999
    var match6         = /[+-]?\d{6}/;    // -999999 - 999999
    var match1to2      = /\d\d?/;         //       0 - 99
    var match3to4      = /\d\d\d\d?/;     //     999 - 9999
    var match5to6      = /\d\d\d\d\d\d?/; //   99999 - 999999
    var match1to3      = /\d{1,3}/;       //       0 - 999
    var match1to4      = /\d{1,4}/;       //       0 - 9999
    var match1to6      = /[+-]?\d{1,6}/;  // -999999 - 999999

    var matchUnsigned  = /\d+/;           //       0 - inf
    var matchSigned    = /[+-]?\d+/;      //    -inf - inf

    var matchOffset    = /Z|[+-]\d\d:?\d\d/gi; // +00:00 -00:00 +0000 -0000 or Z
    var matchShortOffset = /Z|[+-]\d\d(?::?\d\d)?/gi; // +00 -00 +00:00 -00:00 +0000 -0000 or Z

    var matchTimestamp = /[+-]?\d+(\.\d{1,3})?/; // 123456789 123456789.123

    // any word (or two) characters or numbers including two/three word month in arabic.
    // includes scottish gaelic two word and hyphenated months
    var matchWord = /[0-9]*['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+|[\u0600-\u06FF\/]+(\s*?[\u0600-\u06FF]+){1,2}/i;


    var regexes = {};

    function addRegexToken (token, regex, strictRegex) {
        regexes[token] = isFunction(regex) ? regex : function (isStrict, localeData) {
            return (isStrict && strictRegex) ? strictRegex : regex;
        };
    }

    function getParseRegexForToken (token, config) {
        if (!hasOwnProp(regexes, token)) {
            return new RegExp(unescapeFormat(token));
        }

        return regexes[token](config._strict, config._locale);
    }

    // Code from http://stackoverflow.com/questions/3561493/is-there-a-regexp-escape-function-in-javascript
    function unescapeFormat(s) {
        return regexEscape(s.replace('\\', '').replace(/\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g, function (matched, p1, p2, p3, p4) {
            return p1 || p2 || p3 || p4;
        }));
    }

    function regexEscape(s) {
        return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    }

    var tokens = {};

    function addParseToken (token, callback) {
        var i, func = callback;
        if (typeof token === 'string') {
            token = [token];
        }
        if (typeof callback === 'number') {
            func = function (input, array) {
                array[callback] = toInt(input);
            };
        }
        for (i = 0; i < token.length; i++) {
            tokens[token[i]] = func;
        }
    }

    function addWeekParseToken (token, callback) {
        addParseToken(token, function (input, array, config, token) {
            config._w = config._w || {};
            callback(input, config._w, config, token);
        });
    }

    function addTimeToArrayFromToken(token, input, config) {
        if (input != null && hasOwnProp(tokens, token)) {
            tokens[token](input, config._a, config, token);
        }
    }

    var YEAR = 0;
    var MONTH = 1;
    var DATE = 2;
    var HOUR = 3;
    var MINUTE = 4;
    var SECOND = 5;
    var MILLISECOND = 6;
    var WEEK = 7;
    var WEEKDAY = 8;

    var indexOf;

    if (Array.prototype.indexOf) {
        indexOf = Array.prototype.indexOf;
    } else {
        indexOf = function (o) {
            // I know
            var i;
            for (i = 0; i < this.length; ++i) {
                if (this[i] === o) {
                    return i;
                }
            }
            return -1;
        };
    }

    function daysInMonth(year, month) {
        return new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
    }

    // FORMATTING

    addFormatToken('M', ['MM', 2], 'Mo', function () {
        return this.month() + 1;
    });

    addFormatToken('MMM', 0, 0, function (format) {
        return this.localeData().monthsShort(this, format);
    });

    addFormatToken('MMMM', 0, 0, function (format) {
        return this.localeData().months(this, format);
    });

    // ALIASES

    addUnitAlias('month', 'M');

    // PARSING

    addRegexToken('M',    match1to2);
    addRegexToken('MM',   match1to2, match2);
    addRegexToken('MMM',  function (isStrict, locale) {
        return locale.monthsShortRegex(isStrict);
    });
    addRegexToken('MMMM', function (isStrict, locale) {
        return locale.monthsRegex(isStrict);
    });

    addParseToken(['M', 'MM'], function (input, array) {
        array[MONTH] = toInt(input) - 1;
    });

    addParseToken(['MMM', 'MMMM'], function (input, array, config, token) {
        var month = config._locale.monthsParse(input, token, config._strict);
        // if we didn't find a month name, mark the date as invalid.
        if (month != null) {
            array[MONTH] = month;
        } else {
            getParsingFlags(config).invalidMonth = input;
        }
    });

    // LOCALES

    var MONTHS_IN_FORMAT = /D[oD]?(\[[^\[\]]*\]|\s+)+MMMM?/;
    var defaultLocaleMonths = 'January_February_March_April_May_June_July_August_September_October_November_December'.split('_');
    function localeMonths (m, format) {
        return isArray(this._months) ? this._months[m.month()] :
            this._months[MONTHS_IN_FORMAT.test(format) ? 'format' : 'standalone'][m.month()];
    }

    var defaultLocaleMonthsShort = 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_');
    function localeMonthsShort (m, format) {
        return isArray(this._monthsShort) ? this._monthsShort[m.month()] :
            this._monthsShort[MONTHS_IN_FORMAT.test(format) ? 'format' : 'standalone'][m.month()];
    }

    function units_month__handleStrictParse(monthName, format, strict) {
        var i, ii, mom, llc = monthName.toLocaleLowerCase();
        if (!this._monthsParse) {
            // this is not used
            this._monthsParse = [];
            this._longMonthsParse = [];
            this._shortMonthsParse = [];
            for (i = 0; i < 12; ++i) {
                mom = create_utc__createUTC([2000, i]);
                this._shortMonthsParse[i] = this.monthsShort(mom, '').toLocaleLowerCase();
                this._longMonthsParse[i] = this.months(mom, '').toLocaleLowerCase();
            }
        }

        if (strict) {
            if (format === 'MMM') {
                ii = indexOf.call(this._shortMonthsParse, llc);
                return ii !== -1 ? ii : null;
            } else {
                ii = indexOf.call(this._longMonthsParse, llc);
                return ii !== -1 ? ii : null;
            }
        } else {
            if (format === 'MMM') {
                ii = indexOf.call(this._shortMonthsParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf.call(this._longMonthsParse, llc);
                return ii !== -1 ? ii : null;
            } else {
                ii = indexOf.call(this._longMonthsParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf.call(this._shortMonthsParse, llc);
                return ii !== -1 ? ii : null;
            }
        }
    }

    function localeMonthsParse (monthName, format, strict) {
        var i, mom, regex;

        if (this._monthsParseExact) {
            return units_month__handleStrictParse.call(this, monthName, format, strict);
        }

        if (!this._monthsParse) {
            this._monthsParse = [];
            this._longMonthsParse = [];
            this._shortMonthsParse = [];
        }

        // TODO: add sorting
        // Sorting makes sure if one month (or abbr) is a prefix of another
        // see sorting in computeMonthsParse
        for (i = 0; i < 12; i++) {
            // make the regex if we don't have it already
            mom = create_utc__createUTC([2000, i]);
            if (strict && !this._longMonthsParse[i]) {
                this._longMonthsParse[i] = new RegExp('^' + this.months(mom, '').replace('.', '') + '$', 'i');
                this._shortMonthsParse[i] = new RegExp('^' + this.monthsShort(mom, '').replace('.', '') + '$', 'i');
            }
            if (!strict && !this._monthsParse[i]) {
                regex = '^' + this.months(mom, '') + '|^' + this.monthsShort(mom, '');
                this._monthsParse[i] = new RegExp(regex.replace('.', ''), 'i');
            }
            // test the regex
            if (strict && format === 'MMMM' && this._longMonthsParse[i].test(monthName)) {
                return i;
            } else if (strict && format === 'MMM' && this._shortMonthsParse[i].test(monthName)) {
                return i;
            } else if (!strict && this._monthsParse[i].test(monthName)) {
                return i;
            }
        }
    }

    // MOMENTS

    function setMonth (mom, value) {
        var dayOfMonth;

        if (!mom.isValid()) {
            // No op
            return mom;
        }

        if (typeof value === 'string') {
            if (/^\d+$/.test(value)) {
                value = toInt(value);
            } else {
                value = mom.localeData().monthsParse(value);
                // TODO: Another silent failure?
                if (typeof value !== 'number') {
                    return mom;
                }
            }
        }

        dayOfMonth = Math.min(mom.date(), daysInMonth(mom.year(), value));
        mom._d['set' + (mom._isUTC ? 'UTC' : '') + 'Month'](value, dayOfMonth);
        return mom;
    }

    function getSetMonth (value) {
        if (value != null) {
            setMonth(this, value);
            utils_hooks__hooks.updateOffset(this, true);
            return this;
        } else {
            return get_set__get(this, 'Month');
        }
    }

    function getDaysInMonth () {
        return daysInMonth(this.year(), this.month());
    }

    var defaultMonthsShortRegex = matchWord;
    function monthsShortRegex (isStrict) {
        if (this._monthsParseExact) {
            if (!hasOwnProp(this, '_monthsRegex')) {
                computeMonthsParse.call(this);
            }
            if (isStrict) {
                return this._monthsShortStrictRegex;
            } else {
                return this._monthsShortRegex;
            }
        } else {
            return this._monthsShortStrictRegex && isStrict ?
                this._monthsShortStrictRegex : this._monthsShortRegex;
        }
    }

    var defaultMonthsRegex = matchWord;
    function monthsRegex (isStrict) {
        if (this._monthsParseExact) {
            if (!hasOwnProp(this, '_monthsRegex')) {
                computeMonthsParse.call(this);
            }
            if (isStrict) {
                return this._monthsStrictRegex;
            } else {
                return this._monthsRegex;
            }
        } else {
            return this._monthsStrictRegex && isStrict ?
                this._monthsStrictRegex : this._monthsRegex;
        }
    }

    function computeMonthsParse () {
        function cmpLenRev(a, b) {
            return b.length - a.length;
        }

        var shortPieces = [], longPieces = [], mixedPieces = [],
            i, mom;
        for (i = 0; i < 12; i++) {
            // make the regex if we don't have it already
            mom = create_utc__createUTC([2000, i]);
            shortPieces.push(this.monthsShort(mom, ''));
            longPieces.push(this.months(mom, ''));
            mixedPieces.push(this.months(mom, ''));
            mixedPieces.push(this.monthsShort(mom, ''));
        }
        // Sorting makes sure if one month (or abbr) is a prefix of another it
        // will match the longer piece.
        shortPieces.sort(cmpLenRev);
        longPieces.sort(cmpLenRev);
        mixedPieces.sort(cmpLenRev);
        for (i = 0; i < 12; i++) {
            shortPieces[i] = regexEscape(shortPieces[i]);
            longPieces[i] = regexEscape(longPieces[i]);
            mixedPieces[i] = regexEscape(mixedPieces[i]);
        }

        this._monthsRegex = new RegExp('^(' + mixedPieces.join('|') + ')', 'i');
        this._monthsShortRegex = this._monthsRegex;
        this._monthsStrictRegex = new RegExp('^(' + longPieces.join('|') + ')', 'i');
        this._monthsShortStrictRegex = new RegExp('^(' + shortPieces.join('|') + ')', 'i');
    }

    function checkOverflow (m) {
        var overflow;
        var a = m._a;

        if (a && getParsingFlags(m).overflow === -2) {
            overflow =
                a[MONTH]       < 0 || a[MONTH]       > 11  ? MONTH :
                a[DATE]        < 1 || a[DATE]        > daysInMonth(a[YEAR], a[MONTH]) ? DATE :
                a[HOUR]        < 0 || a[HOUR]        > 24 || (a[HOUR] === 24 && (a[MINUTE] !== 0 || a[SECOND] !== 0 || a[MILLISECOND] !== 0)) ? HOUR :
                a[MINUTE]      < 0 || a[MINUTE]      > 59  ? MINUTE :
                a[SECOND]      < 0 || a[SECOND]      > 59  ? SECOND :
                a[MILLISECOND] < 0 || a[MILLISECOND] > 999 ? MILLISECOND :
                -1;

            if (getParsingFlags(m)._overflowDayOfYear && (overflow < YEAR || overflow > DATE)) {
                overflow = DATE;
            }
            if (getParsingFlags(m)._overflowWeeks && overflow === -1) {
                overflow = WEEK;
            }
            if (getParsingFlags(m)._overflowWeekday && overflow === -1) {
                overflow = WEEKDAY;
            }

            getParsingFlags(m).overflow = overflow;
        }

        return m;
    }

    // iso 8601 regex
    // 0000-00-00 0000-W00 or 0000-W00-0 + T + 00 or 00:00 or 00:00:00 or 00:00:00.000 + +00:00 or +0000 or +00)
    var extendedIsoRegex = /^\s*((?:[+-]\d{6}|\d{4})-(?:\d\d-\d\d|W\d\d-\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?::\d\d(?::\d\d(?:[.,]\d+)?)?)?)([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?/;
    var basicIsoRegex = /^\s*((?:[+-]\d{6}|\d{4})(?:\d\d\d\d|W\d\d\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?:\d\d(?:\d\d(?:[.,]\d+)?)?)?)([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?/;

    var tzRegex = /Z|[+-]\d\d(?::?\d\d)?/;

    var isoDates = [
        ['YYYYYY-MM-DD', /[+-]\d{6}-\d\d-\d\d/],
        ['YYYY-MM-DD', /\d{4}-\d\d-\d\d/],
        ['GGGG-[W]WW-E', /\d{4}-W\d\d-\d/],
        ['GGGG-[W]WW', /\d{4}-W\d\d/, false],
        ['YYYY-DDD', /\d{4}-\d{3}/],
        ['YYYY-MM', /\d{4}-\d\d/, false],
        ['YYYYYYMMDD', /[+-]\d{10}/],
        ['YYYYMMDD', /\d{8}/],
        // YYYYMM is NOT allowed by the standard
        ['GGGG[W]WWE', /\d{4}W\d{3}/],
        ['GGGG[W]WW', /\d{4}W\d{2}/, false],
        ['YYYYDDD', /\d{7}/]
    ];

    // iso time formats and regexes
    var isoTimes = [
        ['HH:mm:ss.SSSS', /\d\d:\d\d:\d\d\.\d+/],
        ['HH:mm:ss,SSSS', /\d\d:\d\d:\d\d,\d+/],
        ['HH:mm:ss', /\d\d:\d\d:\d\d/],
        ['HH:mm', /\d\d:\d\d/],
        ['HHmmss.SSSS', /\d\d\d\d\d\d\.\d+/],
        ['HHmmss,SSSS', /\d\d\d\d\d\d,\d+/],
        ['HHmmss', /\d\d\d\d\d\d/],
        ['HHmm', /\d\d\d\d/],
        ['HH', /\d\d/]
    ];

    var aspNetJsonRegex = /^\/?Date\((\-?\d+)/i;

    // date from iso format
    function configFromISO(config) {
        var i, l,
            string = config._i,
            match = extendedIsoRegex.exec(string) || basicIsoRegex.exec(string),
            allowTime, dateFormat, timeFormat, tzFormat;

        if (match) {
            getParsingFlags(config).iso = true;

            for (i = 0, l = isoDates.length; i < l; i++) {
                if (isoDates[i][1].exec(match[1])) {
                    dateFormat = isoDates[i][0];
                    allowTime = isoDates[i][2] !== false;
                    break;
                }
            }
            if (dateFormat == null) {
                config._isValid = false;
                return;
            }
            if (match[3]) {
                for (i = 0, l = isoTimes.length; i < l; i++) {
                    if (isoTimes[i][1].exec(match[3])) {
                        // match[2] should be 'T' or space
                        timeFormat = (match[2] || ' ') + isoTimes[i][0];
                        break;
                    }
                }
                if (timeFormat == null) {
                    config._isValid = false;
                    return;
                }
            }
            if (!allowTime && timeFormat != null) {
                config._isValid = false;
                return;
            }
            if (match[4]) {
                if (tzRegex.exec(match[4])) {
                    tzFormat = 'Z';
                } else {
                    config._isValid = false;
                    return;
                }
            }
            config._f = dateFormat + (timeFormat || '') + (tzFormat || '');
            configFromStringAndFormat(config);
        } else {
            config._isValid = false;
        }
    }

    // date from iso format or fallback
    function configFromString(config) {
        var matched = aspNetJsonRegex.exec(config._i);

        if (matched !== null) {
            config._d = new Date(+matched[1]);
            return;
        }

        configFromISO(config);
        if (config._isValid === false) {
            delete config._isValid;
            utils_hooks__hooks.createFromInputFallback(config);
        }
    }

    utils_hooks__hooks.createFromInputFallback = deprecate(
        'moment construction falls back to js Date. This is ' +
        'discouraged and will be removed in upcoming major ' +
        'release. Please refer to ' +
        'https://github.com/moment/moment/issues/1407 for more info.',
        function (config) {
            config._d = new Date(config._i + (config._useUTC ? ' UTC' : ''));
        }
    );

    function createDate (y, m, d, h, M, s, ms) {
        //can't just apply() to create a date:
        //http://stackoverflow.com/questions/181348/instantiating-a-javascript-object-by-calling-prototype-constructor-apply
        var date = new Date(y, m, d, h, M, s, ms);

        //the date constructor remaps years 0-99 to 1900-1999
        if (y < 100 && y >= 0 && isFinite(date.getFullYear())) {
            date.setFullYear(y);
        }
        return date;
    }

    function createUTCDate (y) {
        var date = new Date(Date.UTC.apply(null, arguments));

        //the Date.UTC function remaps years 0-99 to 1900-1999
        if (y < 100 && y >= 0 && isFinite(date.getUTCFullYear())) {
            date.setUTCFullYear(y);
        }
        return date;
    }

    // FORMATTING

    addFormatToken('Y', 0, 0, function () {
        var y = this.year();
        return y <= 9999 ? '' + y : '+' + y;
    });

    addFormatToken(0, ['YY', 2], 0, function () {
        return this.year() % 100;
    });

    addFormatToken(0, ['YYYY',   4],       0, 'year');
    addFormatToken(0, ['YYYYY',  5],       0, 'year');
    addFormatToken(0, ['YYYYYY', 6, true], 0, 'year');

    // ALIASES

    addUnitAlias('year', 'y');

    // PARSING

    addRegexToken('Y',      matchSigned);
    addRegexToken('YY',     match1to2, match2);
    addRegexToken('YYYY',   match1to4, match4);
    addRegexToken('YYYYY',  match1to6, match6);
    addRegexToken('YYYYYY', match1to6, match6);

    addParseToken(['YYYYY', 'YYYYYY'], YEAR);
    addParseToken('YYYY', function (input, array) {
        array[YEAR] = input.length === 2 ? utils_hooks__hooks.parseTwoDigitYear(input) : toInt(input);
    });
    addParseToken('YY', function (input, array) {
        array[YEAR] = utils_hooks__hooks.parseTwoDigitYear(input);
    });
    addParseToken('Y', function (input, array) {
        array[YEAR] = parseInt(input, 10);
    });

    // HELPERS

    function daysInYear(year) {
        return isLeapYear(year) ? 366 : 365;
    }

    function isLeapYear(year) {
        return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    }

    // HOOKS

    utils_hooks__hooks.parseTwoDigitYear = function (input) {
        return toInt(input) + (toInt(input) > 68 ? 1900 : 2000);
    };

    // MOMENTS

    var getSetYear = makeGetSet('FullYear', true);

    function getIsLeapYear () {
        return isLeapYear(this.year());
    }

    // start-of-first-week - start-of-year
    function firstWeekOffset(year, dow, doy) {
        var // first-week day -- which january is always in the first week (4 for iso, 1 for other)
            fwd = 7 + dow - doy,
            // first-week day local weekday -- which local weekday is fwd
            fwdlw = (7 + createUTCDate(year, 0, fwd).getUTCDay() - dow) % 7;

        return -fwdlw + fwd - 1;
    }

    //http://en.wikipedia.org/wiki/ISO_week_date#Calculating_a_date_given_the_year.2C_week_number_and_weekday
    function dayOfYearFromWeeks(year, week, weekday, dow, doy) {
        var localWeekday = (7 + weekday - dow) % 7,
            weekOffset = firstWeekOffset(year, dow, doy),
            dayOfYear = 1 + 7 * (week - 1) + localWeekday + weekOffset,
            resYear, resDayOfYear;

        if (dayOfYear <= 0) {
            resYear = year - 1;
            resDayOfYear = daysInYear(resYear) + dayOfYear;
        } else if (dayOfYear > daysInYear(year)) {
            resYear = year + 1;
            resDayOfYear = dayOfYear - daysInYear(year);
        } else {
            resYear = year;
            resDayOfYear = dayOfYear;
        }

        return {
            year: resYear,
            dayOfYear: resDayOfYear
        };
    }

    function weekOfYear(mom, dow, doy) {
        var weekOffset = firstWeekOffset(mom.year(), dow, doy),
            week = Math.floor((mom.dayOfYear() - weekOffset - 1) / 7) + 1,
            resWeek, resYear;

        if (week < 1) {
            resYear = mom.year() - 1;
            resWeek = week + weeksInYear(resYear, dow, doy);
        } else if (week > weeksInYear(mom.year(), dow, doy)) {
            resWeek = week - weeksInYear(mom.year(), dow, doy);
            resYear = mom.year() + 1;
        } else {
            resYear = mom.year();
            resWeek = week;
        }

        return {
            week: resWeek,
            year: resYear
        };
    }

    function weeksInYear(year, dow, doy) {
        var weekOffset = firstWeekOffset(year, dow, doy),
            weekOffsetNext = firstWeekOffset(year + 1, dow, doy);
        return (daysInYear(year) - weekOffset + weekOffsetNext) / 7;
    }

    // Pick the first defined of two or three arguments.
    function defaults(a, b, c) {
        if (a != null) {
            return a;
        }
        if (b != null) {
            return b;
        }
        return c;
    }

    function currentDateArray(config) {
        // hooks is actually the exported moment object
        var nowValue = new Date(utils_hooks__hooks.now());
        if (config._useUTC) {
            return [nowValue.getUTCFullYear(), nowValue.getUTCMonth(), nowValue.getUTCDate()];
        }
        return [nowValue.getFullYear(), nowValue.getMonth(), nowValue.getDate()];
    }

    // convert an array to a date.
    // the array should mirror the parameters below
    // note: all values past the year are optional and will default to the lowest possible value.
    // [year, month, day , hour, minute, second, millisecond]
    function configFromArray (config) {
        var i, date, input = [], currentDate, yearToUse;

        if (config._d) {
            return;
        }

        currentDate = currentDateArray(config);

        //compute day of the year from weeks and weekdays
        if (config._w && config._a[DATE] == null && config._a[MONTH] == null) {
            dayOfYearFromWeekInfo(config);
        }

        //if the day of the year is set, figure out what it is
        if (config._dayOfYear) {
            yearToUse = defaults(config._a[YEAR], currentDate[YEAR]);

            if (config._dayOfYear > daysInYear(yearToUse)) {
                getParsingFlags(config)._overflowDayOfYear = true;
            }

            date = createUTCDate(yearToUse, 0, config._dayOfYear);
            config._a[MONTH] = date.getUTCMonth();
            config._a[DATE] = date.getUTCDate();
        }

        // Default to current date.
        // * if no year, month, day of month are given, default to today
        // * if day of month is given, default month and year
        // * if month is given, default only year
        // * if year is given, don't default anything
        for (i = 0; i < 3 && config._a[i] == null; ++i) {
            config._a[i] = input[i] = currentDate[i];
        }

        // Zero out whatever was not defaulted, including time
        for (; i < 7; i++) {
            config._a[i] = input[i] = (config._a[i] == null) ? (i === 2 ? 1 : 0) : config._a[i];
        }

        // Check for 24:00:00.000
        if (config._a[HOUR] === 24 &&
                config._a[MINUTE] === 0 &&
                config._a[SECOND] === 0 &&
                config._a[MILLISECOND] === 0) {
            config._nextDay = true;
            config._a[HOUR] = 0;
        }

        config._d = (config._useUTC ? createUTCDate : createDate).apply(null, input);
        // Apply timezone offset from input. The actual utcOffset can be changed
        // with parseZone.
        if (config._tzm != null) {
            config._d.setUTCMinutes(config._d.getUTCMinutes() - config._tzm);
        }

        if (config._nextDay) {
            config._a[HOUR] = 24;
        }
    }

    function dayOfYearFromWeekInfo(config) {
        var w, weekYear, week, weekday, dow, doy, temp, weekdayOverflow;

        w = config._w;
        if (w.GG != null || w.W != null || w.E != null) {
            dow = 1;
            doy = 4;

            // TODO: We need to take the current isoWeekYear, but that depends on
            // how we interpret now (local, utc, fixed offset). So create
            // a now version of current config (take local/utc/offset flags, and
            // create now).
            weekYear = defaults(w.GG, config._a[YEAR], weekOfYear(local__createLocal(), 1, 4).year);
            week = defaults(w.W, 1);
            weekday = defaults(w.E, 1);
            if (weekday < 1 || weekday > 7) {
                weekdayOverflow = true;
            }
        } else {
            dow = config._locale._week.dow;
            doy = config._locale._week.doy;

            weekYear = defaults(w.gg, config._a[YEAR], weekOfYear(local__createLocal(), dow, doy).year);
            week = defaults(w.w, 1);

            if (w.d != null) {
                // weekday -- low day numbers are considered next week
                weekday = w.d;
                if (weekday < 0 || weekday > 6) {
                    weekdayOverflow = true;
                }
            } else if (w.e != null) {
                // local weekday -- counting starts from begining of week
                weekday = w.e + dow;
                if (w.e < 0 || w.e > 6) {
                    weekdayOverflow = true;
                }
            } else {
                // default to begining of week
                weekday = dow;
            }
        }
        if (week < 1 || week > weeksInYear(weekYear, dow, doy)) {
            getParsingFlags(config)._overflowWeeks = true;
        } else if (weekdayOverflow != null) {
            getParsingFlags(config)._overflowWeekday = true;
        } else {
            temp = dayOfYearFromWeeks(weekYear, week, weekday, dow, doy);
            config._a[YEAR] = temp.year;
            config._dayOfYear = temp.dayOfYear;
        }
    }

    // constant that refers to the ISO standard
    utils_hooks__hooks.ISO_8601 = function () {};

    // date from string and format string
    function configFromStringAndFormat(config) {
        // TODO: Move this to another part of the creation flow to prevent circular deps
        if (config._f === utils_hooks__hooks.ISO_8601) {
            configFromISO(config);
            return;
        }

        config._a = [];
        getParsingFlags(config).empty = true;

        // This array is used to make a Date, either with `new Date` or `Date.UTC`
        var string = '' + config._i,
            i, parsedInput, tokens, token, skipped,
            stringLength = string.length,
            totalParsedInputLength = 0;

        tokens = expandFormat(config._f, config._locale).match(formattingTokens) || [];

        for (i = 0; i < tokens.length; i++) {
            token = tokens[i];
            parsedInput = (string.match(getParseRegexForToken(token, config)) || [])[0];
            // console.log('token', token, 'parsedInput', parsedInput,
            //         'regex', getParseRegexForToken(token, config));
            if (parsedInput) {
                skipped = string.substr(0, string.indexOf(parsedInput));
                if (skipped.length > 0) {
                    getParsingFlags(config).unusedInput.push(skipped);
                }
                string = string.slice(string.indexOf(parsedInput) + parsedInput.length);
                totalParsedInputLength += parsedInput.length;
            }
            // don't parse if it's not a known token
            if (formatTokenFunctions[token]) {
                if (parsedInput) {
                    getParsingFlags(config).empty = false;
                }
                else {
                    getParsingFlags(config).unusedTokens.push(token);
                }
                addTimeToArrayFromToken(token, parsedInput, config);
            }
            else if (config._strict && !parsedInput) {
                getParsingFlags(config).unusedTokens.push(token);
            }
        }

        // add remaining unparsed input length to the string
        getParsingFlags(config).charsLeftOver = stringLength - totalParsedInputLength;
        if (string.length > 0) {
            getParsingFlags(config).unusedInput.push(string);
        }

        // clear _12h flag if hour is <= 12
        if (getParsingFlags(config).bigHour === true &&
                config._a[HOUR] <= 12 &&
                config._a[HOUR] > 0) {
            getParsingFlags(config).bigHour = undefined;
        }

        getParsingFlags(config).parsedDateParts = config._a.slice(0);
        getParsingFlags(config).meridiem = config._meridiem;
        // handle meridiem
        config._a[HOUR] = meridiemFixWrap(config._locale, config._a[HOUR], config._meridiem);

        configFromArray(config);
        checkOverflow(config);
    }


    function meridiemFixWrap (locale, hour, meridiem) {
        var isPm;

        if (meridiem == null) {
            // nothing to do
            return hour;
        }
        if (locale.meridiemHour != null) {
            return locale.meridiemHour(hour, meridiem);
        } else if (locale.isPM != null) {
            // Fallback
            isPm = locale.isPM(meridiem);
            if (isPm && hour < 12) {
                hour += 12;
            }
            if (!isPm && hour === 12) {
                hour = 0;
            }
            return hour;
        } else {
            // this is not supposed to happen
            return hour;
        }
    }

    // date from string and array of format strings
    function configFromStringAndArray(config) {
        var tempConfig,
            bestMoment,

            scoreToBeat,
            i,
            currentScore;

        if (config._f.length === 0) {
            getParsingFlags(config).invalidFormat = true;
            config._d = new Date(NaN);
            return;
        }

        for (i = 0; i < config._f.length; i++) {
            currentScore = 0;
            tempConfig = copyConfig({}, config);
            if (config._useUTC != null) {
                tempConfig._useUTC = config._useUTC;
            }
            tempConfig._f = config._f[i];
            configFromStringAndFormat(tempConfig);

            if (!valid__isValid(tempConfig)) {
                continue;
            }

            // if there is any input that was not parsed add a penalty for that format
            currentScore += getParsingFlags(tempConfig).charsLeftOver;

            //or tokens
            currentScore += getParsingFlags(tempConfig).unusedTokens.length * 10;

            getParsingFlags(tempConfig).score = currentScore;

            if (scoreToBeat == null || currentScore < scoreToBeat) {
                scoreToBeat = currentScore;
                bestMoment = tempConfig;
            }
        }

        extend(config, bestMoment || tempConfig);
    }

    function configFromObject(config) {
        if (config._d) {
            return;
        }

        var i = normalizeObjectUnits(config._i);
        config._a = map([i.year, i.month, i.day || i.date, i.hour, i.minute, i.second, i.millisecond], function (obj) {
            return obj && parseInt(obj, 10);
        });

        configFromArray(config);
    }

    function createFromConfig (config) {
        var res = new Moment(checkOverflow(prepareConfig(config)));
        if (res._nextDay) {
            // Adding is smart enough around DST
            res.add(1, 'd');
            res._nextDay = undefined;
        }

        return res;
    }

    function prepareConfig (config) {
        var input = config._i,
            format = config._f;

        config._locale = config._locale || locale_locales__getLocale(config._l);

        if (input === null || (format === undefined && input === '')) {
            return valid__createInvalid({nullInput: true});
        }

        if (typeof input === 'string') {
            config._i = input = config._locale.preparse(input);
        }

        if (isMoment(input)) {
            return new Moment(checkOverflow(input));
        } else if (isArray(format)) {
            configFromStringAndArray(config);
        } else if (format) {
            configFromStringAndFormat(config);
        } else if (isDate(input)) {
            config._d = input;
        } else {
            configFromInput(config);
        }

        if (!valid__isValid(config)) {
            config._d = null;
        }

        return config;
    }

    function configFromInput(config) {
        var input = config._i;
        if (input === undefined) {
            config._d = new Date(utils_hooks__hooks.now());
        } else if (isDate(input)) {
            config._d = new Date(input.valueOf());
        } else if (typeof input === 'string') {
            configFromString(config);
        } else if (isArray(input)) {
            config._a = map(input.slice(0), function (obj) {
                return parseInt(obj, 10);
            });
            configFromArray(config);
        } else if (typeof(input) === 'object') {
            configFromObject(config);
        } else if (typeof(input) === 'number') {
            // from milliseconds
            config._d = new Date(input);
        } else {
            utils_hooks__hooks.createFromInputFallback(config);
        }
    }

    function createLocalOrUTC (input, format, locale, strict, isUTC) {
        var c = {};

        if (typeof(locale) === 'boolean') {
            strict = locale;
            locale = undefined;
        }
        // object construction must be done this way.
        // https://github.com/moment/moment/issues/1423
        c._isAMomentObject = true;
        c._useUTC = c._isUTC = isUTC;
        c._l = locale;
        c._i = input;
        c._f = format;
        c._strict = strict;

        return createFromConfig(c);
    }

    function local__createLocal (input, format, locale, strict) {
        return createLocalOrUTC(input, format, locale, strict, false);
    }

    var prototypeMin = deprecate(
         'moment().min is deprecated, use moment.max instead. https://github.com/moment/moment/issues/1548',
         function () {
             var other = local__createLocal.apply(null, arguments);
             if (this.isValid() && other.isValid()) {
                 return other < this ? this : other;
             } else {
                 return valid__createInvalid();
             }
         }
     );

    var prototypeMax = deprecate(
        'moment().max is deprecated, use moment.min instead. https://github.com/moment/moment/issues/1548',
        function () {
            var other = local__createLocal.apply(null, arguments);
            if (this.isValid() && other.isValid()) {
                return other > this ? this : other;
            } else {
                return valid__createInvalid();
            }
        }
    );

    // Pick a moment m from moments so that m[fn](other) is true for all
    // other. This relies on the function fn to be transitive.
    //
    // moments should either be an array of moment objects or an array, whose
    // first element is an array of moment objects.
    function pickBy(fn, moments) {
        var res, i;
        if (moments.length === 1 && isArray(moments[0])) {
            moments = moments[0];
        }
        if (!moments.length) {
            return local__createLocal();
        }
        res = moments[0];
        for (i = 1; i < moments.length; ++i) {
            if (!moments[i].isValid() || moments[i][fn](res)) {
                res = moments[i];
            }
        }
        return res;
    }

    // TODO: Use [].sort instead?
    function min () {
        var args = [].slice.call(arguments, 0);

        return pickBy('isBefore', args);
    }

    function max () {
        var args = [].slice.call(arguments, 0);

        return pickBy('isAfter', args);
    }

    var now = function () {
        return Date.now ? Date.now() : +(new Date());
    };

    function Duration (duration) {
        var normalizedInput = normalizeObjectUnits(duration),
            years = normalizedInput.year || 0,
            quarters = normalizedInput.quarter || 0,
            months = normalizedInput.month || 0,
            weeks = normalizedInput.week || 0,
            days = normalizedInput.day || 0,
            hours = normalizedInput.hour || 0,
            minutes = normalizedInput.minute || 0,
            seconds = normalizedInput.second || 0,
            milliseconds = normalizedInput.millisecond || 0;

        // representation for dateAddRemove
        this._milliseconds = +milliseconds +
            seconds * 1e3 + // 1000
            minutes * 6e4 + // 1000 * 60
            hours * 1000 * 60 * 60; //using 1000 * 60 * 60 instead of 36e5 to avoid floating point rounding errors https://github.com/moment/moment/issues/2978
        // Because of dateAddRemove treats 24 hours as different from a
        // day when working around DST, we need to store them separately
        this._days = +days +
            weeks * 7;
        // It is impossible translate months into days without knowing
        // which months you are are talking about, so we have to store
        // it separately.
        this._months = +months +
            quarters * 3 +
            years * 12;

        this._data = {};

        this._locale = locale_locales__getLocale();

        this._bubble();
    }

    function isDuration (obj) {
        return obj instanceof Duration;
    }

    // FORMATTING

    function offset (token, separator) {
        addFormatToken(token, 0, 0, function () {
            var offset = this.utcOffset();
            var sign = '+';
            if (offset < 0) {
                offset = -offset;
                sign = '-';
            }
            return sign + zeroFill(~~(offset / 60), 2) + separator + zeroFill(~~(offset) % 60, 2);
        });
    }

    offset('Z', ':');
    offset('ZZ', '');

    // PARSING

    addRegexToken('Z',  matchShortOffset);
    addRegexToken('ZZ', matchShortOffset);
    addParseToken(['Z', 'ZZ'], function (input, array, config) {
        config._useUTC = true;
        config._tzm = offsetFromString(matchShortOffset, input);
    });

    // HELPERS

    // timezone chunker
    // '+10:00' > ['10',  '00']
    // '-1530'  > ['-15', '30']
    var chunkOffset = /([\+\-]|\d\d)/gi;

    function offsetFromString(matcher, string) {
        var matches = ((string || '').match(matcher) || []);
        var chunk   = matches[matches.length - 1] || [];
        var parts   = (chunk + '').match(chunkOffset) || ['-', 0, 0];
        var minutes = +(parts[1] * 60) + toInt(parts[2]);

        return parts[0] === '+' ? minutes : -minutes;
    }

    // Return a moment from input, that is local/utc/zone equivalent to model.
    function cloneWithOffset(input, model) {
        var res, diff;
        if (model._isUTC) {
            res = model.clone();
            diff = (isMoment(input) || isDate(input) ? input.valueOf() : local__createLocal(input).valueOf()) - res.valueOf();
            // Use low-level api, because this fn is low-level api.
            res._d.setTime(res._d.valueOf() + diff);
            utils_hooks__hooks.updateOffset(res, false);
            return res;
        } else {
            return local__createLocal(input).local();
        }
    }

    function getDateOffset (m) {
        // On Firefox.24 Date#getTimezoneOffset returns a floating point.
        // https://github.com/moment/moment/pull/1871
        return -Math.round(m._d.getTimezoneOffset() / 15) * 15;
    }

    // HOOKS

    // This function will be called whenever a moment is mutated.
    // It is intended to keep the offset in sync with the timezone.
    utils_hooks__hooks.updateOffset = function () {};

    // MOMENTS

    // keepLocalTime = true means only change the timezone, without
    // affecting the local hour. So 5:31:26 +0300 --[utcOffset(2, true)]-->
    // 5:31:26 +0200 It is possible that 5:31:26 doesn't exist with offset
    // +0200, so we adjust the time as needed, to be valid.
    //
    // Keeping the time actually adds/subtracts (one hour)
    // from the actual represented time. That is why we call updateOffset
    // a second time. In case it wants us to change the offset again
    // _changeInProgress == true case, then we have to adjust, because
    // there is no such time in the given timezone.
    function getSetOffset (input, keepLocalTime) {
        var offset = this._offset || 0,
            localAdjust;
        if (!this.isValid()) {
            return input != null ? this : NaN;
        }
        if (input != null) {
            if (typeof input === 'string') {
                input = offsetFromString(matchShortOffset, input);
            } else if (Math.abs(input) < 16) {
                input = input * 60;
            }
            if (!this._isUTC && keepLocalTime) {
                localAdjust = getDateOffset(this);
            }
            this._offset = input;
            this._isUTC = true;
            if (localAdjust != null) {
                this.add(localAdjust, 'm');
            }
            if (offset !== input) {
                if (!keepLocalTime || this._changeInProgress) {
                    add_subtract__addSubtract(this, create__createDuration(input - offset, 'm'), 1, false);
                } else if (!this._changeInProgress) {
                    this._changeInProgress = true;
                    utils_hooks__hooks.updateOffset(this, true);
                    this._changeInProgress = null;
                }
            }
            return this;
        } else {
            return this._isUTC ? offset : getDateOffset(this);
        }
    }

    function getSetZone (input, keepLocalTime) {
        if (input != null) {
            if (typeof input !== 'string') {
                input = -input;
            }

            this.utcOffset(input, keepLocalTime);

            return this;
        } else {
            return -this.utcOffset();
        }
    }

    function setOffsetToUTC (keepLocalTime) {
        return this.utcOffset(0, keepLocalTime);
    }

    function setOffsetToLocal (keepLocalTime) {
        if (this._isUTC) {
            this.utcOffset(0, keepLocalTime);
            this._isUTC = false;

            if (keepLocalTime) {
                this.subtract(getDateOffset(this), 'm');
            }
        }
        return this;
    }

    function setOffsetToParsedOffset () {
        if (this._tzm) {
            this.utcOffset(this._tzm);
        } else if (typeof this._i === 'string') {
            this.utcOffset(offsetFromString(matchOffset, this._i));
        }
        return this;
    }

    function hasAlignedHourOffset (input) {
        if (!this.isValid()) {
            return false;
        }
        input = input ? local__createLocal(input).utcOffset() : 0;

        return (this.utcOffset() - input) % 60 === 0;
    }

    function isDaylightSavingTime () {
        return (
            this.utcOffset() > this.clone().month(0).utcOffset() ||
            this.utcOffset() > this.clone().month(5).utcOffset()
        );
    }

    function isDaylightSavingTimeShifted () {
        if (!isUndefined(this._isDSTShifted)) {
            return this._isDSTShifted;
        }

        var c = {};

        copyConfig(c, this);
        c = prepareConfig(c);

        if (c._a) {
            var other = c._isUTC ? create_utc__createUTC(c._a) : local__createLocal(c._a);
            this._isDSTShifted = this.isValid() &&
                compareArrays(c._a, other.toArray()) > 0;
        } else {
            this._isDSTShifted = false;
        }

        return this._isDSTShifted;
    }

    function isLocal () {
        return this.isValid() ? !this._isUTC : false;
    }

    function isUtcOffset () {
        return this.isValid() ? this._isUTC : false;
    }

    function isUtc () {
        return this.isValid() ? this._isUTC && this._offset === 0 : false;
    }

    // ASP.NET json date format regex
    var aspNetRegex = /^(\-)?(?:(\d*)[. ])?(\d+)\:(\d+)(?:\:(\d+)\.?(\d{3})?\d*)?$/;

    // from http://docs.closure-library.googlecode.com/git/closure_goog_date_date.js.source.html
    // somewhat more in line with 4.4.3.2 2004 spec, but allows decimal anywhere
    // and further modified to allow for strings containing both week and day
    var isoRegex = /^(-)?P(?:(-?[0-9,.]*)Y)?(?:(-?[0-9,.]*)M)?(?:(-?[0-9,.]*)W)?(?:(-?[0-9,.]*)D)?(?:T(?:(-?[0-9,.]*)H)?(?:(-?[0-9,.]*)M)?(?:(-?[0-9,.]*)S)?)?$/;

    function create__createDuration (input, key) {
        var duration = input,
            // matching against regexp is expensive, do it on demand
            match = null,
            sign,
            ret,
            diffRes;

        if (isDuration(input)) {
            duration = {
                ms : input._milliseconds,
                d  : input._days,
                M  : input._months
            };
        } else if (typeof input === 'number') {
            duration = {};
            if (key) {
                duration[key] = input;
            } else {
                duration.milliseconds = input;
            }
        } else if (!!(match = aspNetRegex.exec(input))) {
            sign = (match[1] === '-') ? -1 : 1;
            duration = {
                y  : 0,
                d  : toInt(match[DATE])        * sign,
                h  : toInt(match[HOUR])        * sign,
                m  : toInt(match[MINUTE])      * sign,
                s  : toInt(match[SECOND])      * sign,
                ms : toInt(match[MILLISECOND]) * sign
            };
        } else if (!!(match = isoRegex.exec(input))) {
            sign = (match[1] === '-') ? -1 : 1;
            duration = {
                y : parseIso(match[2], sign),
                M : parseIso(match[3], sign),
                w : parseIso(match[4], sign),
                d : parseIso(match[5], sign),
                h : parseIso(match[6], sign),
                m : parseIso(match[7], sign),
                s : parseIso(match[8], sign)
            };
        } else if (duration == null) {// checks for null or undefined
            duration = {};
        } else if (typeof duration === 'object' && ('from' in duration || 'to' in duration)) {
            diffRes = momentsDifference(local__createLocal(duration.from), local__createLocal(duration.to));

            duration = {};
            duration.ms = diffRes.milliseconds;
            duration.M = diffRes.months;
        }

        ret = new Duration(duration);

        if (isDuration(input) && hasOwnProp(input, '_locale')) {
            ret._locale = input._locale;
        }

        return ret;
    }

    create__createDuration.fn = Duration.prototype;

    function parseIso (inp, sign) {
        // We'd normally use ~~inp for this, but unfortunately it also
        // converts floats to ints.
        // inp may be undefined, so careful calling replace on it.
        var res = inp && parseFloat(inp.replace(',', '.'));
        // apply sign while we're at it
        return (isNaN(res) ? 0 : res) * sign;
    }

    function positiveMomentsDifference(base, other) {
        var res = {milliseconds: 0, months: 0};

        res.months = other.month() - base.month() +
            (other.year() - base.year()) * 12;
        if (base.clone().add(res.months, 'M').isAfter(other)) {
            --res.months;
        }

        res.milliseconds = +other - +(base.clone().add(res.months, 'M'));

        return res;
    }

    function momentsDifference(base, other) {
        var res;
        if (!(base.isValid() && other.isValid())) {
            return {milliseconds: 0, months: 0};
        }

        other = cloneWithOffset(other, base);
        if (base.isBefore(other)) {
            res = positiveMomentsDifference(base, other);
        } else {
            res = positiveMomentsDifference(other, base);
            res.milliseconds = -res.milliseconds;
            res.months = -res.months;
        }

        return res;
    }

    function absRound (number) {
        if (number < 0) {
            return Math.round(-1 * number) * -1;
        } else {
            return Math.round(number);
        }
    }

    // TODO: remove 'name' arg after deprecation is removed
    function createAdder(direction, name) {
        return function (val, period) {
            var dur, tmp;
            //invert the arguments, but complain about it
            if (period !== null && !isNaN(+period)) {
                deprecateSimple(name, 'moment().' + name  + '(period, number) is deprecated. Please use moment().' + name + '(number, period).');
                tmp = val; val = period; period = tmp;
            }

            val = typeof val === 'string' ? +val : val;
            dur = create__createDuration(val, period);
            add_subtract__addSubtract(this, dur, direction);
            return this;
        };
    }

    function add_subtract__addSubtract (mom, duration, isAdding, updateOffset) {
        var milliseconds = duration._milliseconds,
            days = absRound(duration._days),
            months = absRound(duration._months);

        if (!mom.isValid()) {
            // No op
            return;
        }

        updateOffset = updateOffset == null ? true : updateOffset;

        if (milliseconds) {
            mom._d.setTime(mom._d.valueOf() + milliseconds * isAdding);
        }
        if (days) {
            get_set__set(mom, 'Date', get_set__get(mom, 'Date') + days * isAdding);
        }
        if (months) {
            setMonth(mom, get_set__get(mom, 'Month') + months * isAdding);
        }
        if (updateOffset) {
            utils_hooks__hooks.updateOffset(mom, days || months);
        }
    }

    var add_subtract__add      = createAdder(1, 'add');
    var add_subtract__subtract = createAdder(-1, 'subtract');

    function moment_calendar__calendar (time, formats) {
        // We want to compare the start of today, vs this.
        // Getting start-of-today depends on whether we're local/utc/offset or not.
        var now = time || local__createLocal(),
            sod = cloneWithOffset(now, this).startOf('day'),
            diff = this.diff(sod, 'days', true),
            format = diff < -6 ? 'sameElse' :
                diff < -1 ? 'lastWeek' :
                diff < 0 ? 'lastDay' :
                diff < 1 ? 'sameDay' :
                diff < 2 ? 'nextDay' :
                diff < 7 ? 'nextWeek' : 'sameElse';

        var output = formats && (isFunction(formats[format]) ? formats[format]() : formats[format]);

        return this.format(output || this.localeData().calendar(format, this, local__createLocal(now)));
    }

    function clone () {
        return new Moment(this);
    }

    function isAfter (input, units) {
        var localInput = isMoment(input) ? input : local__createLocal(input);
        if (!(this.isValid() && localInput.isValid())) {
            return false;
        }
        units = normalizeUnits(!isUndefined(units) ? units : 'millisecond');
        if (units === 'millisecond') {
            return this.valueOf() > localInput.valueOf();
        } else {
            return localInput.valueOf() < this.clone().startOf(units).valueOf();
        }
    }

    function isBefore (input, units) {
        var localInput = isMoment(input) ? input : local__createLocal(input);
        if (!(this.isValid() && localInput.isValid())) {
            return false;
        }
        units = normalizeUnits(!isUndefined(units) ? units : 'millisecond');
        if (units === 'millisecond') {
            return this.valueOf() < localInput.valueOf();
        } else {
            return this.clone().endOf(units).valueOf() < localInput.valueOf();
        }
    }

    function isBetween (from, to, units, inclusivity) {
        inclusivity = inclusivity || '()';
        return (inclusivity[0] === '(' ? this.isAfter(from, units) : !this.isBefore(from, units)) &&
            (inclusivity[1] === ')' ? this.isBefore(to, units) : !this.isAfter(to, units));
    }

    function isSame (input, units) {
        var localInput = isMoment(input) ? input : local__createLocal(input),
            inputMs;
        if (!(this.isValid() && localInput.isValid())) {
            return false;
        }
        units = normalizeUnits(units || 'millisecond');
        if (units === 'millisecond') {
            return this.valueOf() === localInput.valueOf();
        } else {
            inputMs = localInput.valueOf();
            return this.clone().startOf(units).valueOf() <= inputMs && inputMs <= this.clone().endOf(units).valueOf();
        }
    }

    function isSameOrAfter (input, units) {
        return this.isSame(input, units) || this.isAfter(input,units);
    }

    function isSameOrBefore (input, units) {
        return this.isSame(input, units) || this.isBefore(input,units);
    }

    function diff (input, units, asFloat) {
        var that,
            zoneDelta,
            delta, output;

        if (!this.isValid()) {
            return NaN;
        }

        that = cloneWithOffset(input, this);

        if (!that.isValid()) {
            return NaN;
        }

        zoneDelta = (that.utcOffset() - this.utcOffset()) * 6e4;

        units = normalizeUnits(units);

        if (units === 'year' || units === 'month' || units === 'quarter') {
            output = monthDiff(this, that);
            if (units === 'quarter') {
                output = output / 3;
            } else if (units === 'year') {
                output = output / 12;
            }
        } else {
            delta = this - that;
            output = units === 'second' ? delta / 1e3 : // 1000
                units === 'minute' ? delta / 6e4 : // 1000 * 60
                units === 'hour' ? delta / 36e5 : // 1000 * 60 * 60
                units === 'day' ? (delta - zoneDelta) / 864e5 : // 1000 * 60 * 60 * 24, negate dst
                units === 'week' ? (delta - zoneDelta) / 6048e5 : // 1000 * 60 * 60 * 24 * 7, negate dst
                delta;
        }
        return asFloat ? output : absFloor(output);
    }

    function monthDiff (a, b) {
        // difference in months
        var wholeMonthDiff = ((b.year() - a.year()) * 12) + (b.month() - a.month()),
            // b is in (anchor - 1 month, anchor + 1 month)
            anchor = a.clone().add(wholeMonthDiff, 'months'),
            anchor2, adjust;

        if (b - anchor < 0) {
            anchor2 = a.clone().add(wholeMonthDiff - 1, 'months');
            // linear across the month
            adjust = (b - anchor) / (anchor - anchor2);
        } else {
            anchor2 = a.clone().add(wholeMonthDiff + 1, 'months');
            // linear across the month
            adjust = (b - anchor) / (anchor2 - anchor);
        }

        //check for negative zero, return zero if negative zero
        return -(wholeMonthDiff + adjust) || 0;
    }

    utils_hooks__hooks.defaultFormat = 'YYYY-MM-DDTHH:mm:ssZ';
    utils_hooks__hooks.defaultFormatUtc = 'YYYY-MM-DDTHH:mm:ss[Z]';

    function toString () {
        return this.clone().locale('en').format('ddd MMM DD YYYY HH:mm:ss [GMT]ZZ');
    }

    function moment_format__toISOString () {
        var m = this.clone().utc();
        if (0 < m.year() && m.year() <= 9999) {
            if (isFunction(Date.prototype.toISOString)) {
                // native implementation is ~50x faster, use it when we can
                return this.toDate().toISOString();
            } else {
                return formatMoment(m, 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
            }
        } else {
            return formatMoment(m, 'YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
        }
    }

    function format (inputString) {
        if (!inputString) {
            inputString = this.isUtc() ? utils_hooks__hooks.defaultFormatUtc : utils_hooks__hooks.defaultFormat;
        }
        var output = formatMoment(this, inputString);
        return this.localeData().postformat(output);
    }

    function from (time, withoutSuffix) {
        if (this.isValid() &&
                ((isMoment(time) && time.isValid()) ||
                 local__createLocal(time).isValid())) {
            return create__createDuration({to: this, from: time}).locale(this.locale()).humanize(!withoutSuffix);
        } else {
            return this.localeData().invalidDate();
        }
    }

    function fromNow (withoutSuffix) {
        return this.from(local__createLocal(), withoutSuffix);
    }

    function to (time, withoutSuffix) {
        if (this.isValid() &&
                ((isMoment(time) && time.isValid()) ||
                 local__createLocal(time).isValid())) {
            return create__createDuration({from: this, to: time}).locale(this.locale()).humanize(!withoutSuffix);
        } else {
            return this.localeData().invalidDate();
        }
    }

    function toNow (withoutSuffix) {
        return this.to(local__createLocal(), withoutSuffix);
    }

    // If passed a locale key, it will set the locale for this
    // instance.  Otherwise, it will return the locale configuration
    // variables for this instance.
    function locale (key) {
        var newLocaleData;

        if (key === undefined) {
            return this._locale._abbr;
        } else {
            newLocaleData = locale_locales__getLocale(key);
            if (newLocaleData != null) {
                this._locale = newLocaleData;
            }
            return this;
        }
    }

    var lang = deprecate(
        'moment().lang() is deprecated. Instead, use moment().localeData() to get the language configuration. Use moment().locale() to change languages.',
        function (key) {
            if (key === undefined) {
                return this.localeData();
            } else {
                return this.locale(key);
            }
        }
    );

    function localeData () {
        return this._locale;
    }

    function startOf (units) {
        units = normalizeUnits(units);
        // the following switch intentionally omits break keywords
        // to utilize falling through the cases.
        switch (units) {
        case 'year':
            this.month(0);
            /* falls through */
        case 'quarter':
        case 'month':
            this.date(1);
            /* falls through */
        case 'week':
        case 'isoWeek':
        case 'day':
        case 'date':
            this.hours(0);
            /* falls through */
        case 'hour':
            this.minutes(0);
            /* falls through */
        case 'minute':
            this.seconds(0);
            /* falls through */
        case 'second':
            this.milliseconds(0);
        }

        // weeks are a special case
        if (units === 'week') {
            this.weekday(0);
        }
        if (units === 'isoWeek') {
            this.isoWeekday(1);
        }

        // quarters are also special
        if (units === 'quarter') {
            this.month(Math.floor(this.month() / 3) * 3);
        }

        return this;
    }

    function endOf (units) {
        units = normalizeUnits(units);
        if (units === undefined || units === 'millisecond') {
            return this;
        }

        // 'date' is an alias for 'day', so it should be considered as such.
        if (units === 'date') {
            units = 'day';
        }

        return this.startOf(units).add(1, (units === 'isoWeek' ? 'week' : units)).subtract(1, 'ms');
    }

    function to_type__valueOf () {
        return this._d.valueOf() - ((this._offset || 0) * 60000);
    }

    function unix () {
        return Math.floor(this.valueOf() / 1000);
    }

    function toDate () {
        return this._offset ? new Date(this.valueOf()) : this._d;
    }

    function toArray () {
        var m = this;
        return [m.year(), m.month(), m.date(), m.hour(), m.minute(), m.second(), m.millisecond()];
    }

    function toObject () {
        var m = this;
        return {
            years: m.year(),
            months: m.month(),
            date: m.date(),
            hours: m.hours(),
            minutes: m.minutes(),
            seconds: m.seconds(),
            milliseconds: m.milliseconds()
        };
    }

    function toJSON () {
        // new Date(NaN).toJSON() === null
        return this.isValid() ? this.toISOString() : null;
    }

    function moment_valid__isValid () {
        return valid__isValid(this);
    }

    function parsingFlags () {
        return extend({}, getParsingFlags(this));
    }

    function invalidAt () {
        return getParsingFlags(this).overflow;
    }

    function creationData() {
        return {
            input: this._i,
            format: this._f,
            locale: this._locale,
            isUTC: this._isUTC,
            strict: this._strict
        };
    }

    // FORMATTING

    addFormatToken(0, ['gg', 2], 0, function () {
        return this.weekYear() % 100;
    });

    addFormatToken(0, ['GG', 2], 0, function () {
        return this.isoWeekYear() % 100;
    });

    function addWeekYearFormatToken (token, getter) {
        addFormatToken(0, [token, token.length], 0, getter);
    }

    addWeekYearFormatToken('gggg',     'weekYear');
    addWeekYearFormatToken('ggggg',    'weekYear');
    addWeekYearFormatToken('GGGG',  'isoWeekYear');
    addWeekYearFormatToken('GGGGG', 'isoWeekYear');

    // ALIASES

    addUnitAlias('weekYear', 'gg');
    addUnitAlias('isoWeekYear', 'GG');

    // PARSING

    addRegexToken('G',      matchSigned);
    addRegexToken('g',      matchSigned);
    addRegexToken('GG',     match1to2, match2);
    addRegexToken('gg',     match1to2, match2);
    addRegexToken('GGGG',   match1to4, match4);
    addRegexToken('gggg',   match1to4, match4);
    addRegexToken('GGGGG',  match1to6, match6);
    addRegexToken('ggggg',  match1to6, match6);

    addWeekParseToken(['gggg', 'ggggg', 'GGGG', 'GGGGG'], function (input, week, config, token) {
        week[token.substr(0, 2)] = toInt(input);
    });

    addWeekParseToken(['gg', 'GG'], function (input, week, config, token) {
        week[token] = utils_hooks__hooks.parseTwoDigitYear(input);
    });

    // MOMENTS

    function getSetWeekYear (input) {
        return getSetWeekYearHelper.call(this,
                input,
                this.week(),
                this.weekday(),
                this.localeData()._week.dow,
                this.localeData()._week.doy);
    }

    function getSetISOWeekYear (input) {
        return getSetWeekYearHelper.call(this,
                input, this.isoWeek(), this.isoWeekday(), 1, 4);
    }

    function getISOWeeksInYear () {
        return weeksInYear(this.year(), 1, 4);
    }

    function getWeeksInYear () {
        var weekInfo = this.localeData()._week;
        return weeksInYear(this.year(), weekInfo.dow, weekInfo.doy);
    }

    function getSetWeekYearHelper(input, week, weekday, dow, doy) {
        var weeksTarget;
        if (input == null) {
            return weekOfYear(this, dow, doy).year;
        } else {
            weeksTarget = weeksInYear(input, dow, doy);
            if (week > weeksTarget) {
                week = weeksTarget;
            }
            return setWeekAll.call(this, input, week, weekday, dow, doy);
        }
    }

    function setWeekAll(weekYear, week, weekday, dow, doy) {
        var dayOfYearData = dayOfYearFromWeeks(weekYear, week, weekday, dow, doy),
            date = createUTCDate(dayOfYearData.year, 0, dayOfYearData.dayOfYear);

        this.year(date.getUTCFullYear());
        this.month(date.getUTCMonth());
        this.date(date.getUTCDate());
        return this;
    }

    // FORMATTING

    addFormatToken('Q', 0, 'Qo', 'quarter');

    // ALIASES

    addUnitAlias('quarter', 'Q');

    // PARSING

    addRegexToken('Q', match1);
    addParseToken('Q', function (input, array) {
        array[MONTH] = (toInt(input) - 1) * 3;
    });

    // MOMENTS

    function getSetQuarter (input) {
        return input == null ? Math.ceil((this.month() + 1) / 3) : this.month((input - 1) * 3 + this.month() % 3);
    }

    // FORMATTING

    addFormatToken('w', ['ww', 2], 'wo', 'week');
    addFormatToken('W', ['WW', 2], 'Wo', 'isoWeek');

    // ALIASES

    addUnitAlias('week', 'w');
    addUnitAlias('isoWeek', 'W');

    // PARSING

    addRegexToken('w',  match1to2);
    addRegexToken('ww', match1to2, match2);
    addRegexToken('W',  match1to2);
    addRegexToken('WW', match1to2, match2);

    addWeekParseToken(['w', 'ww', 'W', 'WW'], function (input, week, config, token) {
        week[token.substr(0, 1)] = toInt(input);
    });

    // HELPERS

    // LOCALES

    function localeWeek (mom) {
        return weekOfYear(mom, this._week.dow, this._week.doy).week;
    }

    var defaultLocaleWeek = {
        dow : 0, // Sunday is the first day of the week.
        doy : 6  // The week that contains Jan 1st is the first week of the year.
    };

    function localeFirstDayOfWeek () {
        return this._week.dow;
    }

    function localeFirstDayOfYear () {
        return this._week.doy;
    }

    // MOMENTS

    function getSetWeek (input) {
        var week = this.localeData().week(this);
        return input == null ? week : this.add((input - week) * 7, 'd');
    }

    function getSetISOWeek (input) {
        var week = weekOfYear(this, 1, 4).week;
        return input == null ? week : this.add((input - week) * 7, 'd');
    }

    // FORMATTING

    addFormatToken('D', ['DD', 2], 'Do', 'date');

    // ALIASES

    addUnitAlias('date', 'D');

    // PARSING

    addRegexToken('D',  match1to2);
    addRegexToken('DD', match1to2, match2);
    addRegexToken('Do', function (isStrict, locale) {
        return isStrict ? locale._ordinalParse : locale._ordinalParseLenient;
    });

    addParseToken(['D', 'DD'], DATE);
    addParseToken('Do', function (input, array) {
        array[DATE] = toInt(input.match(match1to2)[0], 10);
    });

    // MOMENTS

    var getSetDayOfMonth = makeGetSet('Date', true);

    // FORMATTING

    addFormatToken('d', 0, 'do', 'day');

    addFormatToken('dd', 0, 0, function (format) {
        return this.localeData().weekdaysMin(this, format);
    });

    addFormatToken('ddd', 0, 0, function (format) {
        return this.localeData().weekdaysShort(this, format);
    });

    addFormatToken('dddd', 0, 0, function (format) {
        return this.localeData().weekdays(this, format);
    });

    addFormatToken('e', 0, 0, 'weekday');
    addFormatToken('E', 0, 0, 'isoWeekday');

    // ALIASES

    addUnitAlias('day', 'd');
    addUnitAlias('weekday', 'e');
    addUnitAlias('isoWeekday', 'E');

    // PARSING

    addRegexToken('d',    match1to2);
    addRegexToken('e',    match1to2);
    addRegexToken('E',    match1to2);
    addRegexToken('dd',   function (isStrict, locale) {
        return locale.weekdaysMinRegex(isStrict);
    });
    addRegexToken('ddd',   function (isStrict, locale) {
        return locale.weekdaysShortRegex(isStrict);
    });
    addRegexToken('dddd',   function (isStrict, locale) {
        return locale.weekdaysRegex(isStrict);
    });

    addWeekParseToken(['dd', 'ddd', 'dddd'], function (input, week, config, token) {
        var weekday = config._locale.weekdaysParse(input, token, config._strict);
        // if we didn't get a weekday name, mark the date as invalid
        if (weekday != null) {
            week.d = weekday;
        } else {
            getParsingFlags(config).invalidWeekday = input;
        }
    });

    addWeekParseToken(['d', 'e', 'E'], function (input, week, config, token) {
        week[token] = toInt(input);
    });

    // HELPERS

    function parseWeekday(input, locale) {
        if (typeof input !== 'string') {
            return input;
        }

        if (!isNaN(input)) {
            return parseInt(input, 10);
        }

        input = locale.weekdaysParse(input);
        if (typeof input === 'number') {
            return input;
        }

        return null;
    }

    // LOCALES

    var defaultLocaleWeekdays = 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_');
    function localeWeekdays (m, format) {
        return isArray(this._weekdays) ? this._weekdays[m.day()] :
            this._weekdays[this._weekdays.isFormat.test(format) ? 'format' : 'standalone'][m.day()];
    }

    var defaultLocaleWeekdaysShort = 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_');
    function localeWeekdaysShort (m) {
        return this._weekdaysShort[m.day()];
    }

    var defaultLocaleWeekdaysMin = 'Su_Mo_Tu_We_Th_Fr_Sa'.split('_');
    function localeWeekdaysMin (m) {
        return this._weekdaysMin[m.day()];
    }

    function day_of_week__handleStrictParse(weekdayName, format, strict) {
        var i, ii, mom, llc = weekdayName.toLocaleLowerCase();
        if (!this._weekdaysParse) {
            this._weekdaysParse = [];
            this._shortWeekdaysParse = [];
            this._minWeekdaysParse = [];

            for (i = 0; i < 7; ++i) {
                mom = create_utc__createUTC([2000, 1]).day(i);
                this._minWeekdaysParse[i] = this.weekdaysMin(mom, '').toLocaleLowerCase();
                this._shortWeekdaysParse[i] = this.weekdaysShort(mom, '').toLocaleLowerCase();
                this._weekdaysParse[i] = this.weekdays(mom, '').toLocaleLowerCase();
            }
        }

        if (strict) {
            if (format === 'dddd') {
                ii = indexOf.call(this._weekdaysParse, llc);
                return ii !== -1 ? ii : null;
            } else if (format === 'ddd') {
                ii = indexOf.call(this._shortWeekdaysParse, llc);
                return ii !== -1 ? ii : null;
            } else {
                ii = indexOf.call(this._minWeekdaysParse, llc);
                return ii !== -1 ? ii : null;
            }
        } else {
            if (format === 'dddd') {
                ii = indexOf.call(this._weekdaysParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf.call(this._shortWeekdaysParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf.call(this._minWeekdaysParse, llc);
                return ii !== -1 ? ii : null;
            } else if (format === 'ddd') {
                ii = indexOf.call(this._shortWeekdaysParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf.call(this._weekdaysParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf.call(this._minWeekdaysParse, llc);
                return ii !== -1 ? ii : null;
            } else {
                ii = indexOf.call(this._minWeekdaysParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf.call(this._weekdaysParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf.call(this._shortWeekdaysParse, llc);
                return ii !== -1 ? ii : null;
            }
        }
    }

    function localeWeekdaysParse (weekdayName, format, strict) {
        var i, mom, regex;

        if (this._weekdaysParseExact) {
            return day_of_week__handleStrictParse.call(this, weekdayName, format, strict);
        }

        if (!this._weekdaysParse) {
            this._weekdaysParse = [];
            this._minWeekdaysParse = [];
            this._shortWeekdaysParse = [];
            this._fullWeekdaysParse = [];
        }

        for (i = 0; i < 7; i++) {
            // make the regex if we don't have it already

            mom = create_utc__createUTC([2000, 1]).day(i);
            if (strict && !this._fullWeekdaysParse[i]) {
                this._fullWeekdaysParse[i] = new RegExp('^' + this.weekdays(mom, '').replace('.', '\.?') + '$', 'i');
                this._shortWeekdaysParse[i] = new RegExp('^' + this.weekdaysShort(mom, '').replace('.', '\.?') + '$', 'i');
                this._minWeekdaysParse[i] = new RegExp('^' + this.weekdaysMin(mom, '').replace('.', '\.?') + '$', 'i');
            }
            if (!this._weekdaysParse[i]) {
                regex = '^' + this.weekdays(mom, '') + '|^' + this.weekdaysShort(mom, '') + '|^' + this.weekdaysMin(mom, '');
                this._weekdaysParse[i] = new RegExp(regex.replace('.', ''), 'i');
            }
            // test the regex
            if (strict && format === 'dddd' && this._fullWeekdaysParse[i].test(weekdayName)) {
                return i;
            } else if (strict && format === 'ddd' && this._shortWeekdaysParse[i].test(weekdayName)) {
                return i;
            } else if (strict && format === 'dd' && this._minWeekdaysParse[i].test(weekdayName)) {
                return i;
            } else if (!strict && this._weekdaysParse[i].test(weekdayName)) {
                return i;
            }
        }
    }

    // MOMENTS

    function getSetDayOfWeek (input) {
        if (!this.isValid()) {
            return input != null ? this : NaN;
        }
        var day = this._isUTC ? this._d.getUTCDay() : this._d.getDay();
        if (input != null) {
            input = parseWeekday(input, this.localeData());
            return this.add(input - day, 'd');
        } else {
            return day;
        }
    }

    function getSetLocaleDayOfWeek (input) {
        if (!this.isValid()) {
            return input != null ? this : NaN;
        }
        var weekday = (this.day() + 7 - this.localeData()._week.dow) % 7;
        return input == null ? weekday : this.add(input - weekday, 'd');
    }

    function getSetISODayOfWeek (input) {
        if (!this.isValid()) {
            return input != null ? this : NaN;
        }
        // behaves the same as moment#day except
        // as a getter, returns 7 instead of 0 (1-7 range instead of 0-6)
        // as a setter, sunday should belong to the previous week.
        return input == null ? this.day() || 7 : this.day(this.day() % 7 ? input : input - 7);
    }

    var defaultWeekdaysRegex = matchWord;
    function weekdaysRegex (isStrict) {
        if (this._weekdaysParseExact) {
            if (!hasOwnProp(this, '_weekdaysRegex')) {
                computeWeekdaysParse.call(this);
            }
            if (isStrict) {
                return this._weekdaysStrictRegex;
            } else {
                return this._weekdaysRegex;
            }
        } else {
            return this._weekdaysStrictRegex && isStrict ?
                this._weekdaysStrictRegex : this._weekdaysRegex;
        }
    }

    var defaultWeekdaysShortRegex = matchWord;
    function weekdaysShortRegex (isStrict) {
        if (this._weekdaysParseExact) {
            if (!hasOwnProp(this, '_weekdaysRegex')) {
                computeWeekdaysParse.call(this);
            }
            if (isStrict) {
                return this._weekdaysShortStrictRegex;
            } else {
                return this._weekdaysShortRegex;
            }
        } else {
            return this._weekdaysShortStrictRegex && isStrict ?
                this._weekdaysShortStrictRegex : this._weekdaysShortRegex;
        }
    }

    var defaultWeekdaysMinRegex = matchWord;
    function weekdaysMinRegex (isStrict) {
        if (this._weekdaysParseExact) {
            if (!hasOwnProp(this, '_weekdaysRegex')) {
                computeWeekdaysParse.call(this);
            }
            if (isStrict) {
                return this._weekdaysMinStrictRegex;
            } else {
                return this._weekdaysMinRegex;
            }
        } else {
            return this._weekdaysMinStrictRegex && isStrict ?
                this._weekdaysMinStrictRegex : this._weekdaysMinRegex;
        }
    }


    function computeWeekdaysParse () {
        function cmpLenRev(a, b) {
            return b.length - a.length;
        }

        var minPieces = [], shortPieces = [], longPieces = [], mixedPieces = [],
            i, mom, minp, shortp, longp;
        for (i = 0; i < 7; i++) {
            // make the regex if we don't have it already
            mom = create_utc__createUTC([2000, 1]).day(i);
            minp = this.weekdaysMin(mom, '');
            shortp = this.weekdaysShort(mom, '');
            longp = this.weekdays(mom, '');
            minPieces.push(minp);
            shortPieces.push(shortp);
            longPieces.push(longp);
            mixedPieces.push(minp);
            mixedPieces.push(shortp);
            mixedPieces.push(longp);
        }
        // Sorting makes sure if one weekday (or abbr) is a prefix of another it
        // will match the longer piece.
        minPieces.sort(cmpLenRev);
        shortPieces.sort(cmpLenRev);
        longPieces.sort(cmpLenRev);
        mixedPieces.sort(cmpLenRev);
        for (i = 0; i < 7; i++) {
            shortPieces[i] = regexEscape(shortPieces[i]);
            longPieces[i] = regexEscape(longPieces[i]);
            mixedPieces[i] = regexEscape(mixedPieces[i]);
        }

        this._weekdaysRegex = new RegExp('^(' + mixedPieces.join('|') + ')', 'i');
        this._weekdaysShortRegex = this._weekdaysRegex;
        this._weekdaysMinRegex = this._weekdaysRegex;

        this._weekdaysStrictRegex = new RegExp('^(' + longPieces.join('|') + ')', 'i');
        this._weekdaysShortStrictRegex = new RegExp('^(' + shortPieces.join('|') + ')', 'i');
        this._weekdaysMinStrictRegex = new RegExp('^(' + minPieces.join('|') + ')', 'i');
    }

    // FORMATTING

    addFormatToken('DDD', ['DDDD', 3], 'DDDo', 'dayOfYear');

    // ALIASES

    addUnitAlias('dayOfYear', 'DDD');

    // PARSING

    addRegexToken('DDD',  match1to3);
    addRegexToken('DDDD', match3);
    addParseToken(['DDD', 'DDDD'], function (input, array, config) {
        config._dayOfYear = toInt(input);
    });

    // HELPERS

    // MOMENTS

    function getSetDayOfYear (input) {
        var dayOfYear = Math.round((this.clone().startOf('day') - this.clone().startOf('year')) / 864e5) + 1;
        return input == null ? dayOfYear : this.add((input - dayOfYear), 'd');
    }

    // FORMATTING

    function hFormat() {
        return this.hours() % 12 || 12;
    }

    function kFormat() {
        return this.hours() || 24;
    }

    addFormatToken('H', ['HH', 2], 0, 'hour');
    addFormatToken('h', ['hh', 2], 0, hFormat);
    addFormatToken('k', ['kk', 2], 0, kFormat);

    addFormatToken('hmm', 0, 0, function () {
        return '' + hFormat.apply(this) + zeroFill(this.minutes(), 2);
    });

    addFormatToken('hmmss', 0, 0, function () {
        return '' + hFormat.apply(this) + zeroFill(this.minutes(), 2) +
            zeroFill(this.seconds(), 2);
    });

    addFormatToken('Hmm', 0, 0, function () {
        return '' + this.hours() + zeroFill(this.minutes(), 2);
    });

    addFormatToken('Hmmss', 0, 0, function () {
        return '' + this.hours() + zeroFill(this.minutes(), 2) +
            zeroFill(this.seconds(), 2);
    });

    function meridiem (token, lowercase) {
        addFormatToken(token, 0, 0, function () {
            return this.localeData().meridiem(this.hours(), this.minutes(), lowercase);
        });
    }

    meridiem('a', true);
    meridiem('A', false);

    // ALIASES

    addUnitAlias('hour', 'h');

    // PARSING

    function matchMeridiem (isStrict, locale) {
        return locale._meridiemParse;
    }

    addRegexToken('a',  matchMeridiem);
    addRegexToken('A',  matchMeridiem);
    addRegexToken('H',  match1to2);
    addRegexToken('h',  match1to2);
    addRegexToken('HH', match1to2, match2);
    addRegexToken('hh', match1to2, match2);

    addRegexToken('hmm', match3to4);
    addRegexToken('hmmss', match5to6);
    addRegexToken('Hmm', match3to4);
    addRegexToken('Hmmss', match5to6);

    addParseToken(['H', 'HH'], HOUR);
    addParseToken(['a', 'A'], function (input, array, config) {
        config._isPm = config._locale.isPM(input);
        config._meridiem = input;
    });
    addParseToken(['h', 'hh'], function (input, array, config) {
        array[HOUR] = toInt(input);
        getParsingFlags(config).bigHour = true;
    });
    addParseToken('hmm', function (input, array, config) {
        var pos = input.length - 2;
        array[HOUR] = toInt(input.substr(0, pos));
        array[MINUTE] = toInt(input.substr(pos));
        getParsingFlags(config).bigHour = true;
    });
    addParseToken('hmmss', function (input, array, config) {
        var pos1 = input.length - 4;
        var pos2 = input.length - 2;
        array[HOUR] = toInt(input.substr(0, pos1));
        array[MINUTE] = toInt(input.substr(pos1, 2));
        array[SECOND] = toInt(input.substr(pos2));
        getParsingFlags(config).bigHour = true;
    });
    addParseToken('Hmm', function (input, array, config) {
        var pos = input.length - 2;
        array[HOUR] = toInt(input.substr(0, pos));
        array[MINUTE] = toInt(input.substr(pos));
    });
    addParseToken('Hmmss', function (input, array, config) {
        var pos1 = input.length - 4;
        var pos2 = input.length - 2;
        array[HOUR] = toInt(input.substr(0, pos1));
        array[MINUTE] = toInt(input.substr(pos1, 2));
        array[SECOND] = toInt(input.substr(pos2));
    });

    // LOCALES

    function localeIsPM (input) {
        // IE8 Quirks Mode & IE7 Standards Mode do not allow accessing strings like arrays
        // Using charAt should be more compatible.
        return ((input + '').toLowerCase().charAt(0) === 'p');
    }

    var defaultLocaleMeridiemParse = /[ap]\.?m?\.?/i;
    function localeMeridiem (hours, minutes, isLower) {
        if (hours > 11) {
            return isLower ? 'pm' : 'PM';
        } else {
            return isLower ? 'am' : 'AM';
        }
    }


    // MOMENTS

    // Setting the hour should keep the time, because the user explicitly
    // specified which hour he wants. So trying to maintain the same hour (in
    // a new timezone) makes sense. Adding/subtracting hours does not follow
    // this rule.
    var getSetHour = makeGetSet('Hours', true);

    // FORMATTING

    addFormatToken('m', ['mm', 2], 0, 'minute');

    // ALIASES

    addUnitAlias('minute', 'm');

    // PARSING

    addRegexToken('m',  match1to2);
    addRegexToken('mm', match1to2, match2);
    addParseToken(['m', 'mm'], MINUTE);

    // MOMENTS

    var getSetMinute = makeGetSet('Minutes', false);

    // FORMATTING

    addFormatToken('s', ['ss', 2], 0, 'second');

    // ALIASES

    addUnitAlias('second', 's');

    // PARSING

    addRegexToken('s',  match1to2);
    addRegexToken('ss', match1to2, match2);
    addParseToken(['s', 'ss'], SECOND);

    // MOMENTS

    var getSetSecond = makeGetSet('Seconds', false);

    // FORMATTING

    addFormatToken('S', 0, 0, function () {
        return ~~(this.millisecond() / 100);
    });

    addFormatToken(0, ['SS', 2], 0, function () {
        return ~~(this.millisecond() / 10);
    });

    addFormatToken(0, ['SSS', 3], 0, 'millisecond');
    addFormatToken(0, ['SSSS', 4], 0, function () {
        return this.millisecond() * 10;
    });
    addFormatToken(0, ['SSSSS', 5], 0, function () {
        return this.millisecond() * 100;
    });
    addFormatToken(0, ['SSSSSS', 6], 0, function () {
        return this.millisecond() * 1000;
    });
    addFormatToken(0, ['SSSSSSS', 7], 0, function () {
        return this.millisecond() * 10000;
    });
    addFormatToken(0, ['SSSSSSSS', 8], 0, function () {
        return this.millisecond() * 100000;
    });
    addFormatToken(0, ['SSSSSSSSS', 9], 0, function () {
        return this.millisecond() * 1000000;
    });


    // ALIASES

    addUnitAlias('millisecond', 'ms');

    // PARSING

    addRegexToken('S',    match1to3, match1);
    addRegexToken('SS',   match1to3, match2);
    addRegexToken('SSS',  match1to3, match3);

    var token;
    for (token = 'SSSS'; token.length <= 9; token += 'S') {
        addRegexToken(token, matchUnsigned);
    }

    function parseMs(input, array) {
        array[MILLISECOND] = toInt(('0.' + input) * 1000);
    }

    for (token = 'S'; token.length <= 9; token += 'S') {
        addParseToken(token, parseMs);
    }
    // MOMENTS

    var getSetMillisecond = makeGetSet('Milliseconds', false);

    // FORMATTING

    addFormatToken('z',  0, 0, 'zoneAbbr');
    addFormatToken('zz', 0, 0, 'zoneName');

    // MOMENTS

    function getZoneAbbr () {
        return this._isUTC ? 'UTC' : '';
    }

    function getZoneName () {
        return this._isUTC ? 'Coordinated Universal Time' : '';
    }

    var momentPrototype__proto = Moment.prototype;

    momentPrototype__proto.add               = add_subtract__add;
    momentPrototype__proto.calendar          = moment_calendar__calendar;
    momentPrototype__proto.clone             = clone;
    momentPrototype__proto.diff              = diff;
    momentPrototype__proto.endOf             = endOf;
    momentPrototype__proto.format            = format;
    momentPrototype__proto.from              = from;
    momentPrototype__proto.fromNow           = fromNow;
    momentPrototype__proto.to                = to;
    momentPrototype__proto.toNow             = toNow;
    momentPrototype__proto.get               = getSet;
    momentPrototype__proto.invalidAt         = invalidAt;
    momentPrototype__proto.isAfter           = isAfter;
    momentPrototype__proto.isBefore          = isBefore;
    momentPrototype__proto.isBetween         = isBetween;
    momentPrototype__proto.isSame            = isSame;
    momentPrototype__proto.isSameOrAfter     = isSameOrAfter;
    momentPrototype__proto.isSameOrBefore    = isSameOrBefore;
    momentPrototype__proto.isValid           = moment_valid__isValid;
    momentPrototype__proto.lang              = lang;
    momentPrototype__proto.locale            = locale;
    momentPrototype__proto.localeData        = localeData;
    momentPrototype__proto.max               = prototypeMax;
    momentPrototype__proto.min               = prototypeMin;
    momentPrototype__proto.parsingFlags      = parsingFlags;
    momentPrototype__proto.set               = getSet;
    momentPrototype__proto.startOf           = startOf;
    momentPrototype__proto.subtract          = add_subtract__subtract;
    momentPrototype__proto.toArray           = toArray;
    momentPrototype__proto.toObject          = toObject;
    momentPrototype__proto.toDate            = toDate;
    momentPrototype__proto.toISOString       = moment_format__toISOString;
    momentPrototype__proto.toJSON            = toJSON;
    momentPrototype__proto.toString          = toString;
    momentPrototype__proto.unix              = unix;
    momentPrototype__proto.valueOf           = to_type__valueOf;
    momentPrototype__proto.creationData      = creationData;

    // Year
    momentPrototype__proto.year       = getSetYear;
    momentPrototype__proto.isLeapYear = getIsLeapYear;

    // Week Year
    momentPrototype__proto.weekYear    = getSetWeekYear;
    momentPrototype__proto.isoWeekYear = getSetISOWeekYear;

    // Quarter
    momentPrototype__proto.quarter = momentPrototype__proto.quarters = getSetQuarter;

    // Month
    momentPrototype__proto.month       = getSetMonth;
    momentPrototype__proto.daysInMonth = getDaysInMonth;

    // Week
    momentPrototype__proto.week           = momentPrototype__proto.weeks        = getSetWeek;
    momentPrototype__proto.isoWeek        = momentPrototype__proto.isoWeeks     = getSetISOWeek;
    momentPrototype__proto.weeksInYear    = getWeeksInYear;
    momentPrototype__proto.isoWeeksInYear = getISOWeeksInYear;

    // Day
    momentPrototype__proto.date       = getSetDayOfMonth;
    momentPrototype__proto.day        = momentPrototype__proto.days             = getSetDayOfWeek;
    momentPrototype__proto.weekday    = getSetLocaleDayOfWeek;
    momentPrototype__proto.isoWeekday = getSetISODayOfWeek;
    momentPrototype__proto.dayOfYear  = getSetDayOfYear;

    // Hour
    momentPrototype__proto.hour = momentPrototype__proto.hours = getSetHour;

    // Minute
    momentPrototype__proto.minute = momentPrototype__proto.minutes = getSetMinute;

    // Second
    momentPrototype__proto.second = momentPrototype__proto.seconds = getSetSecond;

    // Millisecond
    momentPrototype__proto.millisecond = momentPrototype__proto.milliseconds = getSetMillisecond;

    // Offset
    momentPrototype__proto.utcOffset            = getSetOffset;
    momentPrototype__proto.utc                  = setOffsetToUTC;
    momentPrototype__proto.local                = setOffsetToLocal;
    momentPrototype__proto.parseZone            = setOffsetToParsedOffset;
    momentPrototype__proto.hasAlignedHourOffset = hasAlignedHourOffset;
    momentPrototype__proto.isDST                = isDaylightSavingTime;
    momentPrototype__proto.isDSTShifted         = isDaylightSavingTimeShifted;
    momentPrototype__proto.isLocal              = isLocal;
    momentPrototype__proto.isUtcOffset          = isUtcOffset;
    momentPrototype__proto.isUtc                = isUtc;
    momentPrototype__proto.isUTC                = isUtc;

    // Timezone
    momentPrototype__proto.zoneAbbr = getZoneAbbr;
    momentPrototype__proto.zoneName = getZoneName;

    // Deprecations
    momentPrototype__proto.dates  = deprecate('dates accessor is deprecated. Use date instead.', getSetDayOfMonth);
    momentPrototype__proto.months = deprecate('months accessor is deprecated. Use month instead', getSetMonth);
    momentPrototype__proto.years  = deprecate('years accessor is deprecated. Use year instead', getSetYear);
    momentPrototype__proto.zone   = deprecate('moment().zone is deprecated, use moment().utcOffset instead. https://github.com/moment/moment/issues/1779', getSetZone);

    var momentPrototype = momentPrototype__proto;

    function moment__createUnix (input) {
        return local__createLocal(input * 1000);
    }

    function moment__createInZone () {
        return local__createLocal.apply(null, arguments).parseZone();
    }

    var defaultCalendar = {
        sameDay : '[Today at] LT',
        nextDay : '[Tomorrow at] LT',
        nextWeek : 'dddd [at] LT',
        lastDay : '[Yesterday at] LT',
        lastWeek : '[Last] dddd [at] LT',
        sameElse : 'L'
    };

    function locale_calendar__calendar (key, mom, now) {
        var output = this._calendar[key];
        return isFunction(output) ? output.call(mom, now) : output;
    }

    var defaultLongDateFormat = {
        LTS  : 'h:mm:ss A',
        LT   : 'h:mm A',
        L    : 'MM/DD/YYYY',
        LL   : 'MMMM D, YYYY',
        LLL  : 'MMMM D, YYYY h:mm A',
        LLLL : 'dddd, MMMM D, YYYY h:mm A'
    };

    function longDateFormat (key) {
        var format = this._longDateFormat[key],
            formatUpper = this._longDateFormat[key.toUpperCase()];

        if (format || !formatUpper) {
            return format;
        }

        this._longDateFormat[key] = formatUpper.replace(/MMMM|MM|DD|dddd/g, function (val) {
            return val.slice(1);
        });

        return this._longDateFormat[key];
    }

    var defaultInvalidDate = 'Invalid date';

    function invalidDate () {
        return this._invalidDate;
    }

    var defaultOrdinal = '%d';
    var defaultOrdinalParse = /\d{1,2}/;

    function ordinal (number) {
        return this._ordinal.replace('%d', number);
    }

    function preParsePostFormat (string) {
        return string;
    }

    var defaultRelativeTime = {
        future : 'in %s',
        past   : '%s ago',
        s  : 'a few seconds',
        m  : 'a minute',
        mm : '%d minutes',
        h  : 'an hour',
        hh : '%d hours',
        d  : 'a day',
        dd : '%d days',
        M  : 'a month',
        MM : '%d months',
        y  : 'a year',
        yy : '%d years'
    };

    function relative__relativeTime (number, withoutSuffix, string, isFuture) {
        var output = this._relativeTime[string];
        return (isFunction(output)) ?
            output(number, withoutSuffix, string, isFuture) :
            output.replace(/%d/i, number);
    }

    function pastFuture (diff, output) {
        var format = this._relativeTime[diff > 0 ? 'future' : 'past'];
        return isFunction(format) ? format(output) : format.replace(/%s/i, output);
    }

    var prototype__proto = Locale.prototype;

    prototype__proto._calendar       = defaultCalendar;
    prototype__proto.calendar        = locale_calendar__calendar;
    prototype__proto._longDateFormat = defaultLongDateFormat;
    prototype__proto.longDateFormat  = longDateFormat;
    prototype__proto._invalidDate    = defaultInvalidDate;
    prototype__proto.invalidDate     = invalidDate;
    prototype__proto._ordinal        = defaultOrdinal;
    prototype__proto.ordinal         = ordinal;
    prototype__proto._ordinalParse   = defaultOrdinalParse;
    prototype__proto.preparse        = preParsePostFormat;
    prototype__proto.postformat      = preParsePostFormat;
    prototype__proto._relativeTime   = defaultRelativeTime;
    prototype__proto.relativeTime    = relative__relativeTime;
    prototype__proto.pastFuture      = pastFuture;
    prototype__proto.set             = locale_set__set;

    // Month
    prototype__proto.months            =        localeMonths;
    prototype__proto._months           = defaultLocaleMonths;
    prototype__proto.monthsShort       =        localeMonthsShort;
    prototype__proto._monthsShort      = defaultLocaleMonthsShort;
    prototype__proto.monthsParse       =        localeMonthsParse;
    prototype__proto._monthsRegex      = defaultMonthsRegex;
    prototype__proto.monthsRegex       = monthsRegex;
    prototype__proto._monthsShortRegex = defaultMonthsShortRegex;
    prototype__proto.monthsShortRegex  = monthsShortRegex;

    // Week
    prototype__proto.week = localeWeek;
    prototype__proto._week = defaultLocaleWeek;
    prototype__proto.firstDayOfYear = localeFirstDayOfYear;
    prototype__proto.firstDayOfWeek = localeFirstDayOfWeek;

    // Day of Week
    prototype__proto.weekdays       =        localeWeekdays;
    prototype__proto._weekdays      = defaultLocaleWeekdays;
    prototype__proto.weekdaysMin    =        localeWeekdaysMin;
    prototype__proto._weekdaysMin   = defaultLocaleWeekdaysMin;
    prototype__proto.weekdaysShort  =        localeWeekdaysShort;
    prototype__proto._weekdaysShort = defaultLocaleWeekdaysShort;
    prototype__proto.weekdaysParse  =        localeWeekdaysParse;

    prototype__proto._weekdaysRegex      = defaultWeekdaysRegex;
    prototype__proto.weekdaysRegex       =        weekdaysRegex;
    prototype__proto._weekdaysShortRegex = defaultWeekdaysShortRegex;
    prototype__proto.weekdaysShortRegex  =        weekdaysShortRegex;
    prototype__proto._weekdaysMinRegex   = defaultWeekdaysMinRegex;
    prototype__proto.weekdaysMinRegex    =        weekdaysMinRegex;

    // Hours
    prototype__proto.isPM = localeIsPM;
    prototype__proto._meridiemParse = defaultLocaleMeridiemParse;
    prototype__proto.meridiem = localeMeridiem;

    function lists__get (format, index, field, setter) {
        var locale = locale_locales__getLocale();
        var utc = create_utc__createUTC().set(setter, index);
        return locale[field](utc, format);
    }

    function listMonthsImpl (format, index, field) {
        if (typeof format === 'number') {
            index = format;
            format = undefined;
        }

        format = format || '';

        if (index != null) {
            return lists__get(format, index, field, 'month');
        }

        var i;
        var out = [];
        for (i = 0; i < 12; i++) {
            out[i] = lists__get(format, i, field, 'month');
        }
        return out;
    }

    // ()
    // (5)
    // (fmt, 5)
    // (fmt)
    // (true)
    // (true, 5)
    // (true, fmt, 5)
    // (true, fmt)
    function listWeekdaysImpl (localeSorted, format, index, field) {
        if (typeof localeSorted === 'boolean') {
            if (typeof format === 'number') {
                index = format;
                format = undefined;
            }

            format = format || '';
        } else {
            format = localeSorted;
            index = format;
            localeSorted = false;

            if (typeof format === 'number') {
                index = format;
                format = undefined;
            }

            format = format || '';
        }

        var locale = locale_locales__getLocale(),
            shift = localeSorted ? locale._week.dow : 0;

        if (index != null) {
            return lists__get(format, (index + shift) % 7, field, 'day');
        }

        var i;
        var out = [];
        for (i = 0; i < 7; i++) {
            out[i] = lists__get(format, (i + shift) % 7, field, 'day');
        }
        return out;
    }

    function lists__listMonths (format, index) {
        return listMonthsImpl(format, index, 'months');
    }

    function lists__listMonthsShort (format, index) {
        return listMonthsImpl(format, index, 'monthsShort');
    }

    function lists__listWeekdays (localeSorted, format, index) {
        return listWeekdaysImpl(localeSorted, format, index, 'weekdays');
    }

    function lists__listWeekdaysShort (localeSorted, format, index) {
        return listWeekdaysImpl(localeSorted, format, index, 'weekdaysShort');
    }

    function lists__listWeekdaysMin (localeSorted, format, index) {
        return listWeekdaysImpl(localeSorted, format, index, 'weekdaysMin');
    }

    locale_locales__getSetGlobalLocale('en', {
        ordinalParse: /\d{1,2}(th|st|nd|rd)/,
        ordinal : function (number) {
            var b = number % 10,
                output = (toInt(number % 100 / 10) === 1) ? 'th' :
                (b === 1) ? 'st' :
                (b === 2) ? 'nd' :
                (b === 3) ? 'rd' : 'th';
            return number + output;
        }
    });

    // Side effect imports
    utils_hooks__hooks.lang = deprecate('moment.lang is deprecated. Use moment.locale instead.', locale_locales__getSetGlobalLocale);
    utils_hooks__hooks.langData = deprecate('moment.langData is deprecated. Use moment.localeData instead.', locale_locales__getLocale);

    var mathAbs = Math.abs;

    function duration_abs__abs () {
        var data           = this._data;

        this._milliseconds = mathAbs(this._milliseconds);
        this._days         = mathAbs(this._days);
        this._months       = mathAbs(this._months);

        data.milliseconds  = mathAbs(data.milliseconds);
        data.seconds       = mathAbs(data.seconds);
        data.minutes       = mathAbs(data.minutes);
        data.hours         = mathAbs(data.hours);
        data.months        = mathAbs(data.months);
        data.years         = mathAbs(data.years);

        return this;
    }

    function duration_add_subtract__addSubtract (duration, input, value, direction) {
        var other = create__createDuration(input, value);

        duration._milliseconds += direction * other._milliseconds;
        duration._days         += direction * other._days;
        duration._months       += direction * other._months;

        return duration._bubble();
    }

    // supports only 2.0-style add(1, 's') or add(duration)
    function duration_add_subtract__add (input, value) {
        return duration_add_subtract__addSubtract(this, input, value, 1);
    }

    // supports only 2.0-style subtract(1, 's') or subtract(duration)
    function duration_add_subtract__subtract (input, value) {
        return duration_add_subtract__addSubtract(this, input, value, -1);
    }

    function absCeil (number) {
        if (number < 0) {
            return Math.floor(number);
        } else {
            return Math.ceil(number);
        }
    }

    function bubble () {
        var milliseconds = this._milliseconds;
        var days         = this._days;
        var months       = this._months;
        var data         = this._data;
        var seconds, minutes, hours, years, monthsFromDays;

        // if we have a mix of positive and negative values, bubble down first
        // check: https://github.com/moment/moment/issues/2166
        if (!((milliseconds >= 0 && days >= 0 && months >= 0) ||
                (milliseconds <= 0 && days <= 0 && months <= 0))) {
            milliseconds += absCeil(monthsToDays(months) + days) * 864e5;
            days = 0;
            months = 0;
        }

        // The following code bubbles up values, see the tests for
        // examples of what that means.
        data.milliseconds = milliseconds % 1000;

        seconds           = absFloor(milliseconds / 1000);
        data.seconds      = seconds % 60;

        minutes           = absFloor(seconds / 60);
        data.minutes      = minutes % 60;

        hours             = absFloor(minutes / 60);
        data.hours        = hours % 24;

        days += absFloor(hours / 24);

        // convert days to months
        monthsFromDays = absFloor(daysToMonths(days));
        months += monthsFromDays;
        days -= absCeil(monthsToDays(monthsFromDays));

        // 12 months -> 1 year
        years = absFloor(months / 12);
        months %= 12;

        data.days   = days;
        data.months = months;
        data.years  = years;

        return this;
    }

    function daysToMonths (days) {
        // 400 years have 146097 days (taking into account leap year rules)
        // 400 years have 12 months === 4800
        return days * 4800 / 146097;
    }

    function monthsToDays (months) {
        // the reverse of daysToMonths
        return months * 146097 / 4800;
    }

    function as (units) {
        var days;
        var months;
        var milliseconds = this._milliseconds;

        units = normalizeUnits(units);

        if (units === 'month' || units === 'year') {
            days   = this._days   + milliseconds / 864e5;
            months = this._months + daysToMonths(days);
            return units === 'month' ? months : months / 12;
        } else {
            // handle milliseconds separately because of floating point math errors (issue #1867)
            days = this._days + Math.round(monthsToDays(this._months));
            switch (units) {
                case 'week'   : return days / 7     + milliseconds / 6048e5;
                case 'day'    : return days         + milliseconds / 864e5;
                case 'hour'   : return days * 24    + milliseconds / 36e5;
                case 'minute' : return days * 1440  + milliseconds / 6e4;
                case 'second' : return days * 86400 + milliseconds / 1000;
                // Math.floor prevents floating point math errors here
                case 'millisecond': return Math.floor(days * 864e5) + milliseconds;
                default: throw new Error('Unknown unit ' + units);
            }
        }
    }

    // TODO: Use this.as('ms')?
    function duration_as__valueOf () {
        return (
            this._milliseconds +
            this._days * 864e5 +
            (this._months % 12) * 2592e6 +
            toInt(this._months / 12) * 31536e6
        );
    }

    function makeAs (alias) {
        return function () {
            return this.as(alias);
        };
    }

    var asMilliseconds = makeAs('ms');
    var asSeconds      = makeAs('s');
    var asMinutes      = makeAs('m');
    var asHours        = makeAs('h');
    var asDays         = makeAs('d');
    var asWeeks        = makeAs('w');
    var asMonths       = makeAs('M');
    var asYears        = makeAs('y');

    function duration_get__get (units) {
        units = normalizeUnits(units);
        return this[units + 's']();
    }

    function makeGetter(name) {
        return function () {
            return this._data[name];
        };
    }

    var milliseconds = makeGetter('milliseconds');
    var seconds      = makeGetter('seconds');
    var minutes      = makeGetter('minutes');
    var hours        = makeGetter('hours');
    var days         = makeGetter('days');
    var months       = makeGetter('months');
    var years        = makeGetter('years');

    function weeks () {
        return absFloor(this.days() / 7);
    }

    var round = Math.round;
    var thresholds = {
        s: 45,  // seconds to minute
        m: 45,  // minutes to hour
        h: 22,  // hours to day
        d: 26,  // days to month
        M: 11   // months to year
    };

    // helper function for moment.fn.from, moment.fn.fromNow, and moment.duration.fn.humanize
    function substituteTimeAgo(string, number, withoutSuffix, isFuture, locale) {
        return locale.relativeTime(number || 1, !!withoutSuffix, string, isFuture);
    }

    function duration_humanize__relativeTime (posNegDuration, withoutSuffix, locale) {
        var duration = create__createDuration(posNegDuration).abs();
        var seconds  = round(duration.as('s'));
        var minutes  = round(duration.as('m'));
        var hours    = round(duration.as('h'));
        var days     = round(duration.as('d'));
        var months   = round(duration.as('M'));
        var years    = round(duration.as('y'));

        var a = seconds < thresholds.s && ['s', seconds]  ||
                minutes <= 1           && ['m']           ||
                minutes < thresholds.m && ['mm', minutes] ||
                hours   <= 1           && ['h']           ||
                hours   < thresholds.h && ['hh', hours]   ||
                days    <= 1           && ['d']           ||
                days    < thresholds.d && ['dd', days]    ||
                months  <= 1           && ['M']           ||
                months  < thresholds.M && ['MM', months]  ||
                years   <= 1           && ['y']           || ['yy', years];

        a[2] = withoutSuffix;
        a[3] = +posNegDuration > 0;
        a[4] = locale;
        return substituteTimeAgo.apply(null, a);
    }

    // This function allows you to set a threshold for relative time strings
    function duration_humanize__getSetRelativeTimeThreshold (threshold, limit) {
        if (thresholds[threshold] === undefined) {
            return false;
        }
        if (limit === undefined) {
            return thresholds[threshold];
        }
        thresholds[threshold] = limit;
        return true;
    }

    function humanize (withSuffix) {
        var locale = this.localeData();
        var output = duration_humanize__relativeTime(this, !withSuffix, locale);

        if (withSuffix) {
            output = locale.pastFuture(+this, output);
        }

        return locale.postformat(output);
    }

    var iso_string__abs = Math.abs;

    function iso_string__toISOString() {
        // for ISO strings we do not use the normal bubbling rules:
        //  * milliseconds bubble up until they become hours
        //  * days do not bubble at all
        //  * months bubble up until they become years
        // This is because there is no context-free conversion between hours and days
        // (think of clock changes)
        // and also not between days and months (28-31 days per month)
        var seconds = iso_string__abs(this._milliseconds) / 1000;
        var days         = iso_string__abs(this._days);
        var months       = iso_string__abs(this._months);
        var minutes, hours, years;

        // 3600 seconds -> 60 minutes -> 1 hour
        minutes           = absFloor(seconds / 60);
        hours             = absFloor(minutes / 60);
        seconds %= 60;
        minutes %= 60;

        // 12 months -> 1 year
        years  = absFloor(months / 12);
        months %= 12;


        // inspired by https://github.com/dordille/moment-isoduration/blob/master/moment.isoduration.js
        var Y = years;
        var M = months;
        var D = days;
        var h = hours;
        var m = minutes;
        var s = seconds;
        var total = this.asSeconds();

        if (!total) {
            // this is the same as C#'s (Noda) and python (isodate)...
            // but not other JS (goog.date)
            return 'P0D';
        }

        return (total < 0 ? '-' : '') +
            'P' +
            (Y ? Y + 'Y' : '') +
            (M ? M + 'M' : '') +
            (D ? D + 'D' : '') +
            ((h || m || s) ? 'T' : '') +
            (h ? h + 'H' : '') +
            (m ? m + 'M' : '') +
            (s ? s + 'S' : '');
    }

    var duration_prototype__proto = Duration.prototype;

    duration_prototype__proto.abs            = duration_abs__abs;
    duration_prototype__proto.add            = duration_add_subtract__add;
    duration_prototype__proto.subtract       = duration_add_subtract__subtract;
    duration_prototype__proto.as             = as;
    duration_prototype__proto.asMilliseconds = asMilliseconds;
    duration_prototype__proto.asSeconds      = asSeconds;
    duration_prototype__proto.asMinutes      = asMinutes;
    duration_prototype__proto.asHours        = asHours;
    duration_prototype__proto.asDays         = asDays;
    duration_prototype__proto.asWeeks        = asWeeks;
    duration_prototype__proto.asMonths       = asMonths;
    duration_prototype__proto.asYears        = asYears;
    duration_prototype__proto.valueOf        = duration_as__valueOf;
    duration_prototype__proto._bubble        = bubble;
    duration_prototype__proto.get            = duration_get__get;
    duration_prototype__proto.milliseconds   = milliseconds;
    duration_prototype__proto.seconds        = seconds;
    duration_prototype__proto.minutes        = minutes;
    duration_prototype__proto.hours          = hours;
    duration_prototype__proto.days           = days;
    duration_prototype__proto.weeks          = weeks;
    duration_prototype__proto.months         = months;
    duration_prototype__proto.years          = years;
    duration_prototype__proto.humanize       = humanize;
    duration_prototype__proto.toISOString    = iso_string__toISOString;
    duration_prototype__proto.toString       = iso_string__toISOString;
    duration_prototype__proto.toJSON         = iso_string__toISOString;
    duration_prototype__proto.locale         = locale;
    duration_prototype__proto.localeData     = localeData;

    // Deprecations
    duration_prototype__proto.toIsoString = deprecate('toIsoString() is deprecated. Please use toISOString() instead (notice the capitals)', iso_string__toISOString);
    duration_prototype__proto.lang = lang;

    // Side effect imports

    // FORMATTING

    addFormatToken('X', 0, 0, 'unix');
    addFormatToken('x', 0, 0, 'valueOf');

    // PARSING

    addRegexToken('x', matchSigned);
    addRegexToken('X', matchTimestamp);
    addParseToken('X', function (input, array, config) {
        config._d = new Date(parseFloat(input, 10) * 1000);
    });
    addParseToken('x', function (input, array, config) {
        config._d = new Date(toInt(input));
    });

    // Side effect imports


    utils_hooks__hooks.version = '2.13.0';

    setHookCallback(local__createLocal);

    utils_hooks__hooks.fn                    = momentPrototype;
    utils_hooks__hooks.min                   = min;
    utils_hooks__hooks.max                   = max;
    utils_hooks__hooks.now                   = now;
    utils_hooks__hooks.utc                   = create_utc__createUTC;
    utils_hooks__hooks.unix                  = moment__createUnix;
    utils_hooks__hooks.months                = lists__listMonths;
    utils_hooks__hooks.isDate                = isDate;
    utils_hooks__hooks.locale                = locale_locales__getSetGlobalLocale;
    utils_hooks__hooks.invalid               = valid__createInvalid;
    utils_hooks__hooks.duration              = create__createDuration;
    utils_hooks__hooks.isMoment              = isMoment;
    utils_hooks__hooks.weekdays              = lists__listWeekdays;
    utils_hooks__hooks.parseZone             = moment__createInZone;
    utils_hooks__hooks.localeData            = locale_locales__getLocale;
    utils_hooks__hooks.isDuration            = isDuration;
    utils_hooks__hooks.monthsShort           = lists__listMonthsShort;
    utils_hooks__hooks.weekdaysMin           = lists__listWeekdaysMin;
    utils_hooks__hooks.defineLocale          = defineLocale;
    utils_hooks__hooks.updateLocale          = updateLocale;
    utils_hooks__hooks.locales               = locale_locales__listLocales;
    utils_hooks__hooks.weekdaysShort         = lists__listWeekdaysShort;
    utils_hooks__hooks.normalizeUnits        = normalizeUnits;
    utils_hooks__hooks.relativeTimeThreshold = duration_humanize__getSetRelativeTimeThreshold;
    utils_hooks__hooks.prototype             = momentPrototype;

    var _moment = utils_hooks__hooks;

    return _moment;

}));;/**
 * Parse a text request to a json query object tree
 *
 * @param  {String} string The string to parse
 * @return {Object} The json query tree
 */
function parseStringToObject(string) {

var arrayExtend = function () {
  var j, i, newlist = [], list_list = arguments;
  for (j = 0; j < list_list.length; j += 1) {
    for (i = 0; i < list_list[j].length; i += 1) {
      newlist.push(list_list[j][i]);
    }
  }
  return newlist;

}, mkSimpleQuery = function (key, value, operator) {
  var object = {"type": "simple", "key": key, "value": value};
  if (operator !== undefined) {
    object.operator = operator;
  }
  return object;

}, mkNotQuery = function (query) {
  if (query.operator === "NOT") {
    return query.query_list[0];
  }
  return {"type": "complex", "operator": "NOT", "query_list": [query]};

}, mkComplexQuery = function (operator, query_list) {
  var i, query_list2 = [];
  for (i = 0; i < query_list.length; i += 1) {
    if (query_list[i].operator === operator) {
      query_list2 = arrayExtend(query_list2, query_list[i].query_list);
    } else {
      query_list2.push(query_list[i]);
    }
  }
  return {type:"complex",operator:operator,query_list:query_list2};

}, simpleQuerySetKey = function (query, key) {
  var i;
  if (query.type === "complex") {
    for (i = 0; i < query.query_list.length; ++i) {
      simpleQuerySetKey (query.query_list[i],key);
    }
    return true;
  }
  if (query.type === "simple" && !query.key) {
    query.key = key;
    return true;
  }
  return false;
},
  error_offsets = [],
  error_lookaheads = [],
  error_count = 0,
  result;
;/* parser generated by jison 0.4.16 */
/*
  Returns a Parser object of the following structure:

  Parser: {
    yy: {}
  }

  Parser.prototype: {
    yy: {},
    trace: function(),
    symbols_: {associative list: name ==> number},
    terminals_: {associative list: number ==> name},
    productions_: [...],
    performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate, $$, _$),
    table: [...],
    defaultActions: {...},
    parseError: function(str, hash),
    parse: function(input),

    lexer: {
        EOF: 1,
        parseError: function(str, hash),
        setInput: function(input),
        input: function(),
        unput: function(str),
        more: function(),
        less: function(n),
        pastInput: function(),
        upcomingInput: function(),
        showPosition: function(),
        test_match: function(regex_match_array, rule_index),
        next: function(),
        lex: function(),
        begin: function(condition),
        popState: function(),
        _currentRules: function(),
        topState: function(),
        pushState: function(condition),

        options: {
            ranges: boolean           (optional: true ==> token location info will include a .range[] member)
            flex: boolean             (optional: true ==> flex-like lexing behaviour where the rules are tested exhaustively to find the longest match)
            backtrack_lexer: boolean  (optional: true ==> lexer regexes are tested in order and for each matching regex the action code is invoked; the lexer terminates the scan when a token is returned by the action code)
        },

        performAction: function(yy, yy_, $avoiding_name_collisions, YY_START),
        rules: [...],
        conditions: {associative list: name ==> set},
    }
  }


  token location info (@$, _$, etc.): {
    first_line: n,
    last_line: n,
    first_column: n,
    last_column: n,
    range: [start_number, end_number]       (where the numbers are indexes into the input string, regular zero-based)
  }


  the parseError function receives a 'hash' object with these members for lexer and parser errors: {
    text:        (matched text)
    token:       (the produced terminal token, if any)
    line:        (yylineno)
  }
  while parser (grammar) errors will also provide these members, i.e. parser errors deliver a superset of attributes: {
    loc:         (yylloc)
    expected:    (string describing the set of expected tokens)
    recoverable: (boolean: TRUE when the parser has a error recovery rule available for this particular error)
  }
*/
var parser = (function(){
var o=function(k,v,o,l){for(o=o||{},l=k.length;l--;o[k[l]]=v);return o},$V0=[1,5],$V1=[1,7],$V2=[1,8],$V3=[1,10],$V4=[1,12],$V5=[1,6,7,15],$V6=[1,6,7,9,12,14,15,16,19,21],$V7=[1,6,7,9,11,12,14,15,16,19,21],$V8=[2,17];
var parser = {trace: function trace() { },
yy: {},
symbols_: {"error":2,"begin":3,"search_text":4,"end":5,"EOF":6,"NEWLINE":7,"and_expression":8,"OR":9,"boolean_expression":10,"AND":11,"NOT":12,"expression":13,"LEFT_PARENTHESE":14,"RIGHT_PARENTHESE":15,"WORD":16,"DEFINITION":17,"value":18,"OPERATOR":19,"string":20,"QUOTE":21,"QUOTED_STRING":22,"$accept":0,"$end":1},
terminals_: {2:"error",6:"EOF",7:"NEWLINE",9:"OR",11:"AND",12:"NOT",14:"LEFT_PARENTHESE",15:"RIGHT_PARENTHESE",16:"WORD",17:"DEFINITION",19:"OPERATOR",21:"QUOTE",22:"QUOTED_STRING"},
productions_: [0,[3,2],[5,0],[5,1],[5,1],[4,1],[4,2],[4,3],[8,1],[8,3],[10,2],[10,1],[13,3],[13,3],[13,1],[18,2],[18,1],[20,1],[20,3]],
performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate /* action[1] */, $$ /* vstack */, _$ /* lstack */) {
/* this == yyval */

var $0 = $$.length - 1;
switch (yystate) {
case 1:
 return $$[$0-1]; 
break;
case 5: case 8: case 11: case 14: case 16:
 this.$ = $$[$0]; 
break;
case 6:
 this.$ = mkComplexQuery('AND', [$$[$0-1], $$[$0]]); 
break;
case 7:
 this.$ = mkComplexQuery('OR', [$$[$0-2], $$[$0]]); 
break;
case 9:
 this.$ = mkComplexQuery('AND', [$$[$0-2], $$[$0]]); 
break;
case 10:
 this.$ = mkNotQuery($$[$0]); 
break;
case 12:
 this.$ = $$[$0-1]; 
break;
case 13:
 simpleQuerySetKey($$[$0], $$[$0-2]); this.$ = $$[$0]; 
break;
case 15:
 $$[$0].operator = $$[$0-1] ; this.$ = $$[$0]; 
break;
case 17:
 this.$ = mkSimpleQuery('', $$[$0]); 
break;
case 18:
 this.$ = mkSimpleQuery('', $$[$0-1]); 
break;
}
},
table: [{3:1,4:2,8:3,10:4,12:$V0,13:6,14:$V1,16:$V2,18:9,19:$V3,20:11,21:$V4},{1:[3]},{1:[2,2],5:13,6:[1,14],7:[1,15]},o($V5,[2,5],{8:3,10:4,13:6,18:9,20:11,4:16,9:[1,17],12:$V0,14:$V1,16:$V2,19:$V3,21:$V4}),o($V6,[2,8],{11:[1,18]}),{13:19,14:$V1,16:$V2,18:9,19:$V3,20:11,21:$V4},o($V7,[2,11]),{4:20,8:3,10:4,12:$V0,13:6,14:$V1,16:$V2,18:9,19:$V3,20:11,21:$V4},o($V7,$V8,{17:[1,21]}),o($V7,[2,14]),{16:[1,23],20:22,21:$V4},o($V7,[2,16]),{22:[1,24]},{1:[2,1]},{1:[2,3]},{1:[2,4]},o($V5,[2,6]),{4:25,8:3,10:4,12:$V0,13:6,14:$V1,16:$V2,18:9,19:$V3,20:11,21:$V4},{8:26,10:4,12:$V0,13:6,14:$V1,16:$V2,18:9,19:$V3,20:11,21:$V4},o($V7,[2,10]),{15:[1,27]},{13:28,14:$V1,16:$V2,18:9,19:$V3,20:11,21:$V4},o($V7,[2,15]),o($V7,$V8),{21:[1,29]},o($V5,[2,7]),o($V6,[2,9]),o($V7,[2,12]),o($V7,[2,13]),o($V7,[2,18])],
defaultActions: {13:[2,1],14:[2,3],15:[2,4]},
parseError: function parseError(str, hash) {
    if (hash.recoverable) {
        this.trace(str);
    } else {
        function _parseError (msg, hash) {
            this.message = msg;
            this.hash = hash;
        }
        _parseError.prototype = new Error();

        throw new _parseError(str, hash);
    }
},
parse: function parse(input) {
    var self = this, stack = [0], tstack = [], vstack = [null], lstack = [], table = this.table, yytext = '', yylineno = 0, yyleng = 0, recovering = 0, TERROR = 2, EOF = 1;
    var args = lstack.slice.call(arguments, 1);
    var lexer = Object.create(this.lexer);
    var sharedState = { yy: {} };
    for (var k in this.yy) {
        if (Object.prototype.hasOwnProperty.call(this.yy, k)) {
            sharedState.yy[k] = this.yy[k];
        }
    }
    lexer.setInput(input, sharedState.yy);
    sharedState.yy.lexer = lexer;
    sharedState.yy.parser = this;
    if (typeof lexer.yylloc == 'undefined') {
        lexer.yylloc = {};
    }
    var yyloc = lexer.yylloc;
    lstack.push(yyloc);
    var ranges = lexer.options && lexer.options.ranges;
    if (typeof sharedState.yy.parseError === 'function') {
        this.parseError = sharedState.yy.parseError;
    } else {
        this.parseError = Object.getPrototypeOf(this).parseError;
    }
    function popStack(n) {
        stack.length = stack.length - 2 * n;
        vstack.length = vstack.length - n;
        lstack.length = lstack.length - n;
    }
    _token_stack:
        var lex = function () {
            var token;
            token = lexer.lex() || EOF;
            if (typeof token !== 'number') {
                token = self.symbols_[token] || token;
            }
            return token;
        };
    var symbol, preErrorSymbol, state, action, a, r, yyval = {}, p, len, newState, expected;
    while (true) {
        state = stack[stack.length - 1];
        if (this.defaultActions[state]) {
            action = this.defaultActions[state];
        } else {
            if (symbol === null || typeof symbol == 'undefined') {
                symbol = lex();
            }
            action = table[state] && table[state][symbol];
        }
                    if (typeof action === 'undefined' || !action.length || !action[0]) {
                var errStr = '';
                expected = [];
                for (p in table[state]) {
                    if (this.terminals_[p] && p > TERROR) {
                        expected.push('\'' + this.terminals_[p] + '\'');
                    }
                }
                if (lexer.showPosition) {
                    errStr = 'Parse error on line ' + (yylineno + 1) + ':\n' + lexer.showPosition() + '\nExpecting ' + expected.join(', ') + ', got \'' + (this.terminals_[symbol] || symbol) + '\'';
                } else {
                    errStr = 'Parse error on line ' + (yylineno + 1) + ': Unexpected ' + (symbol == EOF ? 'end of input' : '\'' + (this.terminals_[symbol] || symbol) + '\'');
                }
                this.parseError(errStr, {
                    text: lexer.match,
                    token: this.terminals_[symbol] || symbol,
                    line: lexer.yylineno,
                    loc: yyloc,
                    expected: expected
                });
            }
        if (action[0] instanceof Array && action.length > 1) {
            throw new Error('Parse Error: multiple actions possible at state: ' + state + ', token: ' + symbol);
        }
        switch (action[0]) {
        case 1:
            stack.push(symbol);
            vstack.push(lexer.yytext);
            lstack.push(lexer.yylloc);
            stack.push(action[1]);
            symbol = null;
            if (!preErrorSymbol) {
                yyleng = lexer.yyleng;
                yytext = lexer.yytext;
                yylineno = lexer.yylineno;
                yyloc = lexer.yylloc;
                if (recovering > 0) {
                    recovering--;
                }
            } else {
                symbol = preErrorSymbol;
                preErrorSymbol = null;
            }
            break;
        case 2:
            len = this.productions_[action[1]][1];
            yyval.$ = vstack[vstack.length - len];
            yyval._$ = {
                first_line: lstack[lstack.length - (len || 1)].first_line,
                last_line: lstack[lstack.length - 1].last_line,
                first_column: lstack[lstack.length - (len || 1)].first_column,
                last_column: lstack[lstack.length - 1].last_column
            };
            if (ranges) {
                yyval._$.range = [
                    lstack[lstack.length - (len || 1)].range[0],
                    lstack[lstack.length - 1].range[1]
                ];
            }
            r = this.performAction.apply(yyval, [
                yytext,
                yyleng,
                yylineno,
                sharedState.yy,
                action[1],
                vstack,
                lstack
            ].concat(args));
            if (typeof r !== 'undefined') {
                return r;
            }
            if (len) {
                stack = stack.slice(0, -1 * len * 2);
                vstack = vstack.slice(0, -1 * len);
                lstack = lstack.slice(0, -1 * len);
            }
            stack.push(this.productions_[action[1]][0]);
            vstack.push(yyval.$);
            lstack.push(yyval._$);
            newState = table[stack[stack.length - 2]][stack[stack.length - 1]];
            stack.push(newState);
            break;
        case 3:
            return true;
        }
    }
    return true;
}};
/* generated by jison-lex 0.3.4 */
var lexer = (function(){
var lexer = ({

EOF:1,

parseError:function parseError(str, hash) {
        if (this.yy.parser) {
            this.yy.parser.parseError(str, hash);
        } else {
            throw new Error(str);
        }
    },

// resets the lexer, sets new input
setInput:function (input, yy) {
        this.yy = yy || this.yy || {};
        this._input = input;
        this._more = this._backtrack = this.done = false;
        this.yylineno = this.yyleng = 0;
        this.yytext = this.matched = this.match = '';
        this.conditionStack = ['INITIAL'];
        this.yylloc = {
            first_line: 1,
            first_column: 0,
            last_line: 1,
            last_column: 0
        };
        if (this.options.ranges) {
            this.yylloc.range = [0,0];
        }
        this.offset = 0;
        return this;
    },

// consumes and returns one char from the input
input:function () {
        var ch = this._input[0];
        this.yytext += ch;
        this.yyleng++;
        this.offset++;
        this.match += ch;
        this.matched += ch;
        var lines = ch.match(/(?:\r\n?|\n).*/g);
        if (lines) {
            this.yylineno++;
            this.yylloc.last_line++;
        } else {
            this.yylloc.last_column++;
        }
        if (this.options.ranges) {
            this.yylloc.range[1]++;
        }

        this._input = this._input.slice(1);
        return ch;
    },

// unshifts one char (or a string) into the input
unput:function (ch) {
        var len = ch.length;
        var lines = ch.split(/(?:\r\n?|\n)/g);

        this._input = ch + this._input;
        this.yytext = this.yytext.substr(0, this.yytext.length - len);
        //this.yyleng -= len;
        this.offset -= len;
        var oldLines = this.match.split(/(?:\r\n?|\n)/g);
        this.match = this.match.substr(0, this.match.length - 1);
        this.matched = this.matched.substr(0, this.matched.length - 1);

        if (lines.length - 1) {
            this.yylineno -= lines.length - 1;
        }
        var r = this.yylloc.range;

        this.yylloc = {
            first_line: this.yylloc.first_line,
            last_line: this.yylineno + 1,
            first_column: this.yylloc.first_column,
            last_column: lines ?
                (lines.length === oldLines.length ? this.yylloc.first_column : 0)
                 + oldLines[oldLines.length - lines.length].length - lines[0].length :
              this.yylloc.first_column - len
        };

        if (this.options.ranges) {
            this.yylloc.range = [r[0], r[0] + this.yyleng - len];
        }
        this.yyleng = this.yytext.length;
        return this;
    },

// When called from action, caches matched text and appends it on next action
more:function () {
        this._more = true;
        return this;
    },

// When called from action, signals the lexer that this rule fails to match the input, so the next matching rule (regex) should be tested instead.
reject:function () {
        if (this.options.backtrack_lexer) {
            this._backtrack = true;
        } else {
            return this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).\n' + this.showPosition(), {
                text: "",
                token: null,
                line: this.yylineno
            });

        }
        return this;
    },

// retain first n characters of the match
less:function (n) {
        this.unput(this.match.slice(n));
    },

// displays already matched input, i.e. for error messages
pastInput:function () {
        var past = this.matched.substr(0, this.matched.length - this.match.length);
        return (past.length > 20 ? '...':'') + past.substr(-20).replace(/\n/g, "");
    },

// displays upcoming input, i.e. for error messages
upcomingInput:function () {
        var next = this.match;
        if (next.length < 20) {
            next += this._input.substr(0, 20-next.length);
        }
        return (next.substr(0,20) + (next.length > 20 ? '...' : '')).replace(/\n/g, "");
    },

// displays the character position where the lexing error occurred, i.e. for error messages
showPosition:function () {
        var pre = this.pastInput();
        var c = new Array(pre.length + 1).join("-");
        return pre + this.upcomingInput() + "\n" + c + "^";
    },

// test the lexed token: return FALSE when not a match, otherwise return token
test_match:function (match, indexed_rule) {
        var token,
            lines,
            backup;

        if (this.options.backtrack_lexer) {
            // save context
            backup = {
                yylineno: this.yylineno,
                yylloc: {
                    first_line: this.yylloc.first_line,
                    last_line: this.last_line,
                    first_column: this.yylloc.first_column,
                    last_column: this.yylloc.last_column
                },
                yytext: this.yytext,
                match: this.match,
                matches: this.matches,
                matched: this.matched,
                yyleng: this.yyleng,
                offset: this.offset,
                _more: this._more,
                _input: this._input,
                yy: this.yy,
                conditionStack: this.conditionStack.slice(0),
                done: this.done
            };
            if (this.options.ranges) {
                backup.yylloc.range = this.yylloc.range.slice(0);
            }
        }

        lines = match[0].match(/(?:\r\n?|\n).*/g);
        if (lines) {
            this.yylineno += lines.length;
        }
        this.yylloc = {
            first_line: this.yylloc.last_line,
            last_line: this.yylineno + 1,
            first_column: this.yylloc.last_column,
            last_column: lines ?
                         lines[lines.length - 1].length - lines[lines.length - 1].match(/\r?\n?/)[0].length :
                         this.yylloc.last_column + match[0].length
        };
        this.yytext += match[0];
        this.match += match[0];
        this.matches = match;
        this.yyleng = this.yytext.length;
        if (this.options.ranges) {
            this.yylloc.range = [this.offset, this.offset += this.yyleng];
        }
        this._more = false;
        this._backtrack = false;
        this._input = this._input.slice(match[0].length);
        this.matched += match[0];
        token = this.performAction.call(this, this.yy, this, indexed_rule, this.conditionStack[this.conditionStack.length - 1]);
        if (this.done && this._input) {
            this.done = false;
        }
        if (token) {
            return token;
        } else if (this._backtrack) {
            // recover context
            for (var k in backup) {
                this[k] = backup[k];
            }
            return false; // rule action called reject() implying the next rule should be tested instead.
        }
        return false;
    },

// return next match in input
next:function () {
        if (this.done) {
            return this.EOF;
        }
        if (!this._input) {
            this.done = true;
        }

        var token,
            match,
            tempMatch,
            index;
        if (!this._more) {
            this.yytext = '';
            this.match = '';
        }
        var rules = this._currentRules();
        for (var i = 0; i < rules.length; i++) {
            tempMatch = this._input.match(this.rules[rules[i]]);
            if (tempMatch && (!match || tempMatch[0].length > match[0].length)) {
                match = tempMatch;
                index = i;
                if (this.options.backtrack_lexer) {
                    token = this.test_match(tempMatch, rules[i]);
                    if (token !== false) {
                        return token;
                    } else if (this._backtrack) {
                        match = false;
                        continue; // rule action called reject() implying a rule MISmatch.
                    } else {
                        // else: this is a lexer rule which consumes input without producing a token (e.g. whitespace)
                        return false;
                    }
                } else if (!this.options.flex) {
                    break;
                }
            }
        }
        if (match) {
            token = this.test_match(match, rules[index]);
            if (token !== false) {
                return token;
            }
            // else: this is a lexer rule which consumes input without producing a token (e.g. whitespace)
            return false;
        }
        if (this._input === "") {
            return this.EOF;
        } else {
            return this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. Unrecognized text.\n' + this.showPosition(), {
                text: "",
                token: null,
                line: this.yylineno
            });
        }
    },

// return next match that has a token
lex:function lex() {
        var r = this.next();
        if (r) {
            return r;
        } else {
            return this.lex();
        }
    },

// activates a new lexer condition state (pushes the new lexer condition state onto the condition stack)
begin:function begin(condition) {
        this.conditionStack.push(condition);
    },

// pop the previously active lexer condition state off the condition stack
popState:function popState() {
        var n = this.conditionStack.length - 1;
        if (n > 0) {
            return this.conditionStack.pop();
        } else {
            return this.conditionStack[0];
        }
    },

// produce the lexer rule set which is active for the currently active lexer condition state
_currentRules:function _currentRules() {
        if (this.conditionStack.length && this.conditionStack[this.conditionStack.length - 1]) {
            return this.conditions[this.conditionStack[this.conditionStack.length - 1]].rules;
        } else {
            return this.conditions["INITIAL"].rules;
        }
    },

// return the currently active lexer condition state; when an index argument is provided it produces the N-th previous condition state, if available
topState:function topState(n) {
        n = this.conditionStack.length - 1 - Math.abs(n || 0);
        if (n >= 0) {
            return this.conditionStack[n];
        } else {
            return "INITIAL";
        }
    },

// alias for begin(condition)
pushState:function pushState(condition) {
        this.begin(condition);
    },

// return the number of states currently on the stack
stateStackSize:function stateStackSize() {
        return this.conditionStack.length;
    },
options: {},
performAction: function anonymous(yy,yy_,$avoiding_name_collisions,YY_START) {
var YYSTATE=YY_START;
switch($avoiding_name_collisions) {
case 0:this.begin("letsquote"); return "QUOTE";
break;
case 1:this.popState(); this.begin("endquote"); return "QUOTED_STRING";
break;
case 2:this.popState(); return "QUOTE";
break;
case 3:/* skip whitespace */
break;
case 4:return "LEFT_PARENTHESE";
break;
case 5:return "RIGHT_PARENTHESE";
break;
case 6:return "AND";
break;
case 7:return "OR";
break;
case 8:return "NOT";
break;
case 9:return "DEFINITION";
break;
case 10:return 19;
break;
case 11:return 16;
break;
case 12:return 6;
break;
}
},
rules: [/^(?:")/,/^(?:(\\"|[^"])*)/,/^(?:")/,/^(?:[^\S]+)/,/^(?:\()/,/^(?:\))/,/^(?:AND\b)/,/^(?:OR\b)/,/^(?:NOT\b)/,/^(?::)/,/^(?:(!?=|<=?|>=?))/,/^(?:[^\s\n"():><!=]+)/,/^(?:$)/],
conditions: {"endquote":{"rules":[2],"inclusive":false},"letsquote":{"rules":[1],"inclusive":false},"INITIAL":{"rules":[0,3,4,5,6,7,8,9,10,11,12],"inclusive":true}}
});
return lexer;
})();
parser.lexer = lexer;
function Parser () {
  this.yy = {};
}
Parser.prototype = parser;parser.Parser = Parser;
return new Parser;
})();;  return parser.parse(string);
} // parseStringToObject

;/*global RSVP, window, parseStringToObject*/
/*jslint nomen: true, maxlen: 90*/
(function (RSVP, window, parseStringToObject) {
  "use strict";

  var query_class_dict = {},
    regexp_escape = /[\-\[\]{}()*+?.,\\\^$|#\s]/g,
    regexp_percent = /%/g,
    regexp_underscore = /_/g,
    regexp_operator = /^(?:AND|OR|NOT)$/i,
    regexp_comparaison = /^(?:!?=|<=?|>=?)$/i;

  /**
   * Convert metadata values to array of strings. ex:
   *
   *     "a" -> ["a"],
   *     {"content": "a"} -> ["a"]
   *
   * @param  {Any} value The metadata value
   * @return {Array} The value in string array format
   */
  function metadataValueToStringArray(value) {
    var i, new_value = [];
    if (value === undefined) {
      return undefined;
    }
    if (!Array.isArray(value)) {
      value = [value];
    }
    for (i = 0; i < value.length; i += 1) {
      if (typeof value[i] === 'object') {
        new_value[i] = value[i].content;
      } else {
        new_value[i] = value[i];
      }
    }
    return new_value;
  }

  /**
   * A sort function to sort items by key
   *
   * @param  {String} key The key to sort on
   * @param  {String} [way="ascending"] 'ascending' or 'descending'
   * @return {Function} The sort function
   */
  function sortFunction(key, way) {
    var result;
    if (way === 'descending') {
      result = 1;
    } else if (way === 'ascending') {
      result = -1;
    } else {
      throw new TypeError("Query.sortFunction(): " +
                          "Argument 2 must be 'ascending' or 'descending'");
    }
    return function (a, b) {
      // this comparison is 5 times faster than json comparison
      var i, l;
      a = metadataValueToStringArray(a[key]) || [];
      b = metadataValueToStringArray(b[key]) || [];
      l = a.length > b.length ? a.length : b.length;
      for (i = 0; i < l; i += 1) {
        if (a[i] === undefined) {
          return result;
        }
        if (b[i] === undefined) {
          return -result;
        }
        if (a[i] > b[i]) {
          return -result;
        }
        if (a[i] < b[i]) {
          return result;
        }
      }
      return 0;
    };
  }

  /**
   * Sort a list of items, according to keys and directions.
   *
   * @param  {Array} sort_on_option List of couples [key, direction]
   * @param  {Array} list The item list to sort
   * @return {Array} The filtered list
   */
  function sortOn(sort_on_option, list) {
    var sort_index;
    if (!Array.isArray(sort_on_option)) {
      throw new TypeError("jioquery.sortOn(): " +
                          "Argument 1 is not of type 'array'");
    }
    for (sort_index = sort_on_option.length - 1; sort_index >= 0;
         sort_index -= 1) {
      list.sort(sortFunction(
        sort_on_option[sort_index][0],
        sort_on_option[sort_index][1]
      ));
    }
    return list;
  }

  /**
   * Limit a list of items, according to index and length.
   *
   * @param  {Array} limit_option A couple [from, length]
   * @param  {Array} list The item list to limit
   * @return {Array} The filtered list
   */
  function limit(limit_option, list) {
    if (!Array.isArray(limit_option)) {
      throw new TypeError("jioquery.limit(): " +
                          "Argument 1 is not of type 'array'");
    }
    if (!Array.isArray(list)) {
      throw new TypeError("jioquery.limit(): " +
                          "Argument 2 is not of type 'array'");
    }
    list.splice(0, limit_option[0]);
    if (limit_option[1]) {
      list.splice(limit_option[1]);
    }
    return list;
  }

  /**
   * Filter a list of items, modifying them to select only wanted keys.
   *
   * @param  {Array} select_option Key list to keep
   * @param  {Array} list The item list to filter
   * @return {Array} The filtered list
   */
  function select(select_option, list) {
    var i, j, new_item;
    if (!Array.isArray(select_option)) {
      throw new TypeError("jioquery.select(): " +
                          "Argument 1 is not of type Array");
    }
    if (!Array.isArray(list)) {
      throw new TypeError("jioquery.select(): " +
                          "Argument 2 is not of type Array");
    }
    for (i = 0; i < list.length; i += 1) {
      new_item = {};
      for (j = 0; j < select_option.length; j += 1) {
        if (list[i].hasOwnProperty([select_option[j]])) {
          new_item[select_option[j]] = list[i][select_option[j]];
        }
      }
      for (j in new_item) {
        if (new_item.hasOwnProperty(j)) {
          list[i] = new_item;
          break;
        }
      }
    }
    return list;
  }

  /**
   * The query to use to filter a list of objects.
   * This is an abstract class.
   *
   * @class Query
   * @constructor
   */
  function Query() {

    /**
     * Called before parsing the query. Must be overridden!
     *
     * @method onParseStart
     * @param  {Object} object The object shared in the parse process
     * @param  {Object} option Some option gave in parse()
     */
  //   this.onParseStart = emptyFunction;

    /**
     * Called when parsing a simple query. Must be overridden!
     *
     * @method onParseSimpleQuery
     * @param  {Object} object The object shared in the parse process
     * @param  {Object} option Some option gave in parse()
     */
  //   this.onParseSimpleQuery = emptyFunction;

    /**
     * Called when parsing a complex query. Must be overridden!
     *
     * @method onParseComplexQuery
     * @param  {Object} object The object shared in the parse process
     * @param  {Object} option Some option gave in parse()
     */
  //   this.onParseComplexQuery = emptyFunction;

    /**
     * Called after parsing the query. Must be overridden!
     *
     * @method onParseEnd
     * @param  {Object} object The object shared in the parse process
     * @param  {Object} option Some option gave in parse()
     */
  //   this.onParseEnd = emptyFunction;

    return;
  }

  /**
   * Filter the item list with matching item only
   *
   * @method exec
   * @param  {Array} item_list The list of object
   * @param  {Object} [option] Some operation option
   * @param  {Array} [option.select_list] A object keys to retrieve
   * @param  {Array} [option.sort_on] Couples of object keys and "ascending"
   *                 or "descending"
   * @param  {Array} [option.limit] Couple of integer, first is an index and
   *                 second is the length.
   */
  Query.prototype.exec = function (item_list, option) {
    if (!Array.isArray(item_list)) {
      throw new TypeError("Query().exec(): Argument 1 is not of type 'array'");
    }
    if (option === undefined) {
      option = {};
    }
    if (typeof option !== 'object') {
      throw new TypeError("Query().exec(): " +
                          "Optional argument 2 is not of type 'object'");
    }
    var context = this,
      i;
    for (i = item_list.length - 1; i >= 0; i -= 1) {
      if (!context.match(item_list[i])) {
        item_list.splice(i, 1);
      }
    }

    if (option.sort_on) {
      sortOn(option.sort_on, item_list);
    }

    if (option.limit) {
      limit(option.limit, item_list);
    }

    select(option.select_list || [], item_list);

    return new RSVP.Queue()
      .push(function () {
        return item_list;
      });
  };

  /**
   * Test if an item matches this query
   *
   * @method match
   * @param  {Object} item The object to test
   * @return {Boolean} true if match, false otherwise
   */
  Query.prototype.match = function () {
    return true;
  };

  /**
   * Browse the Query in deep calling parser method in each step.
   *
   * `onParseStart` is called first, on end `onParseEnd` is called.
   * It starts from the simple queries at the bottom of the tree calling the
   * parser method `onParseSimpleQuery`, and go up calling the
   * `onParseComplexQuery` method.
   *
   * @method parse
   * @param  {Object} option Any options you want (except 'parsed')
   * @return {Any} The parse result
   */
  Query.prototype.parse = function (option) {
    var that = this,
      object;
    /**
     * The recursive parser.
     *
     * @param  {Object} object The object shared in the parse process
     * @param  {Object} options Some options usable in the parseMethods
     * @return {Any} The parser result
     */
    function recParse(object, option) {
      var query = object.parsed,
        queue = new RSVP.Queue(),
        i;

      function enqueue(j) {
        queue
          .push(function () {
            object.parsed = query.query_list[j];
            return recParse(object, option);
          })
          .push(function () {
            query.query_list[j] = object.parsed;
          });
      }

      if (query.type === "complex") {


        for (i = 0; i < query.query_list.length; i += 1) {
          enqueue(i);
        }

        return queue
          .push(function () {
            object.parsed = query;
            return that.onParseComplexQuery(object, option);
          });

      }
      if (query.type === "simple") {
        return that.onParseSimpleQuery(object, option);
      }
    }
    object = {
      parsed: JSON.parse(JSON.stringify(that.serialized()))
    };
    return new RSVP.Queue()
      .push(function () {
        return that.onParseStart(object, option);
      })
      .push(function () {
        return recParse(object, option);
      })
      .push(function () {
        return that.onParseEnd(object, option);
      })
      .push(function () {
        return object.parsed;
      });

  };

  /**
   * Convert this query to a parsable string.
   *
   * @method toString
   * @return {String} The string version of this query
   */
  Query.prototype.toString = function () {
    return "";
  };

  /**
   * Convert this query to an jsonable object in order to be remake thanks to
   * QueryFactory class.
   *
   * @method serialized
   * @return {Object} The jsonable object
   */
  Query.prototype.serialized = function () {
    return undefined;
  };

  /**
   * Provides static methods to create Query object
   *
   * @class QueryFactory
   */
  function QueryFactory() {
    return;
  }

  /**
   * Escapes regexp special chars from a string.
   *
   * @param  {String} string The string to escape
   * @return {String} The escaped string
   */
  function stringEscapeRegexpCharacters(string) {
    return string.replace(regexp_escape, "\\$&");
  }

  /**
   * Inherits the prototype methods from one constructor into another. The
   * prototype of `constructor` will be set to a new object created from
   * `superConstructor`.
   *
   * @param  {Function} constructor The constructor which inherits the super one
   * @param  {Function} superConstructor The super constructor
   */
  function inherits(constructor, superConstructor) {
    constructor.super_ = superConstructor;
    constructor.prototype = Object.create(superConstructor.prototype, {
      "constructor": {
        "configurable": true,
        "enumerable": false,
        "writable": true,
        "value": constructor
      }
    });
  }

  /**
   * Convert a search text to a regexp.
   *
   * @param  {String} string The string to convert
   * @param  {Boolean} [use_wildcard_character=true] Use wildcard "%" and "_"
   * @return {RegExp} The search text regexp
   */
  function searchTextToRegExp(string, use_wildcard_characters) {
    if (typeof string !== 'string') {
      throw new TypeError("jioquery.searchTextToRegExp(): " +
                          "Argument 1 is not of type 'string'");
    }
    if (use_wildcard_characters === false) {
      return new RegExp("^" + stringEscapeRegexpCharacters(string) + "$");
    }
    return new RegExp("^" + stringEscapeRegexpCharacters(string)
      .replace(regexp_percent, '[\\s\\S]*')
      .replace(regexp_underscore, '.') + "$");
  }

  /**
   * The ComplexQuery inherits from Query, and compares one or several metadata
   * values.
   *
   * @class ComplexQuery
   * @extends Query
   * @param  {Object} [spec={}] The specifications
   * @param  {String} [spec.operator="AND"] The compare method to use
   * @param  {String} spec.key The metadata key
   * @param  {String} spec.value The value of the metadata to compare
   */
  function ComplexQuery(spec, key_schema) {
    Query.call(this);

    /**
     * Logical operator to use to compare object values
     *
     * @attribute operator
     * @type String
     * @default "AND"
     * @optional
     */
    this.operator = spec.operator;

    /**
     * The sub Query list which are used to query an item.
     *
     * @attribute query_list
     * @type Array
     * @default []
     * @optional
     */
    this.query_list = spec.query_list || [];
    this.query_list = this.query_list.map(
      // decorate the map to avoid sending the index as key_schema argument
      function (o) { return QueryFactory.create(o, key_schema); }
    );

  }
  inherits(ComplexQuery, Query);

  ComplexQuery.prototype.operator = "AND";
  ComplexQuery.prototype.type = "complex";

  /**
   * #crossLink "Query/match:method"
   */
  ComplexQuery.prototype.match = function (item) {
    var operator = this.operator;
    if (!(regexp_operator.test(operator))) {
      operator = "AND";
    }
    return this[operator.toUpperCase()](item);
  };

  /**
   * #crossLink "Query/toString:method"
   */
  ComplexQuery.prototype.toString = function () {
    var str_list = [], this_operator = this.operator;
    if (this.operator === "NOT") {
      str_list.push("NOT (");
      str_list.push(this.query_list[0].toString());
      str_list.push(")");
      return str_list.join(" ");
    }
    this.query_list.forEach(function (query) {
      str_list.push("(");
      str_list.push(query.toString());
      str_list.push(")");
      str_list.push(this_operator);
    });
    str_list.length -= 1;
    return str_list.join(" ");
  };

  /**
   * #crossLink "Query/serialized:method"
   */
  ComplexQuery.prototype.serialized = function () {
    var s = {
      "type": "complex",
      "operator": this.operator,
      "query_list": []
    };
    this.query_list.forEach(function (query) {
      s.query_list.push(
        typeof query.toJSON === "function" ? query.toJSON() : query
      );
    });
    return s;
  };
  ComplexQuery.prototype.toJSON = ComplexQuery.prototype.serialized;

  /**
   * Comparison operator, test if all sub queries match the
   * item value
   *
   * @method AND
   * @param  {Object} item The item to match
   * @return {Boolean} true if all match, false otherwise
   */
  ComplexQuery.prototype.AND = function (item) {
    var result = true,
      i = 0;

    while (result && (i !== this.query_list.length)) {
      result = this.query_list[i].match(item);
      i += 1;
    }
    return result;

  };

  /**
   * Comparison operator, test if one of the sub queries matches the
   * item value
   *
   * @method OR
   * @param  {Object} item The item to match
   * @return {Boolean} true if one match, false otherwise
   */
  ComplexQuery.prototype.OR = function (item) {
    var result = false,
      i = 0;

    while ((!result) && (i !== this.query_list.length)) {
      result = this.query_list[i].match(item);
      i += 1;
    }

    return result;
  };

  /**
   * Comparison operator, test if the sub query does not match the
   * item value
   *
   * @method NOT
   * @param  {Object} item The item to match
   * @return {Boolean} true if one match, false otherwise
   */
  ComplexQuery.prototype.NOT = function (item) {
    return !this.query_list[0].match(item);
  };

  /**
   * Creates Query object from a search text string or a serialized version
   * of a Query.
   *
   * @method create
   * @static
   * @param  {Object,String} object The search text or the serialized version
   *         of a Query
   * @return {Query} A Query object
   */
  QueryFactory.create = function (object, key_schema) {
    if (object === "") {
      return new Query();
    }
    if (typeof object === "string") {
      object = parseStringToObject(object);
    }
    if (typeof (object || {}).type === "string" &&
        query_class_dict[object.type]) {
      return new query_class_dict[object.type](object, key_schema);
    }
    throw new TypeError("QueryFactory.create(): " +
                        "Argument 1 is not a search text or a parsable object");
  };

  function objectToSearchText(query) {
    var str_list = [];
    if (query.type === "complex") {
      str_list.push("(");
      (query.query_list || []).forEach(function (sub_query) {
        str_list.push(objectToSearchText(sub_query));
        str_list.push(query.operator);
      });
      str_list.length -= 1;
      str_list.push(")");
      return str_list.join(" ");
    }
    if (query.type === "simple") {
      return (query.key ? query.key + ": " : "") +
        (query.operator || "") + ' "' + query.value + '"';
    }
    throw new TypeError("This object is not a query");
  }

  function checkKeySchema(key_schema) {
    var prop;

    if (key_schema !== undefined) {
      if (typeof key_schema !== 'object') {
        throw new TypeError("SimpleQuery().create(): " +
                            "key_schema is not of type 'object'");
      }
      // key_set is mandatory
      if (key_schema.key_set === undefined) {
        throw new TypeError("SimpleQuery().create(): " +
                            "key_schema has no 'key_set' property");
      }
      for (prop in key_schema) {
        if (key_schema.hasOwnProperty(prop)) {
          switch (prop) {
          case 'key_set':
          case 'cast_lookup':
          case 'match_lookup':
            break;
          default:
            throw new TypeError("SimpleQuery().create(): " +
                               "key_schema has unknown property '" + prop + "'");
          }
        }
      }
    }
  }

  /**
   * The SimpleQuery inherits from Query, and compares one metadata value
   *
   * @class SimpleQuery
   * @extends Query
   * @param  {Object} [spec={}] The specifications
   * @param  {String} [spec.operator="="] The compare method to use
   * @param  {String} spec.key The metadata key
   * @param  {String} spec.value The value of the metadata to compare
   */
  function SimpleQuery(spec, key_schema) {
    Query.call(this);

    checkKeySchema(key_schema);

    this._key_schema = key_schema || {};

    /**
     * Operator to use to compare object values
     *
     * @attribute operator
     * @type String
     * @optional
     */
    this.operator = spec.operator;

    /**
     * Key of the object which refers to the value to compare
     *
     * @attribute key
     * @type String
     */
    this.key = spec.key;

    /**
     * Value is used to do the comparison with the object value
     *
     * @attribute value
     * @type String
     */
    this.value = spec.value;

  }
  inherits(SimpleQuery, Query);

  SimpleQuery.prototype.type = "simple";

  function checkKey(key) {
    var prop;

    if (key.read_from === undefined) {
      throw new TypeError("Custom key is missing the read_from property");
    }

    for (prop in key) {
      if (key.hasOwnProperty(prop)) {
        switch (prop) {
        case 'read_from':
        case 'cast_to':
        case 'equal_match':
          break;
        default:
          throw new TypeError("Custom key has unknown property '" +
                              prop + "'");
        }
      }
    }
  }

  /**
   * #crossLink "Query/match:method"
   */
  SimpleQuery.prototype.match = function (item) {
    var object_value = null,
      equal_match = null,
      cast_to = null,
      matchMethod = null,
      operator = this.operator,
      value = null,
      key = this.key,
      k;

    if (!(regexp_comparaison.test(operator))) {
      // `operator` is not correct, we have to change it to "like" or "="
      if (regexp_percent.test(this.value)) {
        // `value` contains a non escaped `%`
        operator = "like";
      } else {
        // `value` does not contain non escaped `%`
        operator = "=";
      }
    }

    matchMethod = this[operator];

    if (this._key_schema.key_set && this._key_schema.key_set[key] !== undefined) {
      key = this._key_schema.key_set[key];
    }

    // match with all the fields if key is empty
    if (key === '') {
      matchMethod = this.like;
      value = '%' + this.value + '%';
      for (k in item) {
        if (item.hasOwnProperty(k)) {
          if (k !== '__id' && item[k]) {
            if (matchMethod(item[k], value) === true) {
              return true;
            }
          }
        }
      }
      return false;
    }

    if (typeof key === 'object') {
      checkKey(key);
      object_value = item[key.read_from];

      equal_match = key.equal_match;

      // equal_match can be a string
      if (typeof equal_match === 'string') {
        // XXX raise error if equal_match not in match_lookup
        equal_match = this._key_schema.match_lookup[equal_match];
      }

      // equal_match overrides the default '=' operator
      if (equal_match !== undefined) {
        matchMethod = (operator === "=" || operator === "like" ?
                       equal_match : matchMethod);
      }

      value = this.value;
      cast_to = key.cast_to;
      if (cast_to) {
        // cast_to can be a string
        if (typeof cast_to === 'string') {
          // XXX raise error if cast_to not in cast_lookup
          cast_to = this._key_schema.cast_lookup[cast_to];
        }

        try {
          value = cast_to(value);
        } catch (e) {
          value = undefined;
        }

        try {
          object_value = cast_to(object_value);
        } catch (e) {
          object_value = undefined;
        }
      }
    } else {
      object_value = item[key];
      value = this.value;
    }
    if (object_value === undefined || value === undefined) {
      return false;
    }
    return matchMethod(object_value, value);
  };

  /**
   * #crossLink "Query/toString:method"
   */
  SimpleQuery.prototype.toString = function () {
    return (this.key ? this.key + ":" : "") +
      (this.operator ? " " + this.operator : "") + ' "' + this.value + '"';
  };

  /**
   * #crossLink "Query/serialized:method"
   */
  SimpleQuery.prototype.serialized = function () {
    var object = {
      "type": "simple",
      "key": this.key,
      "value": this.value
    };
    if (this.operator !== undefined) {
      object.operator = this.operator;
    }
    return object;
  };
  SimpleQuery.prototype.toJSON = SimpleQuery.prototype.serialized;

  /**
   * Comparison operator, test if this query value matches the item value
   *
   * @method =
   * @param  {String} object_value The value to compare
   * @param  {String} comparison_value The comparison value
   * @return {Boolean} true if match, false otherwise
   */
  SimpleQuery.prototype["="] = function (object_value, comparison_value) {
    var value, i;
    if (!Array.isArray(object_value)) {
      object_value = [object_value];
    }
    for (i = 0; i < object_value.length; i += 1) {
      value = object_value[i];
      if (typeof value === 'object' && value.hasOwnProperty('content')) {
        value = value.content;
      }
      if (typeof value.cmp === "function") {
        return (value.cmp(comparison_value) === 0);
      }
      if (comparison_value.toString() === value.toString()) {
        return true;
      }
    }
    return false;
  };

  /**
   * Comparison operator, test if this query value matches the item value
   *
   * @method like
   * @param  {String} object_value The value to compare
   * @param  {String} comparison_value The comparison value
   * @return {Boolean} true if match, false otherwise
   */
  SimpleQuery.prototype.like = function (object_value, comparison_value) {
    var value, i;
    if (!Array.isArray(object_value)) {
      object_value = [object_value];
    }
    for (i = 0; i < object_value.length; i += 1) {
      value = object_value[i];
      if (typeof value === 'object' && value.hasOwnProperty('content')) {
        value = value.content;
      }
      if (typeof value.cmp === "function") {
        return (value.cmp(comparison_value) === 0);
      }
      if (
        searchTextToRegExp(comparison_value.toString()).test(value.toString())
      ) {
        return true;
      }
    }
    return false;
  };

  /**
   * Comparison operator, test if this query value does not match the item value
   *
   * @method !=
   * @param  {String} object_value The value to compare
   * @param  {String} comparison_value The comparison value
   * @return {Boolean} true if not match, false otherwise
   */
  SimpleQuery.prototype["!="] = function (object_value, comparison_value) {
    var value, i;
    if (!Array.isArray(object_value)) {
      object_value = [object_value];
    }
    for (i = 0; i < object_value.length; i += 1) {
      value = object_value[i];
      if (typeof value === 'object' && value.hasOwnProperty('content')) {
        value = value.content;
      }
      if (typeof value.cmp === "function") {
        return (value.cmp(comparison_value) !== 0);
      }
      if (comparison_value.toString() === value.toString()) {
        return false;
      }
    }
    return true;
  };

  /**
   * Comparison operator, test if this query value is lower than the item value
   *
   * @method <
   * @param  {Number, String} object_value The value to compare
   * @param  {Number, String} comparison_value The comparison value
   * @return {Boolean} true if lower, false otherwise
   */
  SimpleQuery.prototype["<"] = function (object_value, comparison_value) {
    var value;
    if (!Array.isArray(object_value)) {
      object_value = [object_value];
    }
    value = object_value[0];
    if (typeof value === 'object' && value.hasOwnProperty('content')) {
      value = value.content;
    }
    if (typeof value.cmp === "function") {
      return (value.cmp(comparison_value) < 0);
    }
    return (value < comparison_value);
  };

  /**
   * Comparison operator, test if this query value is equal or lower than the
   * item value
   *
   * @method <=
   * @param  {Number, String} object_value The value to compare
   * @param  {Number, String} comparison_value The comparison value
   * @return {Boolean} true if equal or lower, false otherwise
   */
  SimpleQuery.prototype["<="] = function (object_value, comparison_value) {
    var value;
    if (!Array.isArray(object_value)) {
      object_value = [object_value];
    }
    value = object_value[0];
    if (typeof value === 'object' && value.hasOwnProperty('content')) {
      value = value.content;
    }
    if (typeof value.cmp === "function") {
      return (value.cmp(comparison_value) <= 0);
    }
    return (value <= comparison_value);
  };

  /**
   * Comparison operator, test if this query value is greater than the item
   * value
   *
   * @method >
   * @param  {Number, String} object_value The value to compare
   * @param  {Number, String} comparison_value The comparison value
   * @return {Boolean} true if greater, false otherwise
   */
  SimpleQuery.prototype[">"] = function (object_value, comparison_value) {
    var value;
    if (!Array.isArray(object_value)) {
      object_value = [object_value];
    }
    value = object_value[0];
    if (typeof value === 'object' && value.hasOwnProperty('content')) {
      value = value.content;
    }
    if (typeof value.cmp === "function") {
      return (value.cmp(comparison_value) > 0);
    }
    return (value > comparison_value);
  };

  /**
   * Comparison operator, test if this query value is equal or greater than the
   * item value
   *
   * @method >=
   * @param  {Number, String} object_value The value to compare
   * @param  {Number, String} comparison_value The comparison value
   * @return {Boolean} true if equal or greater, false otherwise
   */
  SimpleQuery.prototype[">="] = function (object_value, comparison_value) {
    var value;
    if (!Array.isArray(object_value)) {
      object_value = [object_value];
    }
    value = object_value[0];
    if (typeof value === 'object' && value.hasOwnProperty('content')) {
      value = value.content;
    }
    if (typeof value.cmp === "function") {
      return (value.cmp(comparison_value) >= 0);
    }
    return (value >= comparison_value);
  };

  query_class_dict.simple = SimpleQuery;
  query_class_dict.complex = ComplexQuery;

  Query.parseStringToObject = parseStringToObject;
  Query.objectToSearchText = objectToSearchText;

  window.Query = Query;
  window.SimpleQuery = SimpleQuery;
  window.ComplexQuery = ComplexQuery;
  window.QueryFactory = QueryFactory;

}(RSVP, window, parseStringToObject));
;/*global window, moment */
/*jslint nomen: true, maxlen: 200*/
(function (window, moment) {
  "use strict";

//   /**
//    * Add a secured (write permission denied) property to an object.
//    *
//    * @param  {Object} object The object to fill
//    * @param  {String} key The object key where to store the property
//    * @param  {Any} value The value to store
//    */
//   function _export(key, value) {
//     Object.defineProperty(to_export, key, {
//       "configurable": false,
//       "enumerable": true,
//       "writable": false,
//       "value": value
//     });
//   }

  var YEAR = 'year',
    MONTH = 'month',
    DAY = 'day',
    HOUR = 'hour',
    MIN = 'minute',
    SEC = 'second',
    MSEC = 'millisecond',
    precision_grade = {
      'year': 0,
      'month': 1,
      'day': 2,
      'hour': 3,
      'minute': 4,
      'second': 5,
      'millisecond': 6
    },
    lesserPrecision = function (p1, p2) {
      return (precision_grade[p1] < precision_grade[p2]) ? p1 : p2;
    },
    JIODate;


  JIODate = function (str) {
    // in case of forgotten 'new'
    if (!(this instanceof JIODate)) {
      return new JIODate(str);
    }

    if (str instanceof JIODate) {
      this.mom = str.mom.clone();
      this._precision = str._precision;
      return;
    }

    if (str === undefined) {
      this.mom = moment();
      this.setPrecision(MSEC);
      return;
    }

    this.mom = null;
    this._str = str;

    // http://www.w3.org/TR/NOTE-datetime
    // http://dotat.at/tmp/ISO_8601-2004_E.pdf

    // XXX these regexps fail to detect many invalid dates.

    if (str.match(/\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+\-][0-2]\d:[0-5]\d|Z)/)
          || str.match(/\d\d\d\d-\d\d-\d\d \d\d:\d\d:\d\d\.\d\d\d/)) {
      // ISO, milliseconds
      this.mom = moment(str);
      this.setPrecision(MSEC);
    } else if (str.match(/\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+\-][0-2]\d:[0-5]\d|Z)/)
          || str.match(/\d\d\d\d-\d\d-\d\d \d\d:\d\d:\d\d/)) {
      // ISO, seconds
      this.mom = moment(str);
      this.setPrecision(SEC);
    } else if (str.match(/\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+\-][0-2]\d:[0-5]\d|Z)/)
          || str.match(/\d\d\d\d-\d\d-\d\d \d\d:\d\d/)) {
      // ISO, minutes
      this.mom = moment(str);
      this.setPrecision(MIN);
    } else if (str.match(/\d\d\d\d-\d\d-\d\d \d\d/)) {
      this.mom = moment(str);
      this.setPrecision(HOUR);
    } else if (str.match(/\d\d\d\d-\d\d-\d\d/)) {
      this.mom = moment(str);
      this.setPrecision(DAY);
    } else if (str.match(/\d\d\d\d-\d\d/)) {
      this.mom = moment(str);
      this.setPrecision(MONTH);
    } else if (str.match(/\d\d\d\d/)) {
      // Creating a moment with only the year will show this deprecation
      // warning:
      //
      // Deprecation warning: moment construction falls back to js Date. This is
      // discouraged and will be removed in upcoming major release. Please refer
      // to https://github.com/moment/moment/issues/1407 for more info.
      //
      // TL;DR: parsing year-only strings with momentjs falls back to native
      // Date and it won't correctly represent the year in local time if UTF
      // offset is negative.
      //
      // The solution is to use the format parameter, so momentjs won't fall
      // back to the native Date and we will have the correct year in local
      // time.
      //
      this.mom = moment(str, 'YYYY');
      this.setPrecision(YEAR);
    }

    if (!this.mom) {
      throw new Error("Cannot parse: " + str);
    }

  };


  JIODate.prototype.setPrecision = function (prec) {
    this._precision = prec;
  };


  JIODate.prototype.getPrecision = function () {
    return this._precision;
  };


  JIODate.prototype.cmp = function (other) {
    var m1 = this.mom,
      m2 = other.mom,
      p = lesserPrecision(this._precision, other._precision);
    return m1.isBefore(m2, p) ? -1 : (m1.isSame(m2, p) ? 0 : +1);
  };


  JIODate.prototype.toPrecisionString = function (precision) {
    var fmt;

    precision = precision || this._precision;

    fmt = {
      'millisecond': 'YYYY-MM-DD HH:mm:ss.SSS',
      'second': 'YYYY-MM-DD HH:mm:ss',
      'minute': 'YYYY-MM-DD HH:mm',
      'hour': 'YYYY-MM-DD HH',
      'day': 'YYYY-MM-DD',
      'month': 'YYYY-MM',
      'year': 'YYYY'
    }[precision];

    if (!fmt) {
      throw new TypeError("Unsupported precision value '" + precision + "'");
    }

    return this.mom.format(fmt);
  };


  JIODate.prototype.toString = function () {
    return this._str;
  };


//   _export('JIODate', JIODate);
// 
//   _export('YEAR', YEAR);
//   _export('MONTH', MONTH);
//   _export('DAY', DAY);
//   _export('HOUR', HOUR);
//   _export('MIN', MIN);
//   _export('SEC', SEC);
//   _export('MSEC', MSEC);

  window.jiodate = {
    JIODate: JIODate,
    YEAR: YEAR,
    MONTH: MONTH,
    DAY: DAY,
    HOUR: HOUR,
    MIN: MIN,
    SEC: SEC,
    MSEC: MSEC
  };
}(window, moment));
;/*global window, RSVP, Blob, XMLHttpRequest, QueryFactory, Query, atob,
  FileReader, ArrayBuffer, Uint8Array, navigator */
(function (window, RSVP, Blob, QueryFactory, Query, atob,
           FileReader, ArrayBuffer, Uint8Array, navigator) {
  "use strict";

  if (window.openDatabase === undefined) {
    window.openDatabase = function () {
      throw new Error('WebSQL is not supported by ' + navigator.userAgent);
    };
  }

  /* Safari does not define DOMError */
  if (window.DOMError === undefined) {
    window.DOMError = {};
  }

  var util = {},
    jIO;

  function jIOError(message, status_code) {
    if ((message !== undefined) && (typeof message !== "string")) {
      throw new TypeError('You must pass a string.');
    }
    this.message = message || "Default Message";
    this.status_code = status_code || 500;
  }
  jIOError.prototype = new Error();
  jIOError.prototype.constructor = jIOError;
  util.jIOError = jIOError;

  /**
   * Send request with XHR and return a promise. xhr.onload: The promise is
   * resolved when the status code is lower than 400 with the xhr object as
   * first parameter. xhr.onerror: reject with xhr object as first
   * parameter. xhr.onprogress: notifies the xhr object.
   *
   * @param  {Object} param The parameters
   * @param  {String} [param.type="GET"] The request method
   * @param  {String} [param.dataType=""] The data type to retrieve
   * @param  {String} param.url The url
   * @param  {Any} [param.data] The data to send
   * @param  {Function} [param.beforeSend] A function called just before the
   *    send request. The first parameter of this function is the XHR object.
   * @return {Promise} The promise
   */
  function ajax(param) {
    var xhr = new XMLHttpRequest();
    return new RSVP.Promise(function (resolve, reject, notify) {
      var k;
      xhr.open(param.type || "GET", param.url, true);
      xhr.responseType = param.dataType || "";
      if (typeof param.headers === 'object' && param.headers !== null) {
        for (k in param.headers) {
          if (param.headers.hasOwnProperty(k)) {
            xhr.setRequestHeader(k, param.headers[k]);
          }
        }
      }
      xhr.addEventListener("load", function (e) {
        if (e.target.status >= 400) {
          return reject(e);
        }
        resolve(e);
      });
      xhr.addEventListener("error", reject);
      xhr.addEventListener("progress", notify);
      if (typeof param.xhrFields === 'object' && param.xhrFields !== null) {
        for (k in param.xhrFields) {
          if (param.xhrFields.hasOwnProperty(k)) {
            xhr[k] = param.xhrFields[k];
          }
        }
      }
      if (typeof param.beforeSend === 'function') {
        param.beforeSend(xhr);
      }
      xhr.send(param.data);
    }, function () {
      xhr.abort();
    });
  }
  util.ajax = ajax;

  function readBlobAsText(blob, encoding) {
    var fr = new FileReader();
    return new RSVP.Promise(function (resolve, reject, notify) {
      fr.addEventListener("load", resolve);
      fr.addEventListener("error", reject);
      fr.addEventListener("progress", notify);
      fr.readAsText(blob, encoding);
    }, function () {
      fr.abort();
    });
  }
  util.readBlobAsText = readBlobAsText;

  function readBlobAsArrayBuffer(blob) {
    var fr = new FileReader();
    return new RSVP.Promise(function (resolve, reject, notify) {
      fr.addEventListener("load", resolve);
      fr.addEventListener("error", reject);
      fr.addEventListener("progress", notify);
      fr.readAsArrayBuffer(blob);
    }, function () {
      fr.abort();
    });
  }
  util.readBlobAsArrayBuffer = readBlobAsArrayBuffer;

  function readBlobAsDataURL(blob) {
    var fr = new FileReader();
    return new RSVP.Promise(function (resolve, reject, notify) {
      fr.addEventListener("load", resolve);
      fr.addEventListener("error", reject);
      fr.addEventListener("progress", notify);
      fr.readAsDataURL(blob);
    }, function () {
      fr.abort();
    });
  }
  util.readBlobAsDataURL = readBlobAsDataURL;

  function stringify(obj) {
    // Implement a stable JSON.stringify
    // Object's keys are alphabetically ordered
    var key,
      key_list,
      i,
      value,
      result_list;
    if (obj === undefined) {
      return undefined;
    }
    if (obj.constructor === Object) {
      key_list = Object.keys(obj).sort();
      result_list = [];
      for (i = 0; i < key_list.length; i += 1) {
        key = key_list[i];
        value = stringify(obj[key]);
        if (value !== undefined) {
          result_list.push(stringify(key) + ':' + value);
        }
      }
      return '{' + result_list.join(',') + '}';
    }
    if (obj.constructor === Array) {
      result_list = [];
      for (i = 0; i < obj.length; i += 1) {
        result_list.push(stringify(obj[i]));
      }
      return '[' + result_list.join(',') + ']';
    }
    return JSON.stringify(obj);
  }
  util.stringify = stringify;


  // https://gist.github.com/davoclavo/4424731
  function dataURItoBlob(dataURI) {
    if (dataURI === 'data:') {
      return new Blob();
    }
    // convert base64 to raw binary data held in a string
    var byteString = atob(dataURI.split(',')[1]),
    // separate out the mime component
      mimeString = dataURI.split(',')[0].split(':')[1],
    // write the bytes of the string to an ArrayBuffer
      arrayBuffer = new ArrayBuffer(byteString.length),
      _ia = new Uint8Array(arrayBuffer),
      i;
    mimeString = mimeString.slice(0, mimeString.length - ";base64".length);
    for (i = 0; i < byteString.length; i += 1) {
      _ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([arrayBuffer], {type: mimeString});
  }

  util.dataURItoBlob = dataURItoBlob;

  // tools
  function checkId(argument_list, storage, method_name) {
    if (typeof argument_list[0] !== 'string' || argument_list[0] === '') {
      throw new jIO.util.jIOError(
        "Document id must be a non empty string on '" + storage.__type +
          "." + method_name + "'.",
        400
      );
    }
  }

  function checkAttachmentId(argument_list, storage, method_name) {
    if (typeof argument_list[1] !== 'string' || argument_list[1] === '') {
      throw new jIO.util.jIOError(
        "Attachment id must be a non empty string on '" + storage.__type +
          "." + method_name + "'.",
        400
      );
    }
  }

  function declareMethod(klass, name, precondition_function, post_function) {
    klass.prototype[name] = function () {
      var argument_list = arguments,
        context = this,
        precondition_result;

      return new RSVP.Queue()
        .push(function () {
          if (precondition_function !== undefined) {
            return precondition_function.apply(
              context.__storage,
              [argument_list, context, name]
            );
          }
        })
        .push(function (result) {
          var storage_method = context.__storage[name];
          precondition_result = result;
          if (storage_method === undefined) {
            throw new jIO.util.jIOError(
              "Capacity '" + name + "' is not implemented on '" +
                context.__type + "'",
              501
            );
          }
          return storage_method.apply(
            context.__storage,
            argument_list
          );
        })
        .push(function (result) {
          if (post_function !== undefined) {
            return post_function.call(
              context,
              argument_list,
              result,
              precondition_result
            );
          }
          return result;
        });
    };
    // Allow chain
    return this;
  }




  /////////////////////////////////////////////////////////////////
  // jIO Storage Proxy
  /////////////////////////////////////////////////////////////////
  function JioProxyStorage(type, storage) {
    if (!(this instanceof JioProxyStorage)) {
      return new JioProxyStorage();
    }
    this.__type = type;
    this.__storage = storage;
  }

  declareMethod(JioProxyStorage, "put", checkId, function (argument_list) {
    return argument_list[0];
  });
  declareMethod(JioProxyStorage, "get", checkId);
  declareMethod(JioProxyStorage, "bulk");
  declareMethod(JioProxyStorage, "remove", checkId, function (argument_list) {
    return argument_list[0];
  });

  JioProxyStorage.prototype.post = function () {
    var context = this,
      argument_list = arguments;
    return new RSVP.Queue()
      .push(function () {
        var storage_method = context.__storage.post;
        if (storage_method === undefined) {
          throw new jIO.util.jIOError(
            "Capacity 'post' is not implemented on '" + context.__type + "'",
            501
          );
        }
        return context.__storage.post.apply(context.__storage, argument_list);
      });
  };

  declareMethod(JioProxyStorage, 'putAttachment', function (argument_list,
                                                            storage,
                                                            method_name) {
    checkId(argument_list, storage, method_name);
    checkAttachmentId(argument_list, storage, method_name);

    var options = argument_list[3] || {};

    if (typeof argument_list[2] === 'string') {
      argument_list[2] = new Blob([argument_list[2]], {
        "type": options._content_type || options._mimetype ||
                "text/plain;charset=utf-8"
      });
    } else if (!(argument_list[2] instanceof Blob)) {
      throw new jIO.util.jIOError(
        'Attachment content is not a blob',
        400
      );
    }
  });

  declareMethod(JioProxyStorage, 'removeAttachment', function (argument_list,
                                                               storage,
                                                               method_name) {
    checkId(argument_list, storage, method_name);
    checkAttachmentId(argument_list, storage, method_name);
  });

  declareMethod(JioProxyStorage, 'getAttachment', function (argument_list,
                                                            storage,
                                                            method_name) {
    var result = "blob";
//     if (param.storage_spec.type !== "indexeddb" &&
//         param.storage_spec.type !== "dav" &&
//         (param.kwargs._start !== undefined
//          || param.kwargs._end !== undefined)) {
//       restCommandRejecter(param, [
//         'bad_request',
//         'unsupport',
//         '_start, _end not support'
//       ]);
//       return false;
//     }
    checkId(argument_list, storage, method_name);
    checkAttachmentId(argument_list, storage, method_name);
    // Drop optional parameters, which are only used in postfunction
    if (argument_list[2] !== undefined) {
      result = argument_list[2].format || result;
      delete argument_list[2].format;
    }
    return result;
  }, function (argument_list, blob, convert) {
    var result;
    if (!(blob instanceof Blob)) {
      throw new jIO.util.jIOError(
        "'getAttachment' (" + argument_list[0] + " , " +
          argument_list[1] + ") on '" + this.__type +
          "' does not return a Blob.",
        501
      );
    }
    if (convert === "blob") {
      result = blob;
    } else if (convert === "data_url") {
      result = new RSVP.Queue()
        .push(function () {
          return jIO.util.readBlobAsDataURL(blob);
        })
        .push(function (evt) {
          return evt.target.result;
        });
    } else if (convert === "array_buffer") {
      result = new RSVP.Queue()
        .push(function () {
          return jIO.util.readBlobAsArrayBuffer(blob);
        })
        .push(function (evt) {
          return evt.target.result;
        });
    } else if (convert === "text") {
      result = new RSVP.Queue()
        .push(function () {
          return jIO.util.readBlobAsText(blob);
        })
        .push(function (evt) {
          return evt.target.result;
        });
    } else if (convert === "json") {
      result = new RSVP.Queue()
        .push(function () {
          return jIO.util.readBlobAsText(blob);
        })
        .push(function (evt) {
          return JSON.parse(evt.target.result);
        });
    } else {
      throw new jIO.util.jIOError(
        this.__type + ".getAttachment format: '" + convert +
          "' is not supported",
        400
      );
    }
    return result;
  });

  JioProxyStorage.prototype.buildQuery = function () {
    var storage_method = this.__storage.buildQuery,
      context = this,
      argument_list = arguments;
    if (storage_method === undefined) {
      throw new jIO.util.jIOError(
        "Capacity 'buildQuery' is not implemented on '" + this.__type + "'",
        501
      );
    }
    return new RSVP.Queue()
      .push(function () {
        return storage_method.apply(
          context.__storage,
          argument_list
        );
      });
  };

  JioProxyStorage.prototype.hasCapacity = function (name) {
    var storage_method = this.__storage.hasCapacity,
      capacity_method = this.__storage[name];
    if (capacity_method !== undefined) {
      return true;
    }
    if ((storage_method === undefined) ||
        !storage_method.apply(this.__storage, arguments)) {
      throw new jIO.util.jIOError(
        "Capacity '" + name + "' is not implemented on '" + this.__type + "'",
        501
      );
    }
    return true;
  };

  JioProxyStorage.prototype.allDocs = function (options) {
    var context = this;
    if (options === undefined) {
      options = {};
    }
    return new RSVP.Queue()
      .push(function () {
        if (context.hasCapacity("list") &&
            ((options.query === undefined) || context.hasCapacity("query")) &&
            ((options.sort_on === undefined) || context.hasCapacity("sort")) &&
            ((options.select_list === undefined) ||
             context.hasCapacity("select")) &&
            ((options.include_docs === undefined) ||
             context.hasCapacity("include")) &&
            ((options.limit === undefined) || context.hasCapacity("limit"))) {
          return context.buildQuery(options);
        }
      })
      .push(function (result) {
        return {
          data: {
            rows: result,
            total_rows: result.length
          }
        };
      });
  };

  declareMethod(JioProxyStorage, "allAttachments", checkId);
  declareMethod(JioProxyStorage, "repair");

  JioProxyStorage.prototype.repair = function () {
    var context = this,
      argument_list = arguments;
    return new RSVP.Queue()
      .push(function () {
        var storage_method = context.__storage.repair;
        if (storage_method !== undefined) {
          return context.__storage.repair.apply(context.__storage,
                                                argument_list);
        }
      });
  };

  /////////////////////////////////////////////////////////////////
  // Storage builder
  /////////////////////////////////////////////////////////////////
  function JioBuilder() {
    if (!(this instanceof JioBuilder)) {
      return new JioBuilder();
    }
    this.__storage_types = {};
  }

  JioBuilder.prototype.createJIO = function (storage_spec, util) {

    if (typeof storage_spec.type !== 'string') {
      throw new TypeError("Invalid storage description");
    }
    if (!this.__storage_types[storage_spec.type]) {
      throw new TypeError("Unknown storage '" + storage_spec.type + "'");
    }

    return new JioProxyStorage(
      storage_spec.type,
      new this.__storage_types[storage_spec.type](storage_spec, util)
    );

  };

  JioBuilder.prototype.addStorage = function (type, Constructor) {
    if (typeof type !== 'string') {
      throw new TypeError(
        "jIO.addStorage(): Argument 1 is not of type 'string'"
      );
    }
    if (typeof Constructor !== 'function') {
      throw new TypeError("jIO.addStorage(): " +
                          "Argument 2 is not of type 'function'");
    }
    if (this.__storage_types[type] !== undefined) {
      throw new TypeError("jIO.addStorage(): Storage type already exists");
    }
    this.__storage_types[type] = Constructor;
  };

  JioBuilder.prototype.util = util;
  JioBuilder.prototype.QueryFactory = QueryFactory;
  JioBuilder.prototype.Query = Query;

  /////////////////////////////////////////////////////////////////
  // global
  /////////////////////////////////////////////////////////////////
  jIO = new JioBuilder();
  window.jIO = jIO;

}(window, RSVP, Blob, QueryFactory, Query, atob,
  FileReader, ArrayBuffer, Uint8Array, navigator));
;/*
 * Rusha, a JavaScript implementation of the Secure Hash Algorithm, SHA-1,
 * as defined in FIPS PUB 180-1, tuned for high performance with large inputs.
 * (http://github.com/srijs/rusha)
 *
 * Inspired by Paul Johnstons implementation (http://pajhome.org.uk/crypt/md5).
 *
 * Copyright (c) 2013 Sam Rijs (http://awesam.de).
 * Released under the terms of the MIT license as follows:
 *
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 * IN THE SOFTWARE.
 */
(function () {
    // If we'e running in Node.JS, export a module.
    if (typeof module !== 'undefined') {
        module.exports = Rusha;
    } else if (typeof window !== 'undefined') {
        window.Rusha = Rusha;
    }
    // If we're running in a webworker, accept
    // messages containing a jobid and a buffer
    // or blob object, and return the hash result.
    if (typeof FileReaderSync !== 'undefined') {
        var reader = new FileReaderSync(), hasher = new Rusha(4 * 1024 * 1024);
        self.onmessage = function onMessage(event) {
            var hash, data = event.data.data;
            try {
                hash = hasher.digest(data);
                self.postMessage({
                    id: event.data.id,
                    hash: hash
                });
            } catch (e) {
                self.postMessage({
                    id: event.data.id,
                    error: e.name
                });
            }
        };
    }
    var util = {
            getDataType: function (data) {
                if (typeof data === 'string') {
                    return 'string';
                }
                if (data instanceof Array) {
                    return 'array';
                }
                if (typeof global !== 'undefined' && global.Buffer && global.Buffer.isBuffer(data)) {
                    return 'buffer';
                }
                if (data instanceof ArrayBuffer) {
                    return 'arraybuffer';
                }
                if (data.buffer instanceof ArrayBuffer) {
                    return 'view';
                }
                if (data instanceof Blob) {
                    return 'blob';
                }
                throw new Error('Unsupported data type.');
            }
        };
    // The Rusha object is a wrapper around the low-level RushaCore.
    // It provides means of converting different inputs to the
    // format accepted by RushaCore as well as other utility methods.
    function Rusha(chunkSize) {
        'use strict';
        // Private object structure.
        var self$2 = { fill: 0 };
        // Calculate the length of buffer that the sha1 routine uses
        // including the padding.
        var padlen = function (len) {
            for (len += 9; len % 64 > 0; len += 1);
            return len;
        };
        var padZeroes = function (bin, len) {
            for (var i = len >> 2; i < bin.length; i++)
                bin[i] = 0;
        };
        var padData = function (bin, chunkLen, msgLen) {
            bin[chunkLen >> 2] |= 128 << 24 - (chunkLen % 4 << 3);
            bin[((chunkLen >> 2) + 2 & ~15) + 14] = msgLen >> 29;
            bin[((chunkLen >> 2) + 2 & ~15) + 15] = msgLen << 3;
        };
        // Convert a binary string and write it to the heap.
        // A binary string is expected to only contain char codes < 256.
        var convStr = function (H8, H32, start, len, off) {
            var str = this, i, om = off % 4, lm = len % 4, j = len - lm;
            if (j > 0) {
                switch (om) {
                case 0:
                    H8[off + 3 | 0] = str.charCodeAt(start);
                case 1:
                    H8[off + 2 | 0] = str.charCodeAt(start + 1);
                case 2:
                    H8[off + 1 | 0] = str.charCodeAt(start + 2);
                case 3:
                    H8[off | 0] = str.charCodeAt(start + 3);
                }
            }
            for (i = om; i < j; i = i + 4 | 0) {
                H32[off + i >> 2] = str.charCodeAt(start + i) << 24 | str.charCodeAt(start + i + 1) << 16 | str.charCodeAt(start + i + 2) << 8 | str.charCodeAt(start + i + 3);
            }
            switch (lm) {
            case 3:
                H8[off + j + 1 | 0] = str.charCodeAt(start + j + 2);
            case 2:
                H8[off + j + 2 | 0] = str.charCodeAt(start + j + 1);
            case 1:
                H8[off + j + 3 | 0] = str.charCodeAt(start + j);
            }
        };
        // Convert a buffer or array and write it to the heap.
        // The buffer or array is expected to only contain elements < 256.
        var convBuf = function (H8, H32, start, len, off) {
            var buf = this, i, om = off % 4, lm = len % 4, j = len - lm;
            if (j > 0) {
                switch (om) {
                case 0:
                    H8[off + 3 | 0] = buf[start];
                case 1:
                    H8[off + 2 | 0] = buf[start + 1];
                case 2:
                    H8[off + 1 | 0] = buf[start + 2];
                case 3:
                    H8[off | 0] = buf[start + 3];
                }
            }
            for (i = 4 - om; i < j; i = i += 4 | 0) {
                H32[off + i >> 2] = buf[start + i] << 24 | buf[start + i + 1] << 16 | buf[start + i + 2] << 8 | buf[start + i + 3];
            }
            switch (lm) {
            case 3:
                H8[off + j + 1 | 0] = buf[start + j + 2];
            case 2:
                H8[off + j + 2 | 0] = buf[start + j + 1];
            case 1:
                H8[off + j + 3 | 0] = buf[start + j];
            }
        };
        var convBlob = function (H8, H32, start, len, off) {
            var blob = this, i, om = off % 4, lm = len % 4, j = len - lm;
            var buf = new Uint8Array(reader.readAsArrayBuffer(blob.slice(start, start + len)));
            if (j > 0) {
                switch (om) {
                case 0:
                    H8[off + 3 | 0] = buf[0];
                case 1:
                    H8[off + 2 | 0] = buf[1];
                case 2:
                    H8[off + 1 | 0] = buf[2];
                case 3:
                    H8[off | 0] = buf[3];
                }
            }
            for (i = 4 - om; i < j; i = i += 4 | 0) {
                H32[off + i >> 2] = buf[i] << 24 | buf[i + 1] << 16 | buf[i + 2] << 8 | buf[i + 3];
            }
            switch (lm) {
            case 3:
                H8[off + j + 1 | 0] = buf[j + 2];
            case 2:
                H8[off + j + 2 | 0] = buf[j + 1];
            case 1:
                H8[off + j + 3 | 0] = buf[j];
            }
        };
        var convFn = function (data) {
            switch (util.getDataType(data)) {
            case 'string':
                return convStr.bind(data);
            case 'array':
                return convBuf.bind(data);
            case 'buffer':
                return convBuf.bind(data);
            case 'arraybuffer':
                return convBuf.bind(new Uint8Array(data));
            case 'view':
                return convBuf.bind(new Uint8Array(data.buffer, data.byteOffset, data.byteLength));
            case 'blob':
                return convBlob.bind(data);
            }
        };
        var slice = function (data, offset) {
            switch (util.getDataType(data)) {
            case 'string':
                return data.slice(offset);
            case 'array':
                return data.slice(offset);
            case 'buffer':
                return data.slice(offset);
            case 'arraybuffer':
                return data.slice(offset);
            case 'view':
                return data.buffer.slice(offset);
            }
        };
        // Convert an ArrayBuffer into its hexadecimal string representation.
        var hex = function (arrayBuffer) {
            var i, x, hex_tab = '0123456789abcdef', res = [], binarray = new Uint8Array(arrayBuffer);
            for (i = 0; i < binarray.length; i++) {
                x = binarray[i];
                res[i] = hex_tab.charAt(x >> 4 & 15) + hex_tab.charAt(x >> 0 & 15);
            }
            return res.join('');
        };
        var ceilHeapSize = function (v) {
            // The asm.js spec says:
            // The heap object's byteLength must be either
            // 2^n for n in [12, 24) or 2^24 * n for n ≥ 1.
            // Also, byteLengths smaller than 2^16 are deprecated.
            var p;
            // If v is smaller than 2^16, the smallest possible solution
            // is 2^16.
            if (v <= 65536)
                return 65536;
            // If v < 2^24, we round up to 2^n,
            // otherwise we round up to 2^24 * n.
            if (v < 16777216) {
                for (p = 1; p < v; p = p << 1);
            } else {
                for (p = 16777216; p < v; p += 16777216);
            }
            return p;
        };
        // Initialize the internal data structures to a new capacity.
        var init = function (size) {
            if (size % 64 > 0) {
                throw new Error('Chunk size must be a multiple of 128 bit');
            }
            self$2.maxChunkLen = size;
            self$2.padMaxChunkLen = padlen(size);
            // The size of the heap is the sum of:
            // 1. The padded input message size
            // 2. The extended space the algorithm needs (320 byte)
            // 3. The 160 bit state the algoritm uses
            self$2.heap = new ArrayBuffer(ceilHeapSize(self$2.padMaxChunkLen + 320 + 20));
            self$2.h32 = new Int32Array(self$2.heap);
            self$2.h8 = new Int8Array(self$2.heap);
            self$2.core = RushaCore({
                Int32Array: Int32Array,
                DataView: DataView
            }, {}, self$2.heap);
            self$2.buffer = null;
        };
        // Iinitializethe datastructures according
        // to a chunk siyze.
        init(chunkSize || 64 * 1024);
        var initState = function (heap, padMsgLen) {
            var io = new Int32Array(heap, padMsgLen + 320, 5);
            io[0] = 1732584193;
            io[1] = -271733879;
            io[2] = -1732584194;
            io[3] = 271733878;
            io[4] = -1009589776;
        };
        var padChunk = function (chunkLen, msgLen) {
            var padChunkLen = padlen(chunkLen);
            var view = new Int32Array(self$2.heap, 0, padChunkLen >> 2);
            padZeroes(view, chunkLen);
            padData(view, chunkLen, msgLen);
            return padChunkLen;
        };
        // Write data to the heap.
        var write = function (data, chunkOffset, chunkLen) {
            convFn(data)(self$2.h8, self$2.h32, chunkOffset, chunkLen, 0);
        };
        // Initialize and call the RushaCore,
        // assuming an input buffer of length len * 4.
        var coreCall = function (data, chunkOffset, chunkLen, msgLen, finalize) {
            var padChunkLen = chunkLen;
            if (finalize) {
                padChunkLen = padChunk(chunkLen, msgLen);
            }
            write(data, chunkOffset, chunkLen);
            self$2.core.hash(padChunkLen, self$2.padMaxChunkLen);
        };
        var getRawDigest = function (heap, padMaxChunkLen) {
            var io = new Int32Array(heap, padMaxChunkLen + 320, 5);
            var out = new Int32Array(5);
            var arr = new DataView(out.buffer);
            arr.setInt32(0, io[0], false);
            arr.setInt32(4, io[1], false);
            arr.setInt32(8, io[2], false);
            arr.setInt32(12, io[3], false);
            arr.setInt32(16, io[4], false);
            return out;
        };
        // Calculate the hash digest as an array of 5 32bit integers.
        var rawDigest = this.rawDigest = function (str) {
                var msgLen = str.byteLength || str.length || str.size || 0;
                initState(self$2.heap, self$2.padMaxChunkLen);
                var chunkOffset = 0, chunkLen = self$2.maxChunkLen, last;
                for (chunkOffset = 0; msgLen > chunkOffset + chunkLen; chunkOffset += chunkLen) {
                    coreCall(str, chunkOffset, chunkLen, msgLen, false);
                }
                coreCall(str, chunkOffset, msgLen - chunkOffset, msgLen, true);
                return getRawDigest(self$2.heap, self$2.padMaxChunkLen);
            };
        // The digest and digestFrom* interface returns the hash digest
        // as a hex string.
        this.digest = this.digestFromString = this.digestFromBuffer = this.digestFromArrayBuffer = function (str) {
            return hex(rawDigest(str).buffer);
        };
    }
    ;
    // The low-level RushCore module provides the heart of Rusha,
    // a high-speed sha1 implementation working on an Int32Array heap.
    // At first glance, the implementation seems complicated, however
    // with the SHA1 spec at hand, it is obvious this almost a textbook
    // implementation that has a few functions hand-inlined and a few loops
    // hand-unrolled.
    function RushaCore(stdlib, foreign, heap) {
        'use asm';
        var H = new stdlib.Int32Array(heap);
        function hash(k, x) {
            // k in bytes
            k = k | 0;
            x = x | 0;
            var i = 0, j = 0, y0 = 0, z0 = 0, y1 = 0, z1 = 0, y2 = 0, z2 = 0, y3 = 0, z3 = 0, y4 = 0, z4 = 0, t0 = 0, t1 = 0;
            y0 = H[x + 320 >> 2] | 0;
            y1 = H[x + 324 >> 2] | 0;
            y2 = H[x + 328 >> 2] | 0;
            y3 = H[x + 332 >> 2] | 0;
            y4 = H[x + 336 >> 2] | 0;
            for (i = 0; (i | 0) < (k | 0); i = i + 64 | 0) {
                z0 = y0;
                z1 = y1;
                z2 = y2;
                z3 = y3;
                z4 = y4;
                for (j = 0; (j | 0) < 64; j = j + 4 | 0) {
                    t1 = H[i + j >> 2] | 0;
                    t0 = ((y0 << 5 | y0 >>> 27) + (y1 & y2 | ~y1 & y3) | 0) + ((t1 + y4 | 0) + 1518500249 | 0) | 0;
                    y4 = y3;
                    y3 = y2;
                    y2 = y1 << 30 | y1 >>> 2;
                    y1 = y0;
                    y0 = t0;
                    ;
                    H[k + j >> 2] = t1;
                }
                for (j = k + 64 | 0; (j | 0) < (k + 80 | 0); j = j + 4 | 0) {
                    t1 = (H[j - 12 >> 2] ^ H[j - 32 >> 2] ^ H[j - 56 >> 2] ^ H[j - 64 >> 2]) << 1 | (H[j - 12 >> 2] ^ H[j - 32 >> 2] ^ H[j - 56 >> 2] ^ H[j - 64 >> 2]) >>> 31;
                    t0 = ((y0 << 5 | y0 >>> 27) + (y1 & y2 | ~y1 & y3) | 0) + ((t1 + y4 | 0) + 1518500249 | 0) | 0;
                    y4 = y3;
                    y3 = y2;
                    y2 = y1 << 30 | y1 >>> 2;
                    y1 = y0;
                    y0 = t0;
                    ;
                    H[j >> 2] = t1;
                }
                for (j = k + 80 | 0; (j | 0) < (k + 160 | 0); j = j + 4 | 0) {
                    t1 = (H[j - 12 >> 2] ^ H[j - 32 >> 2] ^ H[j - 56 >> 2] ^ H[j - 64 >> 2]) << 1 | (H[j - 12 >> 2] ^ H[j - 32 >> 2] ^ H[j - 56 >> 2] ^ H[j - 64 >> 2]) >>> 31;
                    t0 = ((y0 << 5 | y0 >>> 27) + (y1 ^ y2 ^ y3) | 0) + ((t1 + y4 | 0) + 1859775393 | 0) | 0;
                    y4 = y3;
                    y3 = y2;
                    y2 = y1 << 30 | y1 >>> 2;
                    y1 = y0;
                    y0 = t0;
                    ;
                    H[j >> 2] = t1;
                }
                for (j = k + 160 | 0; (j | 0) < (k + 240 | 0); j = j + 4 | 0) {
                    t1 = (H[j - 12 >> 2] ^ H[j - 32 >> 2] ^ H[j - 56 >> 2] ^ H[j - 64 >> 2]) << 1 | (H[j - 12 >> 2] ^ H[j - 32 >> 2] ^ H[j - 56 >> 2] ^ H[j - 64 >> 2]) >>> 31;
                    t0 = ((y0 << 5 | y0 >>> 27) + (y1 & y2 | y1 & y3 | y2 & y3) | 0) + ((t1 + y4 | 0) - 1894007588 | 0) | 0;
                    y4 = y3;
                    y3 = y2;
                    y2 = y1 << 30 | y1 >>> 2;
                    y1 = y0;
                    y0 = t0;
                    ;
                    H[j >> 2] = t1;
                }
                for (j = k + 240 | 0; (j | 0) < (k + 320 | 0); j = j + 4 | 0) {
                    t1 = (H[j - 12 >> 2] ^ H[j - 32 >> 2] ^ H[j - 56 >> 2] ^ H[j - 64 >> 2]) << 1 | (H[j - 12 >> 2] ^ H[j - 32 >> 2] ^ H[j - 56 >> 2] ^ H[j - 64 >> 2]) >>> 31;
                    t0 = ((y0 << 5 | y0 >>> 27) + (y1 ^ y2 ^ y3) | 0) + ((t1 + y4 | 0) - 899497514 | 0) | 0;
                    y4 = y3;
                    y3 = y2;
                    y2 = y1 << 30 | y1 >>> 2;
                    y1 = y0;
                    y0 = t0;
                    ;
                    H[j >> 2] = t1;
                }
                y0 = y0 + z0 | 0;
                y1 = y1 + z1 | 0;
                y2 = y2 + z2 | 0;
                y3 = y3 + z3 | 0;
                y4 = y4 + z4 | 0;
            }
            H[x + 320 >> 2] = y0;
            H[x + 324 >> 2] = y1;
            H[x + 328 >> 2] = y2;
            H[x + 332 >> 2] = y3;
            H[x + 336 >> 2] = y4;
        }
        return { hash: hash };
    }
}());;/*
 * JIO extension for resource replication.
 * Copyright (C) 2013, 2015  Nexedi SA
 *
 *   This library is free software: you can redistribute it and/or modify
 *   it under the terms of the GNU Lesser General Public License as published by
 *   the Free Software Foundation, either version 3 of the License, or
 *   (at your option) any later version.
 *
 *   This library is distributed in the hope that it will be useful,
 *   but WITHOUT ANY WARRANTY; without even the implied warranty of
 *   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *   GNU Lesser General Public License for more details.
 *
 *   You should have received a copy of the GNU Lesser General Public License
 *   along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

/*jslint nomen: true*/
/*global jIO, RSVP, Rusha*/

(function (jIO, RSVP, Rusha, stringify) {
  "use strict";

  var rusha = new Rusha(),
    CONFLICT_THROW = 0,
    CONFLICT_KEEP_LOCAL = 1,
    CONFLICT_KEEP_REMOTE = 2,
    CONFLICT_CONTINUE = 3;

  function SkipError(message) {
    if ((message !== undefined) && (typeof message !== "string")) {
      throw new TypeError('You must pass a string.');
    }
    this.message = message || "Skip some asynchronous code";
  }
  SkipError.prototype = new Error();
  SkipError.prototype.constructor = SkipError;

  /****************************************************
   Use a local jIO to read/write/search documents
   Synchronize in background those document with a remote jIO.
   Synchronization status is stored for each document as an local attachment.
  ****************************************************/

  function generateHash(content) {
    // XXX Improve performance by moving calculation to WebWorker
    return rusha.digestFromString(content);
  }

  function generateHashFromArrayBuffer(content) {
    // XXX Improve performance by moving calculation to WebWorker
    return rusha.digestFromArrayBuffer(content);
  }

  function ReplicateStorage(spec) {
    this._query_options = spec.query || {};
    if (spec.signature_hash_key !== undefined) {
      this._query_options.select_list = [spec.signature_hash_key];
    }
    this._signature_hash_key = spec.signature_hash_key;

    this._local_sub_storage = jIO.createJIO(spec.local_sub_storage);
    this._remote_sub_storage = jIO.createJIO(spec.remote_sub_storage);

    if (spec.hasOwnProperty('signature_sub_storage')) {
      this._signature_sub_storage = jIO.createJIO(spec.signature_sub_storage);
      this._custom_signature_sub_storage = true;
    } else {
      this._signature_hash = "_replicate_" + generateHash(
        stringify(spec.local_sub_storage) +
          stringify(spec.remote_sub_storage) +
          stringify(this._query_options)
      );
      this._signature_sub_storage = jIO.createJIO({
        type: "query",
        sub_storage: {
          type: "document",
          document_id: this._signature_hash,
          sub_storage: spec.local_sub_storage
        }
      });
      this._custom_signature_sub_storage = false;
    }

    this._use_remote_post = spec.use_remote_post || false;
    // Number of request we allow browser execution for attachments
    this._parallel_operation_attachment_amount =
      spec.parallel_operation_attachment_amount || 1;
    // Number of request we allow browser execution for documents
    this._parallel_operation_amount =
      spec.parallel_operation_amount || 1;

    this._conflict_handling = spec.conflict_handling || 0;
    // 0: no resolution (ie, throw an Error)
    // 1: keep the local state
    //    (overwrites the remote document with local content)
    //    (delete remote document if local is deleted)
    // 2: keep the remote state
    //    (overwrites the local document with remote content)
    //    (delete local document if remote is deleted)
    // 3: keep both copies (leave documents untouched, no signature update)
    if ((this._conflict_handling !== CONFLICT_THROW) &&
        (this._conflict_handling !== CONFLICT_KEEP_LOCAL) &&
        (this._conflict_handling !== CONFLICT_KEEP_REMOTE) &&
        (this._conflict_handling !== CONFLICT_CONTINUE)) {
      throw new jIO.util.jIOError("Unsupported conflict handling: " +
                                  this._conflict_handling, 400);
    }

    this._check_local_modification = spec.check_local_modification;
    if (this._check_local_modification === undefined) {
      this._check_local_modification = true;
    }
    this._check_local_creation = spec.check_local_creation;
    if (this._check_local_creation === undefined) {
      this._check_local_creation = true;
    }
    this._check_local_deletion = spec.check_local_deletion;
    if (this._check_local_deletion === undefined) {
      this._check_local_deletion = true;
    }
    this._check_remote_modification = spec.check_remote_modification;
    if (this._check_remote_modification === undefined) {
      this._check_remote_modification = true;
    }
    this._check_remote_creation = spec.check_remote_creation;
    if (this._check_remote_creation === undefined) {
      this._check_remote_creation = true;
    }
    this._check_remote_deletion = spec.check_remote_deletion;
    if (this._check_remote_deletion === undefined) {
      this._check_remote_deletion = true;
    }
    this._check_local_attachment_modification =
      spec.check_local_attachment_modification;
    if (this._check_local_attachment_modification === undefined) {
      this._check_local_attachment_modification = false;
    }
    this._check_local_attachment_creation =
      spec.check_local_attachment_creation;
    if (this._check_local_attachment_creation === undefined) {
      this._check_local_attachment_creation = false;
    }
    this._check_local_attachment_deletion =
      spec.check_local_attachment_deletion;
    if (this._check_local_attachment_deletion === undefined) {
      this._check_local_attachment_deletion = false;
    }
    this._check_remote_attachment_modification =
      spec.check_remote_attachment_modification;
    if (this._check_remote_attachment_modification === undefined) {
      this._check_remote_attachment_modification = false;
    }
    this._check_remote_attachment_creation =
      spec.check_remote_attachment_creation;
    if (this._check_remote_attachment_creation === undefined) {
      this._check_remote_attachment_creation = false;
    }
    this._check_remote_attachment_deletion =
      spec.check_remote_attachment_deletion;
    if (this._check_remote_attachment_deletion === undefined) {
      this._check_remote_attachment_deletion = false;
    }
  }

  ReplicateStorage.prototype.remove = function (id) {
    if (id === this._signature_hash) {
      throw new jIO.util.jIOError(this._signature_hash + " is frozen",
                                  403);
    }
    return this._local_sub_storage.remove.apply(this._local_sub_storage,
                                                arguments);
  };
  ReplicateStorage.prototype.post = function () {
    return this._local_sub_storage.post.apply(this._local_sub_storage,
                                              arguments);
  };
  ReplicateStorage.prototype.put = function (id) {
    if (id === this._signature_hash) {
      throw new jIO.util.jIOError(this._signature_hash + " is frozen",
                                  403);
    }
    return this._local_sub_storage.put.apply(this._local_sub_storage,
                                             arguments);
  };
  ReplicateStorage.prototype.get = function () {
    return this._local_sub_storage.get.apply(this._local_sub_storage,
                                             arguments);
  };
  ReplicateStorage.prototype.getAttachment = function () {
    return this._local_sub_storage.getAttachment.apply(this._local_sub_storage,
                                                       arguments);
  };
  ReplicateStorage.prototype.allAttachments = function () {
    return this._local_sub_storage.allAttachments.apply(this._local_sub_storage,
                                                        arguments);
  };
  ReplicateStorage.prototype.putAttachment = function (id) {
    if (id === this._signature_hash) {
      throw new jIO.util.jIOError(this._signature_hash + " is frozen",
                                  403);
    }
    return this._local_sub_storage.putAttachment.apply(this._local_sub_storage,
                                                       arguments);
  };
  ReplicateStorage.prototype.removeAttachment = function (id) {
    if (id === this._signature_hash) {
      throw new jIO.util.jIOError(this._signature_hash + " is frozen",
                                  403);
    }
    return this._local_sub_storage.removeAttachment.apply(
      this._local_sub_storage,
      arguments
    );
  };
  ReplicateStorage.prototype.hasCapacity = function () {
    return this._local_sub_storage.hasCapacity.apply(this._local_sub_storage,
                                                     arguments);
  };
  ReplicateStorage.prototype.buildQuery = function () {
    // XXX Remove signature document?
    return this._local_sub_storage.buildQuery.apply(this._local_sub_storage,
                                                    arguments);
  };

  function dispatchQueue(context, function_used, argument_list,
                         number_queue) {
    var result_promise_list = [],
      i;

    function pushAndExecute(queue) {
      queue
        .push(function () {
          if (argument_list.length > 0) {
            var argument_array = argument_list.shift(),
              sub_queue = new RSVP.Queue();
            argument_array[0] = sub_queue;
            function_used.apply(context, argument_array);
            pushAndExecute(queue);
            return sub_queue;
          }
        });
    }
    for (i = 0; i < number_queue; i += 1) {
      result_promise_list.push(new RSVP.Queue());
      pushAndExecute(result_promise_list[i]);
    }
    if (number_queue > 1) {
      return RSVP.all(result_promise_list);
    }
    return result_promise_list[0];
  }

  function callAllDocsOnStorage(context, storage, cache, cache_key) {
    return new RSVP.Queue()
      .push(function () {
        if (!cache.hasOwnProperty(cache_key)) {
          return storage.allDocs(context._query_options)
            .push(function (result) {
              var i,
                cache_entry = {};
              for (i = 0; i < result.data.total_rows; i += 1) {
                cache_entry[result.data.rows[i].id] = result.data.rows[i].value;
              }
              cache[cache_key] = cache_entry;
            });
        }
      })
      .push(function () {
        return cache[cache_key];
      });
  }

  function propagateAttachmentDeletion(context, skip_attachment_dict,
                                       destination,
                                       id, name) {
    return destination.removeAttachment(id, name)
      .push(function () {
        return context._signature_sub_storage.removeAttachment(id, name);
      })
      .push(function () {
        skip_attachment_dict[name] = null;
      });
  }

  function propagateAttachmentModification(context, skip_attachment_dict,
                                           destination,
                                           blob, hash, id, name) {
    return destination.putAttachment(id, name, blob)
      .push(function () {
        return context._signature_sub_storage.putAttachment(id, name,
                                                            JSON.stringify({
            hash: hash
          }));
      })
      .push(function () {
        skip_attachment_dict[name] = null;
      });
  }

  function checkAndPropagateAttachment(context,
                                       skip_attachment_dict,
                                       status_hash, local_hash, blob,
                                       source, destination, id, name,
                                       conflict_force, conflict_revert,
                                       conflict_ignore) {
    var remote_blob;
    return destination.getAttachment(id, name)
      .push(function (result) {
        remote_blob = result;
        return jIO.util.readBlobAsArrayBuffer(remote_blob);
      })
      .push(function (evt) {
        return generateHashFromArrayBuffer(
          evt.target.result
        );
      }, function (error) {
        if ((error instanceof jIO.util.jIOError) &&
            (error.status_code === 404)) {
          remote_blob = null;
          return null;
        }
        throw error;
      })
      .push(function (remote_hash) {
        if (local_hash === remote_hash) {
          // Same modifications on both side
          if (local_hash === null) {
            // Deleted on both side, drop signature
            return context._signature_sub_storage.removeAttachment(id, name)
              .push(function () {
                skip_attachment_dict[name] = null;
              });
          }

          return context._signature_sub_storage.putAttachment(id, name,
            JSON.stringify({
              hash: local_hash
            }))
            .push(function () {
              skip_attachment_dict[name] = null;
            });
        }

        if ((remote_hash === status_hash) || (conflict_force === true)) {
          // Modified only locally. No conflict or force
          if (local_hash === null) {
            // Deleted locally
            return propagateAttachmentDeletion(context, skip_attachment_dict,
                                               destination,
                                               id, name);
          }
          return propagateAttachmentModification(context,
                                       skip_attachment_dict,
                                       destination, blob,
                                       local_hash, id, name);
        }

        // Conflict cases
        if (conflict_ignore === true) {
          return;
        }

        if ((conflict_revert === true) || (local_hash === null)) {
          // Automatically resolve conflict or force revert
          if (remote_hash === null) {
            // Deleted remotely
            return propagateAttachmentDeletion(context, skip_attachment_dict,
                                               source, id, name);
          }
          return propagateAttachmentModification(
            context,
            skip_attachment_dict,
            source,
            remote_blob,
            remote_hash,
            id,
            name
          );
        }

        // Minimize conflict if it can be resolved
        if (remote_hash === null) {
          // Copy remote modification remotely
          return propagateAttachmentModification(context,
                                       skip_attachment_dict,
                                       destination, blob,
                                       local_hash, id, name);
        }
        throw new jIO.util.jIOError("Conflict on '" + id +
                                    "' with attachment '" +
                                    name + "'",
                                    409);
      });
  }

  function checkAttachmentSignatureDifference(queue, context,
                                              skip_attachment_dict,
                                              source,
                                              destination, id, name,
                                              conflict_force,
                                              conflict_revert,
                                              conflict_ignore,
                                              is_creation, is_modification) {
    var blob,
      status_hash;
    queue
      .push(function () {
        // Optimisation to save a get call to signature storage
        if (is_creation === true) {
          return RSVP.all([
            source.getAttachment(id, name),
            {hash: null}
          ]);
        }
        if (is_modification === true) {
          return RSVP.all([
            source.getAttachment(id, name),
            context._signature_sub_storage.getAttachment(
              id,
              name,
              {format: 'json'}
            )
          ]);
        }
        throw new jIO.util.jIOError("Unexpected call of"
                                    + " checkAttachmentSignatureDifference",
                                    409);
      })
      .push(function (result_list) {
        blob = result_list[0];
        status_hash = result_list[1].hash;
        return jIO.util.readBlobAsArrayBuffer(blob);
      })
      .push(function (evt) {
        var array_buffer = evt.target.result,
          local_hash = generateHashFromArrayBuffer(array_buffer);

        if (local_hash !== status_hash) {
          return checkAndPropagateAttachment(context,
                                             skip_attachment_dict,
                                             status_hash, local_hash, blob,
                                             source, destination, id, name,
                                             conflict_force, conflict_revert,
                                             conflict_ignore);
        }
      });
  }

  function checkAttachmentLocalDeletion(queue, context,
                              skip_attachment_dict,
                              destination, id, name, source,
                              conflict_force, conflict_revert,
                              conflict_ignore) {
    var status_hash;
    queue
      .push(function () {
        return context._signature_sub_storage.getAttachment(id, name,
                                                            {format: 'json'});
      })
      .push(function (result) {
        status_hash = result.hash;
        return checkAndPropagateAttachment(context,
                                 skip_attachment_dict,
                                 status_hash, null, null,
                                 source, destination, id, name,
                                 conflict_force, conflict_revert,
                                 conflict_ignore);
      });
  }

  function pushDocumentAttachment(context,
                                  skip_attachment_dict, id, source,
                                  destination, signature_allAttachments,
                                  options) {
    var local_dict = {},
      signature_dict = {};
    return source.allAttachments(id)
      .push(undefined, function (error) {
        if ((error instanceof jIO.util.jIOError) &&
            (error.status_code === 404)) {
          return {};
        }
        throw error;
      })
      .push(function (source_allAttachments) {
        var is_modification,
          is_creation,
          key,
          argument_list = [];
        for (key in source_allAttachments) {
          if (source_allAttachments.hasOwnProperty(key)) {
            if (!skip_attachment_dict.hasOwnProperty(key)) {
              local_dict[key] = null;
            }
          }
        }
        for (key in signature_allAttachments) {
          if (signature_allAttachments.hasOwnProperty(key)) {
            if (!skip_attachment_dict.hasOwnProperty(key)) {
              signature_dict[key] = null;
            }
          }
        }

        for (key in local_dict) {
          if (local_dict.hasOwnProperty(key)) {
            is_modification = signature_dict.hasOwnProperty(key)
              && options.check_modification;
            is_creation = !signature_dict.hasOwnProperty(key)
              && options.check_creation;
            if (is_modification === true || is_creation === true) {
              argument_list.push([undefined,
                                  context,
                                  skip_attachment_dict,
                                  source,
                                  destination, id, key,
                                  options.conflict_force,
                                  options.conflict_revert,
                                  options.conflict_ignore,
                                  is_creation,
                                  is_modification]);
            }
          }
        }
        return dispatchQueue(
          context,
          checkAttachmentSignatureDifference,
          argument_list,
          context._parallel_operation_attachment_amount
        );
      })
      .push(function () {
        var key, argument_list = [];
        if (options.check_deletion === true) {
          for (key in signature_dict) {
            if (signature_dict.hasOwnProperty(key)) {
              if (!local_dict.hasOwnProperty(key)) {
                argument_list.push([undefined,
                                             context,
                                             skip_attachment_dict,
                                             destination, id, key,
                                             source,
                                             options.conflict_force,
                                             options.conflict_revert,
                                             options.conflict_ignore]);
              }
            }
          }
          return dispatchQueue(
            context,
            checkAttachmentLocalDeletion,
            argument_list,
            context._parallel_operation_attachment_amount
          );
        }
      });
  }

  function propagateFastAttachmentDeletion(queue, id, name, storage) {
    return queue
      .push(function () {
        return storage.removeAttachment(id, name);
      });
  }

  function propagateFastAttachmentModification(queue, id, key, source,
                                               destination, signature, hash) {
    return queue
      .push(function () {
        return signature.getAttachment(id, key, {format: 'json'})
          .push(undefined, function (error) {
            if ((error instanceof jIO.util.jIOError) &&
                (error.status_code === 404)) {
              return {hash: null};
            }
            throw error;
          })
          .push(function (result) {
            if (result.hash !== hash) {
              return source.getAttachment(id, key)
                .push(function (blob) {
                  return destination.putAttachment(id, key, blob);
                })
                .push(function () {
                  return signature.putAttachment(id, key, JSON.stringify({
                    hash: hash
                  }));
                });
            }
          });

      });
  }

  function repairFastDocumentAttachment(context, id,
                                        signature_hash,
                                        signature_attachment_hash,
                                        signature_from_local) {
    if (signature_hash === signature_attachment_hash) {
      // No replication to do
      return;
    }
    return new RSVP.Queue()
      .push(function () {
        return RSVP.all([
          context._signature_sub_storage.allAttachments(id),
          context._local_sub_storage.allAttachments(id),
          context._remote_sub_storage.allAttachments(id)
        ]);
      })
      .push(function (result_list) {
        var key,
          source_attachment_dict,
          destination_attachment_dict,
          source,
          destination,
          push_argument_list = [],
          delete_argument_list = [],
          signature_attachment_dict = result_list[0],
          local_attachment_dict = result_list[1],
          remote_attachment_list = result_list[2],
          check_local_modification =
            context._check_local_attachment_modification,
          check_local_creation = context._check_local_attachment_creation,
          check_local_deletion = context._check_local_attachment_deletion,
          check_remote_modification =
            context._check_remote_attachment_modification,
          check_remote_creation = context._check_remote_attachment_creation,
          check_remote_deletion = context._check_remote_attachment_deletion;

        if (signature_from_local) {
          source_attachment_dict = local_attachment_dict;
          destination_attachment_dict = remote_attachment_list;
          source = context._local_sub_storage;
          destination = context._remote_sub_storage;
        } else {
          source_attachment_dict = remote_attachment_list;
          destination_attachment_dict = local_attachment_dict;
          source = context._remote_sub_storage;
          destination = context._local_sub_storage;
          check_local_modification = check_remote_modification;
          check_local_creation = check_remote_creation;
          check_local_deletion = check_remote_deletion;
          check_remote_creation = check_local_creation;
          check_remote_deletion = check_local_deletion;
        }

        // Push all source attachments
        for (key in source_attachment_dict) {
          if (source_attachment_dict.hasOwnProperty(key)) {

            if ((check_local_creation &&
                 !signature_attachment_dict.hasOwnProperty(key)) ||
                (check_local_modification &&
                 signature_attachment_dict.hasOwnProperty(key))) {
              push_argument_list.push([
                undefined,
                id,
                key,
                source,
                destination,
                context._signature_sub_storage,
                signature_hash
              ]);
            }
          }
        }

        // Delete remaining signature + remote attachments
        for (key in signature_attachment_dict) {
          if (signature_attachment_dict.hasOwnProperty(key)) {
            if (check_local_deletion &&
                !source_attachment_dict.hasOwnProperty(key)) {
              delete_argument_list.push([
                undefined,
                id,
                key,
                context._signature_sub_storage
              ]);
            }
          }
        }
        for (key in destination_attachment_dict) {
          if (destination_attachment_dict.hasOwnProperty(key)) {
            if (!source_attachment_dict.hasOwnProperty(key)) {
              if ((check_local_deletion &&
                   signature_attachment_dict.hasOwnProperty(key)) ||
                  (check_remote_creation &&
                   !signature_attachment_dict.hasOwnProperty(key))) {
                delete_argument_list.push([
                  undefined,
                  id,
                  key,
                  destination
                ]);
              }
            }
          }
        }

        return RSVP.all([
          dispatchQueue(
            context,
            propagateFastAttachmentModification,
            push_argument_list,
            context._parallel_operation_attachment_amount
          ),
          dispatchQueue(
            context,
            propagateFastAttachmentDeletion,
            delete_argument_list,
            context._parallel_operation_attachment_amount
          )
        ]);
      })
      .push(function () {
        // Mark that all attachments have been synchronized
        return context._signature_sub_storage.put(id, {
          hash: signature_hash,
          attachment_hash: signature_hash,
          from_local: signature_from_local
        });
      });
  }

  function repairDocumentAttachment(context, id, signature_hash_key,
                                    signature_hash,
                                    signature_attachment_hash,
                                    signature_from_local) {
    if (signature_hash_key !== undefined) {
      return repairFastDocumentAttachment(context, id,
                                    signature_hash,
                                    signature_attachment_hash,
                                    signature_from_local);
    }

    var skip_attachment_dict = {};
    return new RSVP.Queue()
      .push(function () {
        if (context._check_local_attachment_modification ||
            context._check_local_attachment_creation ||
            context._check_local_attachment_deletion ||
            context._check_remote_attachment_modification ||
            context._check_remote_attachment_creation ||
            context._check_remote_attachment_deletion) {
          return context._signature_sub_storage.allAttachments(id);
        }
        return {};
      })
      .push(undefined, function (error) {
        if ((error instanceof jIO.util.jIOError) &&
            (error.status_code === 404)) {
          return {};
        }
        throw error;
      })
      .push(function (signature_allAttachments) {
        if (context._check_local_attachment_modification ||
            context._check_local_attachment_creation ||
            context._check_local_attachment_deletion) {
          return pushDocumentAttachment(
            context,
            skip_attachment_dict,
            id,
            context._local_sub_storage,
            context._remote_sub_storage,
            signature_allAttachments,
            {
              conflict_force: (context._conflict_handling ===
                               CONFLICT_KEEP_LOCAL),
              conflict_revert: (context._conflict_handling ===
                                CONFLICT_KEEP_REMOTE),
              conflict_ignore: (context._conflict_handling ===
                                CONFLICT_CONTINUE),
              check_modification:
                context._check_local_attachment_modification,
              check_creation: context._check_local_attachment_creation,
              check_deletion: context._check_local_attachment_deletion
            }
          )
            .push(function () {
              return signature_allAttachments;
            });
        }
        return signature_allAttachments;
      })
      .push(function (signature_allAttachments) {
        if (context._check_remote_attachment_modification ||
            context._check_remote_attachment_creation ||
            context._check_remote_attachment_deletion) {
          return pushDocumentAttachment(
            context,
            skip_attachment_dict,
            id,
            context._remote_sub_storage,
            context._local_sub_storage,
            signature_allAttachments,
            {
              use_revert_post: context._use_remote_post,
              conflict_force: (context._conflict_handling ===
                               CONFLICT_KEEP_REMOTE),
              conflict_revert: (context._conflict_handling ===
                                CONFLICT_KEEP_LOCAL),
              conflict_ignore: (context._conflict_handling ===
                                CONFLICT_CONTINUE),
              check_modification:
                context._check_remote_attachment_modification,
              check_creation: context._check_remote_attachment_creation,
              check_deletion: context._check_remote_attachment_deletion
            }
          );
        }
      });
  }

  function propagateModification(context, source, destination, doc, hash, id,
                                 skip_document_dict,
                                 skip_deleted_document_dict,
                                 options) {
    var result = new RSVP.Queue(),
      post_id,
      to_skip = true,
      from_local;
    if (options === undefined) {
      options = {};
    }
    from_local = options.from_local;

    if (doc === null) {
      result
        .push(function () {
          return source.get(id);
        })
        .push(function (source_doc) {
          doc = source_doc;
        }, function (error) {
          if ((error instanceof jIO.util.jIOError) &&
              (error.status_code === 404)) {
            throw new SkipError(id);
          }
          throw error;
        });
    }
    if (options.use_post) {
      result
        .push(function () {
          return destination.post(doc);
        })
        .push(function (new_id) {
          to_skip = false;
          post_id = new_id;
          return source.put(post_id, doc);
        })
        .push(function () {
          // Copy all attachments
          // This is not related to attachment replication
          // It's just about not losing user data
          return source.allAttachments(id);
        })
        .push(function (attachment_dict) {
          var key,
            copy_queue = new RSVP.Queue();

          function copyAttachment(name) {
            copy_queue
              .push(function () {
                return source.getAttachment(id, name);
              })
              .push(function (blob) {
                return source.putAttachment(post_id, name, blob);
              });
          }

          for (key in attachment_dict) {
            if (attachment_dict.hasOwnProperty(key)) {
              copyAttachment(key);
            }
          }
          return copy_queue;
        })
        .push(function () {
          return source.remove(id);
        })
        .push(function () {
          return context._signature_sub_storage.remove(id);
        })
        .push(function () {
          to_skip = true;
          return context._signature_sub_storage.put(post_id, {
            hash: hash,
            from_local: from_local
          });
        })
        .push(function () {
          skip_document_dict[post_id] = null;
        });
    } else {
      result
        .push(function () {
          // Drop signature if the destination document was empty
          // but a signature exists
          if (options.create_new_document === true) {
            delete skip_deleted_document_dict[id];
            return context._signature_sub_storage.remove(id);
          }
        })
        .push(function () {
          return destination.put(id, doc);
        })
        .push(function () {
          return context._signature_sub_storage.put(id, {
            hash: hash,
            from_local: from_local
          });
        });
    }
    return result
      .push(function () {
        if (to_skip) {
          skip_document_dict[id] = null;
        }
      })
      .push(undefined, function (error) {
        if (error instanceof SkipError) {
          return;
        }
        throw error;
      });
  }

  function propagateDeletion(context, destination, id, skip_document_dict,
                             skip_deleted_document_dict) {
    // Do not delete a document if it has an attachment
    // ie, replication should prevent losing user data
    // Synchronize attachments before, to ensure
    // all of them will be deleted too
    var result;
    if (context._signature_hash_key !== undefined) {
      result = destination.remove(id)
        .push(function () {
          return context._signature_sub_storage.remove(id);
        });
    } else {
      result = repairDocumentAttachment(context, id)
        .push(function () {
          return destination.allAttachments(id);
        })
        .push(function (attachment_dict) {
          if (JSON.stringify(attachment_dict) === "{}") {
            return destination.remove(id)
              .push(function () {
                return context._signature_sub_storage.remove(id);
              });
          }
        }, function (error) {
          if ((error instanceof jIO.util.jIOError) &&
              (error.status_code === 404)) {
            return;
          }
          throw error;
        });
    }
    return result
      .push(function () {
        skip_document_dict[id] = null;
        // No need to sync attachment twice on this document
        skip_deleted_document_dict[id] = null;
      });
  }

  function checkAndPropagate(context, skip_document_dict,
                             skip_deleted_document_dict,
                             cache, destination_key,
                             status_hash, local_hash, doc,
                             source, destination, id,
                             conflict_force, conflict_revert,
                             conflict_ignore,
                             options) {
    var from_local = options.from_local;
    return new RSVP.Queue()
      .push(function () {
        if (options.signature_hash_key !== undefined) {
          return callAllDocsOnStorage(context, destination,
                                      cache, destination_key)
            .push(function (result) {
              if (result.hasOwnProperty(id)) {
                return [null, result[id][options.signature_hash_key]];
              }
              return [null, null];
            });
        }
        return destination.get(id)
          .push(function (remote_doc) {
            return [remote_doc, generateHash(stringify(remote_doc))];
          }, function (error) {
            if ((error instanceof jIO.util.jIOError) &&
                (error.status_code === 404)) {
              return [null, null];
            }
            throw error;
          });
      })

      .push(function (remote_list) {
        var remote_doc = remote_list[0],
          remote_hash = remote_list[1];
        if (local_hash === remote_hash) {
          // Same modifications on both side
          if (local_hash === null) {
            // Deleted on both side, drop signature
            return context._signature_sub_storage.remove(id)
              .push(function () {
                skip_document_dict[id] = null;
              });
          }

          return context._signature_sub_storage.put(id, {
            hash: local_hash,
            from_local: from_local
          })
            .push(function () {
              skip_document_dict[id] = null;
            });
        }

        if ((remote_hash === status_hash) || (conflict_force === true)) {
          // Modified only locally. No conflict or force
          if (local_hash === null) {
            // Deleted locally
            return propagateDeletion(context, destination, id,
                                     skip_document_dict,
                                     skip_deleted_document_dict);
          }
          return propagateModification(context, source, destination, doc,
                                       local_hash, id, skip_document_dict,
                                       skip_deleted_document_dict,
                                       {use_post: ((options.use_post) &&
                                                   (remote_hash === null)),
                                        from_local: from_local,
                                        create_new_document:
                                          ((remote_hash === null) &&
                                           (status_hash !== null))
                                        });
        }

        // Conflict cases
        if (conflict_ignore === true) {
          return;
        }

        if ((conflict_revert === true) || (local_hash === null)) {
          // Automatically resolve conflict or force revert
          if (remote_hash === null) {
            // Deleted remotely
            return propagateDeletion(context, source, id, skip_document_dict,
                                     skip_deleted_document_dict);
          }
          return propagateModification(
            context,
            destination,
            source,
            remote_doc,
            remote_hash,
            id,
            skip_document_dict,
            skip_deleted_document_dict,
            {use_post: ((options.use_revert_post) &&
                        (local_hash === null)),
              from_local: !from_local,
              create_new_document: ((local_hash === null) &&
                                    (status_hash !== null))}
          );
        }

        // Minimize conflict if it can be resolved
        if (remote_hash === null) {
          // Copy remote modification remotely
          return propagateModification(context, source, destination, doc,
                                       local_hash, id, skip_document_dict,
                                       skip_deleted_document_dict,
                                       {use_post: options.use_post,
                                        from_local: from_local,
                                        create_new_document:
                                          (status_hash !== null)});
        }
        doc = doc || local_hash;
        remote_doc = remote_doc || remote_hash;
        throw new jIO.util.jIOError("Conflict on '" + id + "': " +
                                    stringify(doc) + " !== " +
                                    stringify(remote_doc),
                                    409);
      });
  }

  function checkLocalDeletion(queue, context, skip_document_dict,
                              skip_deleted_document_dict,
                              cache, destination_key,
                              destination, id, source,
                              conflict_force, conflict_revert,
                              conflict_ignore, options) {
    var status_hash;
    queue
      .push(function () {
        return context._signature_sub_storage.get(id);
      })
      .push(function (result) {
        status_hash = result.hash;
        return checkAndPropagate(context, skip_document_dict,
                                 skip_deleted_document_dict,
                                 cache, destination_key,
                                 status_hash, null, null,
                                 source, destination, id,
                                 conflict_force, conflict_revert,
                                 conflict_ignore,
                                 options);
      });
  }

  function checkSignatureDifference(queue, context, skip_document_dict,
                                    skip_deleted_document_dict,
                                    cache, destination_key,
                                    source, destination, id,
                                    conflict_force, conflict_revert,
                                    conflict_ignore,
                                    local_hash, status_hash,
                                    options) {
    queue
      .push(function () {
        if (local_hash === null) {
          // Hash was not provided by the allDocs query
          return source.get(id);
        }
        return null;
      })
      .push(function (doc) {
        if (local_hash === null) {
          // Hash was not provided by the allDocs query
          local_hash = generateHash(stringify(doc));
        }

        if (local_hash !== status_hash) {
          return checkAndPropagate(context, skip_document_dict,
                                   skip_deleted_document_dict,
                                   cache, destination_key,
                                   status_hash, local_hash, doc,
                                   source, destination, id,
                                   conflict_force, conflict_revert,
                                   conflict_ignore,
                                   options);
        }
      });
  }

  function pushStorage(context, skip_document_dict,
                       skip_deleted_document_dict,
                       cache, source_key, destination_key,
                       source, destination, signature_allDocs, options) {
    var argument_list = [],
      argument_list_deletion = [];
    if (!options.hasOwnProperty("use_post")) {
      options.use_post = false;
    }
    if (!options.hasOwnProperty("use_revert_post")) {
      options.use_revert_post = false;
    }
    return callAllDocsOnStorage(context, source, cache, source_key)
      .push(function (source_allDocs) {
        var i,
          local_dict = {},
          signature_dict = {},
          is_modification,
          is_creation,
          status_hash,
          local_hash,
          key,
          queue = new RSVP.Queue();
        for (key in source_allDocs) {
          if (source_allDocs.hasOwnProperty(key)) {
            if (!skip_document_dict.hasOwnProperty(key)) {
              local_dict[key] = source_allDocs[key];
            }
          }
        }
        /*
        for (i = 0; i < source_allDocs.data.total_rows; i += 1) {
          if (!skip_document_dict.hasOwnProperty(
              source_allDocs.data.rows[i].id
            )) {
            local_dict[source_allDocs.data.rows[i].id] =
              source_allDocs.data.rows[i].value;
          }
        }
        */
        for (i = 0; i < signature_allDocs.data.total_rows; i += 1) {
          if (!skip_document_dict.hasOwnProperty(
              signature_allDocs.data.rows[i].id
            )) {
            signature_dict[signature_allDocs.data.rows[i].id] =
              signature_allDocs.data.rows[i].value.hash;
          }
        }
        for (key in local_dict) {
          if (local_dict.hasOwnProperty(key)) {
            is_modification = signature_dict.hasOwnProperty(key)
              && options.check_modification;
            is_creation = !signature_dict.hasOwnProperty(key)
              && options.check_creation;

            if (is_creation === true) {
              status_hash = null;
            } else if (is_modification === true) {
              status_hash = signature_dict[key];
            }

            local_hash = null;
            if (options.signature_hash_key !== undefined) {
              local_hash = local_dict[key][options.signature_hash_key];
              if (is_modification === true) {
                // Bypass fetching all documents and calculating the sha
                // Compare the select list values returned by allDocs calls
                is_modification = false;
                if (local_hash !== status_hash) {
                  is_modification = true;
                }
              }
            }

            if (is_modification === true || is_creation === true) {
              argument_list.push([undefined, context, skip_document_dict,
                                  skip_deleted_document_dict,
                                  cache, destination_key,
                                  source, destination,
                                  key,
                                  options.conflict_force,
                                  options.conflict_revert,
                                  options.conflict_ignore,
                                  local_hash, status_hash,
                                  options]);
            }
          }
        }
        queue
          .push(function () {
            return dispatchQueue(
              context,
              checkSignatureDifference,
              argument_list,
              options.operation_amount
            );
          });
        for (key in signature_dict) {
          if (signature_dict.hasOwnProperty(key)) {
            if (!local_dict.hasOwnProperty(key)) {
              if (options.check_deletion === true) {
                argument_list_deletion.push([undefined,
                                             context,
                                             skip_document_dict,
                                             skip_deleted_document_dict,
                                             cache, destination_key,
                                             destination, key,
                                             source,
                                             options.conflict_force,
                                             options.conflict_revert,
                                             options.conflict_ignore,
                                             options]);
              } else {
                skip_deleted_document_dict[key] = null;
              }
            }
          }
        }
        if (argument_list_deletion.length !== 0) {
          queue.push(function () {
            return dispatchQueue(
              context,
              checkLocalDeletion,
              argument_list_deletion,
              options.operation_amount
            );
          });
        }
        return queue;
      });
  }

  function repairDocument(queue, context, id, signature_hash_key,
                          signature_hash, signature_attachment_hash,
                          signature_from_local) {
    queue.push(function () {
      return repairDocumentAttachment(context, id, signature_hash_key,
                                      signature_hash,
                                      signature_attachment_hash,
                                      signature_from_local);
    });
  }

  ReplicateStorage.prototype.repair = function () {
    var context = this,
      argument_list = arguments,
      skip_document_dict = {},
      skip_deleted_document_dict = {},
      cache = {};

    return new RSVP.Queue()
      .push(function () {
        // Ensure that the document storage is usable
        if (context._custom_signature_sub_storage === false) {
          // Do not sync the signature document
          skip_document_dict[context._signature_hash] = null;

          return context._signature_sub_storage.__storage._sub_storage
                                               .__storage._sub_storage.get(
              context._signature_hash
            );
        }
      })
      .push(undefined, function (error) {
        if ((error instanceof jIO.util.jIOError) &&
            (error.status_code === 404)) {
          return context._signature_sub_storage.__storage._sub_storage
                                               .__storage._sub_storage.put(
              context._signature_hash,
              {}
            );
        }
        throw error;
      })

      .push(function () {
        return RSVP.all([
// Don't repair local_sub_storage twice
//           context._signature_sub_storage.repair.apply(
//             context._signature_sub_storage,
//             argument_list
//           ),
          context._local_sub_storage.repair.apply(
            context._local_sub_storage,
            argument_list
          ),
          context._remote_sub_storage.repair.apply(
            context._remote_sub_storage,
            argument_list
          )
        ]);
      })

      .push(function () {
        if (context._check_local_modification ||
            context._check_local_creation ||
            context._check_local_deletion ||
            context._check_remote_modification ||
            context._check_remote_creation ||
            context._check_remote_deletion) {
          return context._signature_sub_storage.allDocs({
            select_list: ['hash']
          });
        }
      })

      .push(function (signature_allDocs) {
        if (context._check_local_modification ||
            context._check_local_creation ||
            context._check_local_deletion) {
          return pushStorage(context, skip_document_dict,
                             skip_deleted_document_dict,
                             cache, 'local', 'remote',
                             context._local_sub_storage,
                             context._remote_sub_storage,
                             signature_allDocs,
                             {
              use_post: context._use_remote_post,
              conflict_force: (context._conflict_handling ===
                               CONFLICT_KEEP_LOCAL),
              conflict_revert: (context._conflict_handling ===
                                CONFLICT_KEEP_REMOTE),
              conflict_ignore: (context._conflict_handling ===
                                CONFLICT_CONTINUE),
              check_modification: context._check_local_modification,
              check_creation: context._check_local_creation,
              check_deletion: context._check_local_deletion,
              operation_amount: context._parallel_operation_amount,
              signature_hash_key: context._signature_hash_key,
              from_local: true
            })
              .push(function () {
              return signature_allDocs;
            });
        }
        return signature_allDocs;
      })
      .push(function (signature_allDocs) {
        if (context._check_remote_modification ||
            context._check_remote_creation ||
            context._check_remote_deletion) {
          return pushStorage(context, skip_document_dict,
                             skip_deleted_document_dict,
                             cache, 'remote', 'local',
                             context._remote_sub_storage,
                             context._local_sub_storage,
                             signature_allDocs, {
              use_revert_post: context._use_remote_post,
              conflict_force: (context._conflict_handling ===
                               CONFLICT_KEEP_REMOTE),
              conflict_revert: (context._conflict_handling ===
                                CONFLICT_KEEP_LOCAL),
              conflict_ignore: (context._conflict_handling ===
                                CONFLICT_CONTINUE),
              check_modification: context._check_remote_modification,
              check_creation: context._check_remote_creation,
              check_deletion: context._check_remote_deletion,
              operation_amount: context._parallel_operation_amount,
              signature_hash_key: context._signature_hash_key,
              from_local: false
            });
        }
      })
      .push(function () {
        if (context._check_local_attachment_modification ||
            context._check_local_attachment_creation ||
            context._check_local_attachment_deletion ||
            context._check_remote_attachment_modification ||
            context._check_remote_attachment_creation ||
            context._check_remote_attachment_deletion) {
          // Attachments are synchronized if and only if their parent document
          // has been also marked as synchronized.
          return context._signature_sub_storage.allDocs({
            select_list: ['hash', 'attachment_hash', 'from_local']
          })
            .push(function (result) {
              var i,
                local_argument_list = [],
                row,
                len = result.data.total_rows;

              for (i = 0; i < len; i += 1) {
                row = result.data.rows[i];
                // Do not synchronize attachment if one version of the document
                // is deleted but not pushed to the other storage
                if (!skip_deleted_document_dict.hasOwnProperty(row.id)) {
                  local_argument_list.push(
                    [undefined, context, row.id, context._signature_hash_key,
                      row.value.hash, row.value.attachment_hash,
                      row.value.from_local]
                  );
                }
              }
              return dispatchQueue(
                context,
                repairDocument,
                local_argument_list,
                context._parallel_operation_amount
              );
            });
        }
      });
  };

  jIO.addStorage('replicate', ReplicateStorage);

}(jIO, RSVP, Rusha, jIO.util.stringify));
;/*
 * Copyright 2015, Nexedi SA
 * Released under the LGPL license.
 * http://www.gnu.org/licenses/lgpl.html
 */

/*jslint nomen: true*/
/*global Rusha*/

/**
 * JIO Sha Storage. Type = 'sha'.
 */

(function (Rusha) {
  "use strict";

  var rusha = new Rusha();

  function ShaStorage(spec) {
    this._sub_storage = jIO.createJIO(spec.sub_storage);
  }

  ShaStorage.prototype.post = function (param) {
    return this._sub_storage.put(
      rusha.digestFromString(JSON.stringify(param)),
      param
    );
  };

  ShaStorage.prototype.get = function () {
    return this._sub_storage.get.apply(this._sub_storage, arguments);
  };
  ShaStorage.prototype.remove = function () {
    return this._sub_storage.remove.apply(this._sub_storage, arguments);
  };
  ShaStorage.prototype.hasCapacity = function () {
    return this._sub_storage.hasCapacity.apply(this._sub_storage, arguments);
  };
  ShaStorage.prototype.buildQuery = function () {
    return this._sub_storage.buildQuery.apply(this._sub_storage, arguments);
  };
  ShaStorage.prototype.getAttachment = function () {
    return this._sub_storage.getAttachment.apply(this._sub_storage, arguments);
  };
  ShaStorage.prototype.putAttachment = function () {
    return this._sub_storage.putAttachment.apply(this._sub_storage, arguments);
  };
  ShaStorage.prototype.removeAttachment = function () {
    return this._sub_storage.removeAttachment.apply(this._sub_storage,
                                                    arguments);
  };
  ShaStorage.prototype.allAttachments = function () {
    return this._sub_storage.allAttachments.apply(this._sub_storage, arguments);
  };
  ShaStorage.prototype.repair = function () {
    return this._sub_storage.repair.apply(this._sub_storage, arguments);
  };

  jIO.addStorage('sha', ShaStorage);

}(Rusha));
;/*jslint nomen: true*/
(function (jIO) {
  "use strict";

  /**
   * The jIO UUIDStorage extension
   *
   * @class UUIDStorage
   * @constructor
   */
  function UUIDStorage(spec) {
    this._sub_storage = jIO.createJIO(spec.sub_storage);
  }

  UUIDStorage.prototype.get = function () {
    return this._sub_storage.get.apply(this._sub_storage, arguments);
  };
  UUIDStorage.prototype.allAttachments = function () {
    return this._sub_storage.allAttachments.apply(this._sub_storage, arguments);
  };
  UUIDStorage.prototype.post = function (param) {

    function S4() {
      return ('0000' + Math.floor(
        Math.random() * 0x10000 /* 65536 */
      ).toString(16)).slice(-4);
    }

    var id = S4() + S4() + "-" +
      S4() + "-" +
      S4() + "-" +
      S4() + "-" +
      S4() + S4() + S4();

    return this.put(id, param);
  };
  UUIDStorage.prototype.put = function () {
    return this._sub_storage.put.apply(this._sub_storage, arguments);
  };
  UUIDStorage.prototype.remove = function () {
    return this._sub_storage.remove.apply(this._sub_storage, arguments);
  };
  UUIDStorage.prototype.getAttachment = function () {
    return this._sub_storage.getAttachment.apply(this._sub_storage, arguments);
  };
  UUIDStorage.prototype.putAttachment = function () {
    return this._sub_storage.putAttachment.apply(this._sub_storage, arguments);
  };
  UUIDStorage.prototype.removeAttachment = function () {
    return this._sub_storage.removeAttachment.apply(this._sub_storage,
                                                    arguments);
  };
  UUIDStorage.prototype.repair = function () {
    return this._sub_storage.repair.apply(this._sub_storage, arguments);
  };
  UUIDStorage.prototype.hasCapacity = function (name) {
    return this._sub_storage.hasCapacity(name);
  };
  UUIDStorage.prototype.buildQuery = function () {
    return this._sub_storage.buildQuery.apply(this._sub_storage,
                                              arguments);
  };

  jIO.addStorage('uuid', UUIDStorage);

}(jIO));
;/*
 * Copyright 2013, Nexedi SA
 * Released under the LGPL license.
 * http://www.gnu.org/licenses/lgpl.html
 */

/*jslint nomen: true*/
/*global jIO, RSVP*/

/**
 * JIO Memory Storage. Type = 'memory'.
 * Memory browser "database" storage.
 *
 * Storage Description:
 *
 *     {
 *       "type": "memory"
 *     }
 *
 * @class MemoryStorage
 */

(function (jIO, JSON, RSVP) {
  "use strict";

  /**
   * The JIO MemoryStorage extension
   *
   * @class MemoryStorage
   * @constructor
   */
  function MemoryStorage() {
    this._database = {};
  }

  MemoryStorage.prototype.put = function (id, metadata) {
    if (!this._database.hasOwnProperty(id)) {
      this._database[id] = {
        attachments: {}
      };
    }
    this._database[id].doc = JSON.stringify(metadata);
    return id;
  };

  MemoryStorage.prototype.get = function (id) {
    try {
      return JSON.parse(this._database[id].doc);
    } catch (error) {
      if (error instanceof TypeError) {
        throw new jIO.util.jIOError(
          "Cannot find document: " + id,
          404
        );
      }
      throw error;
    }
  };

  MemoryStorage.prototype.allAttachments = function (id) {
    var key,
      attachments = {};
    try {
      for (key in this._database[id].attachments) {
        if (this._database[id].attachments.hasOwnProperty(key)) {
          attachments[key] = {};
        }
      }
    } catch (error) {
      if (error instanceof TypeError) {
        throw new jIO.util.jIOError(
          "Cannot find document: " + id,
          404
        );
      }
      throw error;
    }
    return attachments;
  };

  MemoryStorage.prototype.remove = function (id) {
    delete this._database[id];
    return id;
  };

  MemoryStorage.prototype.getAttachment = function (id, name) {
    try {
      var result = this._database[id].attachments[name];
      if (result === undefined) {
        throw new jIO.util.jIOError(
          "Cannot find attachment: " + id + " , " + name,
          404
        );
      }
      return jIO.util.dataURItoBlob(result);
    } catch (error) {
      if (error instanceof TypeError) {
        throw new jIO.util.jIOError(
          "Cannot find attachment: " + id + " , " + name,
          404
        );
      }
      throw error;
    }
  };

  MemoryStorage.prototype.putAttachment = function (id, name, blob) {
    var attachment_dict;
    try {
      attachment_dict = this._database[id].attachments;
    } catch (error) {
      if (error instanceof TypeError) {
        throw new jIO.util.jIOError("Cannot find document: " + id, 404);
      }
      throw error;
    }
    return new RSVP.Queue()
      .push(function () {
        return jIO.util.readBlobAsDataURL(blob);
      })
      .push(function (evt) {
        attachment_dict[name] = evt.target.result;
      });
  };

  MemoryStorage.prototype.removeAttachment = function (id, name) {
    try {
      delete this._database[id].attachments[name];
    } catch (error) {
      if (error instanceof TypeError) {
        throw new jIO.util.jIOError(
          "Cannot find document: " + id,
          404
        );
      }
      throw error;
    }
  };


  MemoryStorage.prototype.hasCapacity = function (name) {
    return ((name === "list") || (name === "include"));
  };

  MemoryStorage.prototype.buildQuery = function (options) {
    var rows = [],
      i;
    for (i in this._database) {
      if (this._database.hasOwnProperty(i)) {
        if (options.include_docs === true) {
          rows.push({
            id: i,
            value: {},
            doc: JSON.parse(this._database[i].doc)
          });
        } else {
          rows.push({
            id: i,
            value: {}
          });
        }

      }
    }
    return rows;
  };

  jIO.addStorage('memory', MemoryStorage);

}(jIO, JSON, RSVP));
;/*jslint nomen: true*/
/*global RSVP, Blob, LZString, DOMException*/
(function (RSVP, Blob, LZString, DOMException) {
  "use strict";

  /**
   * The jIO ZipStorage extension
   *
   * @class ZipStorage
   * @constructor
   */

  var MIME_TYPE = "application/x-jio-utf16_lz_string";

  function ZipStorage(spec) {
    this._sub_storage = jIO.createJIO(spec.sub_storage);
  }

  ZipStorage.prototype.get = function () {
    return this._sub_storage.get.apply(this._sub_storage,
                                        arguments);
  };

  ZipStorage.prototype.post = function () {
    return this._sub_storage.post.apply(this._sub_storage,
                                        arguments);
  };

  ZipStorage.prototype.put = function () {
    return this._sub_storage.put.apply(this._sub_storage,
                                       arguments);
  };

  ZipStorage.prototype.remove = function () {
    return this._sub_storage.remove.apply(this._sub_storage,
                                          arguments);
  };

  ZipStorage.prototype.hasCapacity = function () {
    return this._sub_storage.hasCapacity.apply(this._sub_storage,
                                               arguments);
  };

  ZipStorage.prototype.buildQuery = function () {
    return this._sub_storage.buildQuery.apply(this._sub_storage,
                                              arguments);
  };

  ZipStorage.prototype.getAttachment = function (id, name) {
    var that = this;
    return that._sub_storage.getAttachment(id, name)
      .push(function (blob) {
        if (blob.type !== MIME_TYPE) {
          return blob;
        }
        return new RSVP.Queue()
          .push(function () {
            return jIO.util.readBlobAsText(blob, 'utf16');
          })
          .push(function (evt) {
            var result =
              LZString.decompressFromUTF16(evt.target.result);
            if (result === '') {
              return blob;
            }
            try {
              return jIO.util.dataURItoBlob(
                result
              );
            } catch (error) {
              if (error instanceof DOMException) {
                return blob;
              }
              throw error;
            }
          });
      });
  };

  function myEndsWith(str, query) {
    return (str.indexOf(query) === str.length - query.length);
  }

  ZipStorage.prototype.putAttachment = function (id, name, blob) {
    var that = this;
    if ((blob.type.indexOf("text/") === 0) || myEndsWith(blob.type, "xml") ||
        myEndsWith(blob.type, "json")) {
      return new RSVP.Queue()
        .push(function () {
          return jIO.util.readBlobAsDataURL(blob);
        })
        .push(function (data) {
          var result = LZString.compressToUTF16(data.target.result);
          blob = new Blob([result],
                          {type: MIME_TYPE});
          return that._sub_storage.putAttachment(id, name, blob);
        });
    }
    return this._sub_storage.putAttachment.apply(this._sub_storage,
                                                 arguments);
  };

  ZipStorage.prototype.removeAttachment = function () {
    return this._sub_storage.removeAttachment.apply(this._sub_storage,
                                                    arguments);
  };

  ZipStorage.prototype.allAttachments = function () {
    return this._sub_storage.allAttachments.apply(this._sub_storage,
                                                  arguments);
  };

  jIO.addStorage('zip', ZipStorage);
}(RSVP, Blob, LZString, DOMException));
;/*
 * Copyright 2013, Nexedi SA
 * Released under the LGPL license.
 * http://www.gnu.org/licenses/lgpl.html
 */
/**
 * JIO Dropbox Storage. Type = "dropbox".
 * Dropbox "database" storage.
 */
/*global Blob, jIO, RSVP, UriTemplate*/
/*jslint nomen: true*/

(function (jIO, RSVP, Blob, UriTemplate) {
  "use strict";
  var UPLOAD_URL = "https://content.dropboxapi.com/1/files_put/" +
      "{+root}{+id}{+name}{?access_token}",
    upload_template = UriTemplate.parse(UPLOAD_URL),
    CREATE_DIR_URL = "https://api.dropboxapi.com/1/fileops/create_folder" +
      "{?access_token,root,path}",
    create_dir_template = UriTemplate.parse(CREATE_DIR_URL),
    REMOVE_URL = "https://api.dropboxapi.com/1/fileops/delete/" +
      "{?access_token,root,path}",
    remote_template = UriTemplate.parse(REMOVE_URL),
    GET_URL = "https://content.dropboxapi.com/1/files" +
      "{/root,id}{+name}{?access_token}",
    get_template = UriTemplate.parse(GET_URL),
    //LIST_URL = 'https://api.dropboxapi.com/1/metadata/sandbox/';
    METADATA_URL = "https://api.dropboxapi.com/1/metadata" +
      "{/root}{+id}{?access_token}",
    metadata_template = UriTemplate.parse(METADATA_URL);

  function restrictDocumentId(id) {
    if (id.indexOf("/") !== 0) {
      throw new jIO.util.jIOError("id " + id + " is forbidden (no begin /)",
                                  400);
    }
    if (id.lastIndexOf("/") !== (id.length - 1)) {
      throw new jIO.util.jIOError("id " + id + " is forbidden (no end /)",
                                  400);
    }
    return id;
  }

  function restrictAttachmentId(id) {
    if (id.indexOf("/") !== -1) {
      throw new jIO.util.jIOError("attachment " + id + " is forbidden",
                                  400);
    }
  }

  /**
   * The JIO Dropbox Storage extension
   *
   * @class DropboxStorage
   * @constructor
   */
  function DropboxStorage(spec) {
    if (typeof spec.access_token !== 'string' || !spec.access_token) {
      throw new TypeError("Access Token' must be a string " +
                          "which contains more than one character.");
    }
    if (typeof spec.root !== 'string' || !spec.root ||
        (spec.root !== "dropbox" && spec.root !== "sandbox")) {
      throw new TypeError("root must be 'dropbox' or 'sandbox'");
    }
    this._access_token = spec.access_token;
    this._root = spec.root;
  }

  DropboxStorage.prototype.put = function (id, param) {
    var that = this;
    id = restrictDocumentId(id);
    if (Object.getOwnPropertyNames(param).length > 0) {
      // Reject if param has some properties
      throw new jIO.util.jIOError("Can not store properties: " +
                                  Object.getOwnPropertyNames(param), 400);
    }
    return new RSVP.Queue()
      .push(function () {
        return jIO.util.ajax({
          type: "POST",
          url: create_dir_template.expand({
            access_token: that._access_token,
            root: that._root,
            path: id
          })
        });
      })
      .push(undefined, function (err) {
        if ((err.target !== undefined) &&
            (err.target.status === 405)) {
          // Directory already exists, no need to fail
          return;
        }
        throw err;
      });
  };

  DropboxStorage.prototype.remove = function (id) {
    id = restrictDocumentId(id);
    return jIO.util.ajax({
      type: "POST",
      url: remote_template.expand({
        access_token: this._access_token,
        root: this._root,
        path: id
      })
    });
  };

  DropboxStorage.prototype.get = function (id) {
    var that = this;

    if (id === "/") {
      return {};
    }
    id = restrictDocumentId(id);

    return new RSVP.Queue()
      .push(function () {
        return jIO.util.ajax({
          type: "GET",
          url: metadata_template.expand({
            access_token: that._access_token,
            root: that._root,
            id: id
          })
        });
      })
      .push(function (evt) {
        var obj = JSON.parse(evt.target.response ||
                             evt.target.responseText);
        if (obj.is_dir) {
          return {};
        }
        throw new jIO.util.jIOError("Not a directory: " + id, 404);
      }, function (error) {
        if (error.target !== undefined && error.target.status === 404) {
          throw new jIO.util.jIOError("Cannot find document: " + id, 404);
        }
        throw error;
      });
  };

  DropboxStorage.prototype.allAttachments = function (id) {

    var that = this;
    id = restrictDocumentId(id);

    return new RSVP.Queue()
      .push(function () {
        return jIO.util.ajax({
          type: "GET",
          url: metadata_template.expand({
            access_token: that._access_token,
            root: that._root,
            id: id
          })
        });
      })
      .push(function (evt) {
        var obj = JSON.parse(evt.target.response || evt.target.responseText),
          i,
          result = {};
        if (!obj.is_dir) {
          throw new jIO.util.jIOError("Not a directory: " + id, 404);
        }
        for (i = 0; i < obj.contents.length; i += 1) {
          if (!obj.contents[i].is_dir) {
            result[obj.contents[i].path.split("/").pop()] = {};
          }
        }
        return result;
      }, function (error) {
        if (error.target !== undefined && error.target.status === 404) {
          throw new jIO.util.jIOError("Cannot find document: " + id, 404);
        }
        throw error;
      });
  };

  //currently, putAttachment will fail with files larger than 150MB,
  //due to the Dropbox API. the API provides the "chunked_upload" method
  //to pass this limit, but upload process becomes more complex to implement.
  //
  //putAttachment will also create a folder if you try to put an attachment
  //to an inexisting foler.

  DropboxStorage.prototype.putAttachment = function (id, name, blob) {
    id = restrictDocumentId(id);
    restrictAttachmentId(name);

    return jIO.util.ajax({
      type: "PUT",
      url: upload_template.expand({
        root: this._root,
        id: id,
        name: name,
        access_token: this._access_token
      }),
      dataType: blob.type,
      data: blob
    });
  };

  DropboxStorage.prototype.getAttachment = function (id, name) {
    var that = this;

    id = restrictDocumentId(id);
    restrictAttachmentId(name);

    return new RSVP.Queue()
      .push(function () {
        return jIO.util.ajax({
          type: "GET",
          dataType: "blob",
          url: get_template.expand({
            root: that._root,
            id: id,
            name: name,
            access_token: that._access_token
          })
        });
      })
      .push(function (evt) {
        return new Blob(
          [evt.target.response || evt.target.responseText],
          {"type": evt.target.getResponseHeader('Content-Type') ||
            "application/octet-stream"}
        );
      }, function (error) {
        if (error.target !== undefined && error.target.status === 404) {
          throw new jIO.util.jIOError("Cannot find attachment: " +
                                      id + ", " + name, 404);
        }
        throw error;
      });
  };

  //removeAttachment removes also directories.(due to Dropbox API)

  DropboxStorage.prototype.removeAttachment = function (id, name) {
    var that = this;
    id = restrictDocumentId(id);
    restrictAttachmentId(name);

    return new RSVP.Queue()
      .push(function () {
        return jIO.util.ajax({
          type: "POST",
          url: remote_template.expand({
            access_token: that._access_token,
            root: that._root,
            path: id + name
          })
        });
      }).push(undefined, function (error) {
        if (error.target !== undefined && error.target.status === 404) {
          throw new jIO.util.jIOError("Cannot find attachment: " +
                                      id + ", " + name, 404);
        }
        throw error;
      });
  };

  jIO.addStorage('dropbox', DropboxStorage);

}(jIO, RSVP, Blob, UriTemplate));
;/*
 * Copyright 2013, Nexedi SA
 * Released under the LGPL license.
 * http://www.gnu.org/licenses/lgpl.html
 */

/*jslint nomen: true*/
/*global jIO, RSVP, DOMParser, Blob */

// JIO Dav Storage Description :
// {
//   type: "dav",
//   url: {string},
//   basic_login: {string} // Basic authentication
// }

// NOTE: to get the authentication type ->
// curl --verbose  -X OPTION http://domain/
// In the headers: "WWW-Authenticate: Basic realm="DAV-upload"

(function (jIO, RSVP, DOMParser, Blob) {
  "use strict";

  function ajax(storage, options) {
    if (options === undefined) {
      options = {};
    }
    if (storage._authorization !== undefined) {
      if (options.headers === undefined) {
        options.headers = {};
      }
      options.headers.Authorization = storage._authorization;
    }

    if (storage._with_credentials !== undefined) {
      if (options.xhrFields === undefined) {
        options.xhrFields = {};
      }
      options.xhrFields.withCredentials = storage._with_credentials;
    }
//       if (start !== undefined) {
//         if (end !== undefined) {
//           headers.Range = "bytes=" + start + "-" + end;
//         } else {
//           headers.Range = "bytes=" + start + "-";
//         }
//       }
    return new RSVP.Queue()
      .push(function () {
        return jIO.util.ajax(options);
      });
  }

  function restrictDocumentId(id) {
    if (id.indexOf("/") !== 0) {
      throw new jIO.util.jIOError("id " + id + " is forbidden (no begin /)",
                                  400);
    }
    if (id.lastIndexOf("/") !== (id.length - 1)) {
      throw new jIO.util.jIOError("id " + id + " is forbidden (no end /)",
                                  400);
    }
    return id;
  }

  function restrictAttachmentId(id) {
    if (id.indexOf("/") !== -1) {
      throw new jIO.util.jIOError("attachment " + id + " is forbidden",
                                  400);
    }
  }

  /**
   * The JIO WebDAV Storage extension
   *
   * @class DavStorage
   * @constructor
   */
  function DavStorage(spec) {
    if (typeof spec.url !== 'string') {
      throw new TypeError("DavStorage 'url' is not of type string");
    }
    this._url = spec.url;
    // XXX digest login
    if (typeof spec.basic_login === 'string') {
      this._authorization = "Basic " + spec.basic_login;
    }
    this._with_credentials = spec.with_credentials;
  }

  DavStorage.prototype.put = function (id, param) {
    var that = this;
    id = restrictDocumentId(id);
    if (Object.getOwnPropertyNames(param).length > 0) {
      // Reject if param has some properties
      throw new jIO.util.jIOError("Can not store properties: " +
                                  Object.getOwnPropertyNames(param), 400);
    }
    return new RSVP.Queue()
      .push(function () {
        return ajax(that, {
          type: "MKCOL",
          url: that._url + id
        });
      })
      .push(undefined, function (err) {
        if ((err.target !== undefined) &&
            (err.target.status === 405)) {
          return;
        }
        throw err;
      });
  };

  DavStorage.prototype.remove = function (id) {
    id = restrictDocumentId(id);
    return ajax(this, {
      type: "DELETE",
      url: this._url + id
    });
  };

  DavStorage.prototype.get = function (id) {
    var context = this;
    id = restrictDocumentId(id);

    return new RSVP.Queue()
      .push(function () {
        return ajax(context, {
          type: "PROPFIND",
          url: context._url + id,
          dataType: "text",
          headers: {
            // Increasing this value is a performance killer
            Depth: "1"
          }
        });
      })
      .push(function () {
        return {};
      }, function (error) {
        if ((error.target !== undefined) &&
            (error.target.status === 404)) {
          throw new jIO.util.jIOError("Cannot find document", 404);
        }
        throw error;
      });
  };

  DavStorage.prototype.allAttachments = function (id) {

    var context = this;
    id = restrictDocumentId(id);

    return new RSVP.Queue()
      .push(function () {
        return ajax(context, {
          type: "PROPFIND",
          url: context._url + id,
          dataType: "text",
          headers: {
            // Increasing this value is a performance killer
            Depth: "1"
          }
        });
      })


      .push(function (response) {
        // Extract all meta informations and return them to JSON

        var i,
          attachment = {},
          id,
          attachment_list = new DOMParser().parseFromString(
            response.target.responseText,
            "text/xml"
          ).querySelectorAll(
            "D\\:response, response"
          );

        // exclude parent folder and browse
        for (i = 1; i < attachment_list.length; i += 1) {
          // XXX Only get files for now
          id = attachment_list[i].querySelector("D\\:href, href").
            textContent.split('/').slice(-1)[0];
          // XXX Ugly
          if ((id !== undefined) && (id !== "")) {
            attachment[id] = {};
          }
        }
        return attachment;

      }, function (error) {
        if ((error.target !== undefined) &&
            (error.target.status === 404)) {
          throw new jIO.util.jIOError("Cannot find document", 404);
        }
        throw error;
      });

  };


  DavStorage.prototype.putAttachment = function (id, name, blob) {
    var that = this;
    id = restrictDocumentId(id);
    restrictAttachmentId(name);

    return new RSVP.Queue()
      .push(function () {
        return ajax(that, {
          type: "PUT",
          url: that._url + id + name,
          data: blob
        });
      })
      .push(undefined, function (error) {
        if (error.target.status === 403 || error.target.status === 424) {
          throw new jIO.util.jIOError("Cannot access subdocument", 404);
        }
        throw error;
      });
  };

  DavStorage.prototype.getAttachment = function (id, name) {
    var context = this;
    id = restrictDocumentId(id);
    restrictAttachmentId(name);

    return new RSVP.Queue()
      .push(function () {
        return ajax(context, {
          type: "GET",
          url: context._url + id + name,
          dataType: "blob"
        });
      })
      .push(function (response) {
        return new Blob(
          [response.target.response || response.target.responseText],
          {"type": response.target.getResponseHeader('Content-Type') ||
                   "application/octet-stream"}
        );
      }, function (error) {
        if ((error.target !== undefined) &&
            (error.target.status === 404)) {
          throw new jIO.util.jIOError("Cannot find attachment: "
                                      + id + " , " + name,
                                      404);
        }
        throw error;
      });

  };

  DavStorage.prototype.removeAttachment = function (id, name) {
    var context = this;
    id = restrictDocumentId(id);
    restrictAttachmentId(name);

    return new RSVP.Queue()
      .push(function () {
        return ajax(context, {
          type: "DELETE",
          url: context._url + id + name
        });
      })
      .push(undefined, function (error) {
        if ((error.target !== undefined) &&
            (error.target.status === 404)) {
          throw new jIO.util.jIOError("Cannot find attachment: "
                                      + id + " , " + name,
                                      404);
        }
        throw error;
      });
  };

  // JIO COMMANDS //

  // wedDav methods rfc4918 (short summary)
  // COPY     Reproduces single resources (files) and collections (directory
  //          trees). Will overwrite files (if specified by request) but will
  //          respond 209 (Conflict) if it would overwrite a tree
  // DELETE   deletes files and directory trees
  // GET      just the vanilla HTTP/1.1 behaviour
  // HEAD     ditto
  // LOCK     locks a resources
  // MKCOL    creates a directory
  // MOVE     Moves (rename or copy) a file or a directory tree. Will
  //          'overwrite' files (if specified by the request) but will respond
  //          209 (Conflict) if it would overwrite a tree.
  // OPTIONS  If WebDAV is enabled and available for the path this reports the
  //          WebDAV extension methods
  // PROPFIND Retrieves the requested file characteristics, DAV lock status
  //          and 'dead' properties for individual files, a directory and its
  //          child files, or a directory tree
  // PROPPATCHset and remove 'dead' meta-data properties
  // PUT      Update or create resource or collections
  // UNLOCK   unlocks a resource

  // Notes: all Ajax requests should be CORS (cross-domain)
  // adding custom headers triggers preflight OPTIONS request!
  // http://remysharp.com/2011/04/21/getting-cors-working/

  jIO.addStorage('dav', DavStorage);

}(jIO, RSVP, DOMParser, Blob));
;/*
 * Copyright 2015, Nexedi SA
 * Released under the LGPL license.
 * http://www.gnu.org/licenses/lgpl.html
 */
/**
 * JIO Google Drive Storage. Type = "gdrive".
 * Google Drive "database" storage.
 */
/*global jIO, Blob, RSVP, UriTemplate, JSON*/
/*jslint nomen: true*/

(function (jIO, Blob, RSVP, UriTemplate, JSON) {
  "use strict";

  var UPLOAD_URL = "https://www.googleapis.com{/upload}/drive/v2/files{/id}" +
      "{?uploadType,access_token}",
    upload_template = UriTemplate.parse(UPLOAD_URL),
    REMOVE_URL = "https://www.googleapis.com/drive/v2/" +
      "files{/id,trash}{?access_token}",
    remove_template = UriTemplate.parse(REMOVE_URL),
    LIST_URL = "https://www.googleapis.com/drive/v2/files" +
      "?prettyPrint=false{&pageToken}&q=trashed=false" +
      "&fields=nextPageToken,items(id){&access_token}",
    list_template = UriTemplate.parse(LIST_URL),
    GET_URL = "https://www.googleapis.com/drive/v2/files{/id}{?alt}",
    get_template = UriTemplate.parse(GET_URL);

  function handleError(error, id) {
    if (error.target.status === 404) {
      throw new jIO.util.jIOError(
        "Cannot find document: " + id,
        404
      );
    }
    throw error;
  }

  function listPage(result, token) {
    var i,
      obj;
    return new RSVP.Queue()
      .push(function () {
        return jIO.util.ajax({
          "type": "GET",
          "url": list_template.expand({
            pageToken : (result.nextPageToken || ""),
            access_token: token
          })
        });
      })
      .push(function (data) {
        obj = JSON.parse(data.target.response || data.target.responseText);
        for (i = 0; i < obj.items.length; i += 1) {
          obj.items[i].value = {};
          result.push(obj.items[i]);
        }
        result.nextPageToken = obj.nextPageToken;
        return result;
      }, handleError);
  }

  function checkName(name) {
    if (name !== "enclosure") {
      throw new jIO.util.jIOError("Only support 'enclosure' attachment", 400);
    }
  }

  /**
   * The JIO Google Drive Storage extension
   *
   * @class GdriveStorage
   * @constructor
   */
  function GdriveStorage(spec) {
    if (spec === undefined || spec.access_token === undefined ||
        typeof spec.access_token !== 'string') {
      throw new TypeError("Access Token must be a string " +
                          "which contains more than one character.");
    }
    if (spec.trashing !== undefined &&
        (spec.trashing !== true && spec.trashing !== false)) {
      throw new TypeError("trashing parameter" +
                          " must be a boolean (true or false)");
    }
    this._trashing = spec.trashing || true;
    this._access_token = spec.access_token;
    return;
  }

  function recursiveAllDocs(result, accessToken) {
    return new RSVP.Queue()
      .push(function () {
        return listPage(result, accessToken);
      })
      .push(function () {
        if (result.nextPageToken) {
          return recursiveAllDocs(result, accessToken);
        }
        return result;
      });
  }

  GdriveStorage.prototype.hasCapacity = function (name) {
    return (name === "list");
  };

  GdriveStorage.prototype.buildQuery = function () {
    return recursiveAllDocs([], this._access_token);
  };

  function sendMetaData(id, param, token) {
    var boundary = "-------314159265358979323846";

    return new RSVP.Queue()
      .push(function () {
        return jIO.util.ajax({
          "type": id ? "PUT" : "POST",
          "url": upload_template.expand({
            access_token: token,
            id: id || [],
            upload: id ? [] : "upload",
            uploadType: "multipart"
          }),
          headers: {
            "Content-Type" : 'multipart/related; boundary="' + boundary + '"'
          },
          data: '--' + boundary + '\n' +
            'Content-Type: application/json; charset=UTF-8\n\n' +
            JSON.stringify(param) + '\n\n--' + boundary + "--"
        });
      })
      .push(function (result) {
        var obj = JSON.parse(result.target.responseText);

        return obj.id;
      },
            function (error) {handleError(error, id); });
  }

  GdriveStorage.prototype.put = function (id, param) {
    return sendMetaData(id, param, this._access_token);
  };

  GdriveStorage.prototype.post = function (param) {
    return sendMetaData(undefined, param, this._access_token);
  };

  function sendData(id, blob, token) {
    return new RSVP.Queue()
      .push(function () {
        return jIO.util.ajax({
          "type": "PUT",
          "url": upload_template.expand({
            access_token: token,
            upload: "upload",
            id: id,
            uploadType: "media"
          }),
          data: blob
        });
      })
      .push(function (data) {
        data = JSON.parse(data.target.responseText);
        if (data.mimeType === "application/vnd.google-apps.folder") {
          throw new jIO.util.jIOError("cannot put attachments to folder", 400);
        }
        return data;
      }, function (error) {handleError(error, id); });
  }

  GdriveStorage.prototype.putAttachment = function (id, name, blob) {
    checkName(name);
    return sendData(id, blob, this._access_token);
  };

  GdriveStorage.prototype.remove = function (id) {
    var that  = this;
    return new RSVP.Queue()
      .push(function () {
        return jIO.util.ajax({
          type: that._trashing ? "POST" : "DELETE",
          url: remove_template.expand({
            id : id,
            access_token : that._access_token,
            trash : that._trashing ? "trash" : []
          })
        });
      })
      .push(undefined, function (error) {handleError(error, id); });
  };

  function getData(id, attach, token) {
    return new RSVP.Queue()
      .push(function () {
        return jIO.util.ajax({
          type: "GET",
          dataType: attach ? "blob" : "json",
          url: get_template.expand({
            id: id,
            alt: attach ? "media" : [],
            access_token: token
          }),
          headers: {
            "Authorization" : "Bearer " + token
          }
        });
      })
      .push(function (evt) {
        return evt.target.response ||
          (attach ? new Blob([evt.target.responseText],
                             {"type" :
                              evt.target.responseHeaders["Content-Type"]}) :
              JSON.parse(evt.target.responseText));
      }, function (error) {handleError(error, id); });
  }

  GdriveStorage.prototype.get = function (id) {
    return getData(id, false, this._access_token);
  };

  GdriveStorage.prototype.getAttachment = function (id, name) {
    checkName(name);
    return getData(id, true, this._access_token);
  };

  GdriveStorage.prototype.allAttachments = function (id) {
    var token = this._access_token;

    return new RSVP.Queue()
      .push(function () {
        return getData(id, false, token);
      })
      .push(function (data) {
        if (data.mimeType === "application/vnd.google-apps.folder") {
          return {};
        }
        return {"enclosure": {}};
      });
  };

  jIO.addStorage('gdrive', GdriveStorage);

}(jIO, Blob, RSVP, UriTemplate, JSON));
;/*jslint nomen: true */
/*global RSVP*/

/**
 * JIO Union Storage. Type = 'union'.
 * This provide a unified access other multiple storage.
 * New document are created in the first sub storage.
 * Document are searched in each sub storage until it is found.
 * 
 *
 * Storage Description:
 *
 *     {
 *       "type": "union",
 *       "storage_list": [
 *         sub_storage_description_1,
 *         sub_storage_description_2,
 *
 *         sub_storage_description_X,
 *       ]
 *     }
 *
 * @class UnionStorage
 */

(function (jIO, RSVP) {
  "use strict";

  /**
   * The JIO UnionStorage extension
   *
   * @class UnionStorage
   * @constructor
   */
  function UnionStorage(spec) {
    if (!Array.isArray(spec.storage_list)) {
      throw new jIO.util.jIOError("storage_list is not an Array", 400);
    }
    var i;
    this._storage_list = [];
    for (i = 0; i < spec.storage_list.length; i += 1) {
      this._storage_list.push(jIO.createJIO(spec.storage_list[i]));
    }
  }

  UnionStorage.prototype._getWithStorageIndex = function () {
    var i,
      index = 0,
      context = this,
      arg = arguments,
      result = this._storage_list[0].get.apply(this._storage_list[0], arg);

    function handle404(j) {
      result
        .push(undefined, function (error) {
          if ((error instanceof jIO.util.jIOError) &&
              (error.status_code === 404)) {
            return context._storage_list[j].get.apply(context._storage_list[j],
                                                      arg)
              .push(function (doc) {
                index = j;
                return doc;
              });
          }
          throw error;
        });
    }

    for (i = 1; i < this._storage_list.length; i += 1) {
      handle404(i);
    }
    return result
      .push(function (doc) {
        return [index, doc];
      });
  };

  /*
   * Get a document
   * Try on each substorage on after the other
   */
  UnionStorage.prototype.get = function () {
    return this._getWithStorageIndex.apply(this, arguments)
      .push(function (result) {
        return result[1];
      });
  };

  /*
   * Get attachments list
   * Try on each substorage on after the other
   */
  UnionStorage.prototype.allAttachments = function () {
    var argument_list = arguments,
      context = this;
    return this._getWithStorageIndex.apply(this, arguments)
      .push(function (result) {
        var sub_storage = context._storage_list[result[0]];
        return sub_storage.allAttachments.apply(sub_storage, argument_list);
      });
  };

  /*
   * Post a document
   * Simply store on the first substorage
   */
  UnionStorage.prototype.post = function () {
    return this._storage_list[0].post.apply(this._storage_list[0], arguments);
  };

  /*
   * Put a document
   * Search the document location, and modify it in its storage.
   */
  UnionStorage.prototype.put = function () {
    var arg = arguments,
      context = this;
    return this._getWithStorageIndex(arg[0])
      .push(undefined, function (error) {
        if ((error instanceof jIO.util.jIOError) &&
            (error.status_code === 404)) {
          // Document does not exist, create in first substorage
          return [0];
        }
        throw error;
      })
      .push(function (result) {
        // Storage found, modify in it directly
        var sub_storage = context._storage_list[result[0]];
        return sub_storage.put.apply(sub_storage, arg);
      });
  };

  /*
   * Remove a document
   * Search the document location, and remove it from its storage.
   */
  UnionStorage.prototype.remove = function () {
    var arg = arguments,
      context = this;
    return this._getWithStorageIndex(arg[0])
      .push(function (result) {
        // Storage found, remove from it directly
        var sub_storage = context._storage_list[result[0]];
        return sub_storage.remove.apply(sub_storage, arg);
      });
  };

  UnionStorage.prototype.buildQuery = function () {
    var promise_list = [],
      i,
      id_dict = {},
      len = this._storage_list.length,
      sub_storage;
    for (i = 0; i < len; i += 1) {
      sub_storage = this._storage_list[i];
      promise_list.push(sub_storage.buildQuery.apply(sub_storage, arguments));
    }
    return new RSVP.Queue()
      .push(function () {
        return RSVP.all(promise_list);
      })
      .push(function (result_list) {
        var result = [],
          sub_result,
          sub_result_len,
          j;
        len = result_list.length;
        for (i = 0; i < len; i += 1) {
          sub_result = result_list[i];
          sub_result_len = sub_result.length;
          for (j = 0; j < sub_result_len; j += 1) {
            if (!id_dict.hasOwnProperty(sub_result[j].id)) {
              id_dict[sub_result[j].id] = null;
              result.push(sub_result[j]);
            }
          }
        }
        return result;
      });
  };

  UnionStorage.prototype.hasCapacity = function (name) {
    var i,
      len,
      result,
      sub_storage;
    if ((name === "list") ||
            (name === "query") ||
            (name === "select")) {
      result = true;
      len = this._storage_list.length;
      for (i = 0; i < len; i += 1) {
        sub_storage = this._storage_list[i];
        result = result && sub_storage.hasCapacity(name);
      }
      return result;
    }
    return false;
  };

  UnionStorage.prototype.repair = function () {
    var i,
      promise_list = [];
    for (i = 0; i < this._storage_list.length; i += 1) {
      promise_list.push(this._storage_list[i].repair.apply(
        this._storage_list[i],
        arguments
      ));
    }
    return RSVP.all(promise_list);
  };

  UnionStorage.prototype.getAttachment = function () {
    var argument_list = arguments,
      context = this;
    return this._getWithStorageIndex.apply(this, arguments)
      .push(function (result) {
        var sub_storage = context._storage_list[result[0]];
        return sub_storage.getAttachment.apply(sub_storage, argument_list);
      });
  };

  UnionStorage.prototype.putAttachment = function () {
    var argument_list = arguments,
      context = this;
    return this._getWithStorageIndex.apply(this, arguments)
      .push(function (result) {
        var sub_storage = context._storage_list[result[0]];
        return sub_storage.putAttachment.apply(sub_storage, argument_list);
      });
  };

  UnionStorage.prototype.removeAttachment = function () {
    var argument_list = arguments,
      context = this;
    return this._getWithStorageIndex.apply(this, arguments)
      .push(function (result) {
        var sub_storage = context._storage_list[result[0]];
        return sub_storage.removeAttachment.apply(sub_storage, argument_list);
      });
  };

  jIO.addStorage('union', UnionStorage);

}(jIO, RSVP));
;/*
 * Copyright 2013, Nexedi SA
 * Released under the LGPL license.
 * http://www.gnu.org/licenses/lgpl.html
 */
// JIO ERP5 Storage Description :
// {
//   type: "erp5"
//   url: {string}
// }

/*jslint nomen: true, unparam: true */
/*global jIO, UriTemplate, FormData, RSVP, URI, Blob,
         SimpleQuery, ComplexQuery*/

(function (jIO, UriTemplate, FormData, RSVP, URI, Blob,
           SimpleQuery, ComplexQuery) {
  "use strict";

  function getSiteDocument(storage) {
    return new RSVP.Queue()
      .push(function () {
        return jIO.util.ajax({
          "type": "GET",
          "url": storage._url,
          "xhrFields": {
            withCredentials: true
          }
        });
      })
      .push(function (event) {
        return JSON.parse(event.target.responseText);
      });
  }

  function getDocumentAndHateoas(storage, id, options) {
    if (options === undefined) {
      options = {};
    }
    return getSiteDocument(storage)
      .push(function (site_hal) {
        // XXX need to get modified metadata
        return new RSVP.Queue()
          .push(function () {
            return jIO.util.ajax({
              "type": "GET",
              "url": UriTemplate.parse(site_hal._links.traverse.href)
                                .expand({
                  relative_url: id,
                  view: options._view
                }),
              "xhrFields": {
                withCredentials: true
              }
            });
          })
          .push(undefined, function (error) {
            if ((error.target !== undefined) &&
                (error.target.status === 404)) {
              throw new jIO.util.jIOError("Cannot find document: " + id, 404);
            }
            throw error;
          });
      });
  }

  var allowed_field_dict = {
    "StringField": null,
    "EmailField": null,
    "IntegerField": null,
    "FloatField": null,
    "TextAreaField": null
  };

  function extractPropertyFromFormJSON(json) {
    return new RSVP.Queue()
      .push(function () {
        var form = json._embedded._view,
          converted_json = {
            portal_type: json._links.type.name
          },
          form_data_json = {},
          field,
          key,
          prefix_length,
          result;

        if (json._links.hasOwnProperty('parent')) {
          converted_json.parent_relative_url =
            new URI(json._links.parent.href).segment(2);
        }

        form_data_json.form_id = {
          "key": [form.form_id.key],
          "default": form.form_id["default"]
        };
        // XXX How to store datetime
        for (key in form) {
          if (form.hasOwnProperty(key)) {
            field = form[key];
            prefix_length = 0;
            if (key.indexOf('my_') === 0 && field.editable) {
              prefix_length = 3;
            }
            if (key.indexOf('your_') === 0) {
              prefix_length = 5;
            }
            if ((prefix_length !== 0) &&
                (allowed_field_dict.hasOwnProperty(field.type))) {
              form_data_json[key.substring(prefix_length)] = {
                "default": field["default"],
                "key": field.key
              };
              converted_json[key.substring(prefix_length)] = field["default"];
            }
          }
        }

        result = {
          data: converted_json,
          form_data: form_data_json
        };
        if (form.hasOwnProperty('_actions') &&
            form._actions.hasOwnProperty('put')) {
          result.action_href = form._actions.put.href;
        }
        return result;
      });
  }

  function extractPropertyFromForm(context, id) {
    return context.getAttachment(id, "view")
      .push(function (blob) {
        return jIO.util.readBlobAsText(blob);
      })
      .push(function (evt) {
        return JSON.parse(evt.target.result);
      })
      .push(function (json) {
        return extractPropertyFromFormJSON(json);
      });
  }

  // XXX docstring
  function ERP5Storage(spec) {
    if (typeof spec.url !== "string" || !spec.url) {
      throw new TypeError("ERP5 'url' must be a string " +
                          "which contains more than one character.");
    }
    this._url = spec.url;
    this._default_view_reference = spec.default_view_reference;
  }

  function convertJSONToGet(json) {
    var key,
      result = json.data;
    // Remove all ERP5 hateoas links / convert them into jIO ID
    for (key in result) {
      if (result.hasOwnProperty(key)) {
        if (!result[key]) {
          delete result[key];
        }
      }
    }
    return result;
  }

  ERP5Storage.prototype.get = function (id) {
    return extractPropertyFromForm(this, id)
      .push(function (result) {
        return convertJSONToGet(result);
      });
  };

  ERP5Storage.prototype.post = function (data) {
    var context = this,
      new_id;

    return getSiteDocument(this)
      .push(function (site_hal) {
        var form_data = new FormData();
        form_data.append("portal_type", data.portal_type);
        form_data.append("parent_relative_url", data.parent_relative_url);
        return jIO.util.ajax({
          type: "POST",
          url: site_hal._actions.add.href,
          data: form_data,
          xhrFields: {
            withCredentials: true
          }
        });
      })
      .push(function (evt) {
        var location = evt.target.getResponseHeader("X-Location"),
          uri = new URI(location);
        new_id = uri.segment(2);
        return context.put(new_id, data);
      })
      .push(function () {
        return new_id;
      });
  };

  ERP5Storage.prototype.put = function (id, data) {
    var context = this;

    return extractPropertyFromForm(context, id)
      .push(function (result) {
        var key,
          json = result.form_data,
          form_data = {};
        form_data[json.form_id.key] = json.form_id["default"];

        // XXX How to store datetime:!!!!!
        for (key in data) {
          if (data.hasOwnProperty(key)) {
            if (key === "form_id") {
              throw new jIO.util.jIOError(
                "ERP5: forbidden property: " + key,
                400
              );
            }
            if ((key !== "portal_type") && (key !== "parent_relative_url")) {
              if (!json.hasOwnProperty(key)) {
                throw new jIO.util.jIOError(
                  "ERP5: can not store property: " + key,
                  400
                );
              }
              form_data[json[key].key] = data[key];
            }
          }
        }
        if (!result.hasOwnProperty('action_href')) {
          throw new jIO.util.jIOError(
            "ERP5: can not modify document: " + id,
            403
          );
        }
        return context.putAttachment(
          id,
          result.action_href,
          new Blob([JSON.stringify(form_data)], {type: "application/json"})
        );
      });
  };

  ERP5Storage.prototype.allAttachments = function (id) {
    var context = this;
    return getDocumentAndHateoas(this, id)
      .push(function () {
        if (context._default_view_reference === undefined) {
          return {
            links: {}
          };
        }
        return {
          view: {},
          links: {}
        };
      });
  };

  ERP5Storage.prototype.getAttachment = function (id, action, options) {
    if (options === undefined) {
      options = {};
    }
    if (action === "view") {
      if (this._default_view_reference === undefined) {
        throw new jIO.util.jIOError(
          "Cannot find attachment view for: " + id,
          404
        );
      }
      return getDocumentAndHateoas(this, id,
                                   {"_view": this._default_view_reference})
        .push(function (response) {
          var result = JSON.parse(response.target.responseText);
          // Remove all ERP5 hateoas links / convert them into jIO ID

          // XXX Change default action to an jio urn with attachment name inside
          // if Base_edit, do put URN
          // if others, do post URN (ie, unique new attachment name)
          // XXX Except this attachment name should be generated when
          return new Blob(
            [JSON.stringify(result)],
            {"type": 'application/hal+json'}
          );
        });
    }
    if (action === "links") {
      return getDocumentAndHateoas(this, id)
        .push(function (response) {
          return new Blob(
            [JSON.stringify(JSON.parse(response.target.responseText))],
            {"type": 'application/hal+json'}
          );
        });
    }
    if (action.indexOf(this._url) === 0) {
      return new RSVP.Queue()
        .push(function () {
          var start,
            end,
            range,
            request_options = {
              "type": "GET",
              "dataType": "blob",
              "url": action,
              "xhrFields": {
                withCredentials: true
              }
            };
          if (options.start !== undefined ||  options.end !== undefined) {
            start = options.start || 0;
            end = options.end;
            if (end !== undefined && end < 0) {
              throw new jIO.util.jIOError("end must be positive",
                                          400);
            }
            if (start < 0) {
              range = "bytes=" + start;
            } else if (end === undefined) {
              range = "bytes=" + start + "-";
            } else {
              if (start > end) {
                throw new jIO.util.jIOError("start is greater than end",
                                            400);
              }
              range = "bytes=" + start + "-" + end;
            }
            request_options.headers = {Range: range};
          }
          return jIO.util.ajax(request_options);
        })
        .push(function (evt) {
          if (evt.target.response === undefined) {
            return new Blob(
              [evt.target.responseText],
              {"type": evt.target.getResponseHeader("Content-Type")}
            );
          }
          return evt.target.response;
        });
    }
    throw new jIO.util.jIOError("ERP5: not support get attachment: " + action,
                                400);
  };

  ERP5Storage.prototype.putAttachment = function (id, name, blob) {
    // Assert we use a callable on a document from the ERP5 site
    if (name.indexOf(this._url) !== 0) {
      throw new jIO.util.jIOError("Can not store outside ERP5: " +
                                  name, 400);
    }

    return new RSVP.Queue()
      .push(function () {
        return jIO.util.readBlobAsText(blob);
      })
      .push(function (evt) {
        var form_data = JSON.parse(evt.target.result),
          data = new FormData(),
          array,
          i,
          key,
          value;
        for (key in form_data) {
          if (form_data.hasOwnProperty(key)) {
            if (Array.isArray(form_data[key])) {
              array = form_data[key];
            } else {
              array = [form_data[key]];
            }
            for (i = 0; i < array.length; i += 1) {
              value = array[i];
              if (typeof value === "object") {
                data.append(key, jIO.util.dataURItoBlob(value.url),
                            value.file_name);
              } else {
                data.append(key, value);
              }
            }
          }
        }
        return jIO.util.ajax({
          "type": "POST",
          "url": name,
          "data": data,
          "dataType": "blob",
          "xhrFields": {
            withCredentials: true
          }
        });
      });
  };

  ERP5Storage.prototype.hasCapacity = function (name) {
    return ((name === "list") || (name === "query") ||
            (name === "select") || (name === "limit") ||
            (name === "sort"));
  };

  function isSingleLocalRoles(parsed_query) {
    if ((parsed_query instanceof SimpleQuery) &&
        (parsed_query.key === 'local_roles')) {
      // local_roles:"Assignee"
      return parsed_query.value;
    }
  }

  function isMultipleLocalRoles(parsed_query) {
    var i,
      sub_query,
      is_multiple = true,
      local_role_list = [];
    if ((parsed_query instanceof ComplexQuery) &&
        (parsed_query.operator === 'OR')) {

      for (i = 0; i < parsed_query.query_list.length; i += 1) {
        sub_query = parsed_query.query_list[i];
        if ((sub_query instanceof SimpleQuery) &&
            (sub_query.key === 'local_roles')) {
          local_role_list.push(sub_query.value);
        } else {
          is_multiple = false;
        }
      }
      if (is_multiple) {
        // local_roles:"Assignee" OR local_roles:"Assignor"
        return local_role_list;
      }
    }
  }

  ERP5Storage.prototype.buildQuery = function (options) {
//     if (typeof options.query !== "string") {
//       options.query = (options.query ?
//                        jIO.Query.objectToSearchText(options.query) :
//                        undefined);
//     }
    return getSiteDocument(this)
      .push(function (site_hal) {
        var query = options.query,
          i,
          parsed_query,
          sub_query,
          result_list,
          local_roles,
          sort_list = [];
        if (options.query) {
          parsed_query = jIO.QueryFactory.create(options.query);

          result_list = isSingleLocalRoles(parsed_query);
          if (result_list) {
            query = undefined;
            local_roles = result_list;
          } else {

            result_list = isMultipleLocalRoles(parsed_query);
            if (result_list) {
              query = undefined;
              local_roles = result_list;
            } else if ((parsed_query instanceof ComplexQuery) &&
                       (parsed_query.operator === 'AND')) {

              // portal_type:"Person" AND local_roles:"Assignee"
              for (i = 0; i < parsed_query.query_list.length; i += 1) {
                sub_query = parsed_query.query_list[i];

                result_list = isSingleLocalRoles(sub_query);
                if (result_list) {
                  local_roles = result_list;
                  parsed_query.query_list.splice(i, 1);
                  query = jIO.Query.objectToSearchText(parsed_query);
                  i = parsed_query.query_list.length;
                } else {
                  result_list = isMultipleLocalRoles(sub_query);
                  if (result_list) {
                    local_roles = result_list;
                    parsed_query.query_list.splice(i, 1);
                    query = jIO.Query.objectToSearchText(parsed_query);
                    i = parsed_query.query_list.length;
                  }
                }
              }
            }

          }
        }

        if (options.sort_on) {
          for (i = 0; i < options.sort_on.length; i += 1) {
            sort_list.push(JSON.stringify(options.sort_on[i]));
          }
        }

        return jIO.util.ajax({
          "type": "GET",
          "url": UriTemplate.parse(site_hal._links.raw_search.href)
                            .expand({
              query: query,
              // XXX Force erp5 to return embedded document
              select_list: options.select_list || ["title", "reference"],
              limit: options.limit,
              sort_on: sort_list,
              local_roles: local_roles
            }),
          "xhrFields": {
            withCredentials: true
          }
        });
      })
      .push(function (response) {
        return JSON.parse(response.target.responseText);
      })
      .push(function (catalog_json) {
        var data = catalog_json._embedded.contents,
          count = data.length,
          i,
          uri,
          item,
          result = [];
        for (i = 0; i < count; i += 1) {
          item = data[i];
          uri = new URI(item._links.self.href);
          delete item._links;
          result.push({
            id: uri.segment(2),
            value: item
          });
        }
        return result;
      });
  };

  jIO.addStorage("erp5", ERP5Storage);

}(jIO, UriTemplate, FormData, RSVP, URI, Blob,
  SimpleQuery, ComplexQuery));
;/*jslint nomen: true*/
/*global RSVP*/
(function (jIO, RSVP) {
  "use strict";

  /**
   * The jIO QueryStorage extension
   *
   * @class QueryStorage
   * @constructor
   */
  function QueryStorage(spec) {
    this._sub_storage = jIO.createJIO(spec.sub_storage);
    this._key_schema = spec.key_schema;
  }

  QueryStorage.prototype.get = function () {
    return this._sub_storage.get.apply(this._sub_storage, arguments);
  };
  QueryStorage.prototype.allAttachments = function () {
    return this._sub_storage.allAttachments.apply(this._sub_storage, arguments);
  };
  QueryStorage.prototype.post = function () {
    return this._sub_storage.post.apply(this._sub_storage, arguments);
  };
  QueryStorage.prototype.put = function () {
    return this._sub_storage.put.apply(this._sub_storage, arguments);
  };
  QueryStorage.prototype.remove = function () {
    return this._sub_storage.remove.apply(this._sub_storage, arguments);
  };
  QueryStorage.prototype.getAttachment = function () {
    return this._sub_storage.getAttachment.apply(this._sub_storage, arguments);
  };
  QueryStorage.prototype.putAttachment = function () {
    return this._sub_storage.putAttachment.apply(this._sub_storage, arguments);
  };
  QueryStorage.prototype.removeAttachment = function () {
    return this._sub_storage.removeAttachment.apply(this._sub_storage,
                                                    arguments);
  };
  QueryStorage.prototype.repair = function () {
    return this._sub_storage.repair.apply(this._sub_storage, arguments);
  };

  QueryStorage.prototype.hasCapacity = function (name) {
    var this_storage_capacity_list = ["limit",
                                      "sort",
                                      "select",
                                      "query"];

    if (this_storage_capacity_list.indexOf(name) !== -1) {
      return true;
    }
    if (name === "list") {
      return this._sub_storage.hasCapacity(name);
    }
    return false;
  };
  QueryStorage.prototype.buildQuery = function (options) {
    var substorage = this._sub_storage,
      context = this,
      sub_options = {},
      is_manual_query_needed = false,
      is_manual_include_needed = false;

    if (substorage.hasCapacity("list")) {

      // Can substorage handle the queries if needed?
      try {
        if (((options.query === undefined) ||
             (substorage.hasCapacity("query"))) &&
            ((options.sort_on === undefined) ||
             (substorage.hasCapacity("sort"))) &&
            ((options.select_list === undefined) ||
             (substorage.hasCapacity("select"))) &&
            ((options.limit === undefined) ||
             (substorage.hasCapacity("limit")))) {
          sub_options.query = options.query;
          sub_options.sort_on = options.sort_on;
          sub_options.select_list = options.select_list;
          sub_options.limit = options.limit;
        }
      } catch (error) {
        if ((error instanceof jIO.util.jIOError) &&
            (error.status_code === 501)) {
          is_manual_query_needed = true;
        } else {
          throw error;
        }
      }

      // Can substorage include the docs if needed?
      try {
        if ((is_manual_query_needed ||
            (options.include_docs === true)) &&
            (substorage.hasCapacity("include"))) {
          sub_options.include_docs = true;
        }
      } catch (error) {
        if ((error instanceof jIO.util.jIOError) &&
            (error.status_code === 501)) {
          is_manual_include_needed = true;
        } else {
          throw error;
        }
      }

      return substorage.buildQuery(sub_options)

        // Include docs if needed
        .push(function (result) {
          var include_query_list = [result],
            len,
            i;

          function safeGet(j) {
            var id = result[j].id;
            return substorage.get(id)
              .push(function (doc) {
                // XXX Can delete user data!
                doc._id = id;
                return doc;
              }, function (error) {
                // Document may have been dropped after listing
                if ((error instanceof jIO.util.jIOError) &&
                    (error.status_code === 404)) {
                  return;
                }
                throw error;
              });
          }

          if (is_manual_include_needed) {
            len = result.length;
            for (i = 0; i < len; i += 1) {
              include_query_list.push(safeGet(i));
            }
            result = RSVP.all(include_query_list);
          }
          return result;
        })
        .push(function (result) {
          var original_result,
            len,
            i;
          if (is_manual_include_needed) {
            original_result = result[0];
            len = original_result.length;
            for (i = 0; i < len; i += 1) {
              original_result[i].doc = result[i + 1];
            }
            result = original_result;
          }
          return result;

        })

        // Manual query if needed
        .push(function (result) {
          var data_rows = [],
            len,
            i;
          if (is_manual_query_needed) {
            len = result.length;
            for (i = 0; i < len; i += 1) {
              result[i].doc.__id = result[i].id;
              data_rows.push(result[i].doc);
            }
            if (options.select_list) {
              options.select_list.push("__id");
            }
            result = jIO.QueryFactory.create(options.query || "",
                                             context._key_schema).
              exec(data_rows, options);
          }
          return result;
        })

        // reconstruct filtered rows, preserving the order from docs
        .push(function (result) {
          var new_result = [],
            element,
            len,
            i;
          if (is_manual_query_needed) {
            len = result.length;
            for (i = 0; i < len; i += 1) {
              element = {
                id: result[i].__id,
                value: options.select_list ? result[i] : {},
                doc: {}
              };
              if (options.select_list) {
                // Does not work if user manually request __id
                delete element.value.__id;
              }
              if (options.include_docs) {
                // XXX To implement
                throw new Error("QueryStorage does not support include docs");
              }
              new_result.push(element);
            }
            result = new_result;
          }
          return result;
        });

    }
  };

  jIO.addStorage('query', QueryStorage);

}(jIO, RSVP));
;/*jslint nomen: true*/
/*global RSVP, Blob*/
(function (jIO, RSVP, Blob) {
  "use strict";

  /**
   * The jIO FileSystemBridgeStorage extension
   *
   * @class FileSystemBridgeStorage
   * @constructor
   */
  function FileSystemBridgeStorage(spec) {
    this._sub_storage = jIO.createJIO(spec.sub_storage);
  }
  var DOCUMENT_EXTENSION = ".json",
    DOCUMENT_KEY = "/.jio_documents/",
    ROOT = "/";

  function endsWith(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
  }

  FileSystemBridgeStorage.prototype.get = function (id) {
    var context = this;
    return new RSVP.Queue()

      // First, try to get explicit reference to the document

      .push(function () {
        // First get the document itself if it exists
        return context._sub_storage.getAttachment(
          DOCUMENT_KEY,
          id + DOCUMENT_EXTENSION,
          {format: "json"}
        );
      })
      .push(undefined, function (error) {
        if ((error instanceof jIO.util.jIOError) &&
            (error.status_code === 404)) {

          // Second, try to get default attachment
          return context._sub_storage.allAttachments(ROOT)
            .push(function (attachment_dict) {
              if (attachment_dict.hasOwnProperty(id)) {
                return {};
              }
              throw new jIO.util.jIOError("Cannot find document " + id,
                                          404);
            });
        }
        throw error;
      });
  };

  FileSystemBridgeStorage.prototype.allAttachments = function (id) {
    var context = this;
    return context._sub_storage.allAttachments(ROOT)
      .push(function (attachment_dict) {
        if (attachment_dict.hasOwnProperty(id)) {
          return {
            enclosure: {}
          };
        }
        // Second get the document itself if it exists
        return context._sub_storage.getAttachment(
          DOCUMENT_KEY,
          id + DOCUMENT_EXTENSION
        )
          .push(function () {
            return {};
          }, function (error) {
            if ((error instanceof jIO.util.jIOError) &&
                (error.status_code === 404)) {
              throw new jIO.util.jIOError("Cannot find document " + id,
                                          404);
            }
            throw error;
          });
      });

  };

  FileSystemBridgeStorage.prototype.put = function (doc_id, param) {
    var context = this;
    // XXX Handle conflict!

    return context._sub_storage.putAttachment(
      DOCUMENT_KEY,
      doc_id + DOCUMENT_EXTENSION,
      new Blob([JSON.stringify(param)], {type: "application/json"})
    )
      .push(undefined, function (error) {
        if ((error instanceof jIO.util.jIOError) &&
            (error.status_code === 404)) {
          return context._sub_storage.put(DOCUMENT_KEY, {})
            .push(function () {
              return context._sub_storage.putAttachment(
                DOCUMENT_KEY,
                doc_id + DOCUMENT_EXTENSION,
                new Blob([JSON.stringify(param)],
                         {type: "application/json"})
              );
            });
        }
        throw error;
      })
      .push(function () {
        return doc_id;
      });

  };

  FileSystemBridgeStorage.prototype.remove = function (doc_id) {
    var context = this,
      got_error = false;
    return new RSVP.Queue()

      // First, try to remove enclosure
      .push(function () {
        return context._sub_storage.removeAttachment(
          ROOT,
          doc_id
        );
      })

      .push(undefined, function (error) {
        if ((error instanceof jIO.util.jIOError) &&
            (error.status_code === 404)) {
          got_error = true;
          return;
        }
        throw error;
      })

      // Second, try to remove explicit doc
      .push(function () {
        return context._sub_storage.removeAttachment(
          DOCUMENT_KEY,
          doc_id + DOCUMENT_EXTENSION
        );
      })

      .push(undefined, function (error) {
        if ((!got_error) && (error instanceof jIO.util.jIOError) &&
            (error.status_code === 404)) {
          return doc_id;
        }
        throw error;
      });

  };

  FileSystemBridgeStorage.prototype.hasCapacity = function (capacity) {
    return (capacity === "list");
  };

  FileSystemBridgeStorage.prototype.buildQuery = function () {
    var result_dict = {},
      context = this;
    return new RSVP.Queue()

      // First, get list of explicit documents

      .push(function () {
        return context._sub_storage.allAttachments(DOCUMENT_KEY);
      })
      .push(function (result) {
        var key;
        for (key in result) {
          if (result.hasOwnProperty(key)) {
            if (endsWith(key, DOCUMENT_EXTENSION)) {
              result_dict[key.substring(
                0,
                key.length - DOCUMENT_EXTENSION.length
              )] = null;
            }
          }
        }
      }, function (error) {
        if ((error instanceof jIO.util.jIOError) &&
            (error.status_code === 404)) {
          return;
        }
        throw error;
      })

      // Second, get list of enclosure

      .push(function () {
        return context._sub_storage.allAttachments(ROOT);
      })
      .push(function (result) {
        var key;
        for (key in result) {
          if (result.hasOwnProperty(key)) {
            result_dict[key] = null;
          }
        }
      })

      // Finally, build the result

      .push(function () {
        var result = [],
          key;
        for (key in result_dict) {
          if (result_dict.hasOwnProperty(key)) {
            result.push({
              id: key,
              value: {}
            });
          }
        }
        return result;
      });

  };

  FileSystemBridgeStorage.prototype.getAttachment = function (id, name) {
    if (name !== "enclosure") {
      throw new jIO.util.jIOError("Only support 'enclosure' attachment",
                                  400);
    }

    return this._sub_storage.getAttachment(ROOT, id);
  };

  FileSystemBridgeStorage.prototype.putAttachment = function (id, name, blob) {
    if (name !== "enclosure") {
      throw new jIO.util.jIOError("Only support 'enclosure' attachment",
                                  400);
    }

    return this._sub_storage.putAttachment(
      ROOT,
      id,
      blob
    );
  };

  FileSystemBridgeStorage.prototype.removeAttachment = function (id, name) {
    if (name !== "enclosure") {
      throw new jIO.util.jIOError("Only support 'enclosure' attachment",
                                  400);
    }

    return this._sub_storage.removeAttachment(ROOT, id);
  };

  FileSystemBridgeStorage.prototype.repair = function () {
    return this._sub_storage.repair.apply(this._sub_storage, arguments);
  };

  jIO.addStorage('drivetojiomapping', FileSystemBridgeStorage);

}(jIO, RSVP, Blob));
;/*jslint nomen: true*/
/*global Blob, atob, btoa, RSVP*/
(function (jIO, Blob, atob, btoa, RSVP) {
  "use strict";

  /**
   * The jIO DocumentStorage extension
   *
   * @class DocumentStorage
   * @constructor
   */
  function DocumentStorage(spec) {
    this._sub_storage = jIO.createJIO(spec.sub_storage);
    this._document_id = spec.document_id;
    this._repair_attachment = spec.repair_attachment || false;
  }

  var DOCUMENT_EXTENSION = ".json",
    DOCUMENT_REGEXP = new RegExp("^jio_document/([\\w=]+)" +
                                 DOCUMENT_EXTENSION + "$"),
    ATTACHMENT_REGEXP = new RegExp("^jio_attachment/([\\w=]+)/([\\w=]+)$");

  function getSubAttachmentIdFromParam(id, name) {
    if (name === undefined) {
      return 'jio_document/' + btoa(id) + DOCUMENT_EXTENSION;
    }
    return 'jio_attachment/' + btoa(id) + "/" + btoa(name);
  }

  DocumentStorage.prototype.get = function (id) {
    return this._sub_storage.getAttachment(
      this._document_id,
      getSubAttachmentIdFromParam(id),
      {format: "json"}
    );
  };

  DocumentStorage.prototype.allAttachments = function (id) {
    return this._sub_storage.allAttachments(this._document_id)
      .push(function (result) {
        var attachments = {},
          exec,
          key;
        for (key in result) {
          if (result.hasOwnProperty(key)) {
            if (ATTACHMENT_REGEXP.test(key)) {
              exec = ATTACHMENT_REGEXP.exec(key);
              try {
                if (atob(exec[1]) === id) {
                  attachments[atob(exec[2])] = {};
                }
              } catch (error) {
                // Check if unable to decode base64 data
                if (!error instanceof ReferenceError) {
                  throw error;
                }
              }
            }
          }
        }
        return attachments;
      });
  };

  DocumentStorage.prototype.put = function (doc_id, param) {
    return this._sub_storage.putAttachment(
      this._document_id,
      getSubAttachmentIdFromParam(doc_id),
      new Blob([JSON.stringify(param)], {type: "application/json"})
    )
      .push(function () {
        return doc_id;
      });

  };

  DocumentStorage.prototype.remove = function (id) {
    var context = this;
    return this.allAttachments(id)
      .push(function (result) {
        var key,
          promise_list = [];
        for (key in result) {
          if (result.hasOwnProperty(key)) {
            promise_list.push(context.removeAttachment(id, key));
          }
        }
        return RSVP.all(promise_list);
      })
      .push(function () {
        return context._sub_storage.removeAttachment(
          context._document_id,
          getSubAttachmentIdFromParam(id)
        );
      })
      .push(function () {
        return id;
      });
  };

  DocumentStorage.prototype.repair = function () {
    var context = this;
    return this._sub_storage.repair.apply(this._sub_storage, arguments)
      .push(function (result) {
        if (context._repair_attachment) {
          return context._sub_storage.allAttachments(context._document_id)
            .push(function (result_dict) {
              var promise_list = [],
                id_dict = {},
                attachment_dict = {},
                id,
                attachment,
                exec,
                key;
              for (key in result_dict) {
                if (result_dict.hasOwnProperty(key)) {
                  id = undefined;
                  attachment = undefined;
                  if (DOCUMENT_REGEXP.test(key)) {
                    try {
                      id = atob(DOCUMENT_REGEXP.exec(key)[1]);
                    } catch (error) {
                      // Check if unable to decode base64 data
                      if (!error instanceof ReferenceError) {
                        throw error;
                      }
                    }
                    if (id !== undefined) {
                      id_dict[id] = null;
                    }
                  } else if (ATTACHMENT_REGEXP.test(key)) {
                    exec = ATTACHMENT_REGEXP.exec(key);
                    try {
                      id = atob(exec[1]);
                      attachment = atob(exec[2]);
                    } catch (error) {
                      // Check if unable to decode base64 data
                      if (!error instanceof ReferenceError) {
                        throw error;
                      }
                    }
                    if (attachment !== undefined) {
                      if (!id_dict.hasOwnProperty(id)) {
                        if (!attachment_dict.hasOwnProperty(id)) {
                          attachment_dict[id] = {};
                        }
                        attachment_dict[id][attachment] = null;
                      }
                    }
                  }
                }
              }
              for (id in attachment_dict) {
                if (attachment_dict.hasOwnProperty(id)) {
                  if (!id_dict.hasOwnProperty(id)) {
                    for (attachment in attachment_dict[id]) {
                      if (attachment_dict[id].hasOwnProperty(attachment)) {
                        promise_list.push(context.removeAttachment(
                          id,
                          attachment
                        ));
                      }
                    }
                  }
                }
              }
              return RSVP.all(promise_list);
            });
        }
        return result;
      });
  };

  DocumentStorage.prototype.hasCapacity = function (capacity) {
    return (capacity === "list");
  };

  DocumentStorage.prototype.buildQuery = function () {
    return this._sub_storage.allAttachments(this._document_id)
      .push(function (attachment_dict) {
        var result = [],
          key;
        for (key in attachment_dict) {
          if (attachment_dict.hasOwnProperty(key)) {
            if (DOCUMENT_REGEXP.test(key)) {
              try {
                result.push({
                  id: atob(DOCUMENT_REGEXP.exec(key)[1]),
                  value: {}
                });
              } catch (error) {
                // Check if unable to decode base64 data
                if (!error instanceof ReferenceError) {
                  throw error;
                }
              }
            }
          }
        }
        return result;
      });
  };

  DocumentStorage.prototype.getAttachment = function (id, name) {
    return this._sub_storage.getAttachment(
      this._document_id,
      getSubAttachmentIdFromParam(id, name)
    );
  };

  DocumentStorage.prototype.putAttachment = function (id, name, blob) {
    return this._sub_storage.putAttachment(
      this._document_id,
      getSubAttachmentIdFromParam(id, name),
      blob
    );
  };

  DocumentStorage.prototype.removeAttachment = function (id, name) {
    return this._sub_storage.removeAttachment(
      this._document_id,
      getSubAttachmentIdFromParam(id, name)
    );
  };

  jIO.addStorage('document', DocumentStorage);

}(jIO, Blob, atob, btoa, RSVP));
;/*
 * Copyright 2013, Nexedi SA
 * Released under the LGPL license.
 * http://www.gnu.org/licenses/lgpl.html
 */

/*jslint nomen: true*/
/*global jIO, sessionStorage, localStorage, RSVP */

/**
 * JIO Local Storage. Type = 'local'.
 * Local browser "database" storage.
 *
 * Storage Description:
 *
 *     {
 *       "type": "local",
 *       "sessiononly": false
 *     }
 *
 * @class LocalStorage
 */

(function (jIO, sessionStorage, localStorage, RSVP) {
  "use strict";

  function LocalStorage(spec) {
    if (spec.sessiononly === true) {
      this._storage = sessionStorage;
    } else {
      this._storage = localStorage;
    }
  }

  function restrictDocumentId(id) {
    if (id !== "/") {
      throw new jIO.util.jIOError("id " + id + " is forbidden (!== /)",
                                  400);
    }
  }

  LocalStorage.prototype.get = function (id) {
    restrictDocumentId(id);
    return {};
  };

  LocalStorage.prototype.allAttachments = function (id) {
    restrictDocumentId(id);

    var attachments = {},
      key;

    for (key in this._storage) {
      if (this._storage.hasOwnProperty(key)) {
        attachments[key] = {};
      }
    }
    return attachments;
  };

  LocalStorage.prototype.getAttachment = function (id, name) {
    restrictDocumentId(id);

    var textstring = this._storage.getItem(name);

    if (textstring === null) {
      throw new jIO.util.jIOError(
        "Cannot find attachment " + name,
        404
      );
    }
    return jIO.util.dataURItoBlob(textstring);
  };

  LocalStorage.prototype.putAttachment = function (id, name, blob) {
    var context = this;
    restrictDocumentId(id);

    // the document already exists
    // download data
    return new RSVP.Queue()
      .push(function () {
        return jIO.util.readBlobAsDataURL(blob);
      })
      .push(function (e) {
        context._storage.setItem(name, e.target.result);
      });
  };

  LocalStorage.prototype.removeAttachment = function (id, name) {
    restrictDocumentId(id);
    return this._storage.removeItem(name);
  };


  LocalStorage.prototype.hasCapacity = function (name) {
    return (name === "list");
  };

  LocalStorage.prototype.buildQuery = function () {
    return [{
      id: "/",
      value: {}
    }];
  };

  jIO.addStorage('local', LocalStorage);

}(jIO, sessionStorage, localStorage, RSVP));
;/*
 * Copyright 2014, Nexedi SA
 * Released under the LGPL license.
 * http://www.gnu.org/licenses/lgpl.html
 */

/**
 * JIO Indexed Database Storage.
 *
 * A local browser "database" storage greatly more powerful than localStorage.
 *
 * Description:
 *
 *    {
 *      "type": "indexeddb",
 *      "database": <string>
 *    }
 *
 * The database name will be prefixed by "jio:", so if the database property is
 * "hello", then you can manually reach this database with
 * `indexedDB.open("jio:hello");`. (Or
 * `indexedDB.deleteDatabase("jio:hello");`.)
 *
 * For more informations:
 *
 * - http://www.w3.org/TR/IndexedDB/
 * - https://developer.mozilla.org/en-US/docs/IndexedDB/Using_IndexedDB
 */

/*jslint nomen: true */
/*global indexedDB, jIO, RSVP, Blob, Math, IDBKeyRange, IDBOpenDBRequest,
        DOMError, Event*/

(function (indexedDB, jIO, RSVP, Blob, Math, IDBKeyRange, IDBOpenDBRequest,
           DOMError) {
  "use strict";

  // Read only as changing it can lead to data corruption
  var UNITE = 2000000;

  function IndexedDBStorage(description) {
    if (typeof description.database !== "string" ||
        description.database === "") {
      throw new TypeError("IndexedDBStorage 'database' description property " +
                          "must be a non-empty string");
    }
    this._database_name = "jio:" + description.database;
  }

  IndexedDBStorage.prototype.hasCapacity = function (name) {
    return ((name === "list") || (name === "include"));
  };

  function buildKeyPath(key_list) {
    return key_list.join("_");
  }

  function handleUpgradeNeeded(evt) {
    var db = evt.target.result,
      store;

    store = db.createObjectStore("metadata", {
      keyPath: "_id",
      autoIncrement: false
    });
    // It is not possible to use openKeyCursor on keypath directly
    // https://www.w3.org/Bugs/Public/show_bug.cgi?id=19955
    store.createIndex("_id", "_id", {unique: true});

    store = db.createObjectStore("attachment", {
      keyPath: "_key_path",
      autoIncrement: false
    });
    store.createIndex("_id", "_id", {unique: false});

    store = db.createObjectStore("blob", {
      keyPath: "_key_path",
      autoIncrement: false
    });
    store.createIndex("_id_attachment",
                      ["_id", "_attachment"], {unique: false});
    store.createIndex("_id", "_id", {unique: false});
  }

  function openIndexedDB(jio_storage) {
    var db_name = jio_storage._database_name;
    function resolver(resolve, reject) {
      // Open DB //
      var request = indexedDB.open(db_name);
      request.onerror = function (error) {
        if (request.result) {
          request.result.close();
        }
        if ((error !== undefined) &&
            (error.target instanceof IDBOpenDBRequest) &&
            (error.target.error instanceof DOMError)) {
          reject("Connection to: " + db_name + " failed: " +
                 error.target.error.message);
        } else {
          reject(error);
        }
      };

      request.onabort = function () {
        request.result.close();
        reject("Aborting connection to: " + db_name);
      };

      request.ontimeout = function () {
        request.result.close();
        reject("Connection to: " + db_name + " timeout");
      };

      request.onblocked = function () {
        request.result.close();
        reject("Connection to: " + db_name + " was blocked");
      };

      // Create DB if necessary //
      request.onupgradeneeded = handleUpgradeNeeded;

      request.onversionchange = function () {
        request.result.close();
        reject(db_name + " was upgraded");
      };

      request.onsuccess = function () {
        resolve(request.result);
      };
    }
    // XXX Canceller???
    return new RSVP.Queue()
      .push(function () {
        return new RSVP.Promise(resolver);
      });
  }

  function openTransaction(db, stores, flag, autoclosedb) {
    var tx = db.transaction(stores, flag);
    if (autoclosedb !== false) {
      tx.oncomplete = function () {
        db.close();
      };
    }
    tx.onabort = function () {
      db.close();
    };
    return tx;
  }

  function handleCursor(request, callback, resolve, reject) {
    request.onerror = function (error) {
      if (request.transaction) {
        request.transaction.abort();
      }
      reject(error);
    };

    request.onsuccess = function (evt) {
      var cursor = evt.target.result;
      if (cursor) {
        // XXX Wait for result
        try {
          callback(cursor);
        } catch (error) {
          reject(error);
        }

        // continue to next iteration
        cursor["continue"]();
      } else {
        resolve();
      }
    };
  }

  IndexedDBStorage.prototype.buildQuery = function (options) {
    var result_list = [];

    function pushIncludedMetadata(cursor) {
      result_list.push({
        "id": cursor.key,
        "value": {},
        "doc": cursor.value.doc
      });
    }

    function pushMetadata(cursor) {
      result_list.push({
        "id": cursor.key,
        "value": {}
      });
    }
    return openIndexedDB(this)
      .push(function (db) {
        return new RSVP.Promise(function (resolve, reject) {
          var tx = openTransaction(db, ["metadata"], "readonly");
          if (options.include_docs === true) {
            handleCursor(tx.objectStore("metadata").index("_id").openCursor(),
              pushIncludedMetadata, resolve, reject);
          } else {
            handleCursor(tx.objectStore("metadata").index("_id")
                            .openKeyCursor(), pushMetadata, resolve, reject);
          }
        });
      })
      .push(function () {
        return result_list;
      });
  };

  function handleGet(store, id, resolve, reject) {
    var request = store.get(id);
    request.onerror = reject;
    request.onsuccess = function () {
      if (request.result) {
        resolve(request.result);
      } else {
        reject(new jIO.util.jIOError(
          "IndexedDB: cannot find object '" + id + "' in the '" +
            store.name + "' store",
          404
        ));
      }
    };
  }

  IndexedDBStorage.prototype.get = function (id) {
    return openIndexedDB(this)
      .push(function (db) {
        return new RSVP.Promise(function (resolve, reject) {
          var transaction = openTransaction(db, ["metadata"], "readonly");
          handleGet(
            transaction.objectStore("metadata"),
            id,
            resolve,
            reject
          );
        });
      })
      .push(function (result) {
        return result.doc;
      });
  };

  IndexedDBStorage.prototype.allAttachments = function (id) {
    var attachment_dict = {};

    function addEntry(cursor) {
      attachment_dict[cursor.value._attachment] = {};
    }

    return openIndexedDB(this)
      .push(function (db) {
        return new RSVP.Promise(function (resolve, reject) {
          var transaction = openTransaction(db, ["metadata", "attachment"],
            "readonly");
          function getAttachments() {
            handleCursor(
              transaction.objectStore("attachment").index("_id")
                .openCursor(IDBKeyRange.only(id)),
              addEntry,
              resolve,
              reject
            );
          }
          handleGet(
            transaction.objectStore("metadata"),
            id,
            getAttachments,
            reject
          );
        });
      })
      .push(function () {
        return attachment_dict;
      });
  };

  function handleRequest(request, resolve, reject) {
    request.onerror = reject;
    request.onsuccess = function () {
      resolve(request.result);
    };
  }

  IndexedDBStorage.prototype.put = function (id, metadata) {
    return openIndexedDB(this)
      .push(function (db) {
        return new RSVP.Promise(function (resolve, reject) {
          var transaction = openTransaction(db, ["metadata"], "readwrite");
          handleRequest(
            transaction.objectStore("metadata").put({
              "_id": id,
              "doc": metadata
            }),
            resolve,
            reject
          );
        });
      });
  };

  function deleteEntry(cursor) {
    cursor["delete"]();
  }

  IndexedDBStorage.prototype.remove = function (id) {
    var resolved_amount = 0;
    return openIndexedDB(this)
      .push(function (db) {
        return new RSVP.Promise(function (resolve, reject) {
          function resolver() {
            if (resolved_amount < 2) {
              resolved_amount += 1;
            } else {
              resolve();
            }
          }
          var transaction = openTransaction(db, ["metadata", "attachment",
                                            "blob"], "readwrite");
          handleRequest(
            transaction.objectStore("metadata")["delete"](id),
            resolver,
            reject
          );
          // XXX Why not possible to delete with KeyCursor?
          handleCursor(transaction.objectStore("attachment").index("_id")
              .openCursor(IDBKeyRange.only(id)),
            deleteEntry,
            resolver,
            reject
            );
          handleCursor(transaction.objectStore("blob").index("_id")
              .openCursor(IDBKeyRange.only(id)),
            deleteEntry,
            resolver,
            reject
            );
        });
      });
  };

  IndexedDBStorage.prototype.getAttachment = function (id, name, options) {
    var transaction,
      type,
      start,
      end;
    if (options === undefined) {
      options = {};
    }
    return openIndexedDB(this)
      .push(function (db) {
        return new RSVP.Promise(function (resolve, reject) {
          transaction = openTransaction(
            db,
            ["attachment", "blob"],
            "readonly"
          );
          function getBlob(attachment) {
            var total_length = attachment.info.length,
              result_list = [],
              store = transaction.objectStore("blob"),
              start_index,
              end_index;
            type = attachment.info.content_type;
            start = options.start || 0;
            end = options.end || total_length;
            if (end > total_length) {
              end = total_length;
            }
            if (start < 0 || end < 0) {
              throw new jIO.util.jIOError(
                "_start and _end must be positive",
                400
              );
            }
            if (start > end) {
              throw new jIO.util.jIOError("_start is greater than _end",
                                          400);
            }
            start_index = Math.floor(start / UNITE);
            end_index =  Math.floor(end / UNITE) - 1;
            if (end % UNITE === 0) {
              end_index -= 1;
            }
            function resolver(result) {
              result_list.push(result);
              resolve(result_list);
            }
            function getPart(i) {
              return function (result) {
                if (result) {
                  result_list.push(result);
                }
                i += 1;
                handleGet(store,
                  buildKeyPath([id, name, i]),
                  (i <= end_index) ? getPart(i) : resolver,
                  reject
                  );
              };
            }
            getPart(start_index - 1)();
          }
        // XXX Should raise if key is not good
          handleGet(transaction.objectStore("attachment"),
            buildKeyPath([id, name]),
            getBlob,
            reject
            );
        });
      })
      .push(function (result_list) {
        var array_buffer_list = [],
          blob,
          i,
          index,
          len = result_list.length;
        for (i = 0; i < len; i += 1) {
          array_buffer_list.push(result_list[i].blob);
        }
        if ((options.start === undefined) && (options.end === undefined)) {
          return new Blob(array_buffer_list, {type: type});
        }
        index = Math.floor(start / UNITE) * UNITE;
        blob = new Blob(array_buffer_list, {type: "application/octet-stream"});
        return blob.slice(start - index, end - index,
                          "application/octet-stream");
      });
  };

  function removeAttachment(transaction, id, name, resolve, reject) {
      // XXX How to get the right attachment
    function deleteContent() {
      handleCursor(
        transaction.objectStore("blob").index("_id_attachment")
          .openCursor(IDBKeyRange.only([id, name])),
        deleteEntry,
        resolve,
        reject
      );
    }
    handleRequest(
      transaction.objectStore("attachment")["delete"](
        buildKeyPath([id, name])
      ),
      deleteContent,
      reject
    );
  }

  IndexedDBStorage.prototype.putAttachment = function (id, name, blob) {
    var blob_part = [],
      transaction,
      db;

    return openIndexedDB(this)
      .push(function (database) {
        db = database;

        // Split the blob first
        return jIO.util.readBlobAsArrayBuffer(blob);
      })
      .push(function (event) {
        var array_buffer = event.target.result,
          total_size = blob.size,
          handled_size = 0;

        while (handled_size < total_size) {
          blob_part.push(array_buffer.slice(handled_size,
                                            handled_size + UNITE));
          handled_size += UNITE;
        }

        // Remove previous attachment
        transaction = openTransaction(db, ["attachment", "blob"], "readwrite");
        return new RSVP.Promise(function (resolve, reject) {
          function write() {
            var len = blob_part.length - 1,
              attachment_store = transaction.objectStore("attachment"),
              blob_store = transaction.objectStore("blob");
            function putBlobPart(i) {
              return function () {
                i += 1;
                handleRequest(
                  blob_store.put({
                    "_key_path": buildKeyPath([id, name, i]),
                    "_id" : id,
                    "_attachment" : name,
                    "_part" : i,
                    "blob": blob_part[i]
                  }),
                  (i < len) ? putBlobPart(i) : resolve,
                  reject
                );
              };
            }
            handleRequest(
              attachment_store.put({
                "_key_path": buildKeyPath([id, name]),
                "_id": id,
                "_attachment": name,
                "info": {
                  "content_type": blob.type,
                  "length": blob.size
                }
              }),
              putBlobPart(-1),
              reject
            );
          }
          removeAttachment(transaction, id, name, write, reject);
        });
      });
  };

  IndexedDBStorage.prototype.removeAttachment = function (id, name) {
    return openIndexedDB(this)
      .push(function (db) {
        var transaction = openTransaction(db, ["attachment", "blob"],
                                          "readwrite");
        return new RSVP.Promise(function (resolve, reject) {
          removeAttachment(transaction, id, name, resolve, reject);
        });
      });
  };

  jIO.addStorage("indexeddb", IndexedDBStorage);
}(indexedDB, jIO, RSVP, Blob, Math, IDBKeyRange, IDBOpenDBRequest, DOMError));
;/*
 * Copyright 2015, Nexedi SA
 * Released under the LGPL license.
 * http://www.gnu.org/licenses/lgpl.html
 */

/*jslint nomen: true*/
/*global jIO, RSVP, DOMException, Blob, crypto, Uint8Array, ArrayBuffer*/

(function (jIO, RSVP, DOMException, Blob, crypto, Uint8Array, ArrayBuffer) {
  "use strict";

  /*
  The cryptography system used by this storage is AES-GCM.
  Here is an example of how to generate a key to the json format:

  return new RSVP.Queue()
    .push(function () {
      return crypto.subtle.generateKey({name: "AES-GCM", length: 256},
                                       true, ["encrypt", "decrypt"]);
    })
    .push(function (key) {
      return crypto.subtle.exportKey("jwk", key);
    })
    .push(function (json_key) {
      var jio = jIO.createJIO({
        type: "crypt",
        key: json_key,
        sub_storage: {storage_definition}
      });
    });

  Find more informations about this cryptography system on
  https://github.com/diafygi/webcrypto-examples#aes-gcm
  */

  /**
   * The JIO Cryptography Storage extension
   *
   * @class CryptStorage
   * @constructor
   */

  var MIME_TYPE = "application/x-jio-aes-gcm-encryption";

  function CryptStorage(spec) {
    this._key = spec.key;
    this._jsonKey = true;
    this._sub_storage = jIO.createJIO(spec.sub_storage);
  }

  function convertKey(that) {
    return new RSVP.Queue()
      .push(function () {
        return crypto.subtle.importKey("jwk", that._key,
                                       "AES-GCM", false,
                                       ["encrypt", "decrypt"]);
      })
      .push(function (res) {
        that._key = res;
        that._jsonKey = false;
        return;
      });
  }

  CryptStorage.prototype.get = function () {
    return this._sub_storage.get.apply(this._sub_storage,
                                       arguments);
  };

  CryptStorage.prototype.post = function () {
    return this._sub_storage.post.apply(this._sub_storage,
                                        arguments);
  };

  CryptStorage.prototype.put = function () {
    return this._sub_storage.put.apply(this._sub_storage,
                                       arguments);
  };

  CryptStorage.prototype.remove = function () {
    return this._sub_storage.remove.apply(this._sub_storage,
                                          arguments);
  };

  CryptStorage.prototype.hasCapacity = function () {
    return this._sub_storage.hasCapacity.apply(this._sub_storage,
                                               arguments);
  };

  CryptStorage.prototype.buildQuery = function () {
    return this._sub_storage.buildQuery.apply(this._sub_storage,
                                              arguments);
  };


  CryptStorage.prototype.putAttachment = function (id, name, blob) {
    var initializaton_vector = crypto.getRandomValues(new Uint8Array(12)),
      that = this;

    return new RSVP.Queue()
      .push(function () {
        if (that._jsonKey === true) {
          return convertKey(that);
        }
        return;
      })
      .push(function () {
        return jIO.util.readBlobAsDataURL(blob);
      })
      .push(function (dataURL) {
        //string->arraybuffer
        var strLen = dataURL.target.result.length,
          buf = new ArrayBuffer(strLen),
          bufView = new Uint8Array(buf),
          i;

        dataURL = dataURL.target.result;
        for (i = 0; i < strLen; i += 1) {
          bufView[i] = dataURL.charCodeAt(i);
        }
        return crypto.subtle.encrypt({
          name : "AES-GCM",
          iv : initializaton_vector
        },
                                     that._key, buf);
      })
      .push(function (coded) {
        var blob = new Blob([initializaton_vector, coded], {type: MIME_TYPE});
        return that._sub_storage.putAttachment(id, name, blob);
      });
  };

  CryptStorage.prototype.getAttachment = function (id, name) {
    var that = this;

    return that._sub_storage.getAttachment(id, name)
      .push(function (blob) {
        if (blob.type !== MIME_TYPE) {
          return blob;
        }
        return new RSVP.Queue()
          .push(function () {
            if (that._jsonKey === true) {
              return convertKey(that);
            }
            return;
          })
          .push(function () {
            return jIO.util.readBlobAsArrayBuffer(blob);
          })
          .push(function (coded) {
            var initializaton_vector;

            coded = coded.target.result;
            initializaton_vector = new Uint8Array(coded.slice(0, 12));
            return new RSVP.Queue()
              .push(function () {
                return crypto.subtle.decrypt({
                  name : "AES-GCM",
                  iv : initializaton_vector
                },
                                             that._key, coded.slice(12));
              })
              .push(function (arr) {
                //arraybuffer->string
                arr = String.fromCharCode.apply(null, new Uint8Array(arr));
                return jIO.util.dataURItoBlob(arr);
              })
              .push(undefined, function (error) {
                if (error instanceof DOMException) {
                  return blob;
                }
                throw error;
              });
          });
      });
  };

  CryptStorage.prototype.removeAttachment = function () {
    return this._sub_storage.removeAttachment.apply(this._sub_storage,
                                                    arguments);
  };

  CryptStorage.prototype.allAttachments = function () {
    return this._sub_storage.allAttachments.apply(this._sub_storage,
                                                  arguments);
  };

  jIO.addStorage('crypt', CryptStorage);

}(jIO, RSVP, DOMException, Blob, crypto, Uint8Array, ArrayBuffer));
;/*
 * Copyright 2013, Nexedi SA
 * Released under the LGPL license.
 * http://www.gnu.org/licenses/lgpl.html
 */
/**
 * JIO Websql Storage. Type = "websql".
 * websql "database" storage.
 */
/*global Blob, jIO, RSVP, openDatabase*/
/*jslint nomen: true*/

(function (jIO, RSVP, Blob, openDatabase) {

  "use strict";

  /**
   * The JIO Websql Storage extension
   *
   * @class WebSQLStorage
   * @constructor
   */

  function queueSql(db, query_list, argument_list) {
    return new RSVP.Promise(function (resolve, reject) {
      /*jslint unparam: true*/
      db.transaction(function (tx) {
        var len = query_list.length,
          result_list = [],
          i;

        function resolveTransaction(tx, result) {
          result_list.push(result);
          if (result_list.length === len) {
            resolve(result_list);
          }
        }
        function rejectTransaction(tx, error) {
          reject(error);
          return true;
        }
        for (i = 0; i < len; i += 1) {
          tx.executeSql(query_list[i], argument_list[i], resolveTransaction,
                        rejectTransaction);
        }
      }, function (tx, error) {
        reject(error);
      });
      /*jslint unparam: false*/
    });
  }

  function initDatabase(db) {
    var query_list = [
      "CREATE TABLE IF NOT EXISTS document" +
        "(id VARCHAR PRIMARY KEY NOT NULL, data TEXT)",
      "CREATE TABLE IF NOT EXISTS attachment" +
        "(id VARCHAR, attachment VARCHAR, part INT, blob TEXT)",
      "CREATE TRIGGER IF NOT EXISTS removeAttachment " +
        "BEFORE DELETE ON document FOR EACH ROW " +
        "BEGIN DELETE from attachment WHERE id = OLD.id;END;",
      "CREATE INDEX IF NOT EXISTS index_document ON document (id);",
      "CREATE INDEX IF NOT EXISTS index_attachment " +
        "ON attachment (id, attachment);"
    ];
    return new RSVP.Queue()
      .push(function () {
        return queueSql(db, query_list, []);
      });
  }

  function WebSQLStorage(spec) {
    if (typeof spec.database !== 'string' || !spec.database) {
      throw new TypeError("database must be a string " +
                          "which contains more than one character.");
    }
    this._database = openDatabase("jio:" + spec.database,
                                  '1.0', '', 2 * 1024 * 1024);
    if (spec.blob_length &&
        (typeof spec.blob_length !== "number" ||
         spec.blob_length < 20)) {
      throw new TypeError("blob_len parameter must be a number >= 20");
    }
    this._blob_length = spec.blob_length || 2000000;
    this._init_db_promise = initDatabase(this._database);
  }

  WebSQLStorage.prototype.put = function (id, param) {
    var db = this._database,
      that = this,
      data_string = JSON.stringify(param);

    return new RSVP.Queue()
      .push(function () {
        return that._init_db_promise;
      })
      .push(function () {
        return queueSql(db, ["INSERT OR REPLACE INTO " +
                            "document(id, data) VALUES(?,?)"],
                       [[id, data_string]]);
      })
      .push(function () {
        return id;
      });
  };

  WebSQLStorage.prototype.remove = function (id) {
    var db = this._database,
      that = this;

    return new RSVP.Queue()
      .push(function () {
        return that._init_db_promise;
      })
      .push(function () {
        return queueSql(db, ["DELETE FROM document WHERE id = ?"], [[id]]);
      })
      .push(function (result_list) {
        if (result_list[0].rowsAffected === 0) {
          throw new jIO.util.jIOError("Cannot find document", 404);
        }
        return id;
      });

  };

  WebSQLStorage.prototype.get = function (id) {
    var db = this._database,
      that = this;

    return new RSVP.Queue()
      .push(function () {
        return that._init_db_promise;
      })
      .push(function () {
        return queueSql(db, ["SELECT data FROM document WHERE id = ?"],
                        [[id]]);
      })
      .push(function (result_list) {
        if (result_list[0].rows.length === 0) {
          throw new jIO.util.jIOError("Cannot find document", 404);
        }
        return JSON.parse(result_list[0].rows[0].data);
      });
  };

  WebSQLStorage.prototype.allAttachments = function (id) {
    var db = this._database,
      that = this;

    return new RSVP.Queue()
      .push(function () {
        return that._init_db_promise;
      })
      .push(function () {
        return queueSql(db, [
          "SELECT id FROM document WHERE id = ?",
          "SELECT DISTINCT attachment FROM attachment WHERE id = ?"
        ], [[id], [id]]);
      })
      .push(function (result_list) {
        if (result_list[0].rows.length === 0) {
          throw new jIO.util.jIOError("Cannot find document", 404);
        }

        var len = result_list[1].rows.length,
          obj = {},
          i;

        for (i = 0; i < len; i += 1) {
          obj[result_list[1].rows[i].attachment] = {};
        }
        return obj;
      });
  };

  function sendBlobPart(blob, argument_list, index, queue) {
    queue.push(function () {
      return jIO.util.readBlobAsDataURL(blob);
    })
      .push(function (strBlob) {
        argument_list[index + 2].push(strBlob.target.result);
        return;
      });
  }

  WebSQLStorage.prototype.putAttachment = function (id, name, blob) {
    var db = this._database,
      that = this,
      part_size = this._blob_length;

    return new RSVP.Queue()
      .push(function () {
        return that._init_db_promise;
      })
      .push(function () {
        return queueSql(db, ["SELECT id FROM document WHERE id = ?"], [[id]]);
      })
      .push(function (result) {
        var query_list = [],
          argument_list = [],
          blob_size = blob.size,
          queue = new RSVP.Queue(),
          i,
          index;

        if (result[0].rows.length === 0) {
          throw new jIO.util.jIOError("Cannot access subdocument", 404);
        }
        query_list.push("DELETE FROM attachment WHERE id = ? " +
                        "AND attachment = ?");
        argument_list.push([id, name]);
        query_list.push("INSERT INTO attachment(id, attachment, part, blob)" +
                     "VALUES(?, ?, ?, ?)");
        argument_list.push([id, name, -1,
                            blob.type || "application/octet-stream"]);

        for (i = 0, index = 0; i < blob_size; i += part_size, index += 1) {
          query_list.push("INSERT INTO attachment(id, attachment, part, blob)" +
                       "VALUES(?, ?, ?, ?)");
          argument_list.push([id, name, index]);
          sendBlobPart(blob.slice(i, i + part_size), argument_list, index,
                       queue);
        }
        queue.push(function () {
          return queueSql(db, query_list, argument_list);
        });
        return queue;
      });
  };

  WebSQLStorage.prototype.getAttachment = function (id, name, options) {
    var db = this._database,
      that = this,
      part_size = this._blob_length,
      start,
      end,
      start_index,
      end_index;

    if (options === undefined) { options = {}; }
    start = options.start || 0;
    end = options.end || -1;

    if (start < 0 || (options.end !== undefined && options.end < 0)) {
      throw new jIO.util.jIOError("_start and _end must be positive",
                                  400);
    }
    if (start > end && end !== -1) {
      throw new jIO.util.jIOError("_start is greater than _end",
                                  400);
    }

    start_index = Math.floor(start / part_size);
    if (start === 0) { start_index -= 1; }
    end_index =  Math.floor(end / part_size);
    if (end % part_size === 0) {
      end_index -= 1;
    }

    return new RSVP.Queue()
      .push(function () {
        return that._init_db_promise;
      })
      .push(function () {
        var command = "SELECT part, blob FROM attachment WHERE id = ? AND " +
          "attachment = ? AND part >= ?",
          argument_list = [id, name, start_index];

        if (end !== -1) {
          command += " AND part <= ?";
          argument_list.push(end_index);
        }
        return queueSql(db, [command], [argument_list]);
      })
      .push(function (response_list) {
        var i,
          response,
          blob_array = [],
          blob,
          type;

        response = response_list[0].rows;
        if (response.length === 0) {
          throw new jIO.util.jIOError("Cannot find document", 404);
        }
        for (i = 0; i < response.length; i += 1) {
          if (response[i].part === -1) {
            type = response[i].blob;
            start_index += 1;
          } else {
            blob_array.push(jIO.util.dataURItoBlob(response[i].blob));
          }
        }
        if ((start === 0) && (options.end === undefined)) {
          return new Blob(blob_array, {type: type});
        }
        blob = new Blob(blob_array, {});
        return blob.slice(start - (start_index * part_size),
                          end === -1 ? blob.size :
                          end - (start_index * part_size),
                          "application/octet-stream");
      });
  };

  WebSQLStorage.prototype.removeAttachment = function (id, name) {
    var db = this._database,
      that = this;

    return new RSVP.Queue()
      .push(function () {
        return that._init_db_promise;
      })
      .push(function () {
        return queueSql(db, ["DELETE FROM attachment WHERE " +
                            "id = ? AND attachment = ?"], [[id, name]]);
      })
      .push(function (result) {
        if (result[0].rowsAffected === 0) {
          throw new jIO.util.jIOError("Cannot find document", 404);
        }
        return name;
      });
  };

  WebSQLStorage.prototype.hasCapacity = function (name) {
    return (name === "list" || (name === "include"));
  };

  WebSQLStorage.prototype.buildQuery = function (options) {
    var db = this._database,
      that = this,
      query =  "SELECT id";

    return new RSVP.Queue()
      .push(function () {
        return that._init_db_promise;
      })
      .push(function () {
        if (options === undefined) { options = {}; }
        if (options.include_docs === true) {
          query += ", data AS doc";
        }
        query += " FROM document";
        return queueSql(db, [query], [[]]);
      })
      .push(function (result) {
        var array = [],
          len = result[0].rows.length,
          i;

        for (i = 0; i < len; i += 1) {
          array.push(result[0].rows[i]);
          array[i].value = {};
          if (array[i].doc !== undefined) {
            array[i].doc = JSON.parse(array[i].doc);
          }
        }
        return array;
      });
  };

  jIO.addStorage('websql', WebSQLStorage);

}(jIO, RSVP, Blob, openDatabase));