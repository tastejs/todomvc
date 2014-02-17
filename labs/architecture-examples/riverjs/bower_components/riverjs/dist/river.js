/* 
 * all rights resorved by hunter.dding@gmail.com @猎人豆豆 @hunter.dding
 * please notice that the define,main are occupied as gloable variable
 * but most of time you only need to use define with CMD stand.
 * river.js by Jonathan version 13.11 
 */
var _$river = {
  // module define and run api
  sandbox: function() {
    var boxes = {};
    return {
      create: function(key, fn) {
        key = key.toLowerCase();
        boxes[key] = fn;
      },
      run: function(fn) {
        var context = {
          need: function(key) {
            key = key.toLowerCase();
            return boxes[key] && boxes[key].call(context) || undefined;
          }
        };
        fn.call(context);
      }
    };
  }
};
_$river.module = _$river.sandbox();

/*jshint unused:false */


/**
 *@name define
 *@param {string} key - module name and NameSpace
 *@param {function} fn - the module implementation
 */
var define = _$river.module.create;
var main = _$river.module.run;

define('river.engine',function() {

  var me = this,
    tool = me.need('river.core.tools');
  function loadGrammer(key) {
    return me.need('river.grammer.' + key);
  }

  // this reg is for math {{ **.** }} type expression
  var reg = /.*{{\s*|\s*}}.*/g;



  function checkAttributes(doc, fatherContext) {
    var state = {
      hasRepeat: false,
      context: fatherContext
    };
    var newContext = {
      scope: {},
      node: doc,
      eom: {},
      reg: reg
    };

    if (doc.attributes && doc.attributes.length) {
      tool.loop(doc.attributes, function(attr) {
        var key = attr.nodeName;
        var value = attr.nodeValue.replace(reg, '');
        var grammer = loadGrammer(key);

        if ('repeat' === key) {
          state.hasRepeat = true;
        }
        if ('scope' === key) {
          //here we cover the current context by newContext;
          state.context = newContext;
          grammer.call(state.context, value,state.context.scope,state.context.node);
          if (fatherContext) {
            //the inherit object should be the same reference,nor a new one.And no need to inherit eom.
            tool.inherit(state.context.scope, fatherContext.scope);
          }
        } else {
          if (tool.isFunction(grammer)) {
            if (state.context) {
              state.context.node = doc;
              grammer.call(state.context, value,state.context.scope,state.context.node);
              checkText(attr, state.context);
            } else {
              state.context = newContext;
              loadGrammer('scope').call(state.context, value);
              grammer.call(state.context, value,state.context.scope,state.context.node);
            }
          }
        }
      });
    }
    return state;
  }

  function checkText(doc, context) {
    if (reg.test(doc.nodeValue)) {
      var key = doc.nodeValue.replace(/\r|\n/g,'').replace(reg, '');
      if (!context.eom[key]) {
        context.eom[key] = [];
      }
      context.eom[key].push({
        element: doc,
        expression: doc.nodeValue
      });
      doc.nodeValue = doc.nodeValue.replace(/\r|\n/g,'').replace(/{{.*}}/, context.scope[key]);
    }
  }

  function checkChildren(doc, state) {
    if (doc.childNodes && doc.childNodes.length) {
      for(var i=0;i<doc.childNodes.length;i++){
        var child = doc.childNodes[i];
        var context = state ? state.context : undefined;
        var s = scan(child, context);
        if(s.hasRepeat) break;
      }
    }
  }



  function scan(doc, context) {
    var state = checkAttributes(doc, context);
    if (state.context) {
      checkText(doc, state.context);
    }
    if ('CODE' !== doc.nodeName && 'PRE' !== doc.nodeName && !state.hasRepeat) {
      if (state.context) {
        checkChildren(doc, state);
      } else {
        checkChildren(doc);
      }
    }
    return state;
  }

  return {
    scan:scan
  };

});

