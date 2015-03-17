//Method Not documented
//http://codegolf.stackexchange.com/questions/2211/smallest-javascript-css-selector-engine
(function(){
    var _html = this,
    rnotDigit = /\D+/g,
    attr = 'outline-color',
    attrOn = 'rgb(00,00,07)',
        rcamelCase = /-([a-z])/g,
        fcamelCase = function(a,letter) {
                return letter.toUpperCase();
        },
    curCSS,
        //From http://j.mp/FhELC
        getElementById = function(id){
            var elem = document.getElementById(id);
            if(elem){
              //verify it is a valid match!
              if(elem.attributes['id'] && elem.attributes['id'].value == id){
                //valid match!
                return elem;
              } else {
                //not a valid match!
                //the non-standard, document.all array has keys for all name'd, and id'd elements
                //start at one, because we know the first match, is wrong!
                for(var i=1;i<document.all[id].length;i++){
                  if(document.all[id][i].attributes['id'] && document.all[id][i].attributes['id'].value == id){
                    return document.all[id][i];
                  }
                }
              }
            }
            return null;
        };
    style = document.createElement('style'),
    script = document.getElementsByTagName('script')[0];
    script.parentNode.insertBefore(style, script);

        if (document.defaultView && document.defaultView.getComputedStyle) {
            curCSS = function( elem, name ) {
            return elem.ownerDocument.defaultView.getComputedStyle( elem, null ).getPropertyValue(name);    
        };

    } else if ( document.documentElement.currentStyle ) {
        curCSS = function( elem, name ) {
            return elem.currentStyle && elem.currentStyle[ name.replace(rcamelCase,fcamelCase) ];
        };
    }
    this.querySelectorAll = function(selector,context,extend){
        context = context || document;
        extend = extend || [];

        var id, p = extend.length||0;

        try{style.innerHTML = selector+"{"+attr+":"+attrOn+"}";}
        //IE fix
        catch(id){style.styleSheet.cssText = selector +"{"+attr+":"+attrOn+"}";}

        if(document.defaultView && document.querySelectorAll){
            id = "";
            var _id = context.id,
                _context = context;
            if(context!=document){
                id = "__slim__";
                context.id = id;
                id = "#"+id+" ";
            }
            context=document.querySelectorAll(id + selector);
            if(_id)_context.id = _id;
            //Setting selector=1 skips checking elem
            selector=1;
        }
        else if(!context[0] && (id = /(.*)#([\w-]+)([^\s>~]*)[\s>~]*(.*)/.exec(selector)) && id[2]){
            //no selectors after id
            context =  getElementById(id[2]);
            //If there isn't a tagName after the id we know the el just needs to be checked
            if(!id[4]){
                context = [context];
                //Optimize for #id
                if(!id[1] && !id[3]){
                    selector=1;
                }
            }
        }
        //If context contains an array or nodeList of els check them otherwise retrieve new els by tagName using selector last tagName
        context = (selector == 1 || context[0] && context[0].nodeType==1) ? 
            context:                
            context.getElementsByTagName(selector.replace(/\[[^\]]+\]|\.[\w-]+|\s*$/g,'').replace(/^.*[^\w]/, '')||'*');

        for(var i=0,l=context.length; i < l; i++){
            //IE returns comments when using *
            if(context[i].nodeType==1 && (selector==1 || curCSS(context[i],attr).replace(rnotDigit,'')==7)){
            extend[p++]=context[i];
        }
    }
    extend.length = p;
    return _html.array(extend);
    };
    
    this.querySelector = function(selector,context,extend){
        return this.querySelectorAll(selector,context,extend)[0];
    }
}).call(html);