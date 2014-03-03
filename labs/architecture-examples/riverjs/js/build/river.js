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
            var mod = Object.create(context);
            mod.exports = {}; //reset,
            var api = boxes[key] && boxes[key].call(mod,mod.exports,mod.need,mod) || undefined;
            api = typeof mod.exports === 'function' ? mod.exports : Object.keys(mod.exports).length ? mod.exports : api;
            return api;
          },
          exports: {}
        };
        fn.call(context,context.exports,context.need,context);
      }
    };
  }
};
_$river.module = _$river.sandbox();

Object.create = Object.create || function(source){
  var F = function () {}
  F.prototype = source;
  return new F();
}

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
      //'a.b.c.d'
      var ns = key.split('.');
      var value = {};
      for(var i=0;i<ns.length;i++){
        if(typeof value === 'object'){
          value = value[ns[i]] || context.scope[ns[i]] 
        }
      }
      value = typeof value == 'object' ? JSON.stringify(value) : value;
      doc.nodeValue = doc.nodeValue.replace(/\r|\n/g,'').replace(/{{.*}}/, value);
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

  function _keyboard (type, keycode,charCode, element){
    //to-do , cross IE < 9
    var evt = document.createEvent('Events');
    evt.initEvent(type, true, true);
    evt.view = null;
    evt.altKey = false;
    evt.ctrlKey = false;
    evt.shiftKey = false;
    evt.metaKey = false;
    evt.keyCode = keycode;
    evt.charCode = charCode;

    element.dispatchEvent(evt);
  }

  return {
    trigger:_trigger,
    key:_keyboard
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
define('river.core.model', function(exports,require,module) { //@sourceURL=../lib/core/model.js

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
          if(ele.element.nodeName == 'INPUT'){
            ele.element.value = ele.expression.replace(/{{.*}}/, value);
          }
          //ele.element.parent.innerHTML = ele.expression.replace(/{{.*}}/, value);
        });
      }
    } else if (isArray(value)) {
      oldvalue = oldvalue ? oldvalue : [];
      var children = eom[key].repeatContainer.children;
      var length = value.length - children.length
        , len = Math.abs(length)
        , addItems = length > 0
        , removeItems = length < 0;
      if(addItems){
        var vv = value.slice(value.length-len,value.length);
        for(var i = 0;i<len;i++){
          buildNewEom(eom[key],vv);
        }
      }else if(removeItems){
        Array.prototype.splice.call(eom[key],0,len);
        for(var k= 0;k<len;k++){
          children[k].parentNode.removeChild(children[k]);
        }
      }
      loop(value, function(item, index) {
        updateGrammar(eom[key][index],item);
        update.call(scope,item, index, eom[key][index],oldvalue[index]);
      });
    } else if (isObject(value)) {
      oldvalue = oldvalue ? oldvalue : {};
      each(value, function(item, index) {
        update.call(scope,item, index, eom , oldvalue[index]);
      });
    }
  }


  function buildNewEom(eom,data) {
    var trans = eom.trans;
    var node = eom.repeatNode;
    var _r = eom.reg;
    var key = eom.key;
    var parentNode = eom.repeatContainer;
    var frg = document.createDocumentFragment();
    if (data && data.length) {
      data.forEach(function(d,i) {
        var _n = node.cloneNode(true);
        var m = {};
        var grammars = [];
        trans(_r, _n, d, key, m,grammars,true);
        m.grammars = grammars;
        m.repeat = _n;
        eom.push(m);
        frg.appendChild(_n);
      });
      parentNode.appendChild(frg);
    }
  }

  function loadGrammar(key) {
    return require('river.grammer.' + key);
  }

  function updateGrammar(eom,data){
    var grammars = eom.grammars;
    if(!grammars) return;
    grammars.forEach(function(d,i){
      var context = {};
      context.node = d.node;
      context.scope = data;//scope; waiting for refactory
      context.reg = d.reg;
      context.eom = d.eom;
      loadGrammar(d.grammar).call(context,d.str,d.rootScope,d.node,data);
    });
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

  function jbind (str,scope,element,repeatscope){
    scope = repeatscope || scope;
    var oldValue = element.value = scope[str] || '';
    this.eom[str] = this.eom[str] || [];
    this.eom[str].push({
      element:element,
      expression:"{{"+str+"}}"
    });

    var interval;

    element.onfocus = function(){
      var ele = this;
      interval = setInterval(function(){
        watch(ele.value);
      },30);
    };

    element.onblur = function(){
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
  function click (str,scope,element,repeatscope) {
    var key = str.replace(/\(.*\)/,'');
    var fn = scope[key];

    var param = /\((.*)\)/;
    var target = str.match(param);
    var args = [];

    if(target && target.length){
      args = target[1].split(',');
      //Array.prototype.indexOf.call(this.node.parentNode,this.node);
    }

    var argsdata = [];
    for (var i = 0, len = args; i < len; i++) {
      var item = scope[args[i]] ? scope[args[i]] : args[i];
      argsdata.push(item);
    }

    //to-do hot-fix
    if(repeatscope){
      argsdata = [repeatscope];
    }

    var eom = this.eom;
    element.onclick = function(e){
      fn.apply(element,argsdata);
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
define('river.grammer.jon', function() {
  function on (str,scope,element,repeatscope) {
    var expression = str.replace(/\(.*\)/,'');

    var type = expression.replace(/\s*[\||:].*/,'');
    var key  = expression.replace(/.*[\||:]\s*/,'');
    var fn = scope[key];

    var param = /\((.*)\)/;
    var target = str.match(param);
    var args = [];

    if(target && target.length){
      args = target[1].split(',');
      //Array.prototype.indexOf.call(this.node.parentNode,this.node);
    }



    var eom = this.eom;
    var event = 'on' + type;

    element[event] = function(e){
      var argsdata = [];
      for (var i = 0, len = args.length; i < len; i++) {
        var item = scope[args[i]] ? scope[args[i]] : '';//args[i];
        argsdata.push(item);
      }

      //to-do hot-fix
      if(repeatscope){
        argsdata = [repeatscope];
      }
      fn.apply(element,[e].concat(argsdata));
      scope.apply();
    };
  }
  return on;
});
define("river.grammer.repeat", function() {
  var $tool = this.need('river.core.tools')
    , $scan = this.need('river.engine').scan
    , me    = this;

    function loadGrammar(key) {
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

    eom.repeatNode = node; 
    eom.repeatContainer = parentNode;
    eom.trans = trans;
    eom.key = key;
    eom.reg = _r;

    if (data && data.length) {
      data.forEach(function(d,i) {
        var _n = node.cloneNode(true);
        var m = {};
        var grammars=[];
        trans(_r, _n, d, key, m,grammars);
        m.grammars = grammars;
        m.repeat = _n;
        eom.push(m);
        frg.appendChild(_n);
      });
      parentNode.appendChild(frg);
    }
  }

  var context = {};


  function trans(reg, doc, scope, key, eom,grammars,stop) {
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
            expression: attr.nodeValue
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
          var grammer = loadGrammar(attr.nodeName);
          if($tool.isFunction(grammer)){
            //context.scope = rootScope;
            var str = attr.nodeValue.replace(reg, '');
            grammars.push({
              grammar : attr.nodeName,
              eom:eom,
              reg:reg,
              node:doc,
              str : str,
              rootScope:rootScope
            });
            //todo : scope should inherit from rootScope
            if(!stop)grammer.call(context,str,rootScope,context.node,context.scope);
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
        expression: doc.nodeValue
      });
      //this change is for identify two case: 
      //  1. scope = {}
      //  2. scope = "string" or number
      var value  = $tool.isObject(scope) ? scope[k] : scope;
      doc.nodeValue = doc.nodeValue.replace(/{{.*}}/, value);
    }
    if (doc.childNodes && doc.childNodes.length && !hasRepeat) {
      Array.prototype.forEach.call(doc.childNodes, function(child) {
        trans(reg, child, scope, key, eom,grammars,stop);
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
    this.node.removeAttribute('scope');
    var source = me.need(str);
    if (tools.isObject(source)) {
      var mod = new model(str, this.eom);
      //source.watch(this.eom);
      //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/proto
      //as the __proto__ is deprecated,I have to do this
      for(var x in mod){
         source[x] = mod[x]
      }
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