main(function(){
  var me = this;
  document.addEventListener('DOMContentLoaded', function() {
    var scan = me.need('river.engine').scan;
    scan(document);
  });
});
define('river.scenario',function(){

  var tools = this.need('river.core.tools');

  /**
   * this function is for trigger browser default behavior,
   * and it will be usefule , when you do the unite test , or e2e test
   * in the future
   */
  function _trigger (type,element){

    //to-do , cross IE < 9
    var event = document.createEvent('MouseEvents');
    event.initEvent(type,true,true);
    element.dispatchEvent(event);
  }

  return {
    trigger:_trigger
  };
});
define('river.core.Date', function() {

  var getDateByCity = function(jetleg) {
    var now = new Date();
    var local = new Date(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate(),
      now.getUTCHours() + parseInt(jetleg),
      now.getUTCMinutes(),
      now.getUTCSeconds());

    return {
      date: local,
      toString: function(f){
        local.toString = toString;
        return local.toString(f);
      }
    };
  };

  function toString(format) {
    var o = {
      "M+": this.getMonth() + 1, //month
      "d+": this.getDate(), //day
      "h+": this.getHours(), //hour
      "m+": this.getMinutes(), //minute
      "s+": this.getSeconds(), //second
      "q+": Math.floor((this.getMonth() + 3) / 3), //quarter
      "S": this.getMilliseconds() //millisecond
    };

    if (/(y+)/.test(format)) format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o) if (new RegExp("(" + k + ")").test(format))
        format = format.replace(RegExp.$1,
          RegExp.$1.length == 1 ? o[k] :
          ("00" + o[k]).substr(("" + o[k]).length));
    return format;
  }


  return {
    getDateByCity: getDateByCity
  };
});
define('river.core.model', function() { //@sourceURL=../lib/core/model.js

  var tools = this.need('river.core.tools');

  var _eoms = {}, lasts = {} , me = this;

  var isArray  = tools.isArray;
  var isObject = tools.isObject;
  var isString = tools.isString;
  var isNumber = tools.isNumber;
  var each     = tools.each;
  var loop     = tools.loop;

  function update(value, key, eom ,oldvalue) {
    var scope = this;
    if (isString(value) || isNumber(value)) {
      if(eom && eom[key]){
        loop(eom[key], function(ele, i) {
          ele.element.nodeValue = ele.expression.replace(/{{.*}}/, value);
          //ele.element.parent.innerHTML = ele.expression.replace(/{{.*}}/, value);
        });
      }else if(eom && !eom[key]){
        each(eom,function(d,i){
          loop(d, function(ele, i) {
            ele.element.nodeValue = ele.expression.replace(/{{.*}}/, value);
            //ele.element.parent.innerHTML = ele.expression.replace(/{{.*}}/, value);
          });
        })
      }
    } else if (isArray(value)) {
      oldvalue = oldvalue ? oldvalue : [];
      var info = getRepeatTemp(eom[key]);
      var children = info.ele.parent.children;
      var length = value.length - children.length
        , len = Math.abs(length)
        , addItems = length > 0
        , removeItems = length < 0;
      if(addItems){
        var vv = value.slice(value.length-len,value.length);
        for(var i = 0;i<len;i++){
          addEom.call(scope,eom[key],info.eom,info.ele,vv[i]);
        }
      }else if(removeItems){
        Array.prototype.splice.call(eom[key],0,len);
        for(var k= 0;k<len;k++){
          children[k].parentNode.removeChild(children[k]);
        }
      }
      loop(value, function(item, index) {
        update.call(scope,item, index, eom[key][index],oldvalue[index]);
      });
    } else if (isObject(value)) {
      oldvalue = oldvalue ? oldvalue : {};
      each(value, function(item, index) {
        update.call(scope,item, index, eom , oldvalue[index]);
      });
    }
  }


  function getRepeatTemp(eom) {
    var neweom = tools.clone(eom[0]);
    var newele;
    each(neweom,function(d,i){
      if(!newele){
        loop(d,function(data,index){
          if(!newele){
            newele = data;
          }
        });
      }
    })
    return {
      eom : neweom,
      ele : newele
    }
  }

  function addEom(eom,neweom,newele,value) {
    eom.push(neweom);
    var newnode = newele.repeat.cloneNode(true);
    newele.parent.appendChild(newnode);
    newele.element = getTextNode.call(this,newnode,value)[0];
  }

  function getTextNode(node,value,texts){
    texts = texts || [];
    var scope = this;
    if(node.attributes){
      executeGrammer(node,scope,value);
    }
    if(node.childNodes && node.childNodes.length){
      loop(node.childNodes,function(d,i){
        getTextNode.call(scope,d,value,texts);
      });
    }else{
      texts.push(node);
    }
    return texts;
  }

  function executeGrammer(node,scope,data){
    var attrs = node.attributes;
    for(var i=0;i<attrs.length;i++){
      var attr = attrs[i];
      var grammer= me.need('river.grammer.' + attr.nodeName);
      if(grammer){
        grammer.call({scope:scope,node:node},attr.nodeValue,scope,node,data);
      }
    }
  }

  function Model(ns, eom) {
    _eoms[ns] = eom;
    lasts[ns] = {};
    this.$$ns = ns;
  }

  Model.prototype.apply = function() {
    var _eom = _eoms[this.$$ns]
      , last = lasts[this.$$ns]
      , scope = this;

    each(this, function(val, index) {
      if (_eom[index] && !tools.expect(last[index]).toEqual(val)) {
        update.call(scope,val, index, _eom,last[index]);
        last[index] = tools.clone(val);
      }
    });
  };

  Model.prototype.watch = function(eom, repeat) {};

  Model.prototype.inject = function(source) {
    var me = this;
    each(source, function(item, index) {
      me[index] = source[index];
    });
  };


  return Model;
});
define('river.core.tools', function() {
  var toString = Object.prototype.toString;
  /**
   * @namespace river.core.tools
   */

  function inherit(target,source) {
    var F = function() {
      for (var x in target) {
        if(target.hasOwnProperty && target.hasOwnProperty(x)){
          this[x] = target[x];
        }else{
          F.prototype[x] = target[x];
        }
      }
    };
    for(var y in source){
      F.prototype[y] = source[y];
    }
    //F.prototype = source;
    var f = new F();
    for(var z in f){
      target[z] = f[z];
    }
    return target;
  }

  function compile(str){
    var container = document.createElement('div');
    container.innerHTML = str;
    return container.childNodes[0];
  }

  function guid() {
    var uid = "$$";
    for (var i = 1; i <= 8; i++) {
      var n = Math.floor(Math.random() * 16).toString(16);
      uid += n;
      if ((i == 3) || (i == 5))
        uid += "-";
    }
    return uid;
  }

    /**
     * it's for array loop
     */
  function loop(array, fn) {
    var context = {};
    for (var i = 0; i < array.length; i++) {
      fn.call(context, array[i], i);
    }
  }

  /**
   * it's for object loop,but will not loop in prototype
   */
  function each(obj, fn) {
    var context = {};
    for (var x in obj) {
      if (obj.hasOwnProperty && obj.hasOwnProperty(x)) {
        fn.call(context, obj[x], x);
      }
    }
  }

  function type(name,item) {
    return window.Object.prototype.toString.call(item) === '[object '+ name +']';
  }


  /**
   * clone in deep
   * @api:public
   * @param:{object} target
   * @param {object} source 
   */
  function clone(target,result){
    if(typeof target !== 'object'){
      return target;
    }else{
      result = result ? result : type('Object',target) ? {} :[];
      for(var x in target){
        var isObject = type('Object',target[x])
          , isArray  = type('Array', target[x])
          , hasChild = isObject || isArray;

        if(hasChild){
          result[x] = isObject ? {} : [];
          clone(target[x],result[x]);
        }else{
          result[x] = target[x];
        }
      }
      return result;
    }
  }


  /**
   * diff two object/array
   * @api:public
   * @param:{object} target
   * @param {object} source
   */
  function diff(target,source){
    this._diffFlag = true;
      for(var x in source){
        var isObject = type('Object',source[x]) || type('Array',source[x]); 
        if(isObject && target){
          diff.call(this,target[x],source[x]);
        }else{
          if(!target){
            this._diffFlag = false;
            return;
          }
          if(target[x] != source[x]){
            this._diffFlag = false;
          }
        }
      }
      return this._diffFlag;
  }

  function expect(source){
    var isValue = typeof source == 'string' || typeof source == 'number' || typeof source == 'boolean'
      , isObject = typeof source != 'function';
    
    function equal(target) {
      if(isValue){
        return source == target;
      }else if(isObject){
        return diff.call({},target,source) && diff.call({},source,target);
      }
    }

    return {
      toEqual:equal
    }
  }

  var exports = {
    inherit    : inherit,
    compile    : compile,
    guid       : guid,
    loop       : loop,
    each       : each,
    clone      : clone,
    expect     : expect,
    isArray    : function(array) {return type('Array',array);},
    isObject   : function(obj) { return type('Object',obj);},
    isFunction : function(obj) { return type('Function',obj); },
    isString   : function(str) { return type('String',str); },
    isNumber   : function(no) { return type('Number',no); }
  };

  return exports;
});
define('river.grammer.jbind',function(){

  function jbind (str){
    var scope = this.scope;
    var oldValue = this.node.value = scope[str];

    var interval;

    this.node.onfocus = function(){
      var ele = this;
      interval = setInterval(function(){
        watch(ele.value);
      },30);
    };

    this.node.onblur = function(){
      clearInterval(interval);
    };

    function watch(newValue){
      if(newValue !== oldValue){
        scope[str] = newValue;
        oldValue = newValue;
        scope.apply();
      }
    }
  }

  return jbind;

});
define('river.grammer.jChange', function() {
  function change (str) {
    var fn = this.scope[str];
    var scope = this.scope;

    this.node.onchange = function(){
      fn.call({},this.value);
      scope.apply();
    };
  }
  return change;
});
define('river.grammer.jclick', function() {
  function click (str,scope,element,data) {
    var key = str.replace(/\(.*\)/,'');
    var fn = scope[key];

    var param = /\((.*)\)/;
    var target = str.match(param);
    var args = [];

    if(target && target.length){
      args = target[1].split(',');
      //Array.prototype.indexOf.call(this.node.parentNode,this.node);
    }

    var eom = this.eom;
    element.onclick = function(){
      fn.apply({},[data]);
      scope.apply();
    };
  }
  return click;
});
define('river.grammer.jcompile',function(){
  return function(){
    //jcompile should never be used when sub tag structutor contain any other grammer tag,cause it will be totally replace by innnerHTML.

    var element = this.node;
    var scope = this.scope;
    var reg = this.reg;

    var key = element.textContent.replace(reg,'');
    //element.innerHTML = scope[key];
//    console.log(this.eom.msg);
  };
});
define("river.grammer.repeat", function() {
  var $tool = this.need('river.core.tools')
    , $scan = this.need('river.engine').scan
    , me    = this;

    function loadGrammer(key) {
      return me.need('river.grammer.' + key);
    }

  /**
   * all the grammer 'this' object contains,this the base api
   * {
   *  node:,
   *  reg:,
   *  scope,
   *  eom
   *  }
   **/

  var repeatNode,repeatContainer,rootScope;


  function repeat(str) {
    //to-do
    var afterIn = /.*in\s/;
    var beforeIn = /\sin.*/;
    var ns = /.*\./;
    var pro = str.replace(afterIn, '').replace(ns, '');
    var data = this.scope[pro];
    var key = str.replace(beforeIn, '');
    var parentNode = this.node.parentNode;
    var node = parentNode.removeChild(this.node);
    var frg = document.createDocumentFragment();
    var _r = this.reg;
    var eom = this.eom[pro] = [];

    rootScope = this.scope;


    node.removeAttribute('repeat');
    repeatNode = node;
    repeatContainer = parentNode;

    if (data && data.length) {
      data.forEach(function(d,i) {
        var _n = node.cloneNode(true);
        var m = {};
        trans(_r, _n, d, key, m,i);
        eom.push(m);
        frg.appendChild(_n);
      });
      parentNode.appendChild(frg);
    }
  }

  var context = {};


  function trans(reg, doc, scope, key, eom) {
    var hasRepeat = false;
    if (doc.attributes && doc.attributes.length) {
      Array.prototype.forEach.call(doc.attributes, function(attr) {

        if (reg.test(attr.nodeValue)) {
          var k = attr.nodeValue.replace(reg, '').replace(key + '.', '');
          if (!eom[k]) {
            eom[k] = [];
          }
          eom[k].push({
            element: attr,
            expression: attr.nodeValue,
            repeat:repeatNode,
            parent:repeatContainer
          });
          attr.nodeValue = attr.nodeValue.replace(/{{.*}}/, scope[k]);
        }

        context.node = doc;
        context.scope = scope;//scope; waiting for refactory
        context.reg = reg;
        context.eom = eom;
        if ('repeat' === attr.nodeName) {
          hasRepeat = true;
          repeat.call(context, attr.nodeValue.replace(reg, ''));
        }else{
          var grammer = loadGrammer(attr.nodeName);
          if($tool.isFunction(grammer)){
            //context.scope = rootScope;
            grammer.call(context, attr.nodeValue.replace(reg, ''),rootScope,context.node,scope);
          }
        }
      });
    }
    if (reg.test(doc.nodeValue)) {
      var k = doc.nodeValue.replace(reg, '').replace(key + '.', '');
      if (!eom[k]) {
        eom[k] = [];
      }
      eom[k].push({
        element: doc,
        expression: doc.nodeValue,
        repeat:repeatNode,
        parent:repeatContainer
      });
      //this change is for identify two case: 
      //  1. scope = {}
      //  2. scope = "string" or number
      var value  = $tool.isObject(scope) ? scope[k] : scope;
      doc.nodeValue = doc.nodeValue.replace(/{{.*}}/, value);
    }
    if (doc.childNodes && doc.childNodes.length && !hasRepeat) {
      Array.prototype.forEach.call(doc.childNodes, function(child) {
        trans(reg, child, scope, key, eom,scope);
      });
    }
  }

  return repeat;
});
define('river.grammer.scope', function() {

  var me = this;
  var model = me.need('river.core.model');
  var tools = me.need('river.core.tools');

  function _scope(str) {
    //this.node.removeAttribute('scope');
    var source = me.need(str);
    if (tools.isObject(source)) {
      //source.watch(this.eom);
      this.scope = source;
    } else if (tools.isFunction(source)) {
      var m = new model(str, this.eom);
      this.scope = m;
      source.call(m);
    } else {
      var guid = tools.guid();
      this.scope = new model(guid, this.eom);
    }
  }

  return _scope;
});
